# pip install scikit-learn pandas numpy plotly
import os, re, unicodedata, json
import pandas as pd
import numpy as np
from pathlib import Path
from typing import List, Optional, Tuple

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.decomposition import TruncatedSVD   # use SVD on sparse
from scipy.sparse import csr_matrix, vstack      # <-- you were missing csr_matrix
import plotly.express as px
import matplotlib.pyplot as plt

##############################################################################
# 1) CONFIG
##############################################################################
BASE = Path("Wessobrunn_22016_23411_22044")

MS_TO_SCRIBE = {
    "Clm22016": "Diemut",
    "Clm23411": "NunScribe2",
    "Clm22044": "Target"
}

RESTRICT_FOLIOS_22044 = True
FOLIO_MIN, FOLIO_MAX = 16, 87
CHUNK_CHARS = 2000
MIN_TAIL = 0.6

NGRAM_N = 4
MIN_DF = 2
MAX_DF = 0.90
LOWERCASE = False
STRIP_ACCENTS = None

SPECIAL_CHARS = set(
    "\u0304\u0301\uA751\uA76B\uA75D\u204A\u0308\uA753\uA76F\u2E2E\u033E"
    "\uA770\uA759\u0315\uA77A\uA75B\u017F\u0303;\u0307\u0366\u0032\u211F"
    "\u0365\u0368\u036B\u1506\u036D\u036C\u00B7\u0364"
)

##############################################################################
# 2) HELPERS
##############################################################################
import re
folio_pat = re.compile(r"(\d{1,3})([rv])", re.IGNORECASE)

def normalize_nfc(text: str) -> str:
    return unicodedata.normalize("NFC", text)

def sort_key_by_folio(fname: str) -> Tuple[int, int, str]:
    m = folio_pat.search(fname)
    if not m:
        return (10**9, 9, fname)
    num = int(m.group(1))
    side = m.group(2).lower()
    side_ord = 0 if side == 'r' else 1
    return (num, side_ord, fname)

def iter_pages(folder: Path, restrict_folios: Optional[Tuple[int,int]]=None):
    files = sorted(folder.glob("*.txt"), key=lambda p: sort_key_by_folio(p.name))
    for p in files:
        txt = normalize_nfc(p.read_text(encoding="utf-8", errors="replace"))
        m = folio_pat.search(p.stem)
        fnum = int(m.group(1)) if m else None
        fside = m.group(2).lower() if (m and m.group(2)) else None
        if restrict_folios and fnum is not None:
            lo, hi = restrict_folios
            if not (lo <= fnum <= hi):
                continue
        yield (p.stem, txt, fnum, fside)

def chunk_text(txt: str, chunk_chars=CHUNK_CHARS, min_tail_ratio=MIN_TAIL):
    L = len(txt)
    if L == 0: return []
    if L <= chunk_chars: return [txt]
    out = []
    for i in range(0, L, chunk_chars):
        ch = txt[i:i+chunk_chars]
        if i+chunk_chars < L or len(ch) >= int(min_tail_ratio*chunk_chars):
            out.append(ch)
    return out

def build_dataframe(base: Path) -> pd.DataFrame:
    rows = []
    for ms, scribe in MS_TO_SCRIBE.items():
        folder = base / ms
        if not folder.is_dir():
            print(f"[WARN] Missing folder: {folder}")
            continue
        restrict = (FOLIO_MIN, FOLIO_MAX) if (ms=="Clm22044" and RESTRICT_FOLIOS_22044) else None
        for page_id, txt, fnum, fside in iter_pages(folder, restrict):
            for j, ch in enumerate(chunk_text(txt)):
                rows.append(dict(
                    manuscript_id=ms, scribe=scribe, page_id=page_id,
                    folio_num=fnum, folio_side=fside, chunk_idx=j, text=ch
                ))
    return pd.DataFrame(rows)

from sklearn.metrics import classification_report
def fit_tfidf_char_ngrams(texts, n=4, min_df=2, max_df=0.9, lowercase=False, strip_accents=None):
    vec = TfidfVectorizer(analyzer="char",
                          ngram_range=(n, n),
                          min_df=min_df, max_df=max_df,
                          lowercase=lowercase,
                          strip_accents=strip_accents,
                          norm="l2")
    X = vec.fit_transform(texts)
    return vec, X

def mask_features_with_specials(vec):
    feats = vec.get_feature_names_out()
    return np.array([any(ch in SPECIAL_CHARS for ch in f) for f in feats])

def shrink_matrix_to_mask(X, mask):
    cols = np.where(mask)[0]
    if len(cols) == 0:
        raise ValueError("No features match the 'special glyph' mask.")
    return X[:, cols], cols

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import LabelEncoder

def train_and_eval(X, y_labels):
    le = LabelEncoder()
    y = le.fit_transform(y_labels)
    clf = LogisticRegression(max_iter=5000)  # no deprecation warning
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(clf, X, y, cv=cv)
    print(f"[CV] 5-fold accuracy: {scores.mean():.3f} ± {scores.std():.3f}")
    clf.fit(X, y)
    return clf, le

def top_features_per_class(vec, clf, le, top_k=25, cols_subset=None):
    """
    Prints top +weighted n-grams per class.
    Binary case: clf.coef_ is shape (1, n_features).
      - weights for le.classes_[1] (positive class) = +coef
      - weights for le.classes_[0] (negative class) = -coef
    Multi-class: use clf.coef_[i] as usual.
    """
    full_feats = np.array(vec.get_feature_names_out())
    feats = full_feats if cols_subset is None else full_feats[cols_subset]

    classes = list(le.classes_)
    coefs = clf.coef_

    def weights_for_label(label):
        idx = np.where(le.classes_ == label)[0][0]
        if coefs.shape[0] == 1 and len(classes) == 2:
            # binary: single row is for the "positive" class (classes_[1])
            if idx == 1:
                return coefs[0]
            else:
                return -coefs[0]
        else:
            return coefs[idx]

    for label in classes:
        w = weights_for_label(label)
        order = np.argsort(w)[::-1][:top_k]
        print(f"\n=== Top {top_k} 4-grams for {label} ===")
        for i in order:
            print(f"{feats[i]}\t{w[i]:.3f}")

##############################################################################
# 3) MAIN: build corpus, TF-IDF, classify
##############################################################################
Path("outputs").mkdir(exist_ok=True)
df = build_dataframe(BASE)
assert not df.empty, "No pages found. Check your paths."

train_df = df[df["scribe"].isin(["Diemut", "NunScribe2"])].copy()
test_df  = df[df["manuscript_id"]=="Clm22044"].copy()

print(f"Train chunks: {len(train_df)}  |  Test chunks (Clm22044): {len(test_df)}")

all_texts = pd.concat([train_df["text"], test_df["text"]], axis=0).tolist()
vec, X_all = fit_tfidf_char_ngrams(
    all_texts, n=NGRAM_N, min_df=MIN_DF, max_df=MAX_DF,
    lowercase=LOWERCASE, strip_accents=STRIP_ACCENTS
)
X_train = X_all[:len(train_df)]
X_test  = X_all[len(train_df):]

clf, le = train_and_eval(X_train, train_df["scribe"].values)

# --- Probabilities per chunk & page ---
proba = clf.predict_proba(X_test)
prob_df = pd.DataFrame(proba, columns=[f"prob_{c}" for c in le.classes_])
test_out = test_df.reset_index(drop=True).join(prob_df)

page_probs = (
    test_out
    .groupby(["page_id","folio_num","folio_side"], dropna=False)[[f"prob_{c}" for c in le.classes_]]
    .mean()
    .reset_index()
    .sort_values(["folio_num", "folio_side"], na_position="last",
                 key=lambda s: s.map({'r':0,'v':1}).fillna(9) if s.name=="folio_side" else s)
)
global_probs = {c: page_probs[f"prob_{c}"].mean() for c in le.classes_}

test_out.to_csv("outputs/clm22044_chunk_probs.csv", index=False)
page_probs.to_csv("outputs/clm22044_page_probs.csv", index=False)
with open("outputs/clm22044_global_probs.json","w",encoding="utf-8") as f:
    json.dump(global_probs, f, ensure_ascii=False, indent=2)

print("\n### Top features (all 4-grams) ###")
top_features_per_class(vec, clf, le, top_k=25)

##############################################################################
# 4) OPTIONAL: Special-glyphs-only run
##############################################################################
try:
    mask = mask_features_with_specials(vec)
    X_train_special, cols_special = shrink_matrix_to_mask(X_train, mask)
    X_test_special  = X_test[:, cols_special]
    clf_s, le_s = train_and_eval(X_train_special, train_df["scribe"].values)
    # ... (omit printing to keep this short)
except ValueError as e:
    print(f"[INFO] Skipped special-only run: {e}")

##############################################################################
# 5) 3D VIS — one point per PAGE (average of its chunks), SVD on sparse
##############################################################################
meta_all = pd.concat([train_df, test_df], axis=0).reset_index(drop=True)
# group indices by page_id within manuscript
page_groups = meta_all.groupby(["manuscript_id", "page_id"], sort=False).indices

page_rows = []
page_meta = []
for (ms, pid), idx in page_groups.items():
    sub = X_all[idx, :]                 # sparse sub-matrix
    mean_row = sub.mean(axis=0)         # 1 x n_features
    page_rows.append(csr_matrix(mean_row))
    r0 = meta_all.iloc[idx[0]]
    page_meta.append({
        "manuscript_id": ms,
        "page_id": pid,
        "scribe": r0["scribe"],
        "folio_num": r0["folio_num"],
        "folio_side": r0["folio_side"],
    })

X_page = vstack(page_rows)
page_meta = pd.DataFrame(page_meta)

svd = TruncatedSVD(n_components=3, random_state=42)
X3 = svd.fit_transform(X_page)
page_meta["PC1"], page_meta["PC2"], page_meta["PC3"] = X3[:,0], X3[:,1], X3[:,2]
print(f"SVD variance explained (3 comps): {svd.explained_variance_ratio_.sum():.3f}")

fig = px.scatter_3d(
    page_meta, x="PC1", y="PC2", z="PC3",
    color="scribe", symbol="manuscript_id",
    hover_name="page_id", hover_data=["folio_num", "folio_side"],
    title="3D SVD of TF-IDF (char 4-grams) — one point per page",
    opacity=0.85
)
fig.update_traces(marker=dict(size=6, line=dict(width=0.3)))
fig.update_layout(template="plotly_white")
fig.write_html("outputs/pca_3d_pages_char4.html", include_plotlyjs="cdn")

##############################################################################
# 6) OPTIONAL: 3D VIS — one point per CHUNK (also SVD on sparse)
##############################################################################
svd_chunks = TruncatedSVD(n_components=3, random_state=42)
X3_chunks = svd_chunks.fit_transform(X_all)
meta_chunks = meta_all.copy()
meta_chunks["PC1"], meta_chunks["PC2"], meta_chunks["PC3"] = X3_chunks[:,0], X3_chunks[:,1], X3_chunks[:,2]
fig2 = px.scatter_3d(
    meta_chunks, x="PC1", y="PC2", z="PC3",
    color="scribe", symbol="manuscript_id",
    hover_name="page_id", hover_data=["folio_num", "folio_side", "chunk_idx"],
    title="3D SVD of TF-IDF (char 4-grams) — one point per chunk",
    opacity=0.75
)
fig2.update_traces(marker=dict(size=4, line=dict(width=0.2)))
fig2.update_layout(template="plotly_white")
fig2.write_html("outputs/pca_3d_chunks_char4.html", include_plotlyjs="cdn")