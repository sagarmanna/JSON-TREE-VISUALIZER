import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls as RFControls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { jsonToFlow } from '../utils/convert';
import * as htmlToImage from 'html-to-image';

type Props = {
  json: any | null;
  clearSignal: number;
};

export default function TreeVisualizer({ json, clearSignal }: Props) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [rfInstance, setRfInstance] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const flowRef = useRef<HTMLDivElement>(null);

  // ✅ Build tree when JSON updates
  useEffect(() => {
    if (!json) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const { nodes: n, edges: e } = jsonToFlow(json);
    const rfNodes = n.map((item) => ({
      id: item.id,
      position: item.position,
      data: {
        label: item.data.label,
        path: item.data.path,
        value: item.data.value,
        type: item.data.type,
      },
      style: {
        padding: 8,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        background:
          item.data.type === 'object'
            ? '#6b5cff'
            : item.data.type === 'array'
            ? '#2ecc71'
            : '#f39c12',
        color: item.data.type === 'primitive' ? '#111' : '#fff',
        fontSize: 12,
        fontWeight: 500,
        border: '1px solid rgba(255,255,255,0.15)',
      },
    }));

    const rfEdges = e.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { stroke: '#888', strokeWidth: 1.5 },
    }));

    setNodes(rfNodes);
    setEdges(rfEdges);
    setMessage(null);
  }, [json]);

  // ✅ Clear visualization on reset
  useEffect(() => {
    if (clearSignal) {
      setNodes([]);
      setEdges([]);
    }
  }, [clearSignal]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // 📸 Download as image (hide watermark)
  const handleDownload = async () => {
    const flowWrapper = document.querySelector('.react-flow') as HTMLElement;
    const attribution = document.querySelector('.react-flow__attribution') as HTMLElement;

    if (!flowWrapper) return;
    if (attribution) attribution.style.display = 'none';

    try {
      const dataUrl = await htmlToImage.toPng(flowWrapper, {
        backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
      });
      const link = document.createElement('a');
      link.download = 'json-tree.png';
      link.href = dataUrl;
      link.click();
    } finally {
      if (attribution) attribution.style.display = '';
    }
  };

  // 🌓 Toggle Dark/Light mode
  const toggleMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.body.classList.toggle('light', !newMode);
      return newMode;
    });
  };

  // 📋 Copy node path
  const handleNodeClick = (event: any, node: any) => {
    const path = node.data.path;
    navigator.clipboard.writeText(path);
    setMessage(`📋 Copied path: ${path}`);
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: darkMode ? '#181818' : '#fdfdfd',
        color: darkMode ? '#fff' : '#111',
        borderRadius: 10,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: darkMode
          ? '0 2px 10px rgba(0,0,0,0.4)'
          : '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* 🔍 Top Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            placeholder="🔍 Search by JSON path"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #ccc',
              width: 240,
              outline: 'none',
              fontSize: 14,
              transition: 'all 0.2s ease',
            }}
          />
          <button
            style={{
              background: '#6b5cff',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 14px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            Search
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={toggleMode}
            style={{
              background: darkMode ? '#333' : '#eaeaea',
              color: darkMode ? '#fff' : '#111',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={handleDownload}
            style={{
              background: '#2ecc71',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 14px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'background 0.2s ease',
            }}
          >
            📸 Download Tree
          </button>
        </div>
      </div>

      {/* 🌳 Visualization */}
      <div
        ref={flowRef}
        style={{
          flex: 1,
          background: darkMode ? '#222' : '#f7f9fc',
          borderRadius: 8,
          border: darkMode ? '1px solid #333' : '1px solid #ddd',
          overflow: 'hidden',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          onNodeClick={handleNodeClick}
          fitView
        >
          <Background />
          <MiniMap />
          <RFControls />
        </ReactFlow>
      </div>

      {/* 💬 Copy Message */}
      {message && (
        <div
          style={{
            marginTop: 10,
            padding: '6px 10px',
            background: darkMode ? '#333' : '#eef',
            color: darkMode ? '#fff' : '#333',
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
