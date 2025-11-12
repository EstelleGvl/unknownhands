#!/usr/bin/env python3
"""
Split the large transcriptions.json into per-manuscript chunks for faster loading.

This dramatically improves search performance by:
1. Reducing initial download from 31MB to ~100KB (metadata only)
2. Loading only relevant manuscript data when filtered
3. Enabling progressive loading for "all manuscripts" searches

Usage:
    python scripts/split_search_corpus.py
"""

import json
import os
from pathlib import Path
from collections import defaultdict

def split_corpus():
    """Split transcriptions.json into per-manuscript files."""
    
    # Paths
    corpus_path = Path('assets/search/transcriptions.json')
    output_dir = Path('assets/search/manuscripts')
    output_dir.mkdir(exist_ok=True)
    
    print(f"📖 Loading corpus from {corpus_path}...")
    with open(corpus_path, 'r', encoding='utf-8') as f:
        corpus = json.load(f)
    
    docs = corpus.get('docs', [])
    manuscripts = corpus.get('manuscripts', [])
    
    print(f"📊 Found {len(docs):,} documents in {len(manuscripts)} manuscripts")
    
    # Group documents by manuscript slug
    by_manuscript = defaultdict(list)
    for doc in docs:
        slug = doc.get('slug', 'unknown')
        by_manuscript[slug].append(doc)
    
    # Write per-manuscript files
    print(f"\n✂️  Splitting into {len(by_manuscript)} manuscript files...")
    
    manuscript_metadata = []
    for ms in manuscripts:
        slug = ms['slug']
        ms_docs = by_manuscript.get(slug, [])
        
        if not ms_docs:
            print(f"  ⚠️  {slug}: No documents found, skipping")
            continue
        
        # Write manuscript data
        output_path = output_dir / f"{slug}.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                'slug': slug,
                'title': ms.get('title', slug),
                'docs': ms_docs
            }, f, ensure_ascii=False)
        
        file_size = output_path.stat().st_size / 1024  # KB
        
        manuscript_metadata.append({
            'slug': slug,
            'title': ms.get('title', slug),
            'doc_count': len(ms_docs),
            'file_size': int(file_size),
            'file': f"/assets/search/manuscripts/{slug}.json"
        })
        
        print(f"  ✓ {slug}: {len(ms_docs):,} docs → {file_size:.1f} KB")
    
    # Write index file with metadata
    index_path = output_dir / 'index.json'
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump({
            'total_manuscripts': len(manuscript_metadata),
            'total_documents': len(docs),
            'manuscripts': manuscript_metadata
        }, f, ensure_ascii=False, indent=2)
    
    index_size = index_path.stat().st_size / 1024
    print(f"\n📋 Index file: {index_size:.1f} KB")
    
    # Calculate savings
    original_size = corpus_path.stat().st_size / (1024 * 1024)  # MB
    total_split_size = sum(m['file_size'] for m in manuscript_metadata) / 1024  # MB
    
    print(f"\n📈 Results:")
    print(f"  Original file: {original_size:.1f} MB")
    print(f"  Split files total: {total_split_size:.1f} MB")
    print(f"  Metadata index: {index_size:.1f} KB")
    print(f"  Typical single-manuscript load: {total_split_size / len(manuscript_metadata):.1f} MB avg")
    print(f"\n✨ Speed improvement: Load only what you need!")
    print(f"   - Filtered search: ~{total_split_size / len(manuscript_metadata):.0f}KB instead of {original_size:.0f}MB")
    print(f"   - First load: ~{index_size:.0f}KB metadata")

if __name__ == '__main__':
    split_corpus()
