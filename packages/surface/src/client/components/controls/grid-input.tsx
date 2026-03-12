import { useState, useCallback, useRef, useEffect } from "react";
import { Tooltip } from "../tooltip.js";
import {
  LayoutIcon,
  GridIcon,
  BoxIcon,
  EyeNoneIcon,
  ColumnsIcon,
  RowsIcon,
} from "@radix-ui/react-icons";
import { Plus, Minus, Grid3x3 } from "lucide-react";
import { SegmentedIcons } from "./segmented-icons.js";
import { ScrubInput } from "./scrub-input.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GridConfig {
  columns: string[]; // e.g. ["1fr", "1fr", "1fr"]
  rows: string[]; // e.g. ["1fr", "1fr"]
  gap: string; // e.g. "8px"
}

export interface GridChildPlacement {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
}

interface GridInputProps {
  /** Current grid config from authored styles */
  config?: Partial<GridConfig>;
  /** Child placements to visualize */
  children?: Array<{ label: string; placement: GridChildPlacement }>;
  /** Selected child index */
  selectedChild?: number;
  /** Called when column/row count or sizing changes */
  onConfigChange: (config: GridConfig) => void;
  /** Called when a child placement changes */
  onChildPlacementChange?: (index: number, placement: GridChildPlacement) => void;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_CONFIG: GridConfig = {
  columns: ["1fr", "1fr", "1fr"],
  rows: ["1fr", "1fr"],
  gap: "8px",
};

function resolveConfig(partial?: Partial<GridConfig>): GridConfig {
  return {
    columns: partial?.columns?.length ? partial.columns : DEFAULT_CONFIG.columns,
    rows: partial?.rows?.length ? partial.rows : DEFAULT_CONFIG.rows,
    gap: partial?.gap || DEFAULT_CONFIG.gap,
  };
}

// ---------------------------------------------------------------------------
// Track size label (inline editable)
// ---------------------------------------------------------------------------

function TrackSizeCell({
  value,
  onChange,
  orientation,
}: {
  value: string;
  onChange: (v: string) => void;
  orientation: "col" | "row";
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="studio-grid-track-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft.trim() && draft.trim() !== value) onChange(draft.trim());
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(false);
            if (draft.trim() && draft.trim() !== value) onChange(draft.trim());
          }
          if (e.key === "Escape") {
            setEditing(false);
            setDraft(value);
          }
        }}
      />
    );
  }

  return (
    <Tooltip content={`${orientation === "col" ? "Column" : "Row"} size — click to edit`} side="top">
      <button
        className="studio-grid-track-label"
        onClick={() => setEditing(true)}
      >
        {value}
      </button>
    </Tooltip>
  );
}

// ---------------------------------------------------------------------------
// Dot grid visual (Figma-style)
// ---------------------------------------------------------------------------

function DotGrid({
  config,
  children,
  selectedChild,
  drawState,
  onDrawStart,
  onDrawMove,
  onDrawEnd,
}: {
  config: GridConfig;
  children?: Array<{ label: string; placement: GridChildPlacement }>;
  selectedChild?: number;
  drawState: { drawing: boolean; startRow: number; startCol: number; endRow: number; endCol: number } | null;
  onDrawStart: (row: number, col: number) => void;
  onDrawMove: (row: number, col: number) => void;
  onDrawEnd: () => void;
}) {
  const numCols = config.columns.length;
  const numRows = config.rows.length;

  // Build occupancy map
  const occupancy = new Map<string, { index: number; label: string }>();
  children?.forEach((child, i) => {
    for (let r = child.placement.rowStart; r < child.placement.rowEnd; r++) {
      for (let c = child.placement.colStart; c < child.placement.colEnd; c++) {
        occupancy.set(`${r}-${c}`, { index: i, label: child.label });
      }
    }
  });

  // Draw selection bounds
  const drawMin = drawState
    ? { row: Math.min(drawState.startRow, drawState.endRow), col: Math.min(drawState.startCol, drawState.endCol) }
    : null;
  const drawMax = drawState
    ? { row: Math.max(drawState.startRow, drawState.endRow), col: Math.max(drawState.startCol, drawState.endCol) }
    : null;

  function isInDrawRegion(row: number, col: number) {
    if (!drawMin || !drawMax) return false;
    return row >= drawMin.row && row <= drawMax.row && col >= drawMin.col && col <= drawMax.col;
  }

  return (
    <div
      className="studio-grid-dots"
      style={{
        gridTemplateColumns: config.columns.join(" "),
        gridTemplateRows: config.rows.map(() => "1fr").join(" "),
      }}
      onPointerLeave={() => {
        if (drawState?.drawing) onDrawEnd();
      }}
    >
      {Array.from({ length: numRows }, (_, row) =>
        Array.from({ length: numCols }, (_, col) => {
          const key = `${row}-${col}`;
          const occ = occupancy.get(key);
          const inDraw = isInDrawRegion(row, col);
          const isSelected = occ && occ.index === selectedChild;

          const classes = [
            "studio-grid-dot-cell",
            occ ? "studio-grid-dot-cell--occupied" : "",
            isSelected ? "studio-grid-dot-cell--selected" : "",
            inDraw ? "studio-grid-dot-cell--drawing" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={key}
              className={classes}
              onPointerDown={(e) => {
                e.preventDefault();
                onDrawStart(row, col);
              }}
              onPointerEnter={() => {
                if (drawState?.drawing) onDrawMove(row, col);
              }}
              onPointerUp={() => {
                if (drawState?.drawing) onDrawEnd();
              }}
            >
              <div className="studio-grid-dot" />
              {occ && (
                <span className="studio-grid-dot-label">{occ.label}</span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main GridInput component
// ---------------------------------------------------------------------------

export function GridInput({
  config: configProp,
  children,
  selectedChild,
  onConfigChange,
  onChildPlacementChange,
}: GridInputProps) {
  const config = resolveConfig(configProp);
  const [drawState, setDrawState] = useState<{
    drawing: boolean;
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  } | null>(null);

  const numCols = config.columns.length;
  const numRows = config.rows.length;

  // --- Column/row add/remove ---
  const addColumn = useCallback(() => {
    onConfigChange({ ...config, columns: [...config.columns, "1fr"] });
  }, [config, onConfigChange]);

  const removeColumn = useCallback(() => {
    if (numCols <= 1) return;
    onConfigChange({ ...config, columns: config.columns.slice(0, -1) });
  }, [config, numCols, onConfigChange]);

  const addRow = useCallback(() => {
    onConfigChange({ ...config, rows: [...config.rows, "1fr"] });
  }, [config, onConfigChange]);

  const removeRow = useCallback(() => {
    if (numRows <= 1) return;
    onConfigChange({ ...config, rows: config.rows.slice(0, -1) });
  }, [config, numRows, onConfigChange]);

  // --- Track sizing ---
  const setColumnSize = useCallback(
    (index: number, value: string) => {
      const next = [...config.columns];
      next[index] = value;
      onConfigChange({ ...config, columns: next });
    },
    [config, onConfigChange]
  );

  const setRowSize = useCallback(
    (index: number, value: string) => {
      const next = [...config.rows];
      next[index] = value;
      onConfigChange({ ...config, rows: next });
    },
    [config, onConfigChange]
  );

  // --- Draw to place child ---
  const handleDrawStart = useCallback((row: number, col: number) => {
    setDrawState({ drawing: true, startRow: row, startCol: col, endRow: row, endCol: col });
  }, []);

  const handleDrawMove = useCallback((row: number, col: number) => {
    setDrawState((prev) => (prev ? { ...prev, endRow: row, endCol: col } : prev));
  }, []);

  const handleDrawEnd = useCallback(() => {
    if (!drawState) return;
    const placement: GridChildPlacement = {
      colStart: Math.min(drawState.startCol, drawState.endCol),
      colEnd: Math.max(drawState.startCol, drawState.endCol) + 1,
      rowStart: Math.min(drawState.startRow, drawState.endRow),
      rowEnd: Math.max(drawState.startRow, drawState.endRow) + 1,
    };
    if (selectedChild !== undefined && onChildPlacementChange) {
      onChildPlacementChange(selectedChild, placement);
    }
    setDrawState(null);
  }, [drawState, selectedChild, onChildPlacementChange]);

  return (
    <div className="studio-grid-input">
      {/* Main layout: dot grid + controls side by side */}
      <div className="studio-grid-layout">
        {/* Left: dot grid with track labels */}
        <div className="studio-grid-visual">
          {/* Column track labels */}
          <div className="studio-grid-col-tracks">
            {config.columns.map((size, i) => (
              <TrackSizeCell
                key={`col-${i}`}
                value={size}
                onChange={(v) => setColumnSize(i, v)}
                orientation="col"
              />
            ))}
          </div>
          <div className="studio-grid-visual-body">
            {/* Row track labels */}
            <div className="studio-grid-row-tracks">
              {config.rows.map((size, i) => (
                <TrackSizeCell
                  key={`row-${i}`}
                  value={size}
                  onChange={(v) => setRowSize(i, v)}
                  orientation="row"
                />
              ))}
            </div>
            {/* The dot grid */}
            <DotGrid
              config={config}
              children={children}
              selectedChild={selectedChild}
              drawState={drawState}
              onDrawStart={handleDrawStart}
              onDrawMove={handleDrawMove}
              onDrawEnd={handleDrawEnd}
            />
          </div>
        </div>

        {/* Right: compact controls */}
        <div className="studio-grid-sidebar">
          <div className="studio-grid-counter">
            <Tooltip content="Columns" side="left">
              <span className="studio-grid-counter-icon">
                <ColumnsIcon style={{ width: 12, height: 12 }} />
              </span>
            </Tooltip>
            <button className="studio-icon-btn studio-grid-btn" onClick={removeColumn} disabled={numCols <= 1}>
              <Minus size={10} />
            </button>
            <span className="studio-grid-count">{numCols}</span>
            <button className="studio-icon-btn studio-grid-btn" onClick={addColumn}>
              <Plus size={10} />
            </button>
          </div>
          <div className="studio-grid-counter">
            <Tooltip content="Rows" side="left">
              <span className="studio-grid-counter-icon">
                <RowsIcon style={{ width: 12, height: 12 }} />
              </span>
            </Tooltip>
            <button className="studio-icon-btn studio-grid-btn" onClick={removeRow} disabled={numRows <= 1}>
              <Minus size={10} />
            </button>
            <span className="studio-grid-count">{numRows}</span>
            <button className="studio-icon-btn studio-grid-btn" onClick={addRow}>
              <Plus size={10} />
            </button>
          </div>
          <div className="studio-grid-gap-row">
            <ScrubInput
              icon={Grid3x3}
              value={config.gap}
              tooltip="Gap"
              onCommit={(v) => onConfigChange({ ...config, gap: v })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo wrapper — shows Display segmented + grid input together
// ---------------------------------------------------------------------------

const DISPLAY_OPTIONS = [
  { value: "flex", icon: LayoutIcon, tooltip: "Flex" },
  { value: "grid", icon: GridIcon, tooltip: "Grid" },
  { value: "block", icon: BoxIcon, tooltip: "Block" },
  { value: "none", icon: EyeNoneIcon, tooltip: "None" },
];

export function GridInputDemo() {
  const [display, setDisplay] = useState<string>("grid");
  const [config, setConfig] = useState<GridConfig>({
    columns: ["1fr", "2fr", "1fr"],
    rows: ["auto", "1fr", "auto"],
    gap: "8px",
  });

  const [childPlacements, setChildPlacements] = useState<
    Array<{ label: string; placement: GridChildPlacement }>
  >([
    { label: "Head", placement: { colStart: 0, colEnd: 3, rowStart: 0, rowEnd: 1 } },
    { label: "Side", placement: { colStart: 0, colEnd: 1, rowStart: 1, rowEnd: 2 } },
    { label: "Main", placement: { colStart: 1, colEnd: 3, rowStart: 1, rowEnd: 2 } },
    { label: "Foot", placement: { colStart: 0, colEnd: 3, rowStart: 2, rowEnd: 3 } },
  ]);

  const [selectedChild] = useState<number | undefined>(undefined);

  const handlePlacementChange = (index: number, placement: GridChildPlacement) => {
    setChildPlacements((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], placement };
      return next;
    });
  };

  return (
    <div style={{ width: 256 }}>
      {/* Display property — icon segmented like the live UI */}
      <div className="studio-prop-row" style={{ marginBottom: 6 }}>
        <SegmentedIcons
          value={display}
          onChange={setDisplay}
          options={DISPLAY_OPTIONS}
        />
      </div>

      {/* Grid input — only visible when display is grid */}
      {display === "grid" && (
        <GridInput
          config={config}
          children={childPlacements}
          selectedChild={selectedChild}
          onConfigChange={setConfig}
          onChildPlacementChange={handlePlacementChange}
        />
      )}
    </div>
  );
}
