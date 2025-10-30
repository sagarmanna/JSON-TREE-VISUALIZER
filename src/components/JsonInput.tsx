import React, { useState } from 'react';

type Props = {
  onVisualize: (json: any) => void;
  onClear: () => void;
};

const sample = {
  user: {
    name: "Alice",
    address: { city: "Mumbai", pin: 400001 },
    tags: ["frontend", "react"]
  },
  items: [
    { id: 1, name: "Item A" },
    { id: 2, name: "Item B" }
  ]
};

export default function JsonInput({ onVisualize, onClear }: Props) {
  const [text, setText] = useState(JSON.stringify(sample, null, 2));
  const [error, setError] = useState<string | null>(null);

  function handleVisualize() {
    try {
      const parsed = JSON.parse(text);
      setError(null);
      onVisualize(parsed);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
    }
  }

  function handleClear() {
    setText("");
    setError(null);
    onClear();
  }

  function handleSample() {
    setText(JSON.stringify(sample, null, 2));
    setError(null);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>
        🧩 JSON Input
      </h3>

      <textarea
        className="json-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your JSON here..."
        style={{
          width: "100%",
          height: "280px",
          resize: "vertical",
          borderRadius: "8px",
          border: `1px solid ${error ? "#e74c3c" : "#ccc"}`,
          padding: "10px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "14px",
          background: "#fdfdfd",
          color: "#333",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      />

      {error && (
        <div
          style={{
            color: "#e74c3c",
            background: "#ffe6e6",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div
        className="controls"
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "8px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleVisualize}
          style={{
            background: "#6b5cff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
        >
          Visualize
        </button>
        <button
          onClick={handleClear}
          style={{
            background: "#f0f0f0",
            color: "#333",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
        <button
          onClick={handleSample}
          style={{
            background: "#2ecc71",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Load Sample
        </button>
      </div>
    </div>
  );
}
