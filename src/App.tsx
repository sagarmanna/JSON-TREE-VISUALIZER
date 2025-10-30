import React, { useState } from 'react';
import JsonInput from './components/JsonInput';
import TreeVisualizer from './components/TreeVisualizer';

export default function App() {
  const [json, setJson] = useState<any | null>(null);
  const [clearSignal, setClearSignal] = useState(0);

  function handleVisualize(parsed: any) {
    setJson(parsed);
  }

  function handleClear() {
    setJson(null);
    setClearSignal((s) => s + 1);
  }

  return (
    <div className="app">
      <div className="header">
        <h2>JSON Tree Visualizer</h2>
        
        
      </div>

      <div className="container">
        <div className="left">
          <JsonInput onVisualize={handleVisualize} onClear={handleClear} />
        </div>
        <div className="right">
          <TreeVisualizer json={json} clearSignal={clearSignal} />
        </div>
      </div>
    </div>
  );
}
