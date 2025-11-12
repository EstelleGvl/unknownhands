# Elasticsearch Backend Implementation Plan

## Overview
Move from client-side Lunr.js search to server-side Elasticsearch for instant search performance on 200k+ transcription lines.

---

## Architecture

### Current Setup (Static)
```
Browser → Jekyll Static Site → 31MB JSON → Lunr.js → Results
```

### New Setup (Hybrid)
```
Browser → Jekyll Static Site (UI)
           ↓
       API Server (Python Flask)
           ↓
       Elasticsearch → Results
```

**Key Point**: Your public-facing site stays static (Jekyll on GitHub Pages/Netlify). Only search API needs backend.

---

## Implementation Steps

### Phase 1: Local Development (Week 1)

#### 1.1 Install Dependencies
```bash
# Install Elasticsearch locally (macOS)
brew tap elastic/tap
brew install elastic/tap/elasticsearch-full

# Start Elasticsearch
elasticsearch

# Install Python dependencies
pip install flask elasticsearch beautifulsoup4 flask-cors
```

#### 1.2 Create Flask Search API

**File: `api/app.py`** (based on TexTile-Backend)
```python
from flask import Flask, request, jsonify
from elasticsearch import Elasticsearch
import os

app = Flask(__name__)
es = Elasticsearch([os.getenv('ELASTICSEARCH_HOST', 'http://localhost:9200')])

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    manuscript = request.args.get('ms', '')
    page = int(request.args.get('page', 1))
    size = int(request.args.get('size', 25))
    mode = request.args.get('mode', 'exact')  # exact, fuzzy, partial
    
    # Build Elasticsearch query
    must_clauses = []
    
    if mode == 'exact':
        must_clauses.append({
            "match": {"text": {"query": query, "operator": "and"}}
        })
    elif mode == 'fuzzy':
        must_clauses.append({
            "match": {"text": {"query": query, "fuzziness": "AUTO"}}
        })
    else:  # partial
        must_clauses.append({
            "match_phrase_prefix": {"text": query}
        })
    
    if manuscript:
        must_clauses.append({"term": {"slug": manuscript}})
    
    body = {
        "from": (page - 1) * size,
        "size": size,
        "query": {
            "bool": {"must": must_clauses}
        },
        "highlight": {
            "fields": {"text": {}},
            "pre_tags": ["<mark>"],
            "post_tags": ["</mark>"]
        },
        "sort": [{"_score": "desc"}]
    }
    
    results = es.search(index='transcriptions', body=body)
    
    return jsonify({
        'total': results['hits']['total']['value'],
        'hits': [{
            'id': hit['_id'],
            'slug': hit['_source']['slug'],
            'title': hit['_source']['title'],
            'text': hit['_source']['text'],
            'canvas': hit['_source']['canvas'],
            'highlight': hit.get('highlight', {}).get('text', [])
        } for hit in results['hits']['hits']]
    })

@app.route('/api/manuscripts', methods=['GET'])
def manuscripts():
    # Get list of manuscripts with doc counts
    agg = es.search(index='transcriptions', body={
        "size": 0,
        "aggs": {
            "manuscripts": {
                "terms": {"field": "slug", "size": 500},
                "aggs": {
                    "title": {"terms": {"field": "title.keyword", "size": 1}}
                }
            }
        }
    })
    
    results = []
    for bucket in agg['aggregations']['manuscripts']['buckets']:
        results.append({
            'slug': bucket['key'],
            'title': bucket['title']['buckets'][0]['key'] if bucket['title']['buckets'] else bucket['key'],
            'doc_count': bucket['doc_count']
        })
    
    return jsonify({'manuscripts': results})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

#### 1.3 Index Your Data

**File: `api/indexer.py`**
```python
from elasticsearch import Elasticsearch, helpers
import json

es = Elasticsearch(['http://localhost:9200'])

# Create index with proper mappings
index_settings = {
    "mappings": {
        "properties": {
            "slug": {"type": "keyword"},
            "title": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
            "text": {"type": "text", "analyzer": "standard"},
            "text_norm": {"type": "text", "analyzer": "standard"},
            "canvas": {"type": "keyword"},
            "line_id": {"type": "keyword"},
            "page_idx": {"type": "integer"},
            "line_idx": {"type": "integer"}
        }
    },
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    }
}

# Create index
if es.indices.exists(index='transcriptions'):
    es.indices.delete(index='transcriptions')
es.indices.create(index='transcriptions', body=index_settings)

# Load and index data
print("Loading transcriptions.json...")
with open('../assets/search/transcriptions.json', 'r') as f:
    corpus = json.load(f)

print(f"Indexing {len(corpus['docs'])} documents...")

def generate_docs():
    for doc in corpus['docs']:
        yield {
            "_index": "transcriptions",
            "_id": doc['id'],
            "_source": doc
        }

helpers.bulk(es, generate_docs(), chunk_size=1000)
print("✓ Indexing complete!")
```

Run indexer:
```bash
cd api
python indexer.py
```

#### 1.4 Update Frontend

**File: `pages/search-transcriptions.md`** (simplified)
```javascript
async function run() {
    const q = $q.value.trim();
    const ms = $ms.value || '';
    const mode = $ed.value === '0' ? 'exact' : 'fuzzy';
    
    if (!q) return;
    
    $status.textContent = 'Searching...';
    
    try {
        const response = await fetch(
            `http://localhost:5000/api/search?q=${encodeURIComponent(q)}&ms=${ms}&mode=${mode}`
        );
        const data = await response.json();
        
        renderResults(data.hits, data.total);
        $status.textContent = `Found ${data.total.toLocaleString()} results`;
    } catch (err) {
        console.error('Search failed:', err);
        $status.textContent = 'Search failed';
    }
}
```

**Test locally**: Navigate to `http://localhost:4000/search-transcriptions/` and search should be instant!

---

### Phase 2: Production Deployment (Week 2)

#### Option A: Managed Elasticsearch (Easiest, ~$50-200/month)

##### Elastic Cloud (Official, Recommended)
- **Cost**: $45/month for 4GB RAM (sufficient for 200k docs)
- **Scaling**: Automatically scales up to millions of docs
- **Setup Time**: 15 minutes
- **Pros**: 
  - Official support
  - Automatic backups
  - Built-in monitoring
  - SSL/security included
- **Cons**: Most expensive option

**Steps:**
1. Sign up at https://cloud.elastic.co/
2. Create deployment (select 4GB RAM, 1 zone)
3. Get cloud ID and API key
4. Update `ELASTICSEARCH_HOST` in Flask app
5. Deploy Flask app (see Option B below)

##### Bonsai (Budget-Friendly)
- **Cost**: $10/month starter, $50/month for production
- **Scaling**: Up to 125GB storage on $50/month plan
- **Setup Time**: 10 minutes
- **Pros**: 
  - Cheaper than Elastic Cloud
  - Heroku/Render integration
  - Good for small-medium projects
- **Cons**: Less features than Elastic Cloud

**Steps:**
1. Sign up at https://bonsai.io/
2. Create cluster (Elasticsearch 8.x)
3. Get connection URL
4. Same deployment as Elastic Cloud

##### SearchBox (Alternative)
- **Cost**: $29/month starter
- **Similar to Bonsai**

#### Option B: Flask API Hosting

##### Railway (Recommended, Simple)
- **Cost**: $5/month for Flask API
- **Total with Bonsai**: ~$55/month
- **Setup Time**: 20 minutes

**Steps:**
1. Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn app:app",
    "healthcheckPath": "/health"
  }
}
```

2. Add `requirements.txt`:
```
flask==3.0.0
elasticsearch==8.11.0
gunicorn==21.2.0
flask-cors==4.0.0
```

3. Push to GitHub, connect Railway
4. Set environment variables:
   - `ELASTICSEARCH_HOST=https://...bonsai.io`
   - `FLASK_ENV=production`

5. Deploy! Get URL like `https://unknownhands-api.railway.app`

##### Render (Alternative)
- **Cost**: $7/month
- **Similar setup to Railway**

##### Vercel (Serverless, Good for Low Traffic)
- **Cost**: $0 for hobby tier (sufficient for your use case)
- **Pros**: Free!
- **Cons**: 
  - Cold starts (first request slower)
  - 10-second timeout
  - Need to structure as API routes

**Best for**: If you want minimal cost and can tolerate 1-2 second cold start

##### Heroku
- **Cost**: $7/month
- **Pros**: Simple, reliable
- **Cons**: More expensive than Railway/Render

#### Option C: Self-Hosted (Cheapest, Most Work)

##### DigitalOcean Droplet
- **Cost**: $12/month (2GB RAM droplet)
- **Can run both Elasticsearch + Flask on same server**
- **Setup Time**: 2-3 hours

**Steps:**
1. Create Ubuntu 22.04 droplet
2. Install Elasticsearch:
```bash
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list
sudo apt update && sudo apt install elasticsearch
sudo systemctl start elasticsearch
```

3. Install Flask with Nginx + Gunicorn
4. Setup SSL with Let's Encrypt (free)
5. Configure firewall

**Pros**: Cheapest option for production
**Cons**: You manage everything (updates, security, backups)

---

## Cost Summary

### Budget Option (~$10-15/month)
- Vercel (Serverless Flask API): **$0**
- Bonsai Elasticsearch: **$10/month**
- **Total: $10/month**

**Best for**: Small projects, low traffic

### Recommended Option (~$55/month)
- Railway (Flask API): **$5/month**
- Bonsai Elasticsearch: **$50/month**
- **Total: $55/month**

**Best for**: Production-ready, reliable, low maintenance

### Premium Option (~$95/month)
- Railway (Flask API): **$5/month**
- Elastic Cloud (4GB): **$90/month**
- **Total: $95/month**

**Best for**: Maximum performance, official support, scaling to millions of docs

### DIY Option (~$12/month)
- DigitalOcean Droplet (2GB): **$12/month**
- **Total: $12/month**

**Best for**: Technical users comfortable with server administration

---

## Migration Strategy

### Phase 1: Parallel Systems (Week 1-2)
- Keep existing Lunr.js search working
- Deploy Elasticsearch backend
- Add feature flag: "Try new fast search (beta)"
- Gather user feedback

### Phase 2: Switch Default (Week 3)
- Make Elasticsearch default
- Keep Lunr.js as fallback
- Monitor performance and errors

### Phase 3: Full Migration (Week 4)
- Remove Lunr.js code
- Remove 31MB JSON file
- Keep only API calls

---

## Performance Expectations

### Current (Lunr.js)
- Initial load: 10-30 seconds
- Search time: 1-3 seconds
- Works offline: Yes
- Scales to: ~500k docs

### With Elasticsearch
- Initial load: < 1 second
- Search time: 50-200ms (instant!)
- Works offline: No
- Scales to: Millions of docs

---

## Maintenance

### Monthly Tasks (15 minutes)
- Check Elasticsearch health
- Review slow queries
- Monitor disk usage

### Quarterly Tasks (1 hour)
- Update dependencies
- Review costs/optimize
- Backup configuration

### As Needed
- Add new manuscripts: Run indexer script (5 minutes)
- Update search API: Deploy to Railway (2 minutes)

---

## Risk Assessment

### Low Risk
- ✅ Static site stays unchanged (fallback always available)
- ✅ API is separate service (failure doesn't break site)
- ✅ Can revert to Lunr.js anytime

### Medium Risk
- ⚠️ Monthly costs (but predictable)
- ⚠️ Requires monitoring (but minimal)

### Mitigation
- Start with budget option ($10/month)
- Keep Lunr.js as fallback for 1 month
- Monitor usage before committing

---

## Recommended Path for You

Given your project is academic/research:

### Step 1: Try Vercel + Bonsai ($10/month)
1. Weekend project to set up
2. Test with real users for 1 month
3. If successful, upgrade to Railway + Bonsai

### Step 2: Evaluate After 1 Month
- Is search actually being used heavily?
- Are users happy with performance?
- Can you afford $55/month?

### Step 3: Scale Up If Needed
- If usage grows, move to Elastic Cloud
- If budget-constrained, move to DigitalOcean

---

## Alternative: Hybrid Approach

Keep current system but optimize:

1. **Pre-built indices**: Generate Lunr indices during Jekyll build
2. **Service Worker caching**: Cache corpus for offline use
3. **Web Workers**: Move indexing to background thread
4. **Compressed JSON**: Use gzip compression (31MB → ~8MB)

**Cost**: $0  
**Performance gain**: 30-50% faster  
**Effort**: 1-2 days  

This might be sufficient if Elasticsearch feels like overkill.

---

## Next Steps

**To proceed with Elasticsearch:**

1. ✅ I can create the Flask API code
2. ✅ I can create the indexer script
3. ✅ I can update the frontend
4. ✅ You test locally (1 hour)
5. ✅ Choose hosting option
6. ✅ Deploy (2-3 hours)

**To try hybrid approach first:**

1. ✅ I can implement Web Workers
2. ✅ I can add compression
3. ✅ You test and decide

**What would you like to do?**
