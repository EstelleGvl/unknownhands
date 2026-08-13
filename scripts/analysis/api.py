#!/usr/bin/env python3
"""
Flask API for text analysis (TF-IDF, PCA, stylometry)
Usage: python api.py
Then access at http://localhost:5001
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import tempfile
from pathlib import Path
import pandas as pd
import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import StratifiedKFold, cross_val_score
from scipy.sparse import csr_matrix, vstack

app = Flask(__name__)
CORS(app)  # Enable CORS for Jekyll frontend

# Path to transcriptions
BASE_DIR = Path(__file__).parent.parent.parent
TRANSCRIPTIONS_DIR = BASE_DIR / "data" / "transcriptions"


def load_transcription(slug):
    """Load transcription text for a manuscript"""
    mapping_file = TRANSCRIPTIONS_DIR / slug / "mapping.json"
    if not mapping_file.exists():
        return None
    
    with open(mapping_file) as f:
        mapping = json.load(f)
    
    texts = []
    annos_dir = TRANSCRIPTIONS_DIR / slug / "annotations"
    
    for canvas_id, anno_path in mapping.items():
        anno_file = TRANSCRIPTIONS_DIR / slug / anno_path
        if anno_file.exists():
            with open(anno_file) as f:
                anno_data = json.load(f)
                items = anno_data.get("items", [])
                for item in items:
                    body = item.get("body", {})
                    text = body.get("value", "")
                    if text:
                        texts.append(text.strip())
    
    return "\n".join(texts)


def chunk_text(text, chunk_size=2000, min_tail_ratio=0.6):
    """Split text into chunks"""
    L = len(text)
    if L == 0:
        return []
    if L <= chunk_size:
        return [text]
    
    chunks = []
    for i in range(0, L, chunk_size):
        ch = text[i:i+chunk_size]
        if i+chunk_size < L or len(ch) >= int(min_tail_ratio*chunk_size):
            chunks.append(ch)
    return chunks


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Analysis API is running"})


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Main analysis endpoint
    
    Expected JSON body:
    {
      "texts": [
        {"label": "Manuscript1", "text": "..."},
        {"label": "Manuscript2", "text": "..."}
      ],
      "config": {
        "ngram_type": "char",  // "char" or "word"
        "ngram_size": 4,
        "min_df": 2,
        "max_df": 0.9,
        "lowercase": false,
        "chunk_size": 2000,
        "n_components": 3
      }
    }
    """
    try:
        data = request.get_json()
        texts_data = data.get("texts", [])
        config = data.get("config", {})
        
        # Extract config
        ngram_type = config.get("ngram_type", "char")
        ngram_size = int(config.get("ngram_size", 4))
        min_df = int(config.get("min_df", 2))
        max_df = float(config.get("max_df", 0.9))
        lowercase = config.get("lowercase", False)
        chunk_size = int(config.get("chunk_size", 2000))
        n_components = min(int(config.get("n_components", 3)), 10)
        
        # Prepare corpus
        rows = []
        for item in texts_data:
            label = item.get("label", "Unknown")
            text = item.get("text", "")
            chunks = chunk_text(text, chunk_size)
            for idx, chunk in enumerate(chunks):
                rows.append({
                    "label": label,
                    "chunk_idx": idx,
                    "text": chunk
                })
        
        if len(rows) < 2:
            return jsonify({"error": "Need at least 2 text samples"}), 400
        
        df = pd.DataFrame(rows)
        
        # TF-IDF vectorization
        vec = TfidfVectorizer(
            analyzer=ngram_type,
            ngram_range=(ngram_size, ngram_size),
            min_df=min_df,
            max_df=max_df,
            lowercase=lowercase,
            norm="l2"
        )
        
        X = vec.fit_transform(df["text"].tolist())
        
        # Dimensionality reduction
        actual_components = min(n_components, X.shape[0] - 1, X.shape[1])
        svd = TruncatedSVD(n_components=actual_components, random_state=42)
        X_reduced = svd.fit_transform(X)
        
        # Build results
        results = {
            "chunks": [],
            "pages": [],
            "features": {
                "total": X.shape[1],
                "top_features": []
            },
            "variance_explained": svd.explained_variance_ratio_.tolist(),
            "total_variance": float(svd.explained_variance_ratio_.sum())
        }
        
        # Per-chunk coordinates
        for i, row in df.iterrows():
            point = {
                "label": row["label"],
                "chunk_idx": row["chunk_idx"],
                "text_preview": row["text"][:200] + "..." if len(row["text"]) > 200 else row["text"]
            }
            for j in range(actual_components):
                point[f"PC{j+1}"] = float(X_reduced[i, j])
            results["chunks"].append(point)
        
        # Per-page (average of chunks)
        page_groups = df.groupby("label").indices
        page_data = []
        for label, indices in page_groups.items():
            sub = X[indices, :]
            mean_row = sub.mean(axis=0)
            mean_reduced = svd.transform(csr_matrix(mean_row))
            point = {"label": label}
            for j in range(actual_components):
                point[f"PC{j+1}"] = float(mean_reduced[0, j])
            page_data.append(point)
        results["pages"] = page_data
        
        # Top features (if classification makes sense)
        unique_labels = df["label"].unique()
        if len(unique_labels) >= 2 and len(unique_labels) <= 10:
            try:
                le = LabelEncoder()
                y = le.fit_transform(df["label"].values)
                clf = LogisticRegression(max_iter=5000, random_state=42)
                clf.fit(X, y)
                
                feature_names = vec.get_feature_names_out()
                top_k = 25
                
                for class_idx, class_name in enumerate(le.classes_):
                    if clf.coef_.shape[0] == 1 and len(le.classes_) == 2:
                        # Binary classification
                        weights = clf.coef_[0] if class_idx == 1 else -clf.coef_[0]
                    else:
                        weights = clf.coef_[class_idx]
                    
                    top_indices = np.argsort(weights)[::-1][:top_k]
                    features_list = []
                    for idx in top_indices:
                        features_list.append({
                            "feature": feature_names[idx],
                            "weight": float(weights[idx])
                        })
                    
                    results["features"]["top_features"].append({
                        "class": class_name,
                        "features": features_list
                    })
                
                # Cross-validation score
                cv = StratifiedKFold(n_splits=min(5, len(df)), shuffle=True, random_state=42)
                scores = cross_val_score(clf, X, y, cv=cv)
                results["classification"] = {
                    "accuracy_mean": float(scores.mean()),
                    "accuracy_std": float(scores.std())
                }
            except Exception as e:
                results["classification"] = {"error": str(e)}
        
        return jsonify(results)
    
    except Exception as e:
        import traceback
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500


@app.route('/api/manuscripts', methods=['GET'])
def list_manuscripts():
    """List available manuscripts with transcriptions"""
    manuscripts = []
    if TRANSCRIPTIONS_DIR.exists():
        for slug_dir in TRANSCRIPTIONS_DIR.iterdir():
            if slug_dir.is_dir():
                mapping_file = slug_dir / "mapping.json"
                if mapping_file.exists():
                    # Count pages
                    with open(mapping_file) as f:
                        mapping = json.load(f)
                    manuscripts.append({
                        "slug": slug_dir.name,
                        "page_count": len(mapping)
                    })
    return jsonify(manuscripts)


@app.route('/api/load-transcription/<slug>', methods=['GET'])
def get_transcription(slug):
    """Load full transcription for a manuscript"""
    text = load_transcription(slug)
    if text is None:
        return jsonify({"error": "Manuscript not found"}), 404
    
    return jsonify({
        "slug": slug,
        "text": text,
        "length": len(text)
    })


if __name__ == '__main__':
    print("=" * 60)
    print("Text Analysis API Starting...")
    print("=" * 60)
    print(f"Transcriptions directory: {TRANSCRIPTIONS_DIR}")
    print(f"Access the API at: http://localhost:5001")
    print("=" * 60)
    app.run(debug=True, port=5001, host='0.0.0.0')
