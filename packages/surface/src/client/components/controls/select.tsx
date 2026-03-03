import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Tooltip } from "../tooltip.js";

export interface SelectOption {
  value: string;
  label?: string;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface StudioSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  className?: string;
  /** Icon rendered in left gutter — wraps select in a bordered container */
  icon?: React.ComponentType<{ style?: React.CSSProperties }>;
  /** Tooltip shown on icon hover */
  tooltip?: string;
  /** data-testid forwarded to the trigger button */
  "data-testid"?: string;
}

const FILTER_THRESHOLD = 9;

export function StudioSelect({
  value,
  onChange,
  options,
  groups,
  placeholder,
  className,
  icon: Icon,
  tooltip,
  "data-testid": testId,
}: StudioSelectProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Count total items to decide whether to show filter
  const totalItems = useMemo(() => {
    let count = options?.length ?? 0;
    if (groups) for (const g of groups) count += g.options.length;
    return count;
  }, [options, groups]);

  const showFilter = totalItems > FILTER_THRESHOLD;

  // Build flat filtered list for keyboard navigation
  const filteredFlat = useMemo(() => {
    const lf = filter.toLowerCase();
    const result: SelectOption[] = [];
    if (options) {
      for (const opt of options) {
        if (!lf || (opt.label ?? opt.value).toLowerCase().includes(lf)) {
          result.push(opt);
        }
      }
    }
    if (groups) {
      for (const group of groups) {
        for (const opt of group.options) {
          if (!lf || (opt.label ?? opt.value).toLowerCase().includes(lf)) {
            result.push(opt);
          }
        }
      }
    }
    return result;
  }, [options, groups, filter]);

  // Reset state on open
  useEffect(() => {
    if (open) {
      setFilter("");
      setHighlightIdx(-1);
      // Focus the search input or list container when popover opens
      requestAnimationFrame(() => {
        if (showFilter) {
          inputRef.current?.focus();
        } else {
          listRef.current?.focus();
        }
      });
    }
  }, [open, showFilter]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIdx < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-combobox-item]");
    items[highlightIdx]?.scrollIntoView({ block: "nearest" });
  }, [highlightIdx]);

  const selectItem = useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev < filteredFlat.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev > 0 ? prev - 1 : filteredFlat.length - 1,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightIdx >= 0 && highlightIdx < filteredFlat.length) {
          selectItem(filteredFlat[highlightIdx].value);
        }
      }
    },
    [filteredFlat, highlightIdx, selectItem],
  );

  // Find display label for current value
  const displayLabel = useMemo(() => {
    if (options) {
      const found = options.find((o) => o.value === value);
      if (found) return found.label ?? found.value;
    }
    if (groups) {
      for (const g of groups) {
        const found = g.options.find((o) => o.value === value);
        if (found) return found.label ?? found.value;
      }
    }
    return value || placeholder || "";
  }, [value, options, groups, placeholder]);

  const lf = filter.toLowerCase();

  // Filtered groups — hide groups with zero matching items
  const filteredGroups = useMemo(() => {
    if (!groups) return undefined;
    return groups
      .map((g) => ({
        ...g,
        options: g.options.filter(
          (opt) => !lf || (opt.label ?? opt.value).toLowerCase().includes(lf),
        ),
      }))
      .filter((g) => g.options.length > 0);
  }, [groups, lf]);

  const filteredOptions = useMemo(() => {
    if (!options) return undefined;
    return options.filter(
      (opt) => !lf || (opt.label ?? opt.value).toLowerCase().includes(lf),
    );
  }, [options, lf]);

  // Track flat index for highlighting
  let flatIdx = 0;

  const renderItem = (opt: SelectOption) => {
    const idx = flatIdx++;
    const isSelected = opt.value === value;
    const isHighlighted = idx === highlightIdx;
    return (
      <button
        key={opt.value}
        data-combobox-item=""
        className={`studio-prop-select-item${isHighlighted ? " highlighted" : ""}${isSelected ? " selected" : ""}`}
        onMouseEnter={() => setHighlightIdx(idx)}
        onMouseDown={(e) => {
          e.preventDefault(); // keep focus on input
          selectItem(opt.value);
        }}
      >
        <span>{opt.label ?? opt.value}</span>
        {isSelected && (
          <span className="studio-prop-select-check">
            <CheckIcon style={{ width: 10, height: 10 }} />
          </span>
        )}
      </button>
    );
  };

  const trigger = (
    <Popover.Trigger asChild>
      <button
        className={Icon ? "studio-select" : (className || "studio-select")}
        data-testid={testId}
        data-state={open ? "open" : "closed"}
        type="button"
      >
        <span className="studio-prop-select-value">{displayLabel}</span>
        <ChevronDownIcon style={{ width: 10, height: 10, flexShrink: 0 }} />
      </button>
    </Popover.Trigger>
  );

  const content = (
    <Popover.Portal>
      <Popover.Content
        className="studio-combobox-content"
        sideOffset={4}
        collisionPadding={12}
        align="start"
        onOpenAutoFocus={(e) => {
          // We handle focus ourselves
          e.preventDefault();
        }}
      >
        {showFilter && (
          <div className="studio-combobox-search">
            <MagnifyingGlassIcon
              style={{ width: 12, height: 12, flexShrink: 0, color: "var(--studio-text-dimmed)" }}
            />
            <input
              ref={inputRef}
              className="studio-combobox-search-input"
              placeholder="Filter…"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setHighlightIdx(0);
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}
        <div
          ref={listRef}
          className="studio-combobox-list studio-scrollbar"
          onKeyDown={!showFilter ? handleKeyDown : undefined}
          tabIndex={!showFilter ? 0 : undefined}
        >
          {filteredOptions?.map((opt) => renderItem(opt))}

          {filteredGroups?.map((group, i) => (
            <div key={group.label}>
              {(i > 0 || (filteredOptions && filteredOptions.length > 0)) && (
                <div className="studio-prop-select-separator" />
              )}
              <div className="studio-prop-select-group-label">
                {group.label}
              </div>
              {group.options.map((opt) => renderItem(opt))}
            </div>
          ))}

          {filteredFlat.length === 0 && (
            <div className="studio-combobox-empty">No matches</div>
          )}
        </div>
      </Popover.Content>
    </Popover.Portal>
  );

  if (Icon) {
    return (
      <div className="studio-scrub-input" style={{ gap: 0 }}>
        <Tooltip content={tooltip || ""} side="left">
          <div className="studio-scrub-icon no-scrub">
            <Icon style={{ width: 12, height: 12 }} />
          </div>
        </Tooltip>
        <Popover.Root open={open} onOpenChange={setOpen}>
          {trigger}
          {content}
        </Popover.Root>
      </div>
    );
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      {trigger}
      {content}
    </Popover.Root>
  );
}
