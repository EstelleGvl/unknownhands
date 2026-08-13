import os
import yaml

MANIFESTS_YML = "data/manifests.yml"

_manifest_cache = None


def _load_manifests():
    global _manifest_cache
    if _manifest_cache is not None:
        return _manifest_cache
    manifests = []
    if os.path.exists(MANIFESTS_YML):
        try:
            with open(MANIFESTS_YML, "r", encoding="utf-8") as f:
                manifests = yaml.safe_load(f) or []
        except Exception:
            manifests = []
    _manifest_cache = manifests
    return manifests


def find_image_service_for_canvas(canvas_id):
    manifests = _load_manifests()
    for m in manifests:
        # manifests may be dicts with 'sequences' or 'items' depending on IIIF version
        canvases = []
        if isinstance(m, dict):
            if 'items' in m:
                for seq in m.get('items', []):
                    canvases.extend(seq.get('items', []))
            elif 'sequences' in m:
                for seq in m.get('sequences', []):
                    canvases.extend(seq.get('canvases', []))
            else:
                # try to find nested canvases
                for k, v in m.items():
                    if isinstance(v, list):
                        for it in v:
                            if isinstance(it, dict) and ('id' in it or '@id' in it):
                                pass
        for c in canvases:
            cid = c.get('id') or c.get('@id') or c.get('canvas')
            if not cid:
                continue
            if cid == canvas_id or canvas_id.endswith(cid) or cid.endswith(canvas_id):
                # find image service
                # look in items -> items[0] -> body -> service
                imgs = c.get('items') or c.get('images')
                if not imgs:
                    continue
                for img in imgs:
                    resource = img.get('items') or img.get('resource') or img.get('body')
                    if isinstance(resource, list):
                        resource = resource[0]
                    if not isinstance(resource, dict):
                        continue
                    service = resource.get('service') or resource.get('service')
                    if isinstance(service, dict):
                        sid = service.get('id') or service.get('@id')
                        if sid:
                            return sid
                    elif isinstance(service, list) and service:
                        s0 = service[0]
                        sid = s0.get('id') or s0.get('@id')
                        if sid:
                            return sid
                    # fallback if resource itself has an @id
                    rid = resource.get('id') or resource.get('@id')
                    if rid and rid.endswith('.jpg'):
                        return rid.rsplit('/', 1)[0]
    return None


def iiif_crop_url(canvas_id, xywh, size='max', quality='default', fmt='jpg'):
    """Return a IIIF Image API URL for the given canvas id and xywh region if possible.
    Falls back to a placehold.co URL if service cannot be resolved.
    """
    if not xywh:
        return None
    service = find_image_service_for_canvas(canvas_id)
    x, y, w, h = xywh.split(',')
    if service:
        # ensure no trailing slash
        service = service.rstrip('/')
        region = f"{x},{y},{w},{h}"
        return f"{service}/{region}/{size}/0/{quality}.{fmt}"
    else:
        return None
