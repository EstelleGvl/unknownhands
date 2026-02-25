// Auto-generated vocabulary from Heurist database
// Maps term IDs to human-readable labels

const VOCABULARY = {
  // Load from generated vocabulary file
};

const FIELD_VOCAB = {
  // Field-specific vocabularies
};

// Load vocabulary data
fetch('{{ "/vocabulary.json" | relative_url }}')
  .then(r => r.json())
  .then(data => {
    Object.assign(VOCABULARY, data.vocabulary);
    Object.assign(FIELD_VOCAB, data.field_vocabularies);
  })
  .catch(err => console.warn('Could not load vocabulary:', err));

// Helper to get term label
function getTermLabel(termId, fieldName = null) {
  termId = String(termId);
  
  // Try field-specific vocab first
  if (fieldName && FIELD_VOCAB[fieldName] && FIELD_VOCAB[fieldName][termId]) {
    return FIELD_VOCAB[fieldName][termId];
  }
  
  // Fall back to global vocab
  return VOCABULARY[termId] || termId;
}

// Century helpers
const CENTURIES = {
  '9748': { number: 8, start: 701, end: 800 },
  '9749': { number: 9, start: 801, end: 900 },
  '9750': { number: 10, start: 901, end: 1000 },
  '9751': { number: 11, start: 1001, end: 1100 },
  '9752': { number: 12, start: 1101, end: 1200 },
  '9753': { number: 13, start: 1201, end: 1300 },
  '9754': { number: 14, start: 1301, end: 1400 },
  '9755': { number: 15, start: 1401, end: 1500 },
  '9756': { number: 16, start: 1501, end: 1600 },
  '25737': { number: 17, start: 1601, end: 1700 },
  '25372': { number: 18, start: 1701, end: 1800 }
};

function centuryToYearRange(centuryNumber) {
  const start = (centuryNumber - 1) * 100 + 1;
  const end = centuryNumber * 100;
  return [start, end];
}

function centuryTermToYearRange(termId) {
  const century = CENTURIES[String(termId)];
  return century ? [century.start, century.end] : null;
}
