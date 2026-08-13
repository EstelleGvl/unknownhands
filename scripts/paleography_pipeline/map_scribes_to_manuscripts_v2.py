import json
import os
import re
from collections import defaultdict

HEURIST_DIR = "data/heurist"
OUT_DIR = "data/paleography"
OUT_FILE = os.path.join(OUT_DIR, "scribe_to_manuscript_v2.json")


def load_records(filename):
    path = os.path.join(HEURIST_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, dict):
        return data.get("heurist", {}).get("records", [])
    return data if isinstance(data, list) else []


def detail(record, field_name):
    wanted = field_name.lower()
    for item in record.get("details", []):
        if (item.get("fieldName") or "").lower() == wanted:
            return item
    return {}


def details(record, field_name):
    wanted = field_name.lower()
    return [item for item in record.get("details", []) if (item.get("fieldName") or "").lower() == wanted]


def value(record, field_name):
    item = detail(record, field_name)
    if item.get("termLabel"):
        return item["termLabel"]
    raw = item.get("value")
    if isinstance(raw, dict):
        return raw.get("title") or raw.get("id") or ""
    return raw or ""


def values(record, field_name):
    out = []
    for item in details(record, field_name):
        if item.get("termLabel"):
            out.append(item["termLabel"])
            continue
        raw = item.get("value")
        if isinstance(raw, dict):
            out.append(raw.get("title") or raw.get("id") or "")
        elif raw:
            out.append(raw)
    return [clean_title(str(item)) for item in out if clean_title(str(item))]


def resource_value(record, field_name):
    raw = detail(record, field_name).get("value")
    return raw if isinstance(raw, dict) and raw.get("id") else None


def clean_title(value):
    value = re.sub(r"\s+", " ", str(value or "")).strip()
    return value


def unique_values(items):
    seen = set()
    out = []
    for item in items:
        cleaned = clean_title(item)
        if cleaned and cleaned not in seen:
            seen.add(cleaned)
            out.append(cleaned)
    return out


def relationship_endpoints(record):
    source = target = reltype = None
    for item in record.get("details", []):
        field = item.get("fieldName")
        value = item.get("value")
        if field == "Source record" and isinstance(value, dict):
            source = str(value.get("id"))
        elif field == "Target record" and isinstance(value, dict):
            target = str(value.get("id"))
        elif field == "Relationship type":
            reltype = item.get("termLabel") or value
    return source, target, reltype


def entity_link(record_id, entity_type):
    return f"/explore-database/?type={entity_type}&id={record_id}" if record_id else ""


def summarize_monastic_institution(record, relationship_type=""):
    if not record:
        return None
    return {
        "id": str(record.get("rec_ID")),
        "title": clean_title(record.get("rec_Title")),
        "relationship": relationship_type,
        "name": clean_title(value(record, "Monastery name") or record.get("rec_Title")),
        "city": clean_title(value(record, "City") or value(record, "Monastery Location")),
        "country": clean_title(value(record, "Country")),
        "order": clean_title(value(record, "Religious order")),
        "institution_type": clean_title(value(record, "Type of institution") or value(record, "Type of monastery")),
        "rule": clean_title(value(record, "Rule")),
        "movement": clean_title(value(record, "Movement / Reform / Observance")),
        "url": entity_link(record.get("rec_ID"), "mi"),
    }


def summarize_person(record, relationships, monastic_by_id):
    if not record:
        return {}
    person_id = str(record.get("rec_ID"))
    affiliations = []
    for rel in relationships:
        source, target, reltype = relationship_endpoints(rel)
        target_detail = detail(rel, "Target record").get("value") or {}
        if source == person_id and target_detail.get("type") == "115":
            institution = summarize_monastic_institution(monastic_by_id.get(target), clean_title(reltype or ""))
            if institution:
                affiliations.append(institution)
    authority_links = []
    for label, field in [
        ("Wikidata", "Wikidata"),
        ("VIAF", "VIAF"),
        ("GND", "GND ID"),
        ("ISNI", "ISNI"),
        ("BnF", "Bibliothèque nationale de France ID"),
        ("LoC", "Library of Congress authority ID"),
    ]:
        link = clean_title(value(record, field))
        if link:
            authority_links.append({"label": label, "url": link})
    return {
        "id": person_id,
        "name": clean_title(value(record, "Name of Person") or record.get("rec_Title")),
        "gender": clean_title(value(record, "Gender")),
        "gender_certainty": clean_title(value(record, "Gender certainty")),
        "person_type": clean_title(value(record, "Person type")),
        "religious_or_lay_status": clean_title(value(record, "Religious or Lay Status")),
        "century_of_activity": clean_title(value(record, "Century of Activity")),
        "activity_years": clean_title(value(record, "activity years")),
        "birth": clean_title(value(record, "Normalized Date of Birth")),
        "death": clean_title(value(record, "Normalized Date of Death")),
        "short_biography": clean_title(value(record, "Short biography")),
        "comments": clean_title(value(record, "Personal Data Comments") or value(record, "Biography Comments")),
        "authority_links": authority_links,
        "monastic_affiliations": affiliations,
        "database_url": entity_link(person_id, "hp"),
    }


def summarize_production_unit(record):
    if not record:
        return {}
    monastery = resource_value(record, "Monastic Institution")
    return {
        "id": str(record.get("rec_ID")),
        "title": clean_title(record.get("rec_Title")),
        "date": clean_title(value(record, "PU dating") or value(record, "Ms Dating")),
        "century": clean_title(value(record, "Normalized century of production")),
        "terminus_post_quem": clean_title(value(record, "Normalized terminus post quem")),
        "terminus_ante_quem": clean_title(value(record, "Normalized terminus ante quem")),
        "city": clean_title(value(record, "PU City") or value(record, "City")),
        "country": clean_title(value(record, "PU country") or value(record, "Country")),
        "region": clean_title(value(record, "PU region")),
        "material": clean_title(value(record, "Material")),
        "extent": clean_title(value(record, "Extent")),
        "monastic_institution": {
            "id": str(monastery.get("id")),
            "title": clean_title(monastery.get("title")),
            "url": entity_link(monastery.get("id"), "mi"),
        } if monastery else None,
    }


def summarize_scribal_unit(record):
    if not record:
        return {}
    scripts = unique_values(values(record, "Normalised script(s)"))
    if not scripts:
        script_comments = clean_title(value(record, "Script Comments"))
        scripts = [script_comments] if script_comments else []
    return {
        "id": str(record.get("rec_ID")),
        "title": clean_title(record.get("rec_Title")),
        "date": clean_title(value(record, "SU dating")),
        "century": clean_title(value(record, "Normalized century of production")),
        "terminus_post_quem": clean_title(value(record, "Normalized terminus post quem")),
        "terminus_ante_quem": clean_title(value(record, "Normalized terminus ante quem")),
        "extent": clean_title(value(record, "Extent")),
        "folio_range": clean_title(value(record, "Folio range")),
        "script": "; ".join(scripts),
        "scripts": scripts,
        "languages": values(record, "Text Language(s)"),
        "comments": clean_title(value(record, "Scribe Comments")),
    }


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    manuscripts = load_records("manuscripts.json")
    scribal_units = [
        record for record in load_records("scribal_units.json")
        if record.get("rec_RecTypeName") == "Scribal Unit"
    ]
    production_units = [
        record for record in load_records("production_units.json")
        if record.get("rec_RecTypeName") == "Production Unit"
    ]
    historical_people = [
        record for record in load_records("historical_people.json")
        if record.get("rec_RecTypeName") == "Historical Person"
    ]
    monastic_institutions = [
        record for record in load_records("monastic_institutions.json")
        if record.get("rec_RecTypeName") == "Monastic Institution"
    ]
    relationships = load_records("relationships.json")

    manuscripts_by_id = {str(record.get("rec_ID")): record for record in manuscripts}
    scribal_units_by_id = {str(record.get("rec_ID")): record for record in scribal_units}
    production_units_by_id = {str(record.get("rec_ID")): record for record in production_units}
    people_by_id = {str(record.get("rec_ID")): record for record in historical_people}
    monastic_by_id = {str(record.get("rec_ID")): record for record in monastic_institutions}

    manuscript_to_scribal_units = defaultdict(list)
    for unit in scribal_units:
        manuscript = detail(unit, "Manuscript").get("value")
        if isinstance(manuscript, dict) and manuscript.get("id"):
            manuscript_to_scribal_units[str(manuscript["id"])].append(str(unit["rec_ID"]))

    manuscript_to_production_units = defaultdict(list)
    for unit in production_units:
        manuscript = detail(unit, "Manuscript").get("value")
        if isinstance(manuscript, dict) and manuscript.get("id"):
            manuscript_to_production_units[str(manuscript["id"])].append(str(unit["rec_ID"]))

    scribal_unit_to_person = {}
    scribal_unit_to_person_relationship = {}
    for rel in relationships:
        source, target, reltype = relationship_endpoints(rel)
        if not source or not target:
            continue
        if source in scribal_units_by_id:
            target_detail = detail(rel, "Target record").get("value") or {}
            if target_detail.get("type") == "114" or (reltype and "scribe" in str(reltype).lower()):
                scribal_unit_to_person[source] = {
                    "id": target,
                    "title": clean_title(target_detail.get("title") or rel.get("rec_Title")),
                }
                scribal_unit_to_person_relationship[source] = {
                    "relationship": clean_title(reltype or ""),
                    "scribe_certainty": clean_title(value(rel, "scribe certainty")),
                    "production_info": clean_title(value(rel, "Production info")),
                    "function_of_copying": clean_title(value(rel, "Function of Copying")),
                    "scribe_role": clean_title(value(rel, "Scribe role")),
                    "comments": clean_title(value(rel, "Scribe Comments")),
                }

    mappings = {}
    manuscript_profiles = {}
    for manuscript_id, scribe_unit_ids in manuscript_to_scribal_units.items():
        production_unit_ids = manuscript_to_production_units.get(manuscript_id, [])
        manuscript = manuscripts_by_id.get(manuscript_id)
        if not manuscript:
            continue
        if len(production_unit_ids) != 1:
            continue

        production_unit = production_units_by_id.get(production_unit_ids[0])
        for scribe_unit_id in scribe_unit_ids:
            scribe_unit = scribal_units_by_id[scribe_unit_id]
            summarized_scribal_unit = summarize_scribal_unit(scribe_unit)
            extent = clean_title(summarized_scribal_unit.get("extent"))
            if len(scribe_unit_ids) > 1 and extent.lower() == "full manuscript":
                continue

            person = scribal_unit_to_person.get(scribe_unit_id)
            scribe_id = person["id"] if person else f"scribal-unit-{scribe_unit_id}"
            scribe_title = person["title"] if person else clean_title(scribe_unit.get("rec_Title"))
            person_record = people_by_id.get(scribe_id)
            profile_key = manuscript_id if len(scribe_unit_ids) == 1 else f"{manuscript_id}__{scribe_unit_id}"

            mappings.setdefault(scribe_id, set()).add(manuscript_id)
            manuscript_profiles[profile_key] = {
                "profile_key": profile_key,
                "manuscript_id": manuscript_id,
                "manuscript_title": clean_title(manuscript.get("rec_Title")),
                "call_number": clean_title(detail(manuscript, "Call number").get("value")),
                "scribe_id": scribe_id,
                "scribe_title": scribe_title,
                "scribal_unit_id": scribe_unit_id,
                "scribal_unit_title": clean_title(scribe_unit.get("rec_Title")),
                "production_unit_ids": production_unit_ids,
                "person": summarize_person(person_record, relationships, monastic_by_id),
                "scribal_unit": summarized_scribal_unit,
                "scribal_relationship": scribal_unit_to_person_relationship.get(scribe_unit_id, {}),
                "production_unit": summarize_production_unit(production_unit),
                "single_scribal_unit": len(scribe_unit_ids) == 1,
                "single_production_unit": len(production_unit_ids) == 1,
                "prototype_safe": len(scribe_unit_ids) == 1 and len(production_unit_ids) == 1,
                "requires_segment_filter": len(scribe_unit_ids) > 1,
            }

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(
            {
                "mappings": {key: sorted(value) for key, value in sorted(mappings.items())},
                "manuscript_profiles": manuscript_profiles,
                "found": len(mappings),
            },
            f,
            indent=2,
            ensure_ascii=False,
        )
    print(f"Wrote {OUT_FILE} with {len(mappings)} scribes mapped.")


if __name__ == "__main__":
    main()
