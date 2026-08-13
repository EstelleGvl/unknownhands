import json
import os
import re
import time
import urllib.request
from urllib.parse import urlencode
from io import BytesIO
from collections import defaultdict

import numpy as np
import yaml
from lxml import etree
from PIL import Image
from skimage import measure, morphology

ANNOS_DIR = "data/annos"
ALTO_DIR = "exports/alto"
OUTPUT_DIR = "_scribes"
MANIFESTS_YML = "data/manifests.yml"
SCRIBE_MAP_FILE = "data/paleography/scribe_to_manuscript_v2.json"
ALTO_NS = {"alto": "http://www.loc.gov/standards/alto/ns-v4#"}

TARGET_GRAPHEMES = [
    {"key": "a", "label": "a", "chars": ["a"]},
    {"key": "b", "label": "b", "chars": ["b"]},
    {"key": "c", "label": "c", "chars": ["c"]},
    {"key": "d", "label": "d", "chars": ["d"]},
    {"key": "e", "label": "e", "chars": ["e"]},
    {"key": "g", "label": "g", "chars": ["g"]},
    {"key": "h", "label": "h", "chars": ["h"]},
    {"key": "l", "label": "l", "chars": ["l"]},
    {"key": "o", "label": "o", "chars": ["o"]},
    {"key": "p", "label": "p", "chars": ["p"]},
    {"key": "q", "label": "q", "chars": ["q"]},
    {"key": "r", "label": "r", "chars": ["r"]},
    {"key": "s", "label": "s", "chars": ["s"]},
    {"key": "t", "label": "t", "chars": ["t"]},
]
TARGET_KEYS = [target["key"] for target in TARGET_GRAPHEMES]
TARGET_LABELS = {target["key"]: target["label"] for target in TARGET_GRAPHEMES}
CHAR_TO_TARGET = {
    char.lower(): target["key"]
    for target in TARGET_GRAPHEMES
    for char in target["chars"]
}
MAX_SAMPLES_PER_GRAPHEME_PER_MANUSCRIPT = 10
MAX_CANDIDATES_PER_GRAPHEME_PER_MANUSCRIPT = 40
MAX_ALTO_CANDIDATES_PER_GRAPHEME_PER_PAGE = 3
ENABLE_SEGMENTATION_FALLBACK = False
EDGE_PAGE_SKIP_FRACTION = 0.05
EDGE_PAGE_SKIP_MAX = 25
TOP_BOTTOM_MARGIN_RATIO = 0.18
LEFT_RIGHT_MARGIN_RATIO = 0.10
MIN_COMPONENTS_IN_LINE = 3
MAX_SEGMENTATION_MISMATCH_RATIO = 0.35
MIN_INK_DENSITY = 0.03
MAX_INK_DENSITY = 0.70
MIN_COMPONENT_WIDTH = 6
MIN_COMPONENT_HEIGHT = 12
MAX_COMPONENT_WIDTH_RATIO_OF_LINE = 0.18
MAX_SEGMENTED_LINES_PER_MANUSCRIPT = 60
MIN_CROP_WIDTH = 14
MIN_CROP_HEIGHT = 18
MAX_CROP_WIDTH = 360
MAX_CROP_HEIGHT = 520
MIN_CROP_ASPECT = 0.10
MAX_CROP_ASPECT = 2.40

_manifest_cache = {}
_image_cache = {}
_features_cache = {}


def slugify(value):
    value = (value or "").lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "unknown-scribe"


def public_scribe_title(value):
    value = re.sub(r"\s+", " ", str(value or "")).strip()
    value = re.sub(r",\s*(Female|Male|TBC|Unknown)\s*$", "", value, flags=re.IGNORECASE)
    return value or "Unknown scribe"


def normalize(value):
    value = (value or "").lower()
    value = value.replace("dombibliothekx", "dombibliothek")
    value = re.sub(r"b\.\s*p\.\s*l\.", "bpl", value)
    value = re.sub(r"[^a-z0-9]+", "", value)
    return value


def discover_candidate_folders():
    if not os.path.isdir(ALTO_DIR):
        return []
    folders = []
    for folder in sorted(os.listdir(ALTO_DIR)):
        alto_path = os.path.join(ALTO_DIR, folder)
        mapping_path = os.path.join(ANNOS_DIR, folder, "mapping.json")
        if not os.path.isdir(alto_path):
            continue
        if not os.path.exists(mapping_path):
            continue
        if not any(name.lower().endswith(".xml") for name in os.listdir(alto_path)):
            continue
        folders.append(folder)
    return folders


def load_yaml_manifests():
    with open(MANIFESTS_YML, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or []


def load_scribe_map():
    if not os.path.exists(SCRIBE_MAP_FILE):
        return {"manuscript_profiles": {}}
    with open(SCRIBE_MAP_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def fetch_json(url):
    if not url:
        return None
    if url in _manifest_cache:
        return _manifest_cache[url]
    try:
        time.sleep(0.05)
        request = urllib.request.Request(
            url,
            headers={"User-Agent": "UnknownHands/1.0 (+https://unknownhands.netlify.app)"},
        )
        with urllib.request.urlopen(request, timeout=40) as response:
            data = json.loads(response.read())
    except Exception as exc:
        print(f"WARNING: could not fetch manifest {url}: {exc}")
        data = None
    _manifest_cache[url] = data
    return data


def iter_canvases(manifest):
    if not isinstance(manifest, dict):
        return
    if isinstance(manifest.get("items"), list):
        for item in manifest["items"]:
            if isinstance(item, dict) and item.get("type") == "Canvas":
                yield item
            elif isinstance(item, dict):
                for canvas in item.get("items", []):
                    yield canvas
    for sequence in manifest.get("sequences", []):
        for canvas in sequence.get("canvases", []):
            yield canvas


def canvas_id(canvas):
    return canvas.get("id") or canvas.get("@id")


def canvas_dimensions(canvas):
    width = canvas.get("width")
    height = canvas.get("height")
    try:
        width = int(width) if width else None
        height = int(height) if height else None
    except (TypeError, ValueError):
        return None
    return {"width": width, "height": height} if width and height else None


def body_image_id(canvas):
    image_annos = canvas.get("items") or canvas.get("images") or []
    for anno in image_annos:
        body = anno.get("body") or anno.get("resource") or anno.get("items")
        if isinstance(body, list) and body:
            body = body[0].get("body") if isinstance(body[0], dict) else body[0]
        if not isinstance(body, dict):
            continue
        image_id = body.get("id") or body.get("@id")
        if image_id:
            return image_id
    return None


def image_service(canvas):
    image_annos = canvas.get("items") or canvas.get("images") or []
    for anno in image_annos:
        body = anno.get("body") or anno.get("resource") or anno.get("items")
        if isinstance(body, list) and body:
            body = body[0].get("body") if isinstance(body[0], dict) else body[0]
        if not isinstance(body, dict):
            continue
        service = body.get("service")
        if isinstance(service, list) and service:
            service = service[0]
        if isinstance(service, dict):
            service_id = service.get("id") or service.get("@id")
            if service_id:
                return service_id.rstrip("/")
        image_id = body.get("id") or body.get("@id")
        if image_id and "/" in image_id:
            return image_id.rsplit("/", 1)[0]
    return None


def build_canvas_info_map(manifest_url):
    manifest = fetch_json(manifest_url)
    canvas_info = {}
    for canvas in iter_canvases(manifest):
        cid = canvas_id(canvas)
        service = image_service(canvas)
        if cid and service:
            canvas_info[cid] = {
                "service": service,
                "dimensions": canvas_dimensions(canvas),
                "image_id": body_image_id(canvas),
            }
    return canvas_info


def crop_url(service, xywh):
    x, y, w, h = xywh
    return f"{service}/{x},{y},{w},{h}/full/0/default.jpg"


def scale_xywh(xywh, source_dimensions, target_dimensions):
    if not xywh or not source_dimensions or not target_dimensions:
        return xywh
    source_w = source_dimensions.get("width")
    source_h = source_dimensions.get("height")
    target_w = target_dimensions.get("width")
    target_h = target_dimensions.get("height")
    if not source_w or not source_h or not target_w or not target_h:
        return xywh
    scale_x = target_w / source_w
    scale_y = target_h / source_h
    if abs(scale_x - 1) < 0.01 and abs(scale_y - 1) < 0.01:
        return xywh
    x, y, w, h = xywh
    return [
        int(round(x * scale_x)),
        int(round(y * scale_y)),
        max(1, int(round(w * scale_x))),
        max(1, int(round(h * scale_y))),
    ]


def parse_xywh(selector_value):
    if not selector_value or "xywh=" not in selector_value:
        return None
    raw = selector_value.split("xywh=", 1)[1].split("&", 1)[0]
    try:
        values = [int(round(float(part))) for part in raw.split(",")]
    except ValueError:
        return None
    return values if len(values) == 4 else None


def natural_key(path):
    name = os.path.basename(str(path))
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", name)]


def alto_xml_files(folder):
    folder_path = os.path.join(ALTO_DIR, folder)
    if not os.path.isdir(folder_path):
        return []
    return sorted(
        [
            os.path.join(folder_path, filename)
            for filename in os.listdir(folder_path)
            if filename.lower().endswith(".xml") and filename != "METS.xml"
        ],
        key=natural_key,
    )


def int_attr(node, attr):
    try:
        return int(round(float(node.get(attr))))
    except (TypeError, ValueError):
        return None


def node_xywh(node):
    x = int_attr(node, "HPOS")
    y = int_attr(node, "VPOS")
    w = int_attr(node, "WIDTH")
    h = int_attr(node, "HEIGHT")
    if x is None or y is None or w is None or h is None:
        return None
    return [x, y, w, h]


def alto_page_dimensions(xml_path):
    try:
        root = etree.parse(xml_path).getroot()
    except Exception:
        return None
    page = root.find(".//alto:Page", ALTO_NS)
    if page is None:
        return None
    width = int_attr(page, "WIDTH")
    height = int_attr(page, "HEIGHT")
    return {"width": width, "height": height} if width and height else None


def normalized_chars(text):
    if not isinstance(text, str):
        return []
    return [char.lower() for char in text if char.isalpha()]


def edge_skip_count(total_pages):
    if total_pages <= 8:
        return 0
    return min(EDGE_PAGE_SKIP_MAX, int(round(total_pages * EDGE_PAGE_SKIP_FRACTION)))


def is_kept_page(page_index, total_pages):
    skip = edge_skip_count(total_pages)
    return skip <= page_index < (total_pages - skip)


def is_inside_central_text_area(xywh, dimensions):
    if not dimensions:
        return True
    x, y, w, h = xywh
    img_w = dimensions["width"]
    img_h = dimensions["height"]
    left = img_w * LEFT_RIGHT_MARGIN_RATIO
    right = img_w * (1 - LEFT_RIGHT_MARGIN_RATIO)
    top = img_h * TOP_BOTTOM_MARGIN_RATIO
    bottom = img_h * (1 - TOP_BOTTOM_MARGIN_RATIO)
    cx = x + (w / 2)
    cy = y + (h / 2)
    return left <= cx <= right and top <= cy <= bottom


def crop_geometry_quality(xywh):
    if not xywh or len(xywh) != 4:
        return False
    _, _, w, h = xywh
    if w < MIN_CROP_WIDTH or h < MIN_CROP_HEIGHT:
        return False
    if w > MAX_CROP_WIDTH or h > MAX_CROP_HEIGHT:
        return False
    aspect = w / max(h, 1)
    return MIN_CROP_ASPECT <= aspect <= MAX_CROP_ASPECT


def padded_box(x, y, w, h, dimensions=None):
    if not h or h <= 0:
        h = max(12, int(round(w * 1.8)))
    min_width = max(14, int(round((h or 20) * 0.28)))
    if not w or w < min_width:
        w = min_width
    pad_x = max(4, int(round(w * 0.45)))
    pad_y = max(5, int(round(h * 0.25)))
    x = int(round(x - pad_x))
    y = int(round(y - pad_y))
    w = int(round(w + (pad_x * 2)))
    h = int(round(h + (pad_y * 2)))
    if dimensions:
        x = max(0, min(x, dimensions["width"] - 1))
        y = max(0, min(y, dimensions["height"] - 1))
        w = max(1, min(w, dimensions["width"] - x))
        h = max(1, min(h, dimensions["height"] - y))
    else:
        x = max(0, x)
        y = max(0, y)
        w = max(1, w)
        h = max(1, h)
    return [x, y, w, h]


def glyph_width(glyphs, index, string_box):
    glyph = glyphs[index]
    width = int_attr(glyph, "WIDTH") or 0
    if width > 0:
        return width
    x = int_attr(glyph, "HPOS")
    if x is None:
        return 0
    for next_glyph in glyphs[index + 1:]:
        next_x = int_attr(next_glyph, "HPOS")
        if next_x and next_x > x:
            return next_x - x
    if string_box:
        sx, _, sw, _ = string_box
        right = sx + sw
        if right > x:
            return right - x
    return 0


def alto_grapheme_boxes(xml_path, needed):
    if not xml_path or not os.path.exists(xml_path):
        return []
    try:
        root = etree.parse(xml_path).getroot()
    except Exception:
        return []

    page_dimensions = alto_page_dimensions(xml_path)
    boxes = []

    for line in root.findall(".//alto:TextLine", ALTO_NS):
        line_box = node_xywh(line)
        if line_box and not is_inside_central_text_area(line_box, page_dimensions):
            continue

        for string in line.findall("./alto:String", ALTO_NS):
            text = string.get("CONTENT") or ""
            string_box = node_xywh(string)
            if string_box and not is_inside_central_text_area(string_box, page_dimensions):
                continue

            glyphs = string.findall("./alto:Glyph", ALTO_NS)
            if glyphs:
                for index, glyph in enumerate(glyphs):
                    char = CHAR_TO_TARGET.get((glyph.get("CONTENT") or "").lower())
                    if char not in needed:
                        continue
                    x = int_attr(glyph, "HPOS")
                    y = int_attr(glyph, "VPOS")
                    h = int_attr(glyph, "HEIGHT") or (string_box[3] if string_box else None) or (line_box[3] if line_box else None)
                    w = glyph_width(glyphs, index, string_box)
                    if x is None or y is None or h is None:
                        continue
                    box = padded_box(x, y, w, h, page_dimensions)
                    if is_inside_central_text_area(box, page_dimensions) and crop_geometry_quality(box):
                        boxes.append((char, box, {"source": "ALTO glyph", "coordinate_level": "glyph"}))
                continue

            chars = normalized_chars(text)
            if not chars or not string_box:
                continue
            sx, sy, sw, sh = string_box
            char_w = sw / max(len(chars), 1)
            for index, char in enumerate(chars):
                char = CHAR_TO_TARGET.get(char)
                if char not in needed:
                    continue
                box = padded_box(sx + (index * char_w), sy, char_w, sh, page_dimensions)
                if is_inside_central_text_area(box, page_dimensions) and crop_geometry_quality(box):
                    boxes.append((char, box, {"source": "ALTO word estimate", "coordinate_level": "word"}))

    return boxes


def fetch_image(url):
    if url in _image_cache:
        return _image_cache[url]
    try:
        time.sleep(0.03)
        with urllib.request.urlopen(url, timeout=15) as response:
            image = Image.open(BytesIO(response.read())).convert("L")
    except Exception:
        image = None
    _image_cache[url] = image
    return image


def ink_mask(gray_image):
    arr = np.asarray(gray_image)
    background = float(np.percentile(arr, 85))
    threshold = max(35, min(225, background - 35))
    mask = arr < threshold
    mask = morphology.remove_small_objects(mask, min_size=18)
    footprint = morphology.footprint_rectangle((2, 2)) if hasattr(morphology, "footprint_rectangle") else morphology.rectangle(2, 2)
    mask = morphology.binary_closing(mask, footprint)
    return mask


def components_from_line(line_image):
    mask = ink_mask(line_image)
    ink_density = float(mask.mean())
    if ink_density < MIN_INK_DENSITY or ink_density > MAX_INK_DENSITY:
        return [], ink_density

    height, width = mask.shape
    labeled = measure.label(mask, connectivity=2)
    components = []
    for region in measure.regionprops(labeled):
        min_y, min_x, max_y, max_x = region.bbox
        comp_w = max_x - min_x
        comp_h = max_y - min_y
        if comp_w < MIN_COMPONENT_WIDTH or comp_h < MIN_COMPONENT_HEIGHT:
            continue
        if comp_w > width * MAX_COMPONENT_WIDTH_RATIO_OF_LINE:
            continue
        if comp_h > height * 1.05:
            continue
        if region.area < 25:
            continue
        components.append((min_x, min_y, comp_w, comp_h))

    components.sort(key=lambda box: (box[0], box[1]))
    return components, ink_density


def grapheme_boxes_from_components(text, xywh, service):
    if not isinstance(text, str) or not xywh or not service:
        return []
    x, y, w, h = xywh
    if h > 550 or w < 30:
        return []
    chars = normalized_chars(text)
    if not chars:
        return []

    line_image = fetch_image(crop_url(service, xywh))
    if not line_image:
        return []

    components, ink_density = components_from_line(line_image)
    if len(components) < MIN_COMPONENTS_IN_LINE:
        return []

    mismatch = abs(len(components) - len(chars)) / max(len(chars), 1)
    if mismatch > MAX_SEGMENTATION_MISMATCH_RATIO:
        return []

    pair_count = min(len(chars), len(components))
    boxes = []
    for index in range(pair_count):
        char = CHAR_TO_TARGET.get(chars[index])
        if char not in TARGET_KEYS:
            continue
        comp_x, comp_y, comp_w, comp_h = components[index]
        pad_x = max(3, int(comp_w * 0.45))
        pad_y = max(4, int(comp_h * 0.30))
        boxes.append(
            (
                char,
                [
                    max(0, int(x + comp_x - pad_x)),
                    max(0, int(y + comp_y - pad_y)),
                    max(1, int(comp_w + (pad_x * 2))),
                    max(1, int(comp_h + (pad_y * 2))),
                ],
                {"ink_density": round(ink_density, 4), "segmentation_mismatch": round(mismatch, 4)},
            )
        )
    return boxes


def annotation_lines(item):
    annotation_page = (item.get("annotationPage") or "").lstrip("/")
    page_path = annotation_page if os.path.exists(annotation_page) else os.path.join(ANNOS_DIR, os.path.basename(annotation_page))
    if not os.path.exists(page_path):
        page_path = os.path.join(ANNOS_DIR, item.get("folder", ""), os.path.basename(annotation_page))
    if not os.path.exists(page_path):
        return []

    with open(page_path, "r", encoding="utf-8") as f:
        page_data = json.load(f)

    lines = []
    for anno in page_data.get("items", []):
        body = anno.get("body") or {}
        target = anno.get("target") or {}
        xywh = parse_xywh((target.get("selector") or {}).get("value"))
        text = body.get("value", "")
        if xywh and text:
            lines.append({"text": text, "xywh": xywh, "source": "IIIF annotation"})
    return lines


def needed_graphemes(features):
    return {
        key
        for key in TARGET_KEYS
        if len(features[key]) < MAX_CANDIDATES_PER_GRAPHEME_PER_MANUSCRIPT
    }


def evenly_sample(samples, limit):
    if len(samples) <= limit:
        return samples
    ordered = sorted(samples, key=lambda sample: (sample.get("page_index", 0), sample.get("xywh", [0, 0])[1], sample.get("xywh", [0])[0]))
    if limit <= 1:
        return ordered[:limit]
    chosen = []
    last_index = -1
    for i in range(limit):
        index = round(i * (len(ordered) - 1) / (limit - 1))
        if index <= last_index:
            index = min(last_index + 1, len(ordered) - 1)
        chosen.append(ordered[index])
        last_index = index
    return chosen


def parse_folio_page_range(extent):
    text = (extent or "").lower()
    if not text or "full manuscript" in text or text == "rest":
        return None
    matches = re.findall(r"(\d+)\s*([rv])?", text)
    if not matches:
        return None
    pages = []
    for number, side in matches:
        folio = int(number)
        if side == "v":
            pages.append(folio * 2)
        else:
            pages.append(folio * 2 - 1)
    if not pages:
        return None
    return [min(pages), max(pages)]


def folio_key(number, side):
    return int(number) * 2 + (1 if (side or "").lower() == "v" else 0)


def parse_folio_key(value):
    text = (value or "").lower()
    match = re.search(r"(?:f(?:ol)?\.?\s*)?(\d+)\s*([rv])\b", text)
    if not match:
        return None
    return folio_key(match.group(1), match.group(2))


def folio_key_range(extent):
    text = (extent or "").lower()
    if not text or "full manuscript" in text or text == "rest":
        return None
    matches = re.findall(r"(\d+)\s*([rv])\b", text)
    if not matches:
        return None
    keys = [folio_key(number, side) for number, side in matches]
    return [min(keys), max(keys)] if keys else None


def canvas_ids_for_folio_range(mapping_items, source_range):
    wanted = folio_key_range(source_range)
    if not wanted:
        return None
    selected = set()
    saw_any_label_folio = False
    for item in mapping_items:
        label_key = parse_folio_key(item.get("label"))
        if label_key is None:
            continue
        saw_any_label_folio = True
        if wanted[0] <= label_key <= wanted[1]:
            selected.add(item.get("canvas"))
    if not saw_any_label_folio:
        return None
    return selected


def scribal_unit_range_label(profile):
    scribal_unit = profile.get("scribal_unit") or {}
    return scribal_unit.get("folio_range") or scribal_unit.get("extent") or ""


def extract_features(folder, manifest_url, allowed_canvas_ids=None):
    mapping_path = os.path.join(ANNOS_DIR, folder, "mapping.json")
    if not os.path.exists(mapping_path):
        return {}

    cache_key = (
        folder,
        tuple(sorted(allowed_canvas_ids)) if allowed_canvas_ids is not None else None,
    )
    if cache_key in _features_cache:
        return _features_cache[cache_key]

    canvas_info = build_canvas_info_map(manifest_url)
    xml_files = alto_xml_files(folder)
    features = {key: [] for key in TARGET_KEYS}
    with open(mapping_path, "r", encoding="utf-8") as f:
        mapping = json.load(f)

    items = mapping.get("items", [])
    total_pages = len(items)
    segmented_lines = 0
    for page_index, item in enumerate(items):
        page_number = page_index + 1
        needed = needed_graphemes(features)
        if not needed:
            break
        if not is_kept_page(page_index, total_pages):
            continue
        canvas = item.get("canvas")
        if allowed_canvas_ids is not None and canvas not in allowed_canvas_ids:
            continue
        info = canvas_info.get(canvas) or {}
        service = info.get("service")
        if not service:
            continue

        xml_path = xml_files[page_index] if page_index < len(xml_files) else None
        alto_dimensions = alto_page_dimensions(xml_path) if xml_path else None
        crop_dimensions = info.get("dimensions")
        alto_boxes = alto_grapheme_boxes(xml_path, needed)
        page_counts = defaultdict(int)
        for letter, box, diagnostics in alto_boxes:
            if len(features[letter]) >= MAX_CANDIDATES_PER_GRAPHEME_PER_MANUSCRIPT:
                continue
            if page_counts[letter] >= MAX_ALTO_CANDIDATES_PER_GRAPHEME_PER_PAGE:
                continue
            crop_box = scale_xywh(box, alto_dimensions, crop_dimensions)
            if not crop_geometry_quality(crop_box):
                continue
            page_counts[letter] += 1
            features[letter].append(
                {
                    "image": crop_url(service, crop_box),
                    "canvas": canvas,
                    "xywh": crop_box,
                    "alto_xywh": box,
                    "page_index": page_number,
                    "quality": "geometry-pass",
                    **diagnostics,
                }
            )

        needed = needed_graphemes(features)
        if not needed or not ENABLE_SEGMENTATION_FALLBACK:
            continue

        item["folder"] = folder
        lines = annotation_lines(item)
        for line in lines:
            needed = needed_graphemes(features)
            if not needed:
                break
            text = line["text"]
            if not {CHAR_TO_TARGET.get(char) for char in normalized_chars(text)} & needed:
                continue
            xywh = line["xywh"]
            if not service or not xywh:
                continue
            if not is_inside_central_text_area(xywh, info.get("dimensions")):
                continue
            if segmented_lines >= MAX_SEGMENTED_LINES_PER_MANUSCRIPT:
                break
            segmented_lines += 1
            for letter, box, diagnostics in grapheme_boxes_from_components(text, xywh, service):
                if len(features[letter]) >= MAX_CANDIDATES_PER_GRAPHEME_PER_MANUSCRIPT:
                    continue
                if not crop_geometry_quality(box):
                    continue
                features[letter].append(
                    {
                        "image": crop_url(service, box),
                        "canvas": canvas,
                        "xywh": box,
                        "page_index": page_number,
                        "source": "line image segmentation fallback",
                        "coordinate_level": "connected-component",
                        "quality": "geometry-pass",
                        **diagnostics,
                    }
                )
    extracted = {
        letter: evenly_sample(samples, MAX_SAMPLES_PER_GRAPHEME_PER_MANUSCRIPT)
        for letter, samples in features.items()
        if samples
    }
    _features_cache[cache_key] = extracted
    return extracted


def find_manuscript_profile(manifest, profile_by_id, profile_by_title, profile_by_call):
    for key in (manifest.get("heurist_id"), manifest.get("manuscript_id")):
        if key and str(key) in profile_by_id:
            return profile_by_id[str(key)]
    title_key = normalize(manifest.get("title"))
    if title_key in profile_by_title:
        return profile_by_title[title_key]
    call = normalize(manifest.get("call_number"))
    if call and call in profile_by_call:
        return profile_by_call[call]
    return None


def find_manuscript_profiles(manifest, profiles):
    manifest_id = str(manifest.get("heurist_id") or manifest.get("manuscript_id") or "")
    matches = [
        profile for profile in profiles.values()
        if str(profile.get("manuscript_id") or "") == manifest_id
    ]
    if matches:
        return matches
    profile = find_manuscript_profile(
        manifest,
        {str(value.get("manuscript_id")): value for value in profiles.values()},
        {normalize(value.get("manuscript_title")): value for value in profiles.values()},
        {
            normalize(value.get("call_number")): value
            for value in profiles.values()
            if normalize(value.get("call_number"))
        },
    )
    return [profile] if profile else []


def viewer_url(manifest, folder):
    manifest_url = manifest.get("manifest") or ""
    annos = manifest.get("annos") or f"/data/annos/{folder}/mapping.json"
    if not manifest_url:
        return ""
    return "/viewer/?" + urlencode({
        "manifest": manifest_url,
        "annos": annos,
        "ms": folder,
    })


def database_url(entity_type, record_id):
    return f"/explore-database/?type={entity_type}&id={record_id}" if record_id else ""


def unique_values(items):
    seen = set()
    out = []
    for item in items:
        if isinstance(item, list):
            candidates = item
        else:
            candidates = str(item or "").split(";")
        for candidate in candidates:
            cleaned = re.sub(r"\s+", " ", str(candidate or "")).strip()
            if cleaned and cleaned not in seen:
                seen.add(cleaned)
                out.append(cleaned)
    return out


def script_values_from_scribal_unit(scribal_unit):
    if not isinstance(scribal_unit, dict):
        return []
    return unique_values([scribal_unit.get("scripts") or [], scribal_unit.get("script")])


def compact_profile_metadata(profile):
    person = profile.get("person") or {}
    scribal_unit = profile.get("scribal_unit") or {}
    production_unit = profile.get("production_unit") or {}
    relationship = profile.get("scribal_relationship") or {}
    affiliations = person.get("monastic_affiliations") or []
    if not affiliations:
        monastery = production_unit.get("monastic_institution")
        if monastery:
            affiliations = [{
                "id": monastery.get("id"),
                "title": monastery.get("title"),
                "name": monastery.get("title"),
                "url": monastery.get("url"),
            }]
    scripts = script_values_from_scribal_unit(scribal_unit)
    return {
        "person": person,
        "date": scribal_unit.get("date") or production_unit.get("date") or person.get("activity_years") or person.get("century_of_activity"),
        "century": scribal_unit.get("century") or production_unit.get("century") or person.get("century_of_activity"),
        "place": ", ".join(part for part in [production_unit.get("city"), production_unit.get("region"), production_unit.get("country")] if part),
        "script": "; ".join(scripts),
        "scripts": scripts,
        "role": relationship.get("scribe_role"),
        "certainty": relationship.get("scribe_certainty"),
        "production_info": relationship.get("production_info"),
        "function_of_copying": relationship.get("function_of_copying"),
        "religious_or_lay_status": person.get("religious_or_lay_status"),
        "affiliations": affiliations,
        "authority_links": person.get("authority_links") or [],
        "database_url": person.get("database_url") or database_url("hp", profile.get("scribe_id")),
    }


def is_public_fingerprint_profile(profile):
    person = profile.get("person") or {}
    title_fields = [
        profile.get("scribe_title"),
        profile.get("scribal_unit_title"),
        person.get("name"),
    ]
    normalized = " ".join(str(value or "").lower() for value in title_fields)
    return "unidentified" not in normalized


def generate_profiles():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    manifests = {entry["slug"]: entry for entry in load_yaml_manifests() if entry.get("slug")}
    scribe_map = load_scribe_map()
    profiles = scribe_map.get("manuscript_profiles", {})

    scribe_pages = {}
    skipped = []

    candidate_folders = discover_candidate_folders()
    print(f"Discovered {len(candidate_folders)} ALTO+annotation manuscript folders.")
    for folder in candidate_folders:
        manifest = manifests.get(folder)
        if not manifest:
            skipped.append((folder, "missing manifest entry"))
            continue
        manifest_profiles = find_manuscript_profiles(manifest, profiles)
        print(f"Processing {folder}: {len(manifest_profiles)} candidate scribal profile(s).", flush=True)
        if not manifest_profiles:
            skipped.append((folder, "no Heurist manuscript profile"))
            continue
        mapping_path = os.path.join(ANNOS_DIR, folder, "mapping.json")
        with open(mapping_path, "r", encoding="utf-8") as f:
            mapping_items = json.load(f).get("items", [])

        for profile in manifest_profiles:
            skip_label = f"{folder} / scribal unit {profile.get('scribal_unit_id')}"
            if not is_public_fingerprint_profile(profile):
                skipped.append((skip_label, "generic unidentified hand excluded from public fingerprints"))
                continue
            source_range = scribal_unit_range_label(profile)
            allowed_canvas_ids = None
            if profile.get("requires_segment_filter"):
                allowed_canvas_ids = canvas_ids_for_folio_range(mapping_items, source_range)
                if allowed_canvas_ids is None:
                    skipped.append((skip_label, "multi-scribe manuscript without mappable IIIF folio labels"))
                    continue
                if not allowed_canvas_ids:
                    skipped.append((skip_label, "multi-scribe folio range did not match any IIIF canvas labels"))
                    continue

            print(f"  Extracting {skip_label}", flush=True)
            features = extract_features(folder, manifest.get("manifest"), allowed_canvas_ids=allowed_canvas_ids)
            if not features:
                skipped.append((skip_label, "no crop-capable letter samples"))
                continue

            scribe_id = profile["scribe_id"]
            page = scribe_pages.setdefault(
                scribe_id,
                {
                    "title": public_scribe_title(profile["scribe_title"]),
                    "slug": slugify(profile["scribe_title"]),
                    "scribe_id": scribe_id,
                    "metadata": compact_profile_metadata(profile),
                    "features": {key: [] for key in TARGET_KEYS},
                    "manuscripts": [],
                },
            )
            page["manuscripts"].append(
                {
                    "id": profile["manuscript_id"],
                    "title": profile["manuscript_title"],
                    "slug": folder,
                    "scribal_unit_id": profile["scribal_unit_id"],
                    "scribal_unit_title": profile["scribal_unit_title"],
                    "call_number": profile.get("call_number"),
                    "viewer_url": viewer_url(manifest, folder),
                    "database_url": database_url("ms", profile["manuscript_id"]),
                    "scribal_unit": profile.get("scribal_unit") or {},
                    "scribal_relationship": profile.get("scribal_relationship") or {},
                    "production_unit": profile.get("production_unit") or {},
                    "source_range": source_range,
                }
            )
            for letter, samples in features.items():
                page["features"][letter].append(
                    {
                        "title": profile["manuscript_title"],
                        "slug": folder,
                        "viewer_url": viewer_url(manifest, folder),
                        "database_url": database_url("ms", profile["manuscript_id"]),
                        "images": [sample["image"] for sample in samples],
                        "samples": samples,
                    }
                )

    rendered_pages = {}
    for page in scribe_pages.values():
        page_scripts = unique_values(
            [page["metadata"].get("scripts") or [], page["metadata"].get("script")]
            + [
                script
                for manuscript in page["manuscripts"]
                for script in script_values_from_scribal_unit(manuscript.get("scribal_unit") or {})
            ]
        )
        page["metadata"]["scripts"] = page_scripts
        page["metadata"]["script"] = "; ".join(page_scripts)

        features = []
        for letter in TARGET_KEYS:
            manuscripts = page["features"].get(letter) or []
            if manuscripts:
                features.append(
                    {
                        "letter": TARGET_LABELS.get(letter, letter),
                        "key": letter,
                        "description": f"{sum(len(ms['images']) for ms in manuscripts)} grapheme candidates from central ALTO glyph/word regions.",
                        "manuscripts": manuscripts,
                    }
                )
        frontmatter = {
            "layout": "scribe_profile",
            "title": page["title"],
            "scribe_id": page["scribe_id"],
            "metadata": page["metadata"],
            "manuscripts": page["manuscripts"],
            "features": features,
        }
        body = "---\n"
        body += yaml.dump(frontmatter, sort_keys=False, allow_unicode=True)
        body += "---\n\n"
        body += "Profile generated automatically from ALTO glyph and word coordinates, central-page filtering, and Heurist entity relationships.\n"
        rendered_pages[f"{page['slug']}.md"] = body

    if rendered_pages:
        for filename in os.listdir(OUTPUT_DIR):
            if filename.endswith(".md"):
                os.remove(os.path.join(OUTPUT_DIR, filename))
        for filename, body in rendered_pages.items():
            with open(os.path.join(OUTPUT_DIR, filename), "w", encoding="utf-8") as f:
                f.write(body)

    print(f"Generated {len(scribe_pages)} scribe profiles.")
    if skipped:
        print("Skipped:")
        for folder, reason in skipped:
            print(f"- {folder}: {reason}")


if __name__ == "__main__":
    generate_profiles()
