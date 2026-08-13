import json
import os
import csv
import glob

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "../../data/heurist")
OUTPUT_FILE = os.path.join(BASE_DIR, "../../data/rag_data/colophon_chunks.csv")

def load_all_records():
    records_db = {}
    for file in glob.glob(os.path.join(DATA_DIR, "*.json")):
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            recs = data.get("heurist", {}).get("records", [])
            for r in recs:
                records_db[r["rec_ID"]] = r
    return records_db

def build_graph(records_db):
    graph = {}
    for r_id, r in records_db.items():
        if r.get("rec_RecTypeID") == "1": # Relationship record type
            details = {d.get("fieldName"): d for d in r.get("details", [])}
            src = details.get("Source record", {}).get("value", {}).get("id")
            tgt = details.get("Target record", {}).get("value", {}).get("id")
            if src and tgt:
                graph.setdefault(src, set()).add(tgt)
                graph.setdefault(tgt, set()).add(src)
    return graph

def get_details_dict(record):
    dd = {}
    for d in record.get("details", []):
        fname = d.get("fieldName")
        val = d.get("termLabel") or d.get("value")
        if isinstance(val, dict):
            val = val.get("title", str(val))
        dd.setdefault(fname, []).append(str(val))
    return {k: ", ".join(list(set(v))) for k, v in dd.items()}

def extract():
    print("Loading entire Heurist database into memory...")
    records_db = load_all_records()
    print("Building relationship graph...")
    graph = build_graph(records_db)
    
    chunks = []
    
    TARGET_FIELDS = [
        "PU country", "PU City", "PU region", "PU dating", "Normalized century of production",
        "Material", "Colophon language", "Extent", "Number of Folios", "Holding Institution",
        "Normalised script(s)", "Gender", "Religious order", "Decoration Presence", "Musical Notation Presence"
    ]

    for r_id, r in records_db.items():
        if r.get("rec_RecTypeID") == "116": # Production Unit
            dd = get_details_dict(r)
            olo = dd.get("Colophon transcription")
            trans = dd.get("Colophon translation")
            
            if (olo and len(olo.strip()) > 10) or (trans and len(trans.strip()) > 10):
                # We have a colophon! Now let's traverse the graph to get Scribes, Texts, Monasteries
                
                # Breadth-first search for 2 degrees of separation
                deg1 = graph.get(r_id, set())
                deg2 = set()
                for d in deg1:
                    deg2.update(graph.get(d, set()))
                all_related_ids = deg1.union(deg2)
                
                scribes = []
                texts = []
                monasteries = []
                
                # Check direct fields first
                if "Monastic Institution" in dd:
                    monasteries.append(dd["Monastic Institution"])
                
                # Add related records
                for rel_id in all_related_ids:
                    if rel_id not in records_db: continue
                    rel_rec = records_db[rel_id]
                    rel_type = rel_rec.get("rec_RecTypeID")
                    rel_dd = get_details_dict(rel_rec)
                    
                    if rel_type == "114": # Person (Scribe)
                        name = rel_rec.get("rec_Title", "Unknown Person")
                        gender = rel_dd.get("Gender", "")
                        status = rel_dd.get("Religious or Lay Status", "")
                        extra = []
                        if gender: extra.append(gender)
                        if status: extra.append(status)
                        if extra: name += f" ({', '.join(extra)})"
                        scribes.append(name)
                        
                    elif rel_type == "107": # Text
                        title = rel_rec.get("rec_Title", "Unknown Text")
                        genre = rel_dd.get("Genre", "")
                        if genre: title += f" [{genre}]"
                        texts.append(title)
                        
                    elif rel_type == "115": # Monastic Institution
                        monast_str = rel_rec.get("rec_Title", "Unknown")
                        order = rel_dd.get("Religious order", "")
                        if order: monast_str += f" ({order})"
                        monasteries.append(monast_str)
                
                # Build context
                context_parts = [f"Manuscript: {r.get('rec_Title', 'Unknown')}"]
                
                for tf in TARGET_FIELDS:
                    if tf in dd and dd[tf].lower() != "unknown":
                        nice_name = tf.replace("PU ", "").replace("Normalized ", "").replace("Normalised ", "").capitalize()
                        context_parts.append(f"{nice_name}: {dd[tf]}")
                
                if monasteries:
                    context_parts.append(f"Monasteries: {'; '.join(list(set(monasteries)))}")
                if scribes:
                    context_parts.append(f"Scribes: {'; '.join(list(set(scribes)))}")
                if texts:
                    context_parts.append(f"Texts copied: {'; '.join(list(set(texts)))}")
                    
                context_string = " | ".join(context_parts)
                
                clean_text = ""
                if olo: clean_text += f"Original: {olo.replace(chr(10), ' ').replace(chr(13), ' ')} "
                if trans: clean_text += f"Translation: {trans.replace(chr(10), ' ').replace(chr(13), ' ')}"
                
                chunks.append({
                    "chunk_id": f"pu_{r_id}",
                    "manuscript_title": r.get('rec_Title', 'Unknown'),
                    "country": dd.get("PU country", "Unknown"),
                    "context": context_string,
                    "text": clean_text.strip()
                })

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=["chunk_id", "manuscript_title", "country", "context", "text"])
        writer.writeheader()
        writer.writerows(chunks)
        
    print(f"Extraction complete! Saved {len(chunks)} relationally-enriched colophon chunks.")

if __name__ == "__main__":
    extract()
