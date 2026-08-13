import json
import os
import csv
import urllib.request
import time

CSV_FILE = "../../data/rag_data/colophon_chunks.csv"
OUTPUT_DB = "../../data/rag_data/colophon_embeddings.json"

def get_api_key():
    # Attempt to read from .env if present
    env_path = os.path.join(os.path.dirname(__file__), '../../.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    return line.split('=', 1)[1].strip().strip('"').strip("'")
    return os.environ.get("GEMINI_API_KEY")

def get_embedding(text, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key={api_key}"
    data = json.dumps({
        "model": "models/gemini-embedding-2",
        "content": {"parts": [{"text": text}]},
        "task_type": "retrieval_document"
    }).encode("utf-8")
    
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as response:
        resp_data = json.loads(response.read().decode("utf-8"))
        return resp_data["embedding"]["values"]

def main():
    api_key = get_api_key()
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found in environment or .env file.")
        return

    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, CSV_FILE)
    out_path = os.path.join(base_dir, OUTPUT_DB)
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        chunks = list(reader)
        
    print(f"Generating embeddings for {len(chunks)} ultra-enriched records...")
    db = []
    
    for i, c in enumerate(chunks):
        text_to_embed = f"{c['context']} \n\n {c['text']}"
        try:
            vector = get_embedding(text_to_embed, api_key)
            db.append({
                "chunk_id": c["chunk_id"],
                "manuscript_title": c["manuscript_title"],
                "country": c["country"],
                "context": c["context"],
                "text": c["text"],
                "embedding": vector
            })
            if (i+1) % 50 == 0:
                print(f"Processed {i+1}/{len(chunks)} vectors...")
            time.sleep(0.1) # Soft rate limit protection
        except Exception as e:
            print(f"Failed to embed chunk {c['chunk_id']}: {e}")
            
    with open(out_path, 'w', encoding='utf-8') as f:
        # Save compact JSON
        json.dump(db, f, separators=(',', ':'))
        
    print(f"\nSUCCESS! Stored {len(db)} embedded vectors in {out_path}.")

if __name__ == "__main__":
    main()
