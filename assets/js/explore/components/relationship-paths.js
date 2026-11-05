/* Explicit, directed catalogue paths. Each query node binds one record. */
(function(root) {
  function create(data, typeMap) {
    const records = new Map(), adjacency = new Map(), schema = new Map();
    const key = (type, id) => `${type}:${id}`;
    Object.entries(data).forEach(([type, list]) => list.forEach(rec => records.set(key(type, rec.rec_ID), rec)));
    function edge(fromType, fromId, toType, toId, kind, label, direction) {
      if (!records.has(key(toType, toId))) return;
      const spec = {entity:toType, kind, label, direction};
      const token = JSON.stringify(spec);
      if (!schema.has(fromType)) schema.set(fromType, new Map());
      schema.get(fromType).set(token, spec);
      const from = key(fromType, fromId);
      if (!adjacency.has(from)) adjacency.set(from, []);
      adjacency.get(from).push({token, rec:records.get(key(toType, toId))});
    }
    Object.entries(data).forEach(([type, list]) => list.forEach(rec => {
      (rec.details || []).forEach(detail => {
        const pointer = detail.value;
        const targetType = typeMap[String(pointer?.type)];
        if (!pointer?.id || !targetType) return;
        edge(type, rec.rec_ID, targetType, pointer.id, 'pointer', detail.fieldName, 'out');
        edge(targetType, pointer.id, type, rec.rec_ID, 'pointer', detail.fieldName, 'in');
      });
    }));
    (data.rel || []).forEach(rel => {
      const source = rel.details?.find(d => d.fieldName === 'Source record')?.value;
      const target = rel.details?.find(d => d.fieldName === 'Target record')?.value;
      const relationship = rel.details?.find(d => d.fieldName === 'Relationship type');
      const label = relationship?.termLabel || String(relationship?.value || 'Unspecified relationship');
      const srcType = typeMap[String(source?.type)], tgtType = typeMap[String(target?.type)];
      if (!srcType || !tgtType) return;
      edge(srcType, source.id, tgtType, target.id, 'relationship', label, 'out');
      edge(tgtType, target.id, srcType, source.id, 'relationship', label, 'in');
    });
    function matches(type, rec, query, conditionMatches) {
      // Iterative postorder evaluation avoids a fixed path-depth limit and
      // keeps every child and condition scoped to the same candidate record.
      const stack = [{type, rec, query, expanded:false}];
      const results = new Map();
      const resultKey = frame => `${key(frame.type, frame.rec.rec_ID)}:${frame.query.id}`;
      while (stack.length) {
        const frame = stack.pop();
        const id = resultKey(frame);
        if (results.has(id)) continue;
        if (!frame.expanded) {
          const conditions = frame.query.conditions || [];
          const checks = conditions.map(c => conditionMatches(frame.rec, c));
          const own = !checks.length || (frame.query.mode === 'any' ? checks.some(Boolean) : checks.every(Boolean));
          if (!own) { results.set(id, false); continue; }
          const groups = (frame.query.children || []).map(child =>
            (adjacency.get(key(frame.type, frame.rec.rec_ID)) || [])
              .filter(link => link.token === child.edge)
              .map(link => ({type:child.entity, rec:link.rec, query:child, expanded:false})));
          stack.push({...frame, expanded:true, groups});
          groups.forEach(group => group.forEach(candidate => stack.push(candidate)));
        } else {
          results.set(id, frame.groups.every(group => group.some(candidate => results.get(resultKey(candidate)))));
        }
      }
      return results.get(`${key(type, rec.rec_ID)}:${query.id}`) || false;
    }
    return {options:type => [...(schema.get(type) || new Map()).entries()], matches};
  }
  root.ExplorePaths = {create};
})(typeof window === 'undefined' ? globalThis : window);
