export type RFNode = {
  id: string;
  position: { x: number; y: number };
  data: { label: string; path: string; value?: any; type: string };
  style?: any;
}

export type RFEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

let nodeCounter = 0;

function makeId(prefix = 'n') {
  nodeCounter += 1;
  return `${prefix}_${nodeCounter}`;
}

export function jsonToFlow(json: any) {
  nodeCounter = 0;
  const nodes: RFNode[] = [];
  const edges: RFEdge[] = [];

  function traverse(value: any, path: string, depth: number, indexWithinParent: number, siblingIndex: number) {
    const id = makeId();
    const type = Array.isArray(value) ? 'array' : (value !== null && typeof value === 'object' ? 'object' : 'primitive');
    const label = (() => {
      if (type === 'object') return path.split('/').pop() || 'root';
      if (type === 'array') return path.split('/').pop() || 'array';
      return `${path.split('/').pop()}: ${String(value)}`;
    })();
    const x = siblingIndex * 220;
    const y = depth * 120;
    nodes.push({ id, position: { x, y }, data: { label, path, value, type }, style: {} });
    if (path !== '$') {
      const parentPath = path.substring(0, path.lastIndexOf('/')) || '$';
      const parentNode = nodes.find(n => n.data.path === parentPath);
      if (parentNode) edges.push({ id: `e_${parentNode.id}_${id}`, source: parentNode.id, target: id });
    }
    if (type === 'object') Object.keys(value).forEach((k, i) => traverse(value[k], `${path}/${k}`, depth+1, i, i));
    else if (type === 'array') value.forEach((item: any, i: number) => traverse(item, `${path}/[${i}]`, depth+1, i, i));
  }

  traverse(json, '$', 0, 0, 0);
  return { nodes, edges };
}
