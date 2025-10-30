import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

type Props = {
  onFitView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export default function Controls({ onFitView, onZoomIn, onZoomOut }: Props) {
  const baseButtonStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 8,
    width: 38,
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background 0.3s ease',
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        background: 'rgba(30, 30, 30, 0.35)',
        padding: '8px 12px',
        borderRadius: 12,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* 🔍 Zoom In */}
      <button
        onClick={onZoomIn}
        style={{
          ...baseButtonStyle,
          background: 'linear-gradient(135deg, #6b5cff, #2b7cff)',
          color: '#fff',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = 'scale(1.1)')
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.transform = 'scale(1)')
        }
      >
        <ZoomIn size={18} />
      </button>

      {/* 🔎 Zoom Out */}
      <button
        onClick={onZoomOut}
        style={{
          ...baseButtonStyle,
          background: 'linear-gradient(135deg, #f39c12, #f1c40f)',
          color: '#111',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = 'scale(1.1)')
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.transform = 'scale(1)')
        }
      >
        <ZoomOut size={18} />
      </button>

      {/* 🖼 Fit View */}
      <button
        onClick={onFitView}
        style={{
          ...baseButtonStyle,
          background: 'linear-gradient(135deg, #2ecc71, #1abc9c)',
          color: '#fff',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = 'scale(1.1)')
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.transform = 'scale(1)')
        }
      >
        <Maximize2 size={18} />
      </button>
    </div>
  );
}
