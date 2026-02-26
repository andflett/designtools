import { useState, useRef, useEffect, useCallback } from "react";
import { Component1Icon } from "@radix-ui/react-icons";
import type { SelectedElementData, ComponentTreeNode, PreviewCombination } from "../shared/protocol.js";
import type { ComponentEntry } from "../server/lib/scan-components.js";
import { usePostMessage } from "./lib/use-postmessage.js";
import { ToolChrome } from "./components/tool-chrome.js";
import { EditorPanel } from "./components/editor-panel.js";
import { TooltipProvider } from "./components/tooltip.js";
import { BootScreen } from "./components/boot-screen.js";
import { scanStore, type RawScanData } from "./lib/scan-store.js";
import { useScanReady, useComponents } from "./lib/scan-hooks.js";
import { UsagePanel } from "./components/usage-panel.js";
import { PageExplorer } from "./components/page-explorer.js";
import { IsolationView, generateCombinations } from "./components/isolation-view.js";

/** Set to false to skip the boot screen (disable before publishing) */
const SHOW_BOOT_SCREEN = false;

/**
 * Find the tree node ID that corresponds to the currently selected element.
 * Uses domPath matching — both the tree node IDs and SelectedElementData.domPath
 * use the same nth-child CSS selector path format.
 */
function findTreeIdForElement(
  tree: ComponentTreeNode[],
  element: SelectedElementData
): string | null {
  if (!element.domPath) return null;
  // The selected element's domPath may point to the exact element or a descendant.
  // Walk the tree looking for an exact match or the closest ancestor match.
  return findInTree(tree, element.domPath);
}

function findInTree(nodes: ComponentTreeNode[], domPath: string): string | null {
  for (const node of nodes) {
    if (node.id === domPath) return node.id;
    // Check if domPath starts with this node's id (descendant)
    const found = findInTree(node.children, domPath);
    if (found) return found;
  }
  return null;
}

export function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [targetUrl, setTargetUrl] = useState("");
  const [stylingType, setStylingType] = useState("");
  const [selectedElement, setSelectedElement] = useState<SelectedElementData | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [viewportWidth, setViewportWidth] = useState<number | "fill">("fill");
  const [iframePath, setIframePath] = useState("/");
  const [injectedReady, setInjectedReady] = useState(false);
  const [bootDone, setBootDone] = useState(!SHOW_BOOT_SCREEN);
  const [usagePanelOpen, setUsagePanelOpen] = useState(false);
  const [componentTree, setComponentTree] = useState<ComponentTreeNode[]>([]);
  const [leftPanelTab, setLeftPanelTab] = useState<"elements" | "usages">("elements");
  const [isolationComponent, setIsolationComponent] = useState<ComponentEntry | null>(null);
  const [preIsolationPath, setPreIsolationPath] = useState("/");
  const scanReady = useScanReady();
  const componentData = useComponents();

  // Fetch config from server
  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((config) => {
        setTargetUrl(config.targetUrl);
        setStylingType(config.stylingType || "");
      })
      .catch(console.error);
  }, []);

  // Fetch unified scan data and populate the store
  useEffect(() => {
    fetch("/scan/all")
      .then((res) => res.json())
      .then((data: RawScanData) => {
        scanStore.setAll(data);
      })
      .catch(console.error);
  }, []);

  const handleMessage = useCallback(
    (msg: import("../shared/protocol.js").IframeToEditor) => {
      switch (msg.type) {
        case "tool:injectedReady":
          setInjectedReady(true);
          // Auto-enter selection mode
          if (iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage(
              { type: "tool:enterSelectionMode" },
              "*"
            );
            iframeRef.current.contentWindow?.postMessage(
              { type: "tool:requestComponentTree" },
              "*"
            );
            setSelectionMode(true);
          }
          break;
        case "tool:elementSelected":
          setSelectedElement(msg.data);
          break;
        case "tool:pathChanged":
          setIframePath(msg.path);
          // Request updated component tree after navigation
          if (iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage(
              { type: "tool:requestComponentTree" },
              "*"
            );
          }
          break;
        case "tool:componentTree":
          setComponentTree(msg.tree);
          break;
      }
    },
    []
  );

  const { send } = usePostMessage(iframeRef, handleMessage);

  const toggleSelectionMode = useCallback(() => {
    const next = !selectionMode;
    setSelectionMode(next);
    send(next ? { type: "tool:enterSelectionMode" } : { type: "tool:exitSelectionMode" });
  }, [selectionMode, send]);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    send({ type: "tool:setTheme", theme: next });
  }, [theme, send]);

  const handlePreviewInlineStyle = useCallback((property: string, value: string) => {
    send({ type: "tool:previewInlineStyle", property, value });
  }, [send]);

  const handleRevertInlineStyles = useCallback(() => {
    send({ type: "tool:revertInlineStyles" });
  }, [send]);

  const handleReselectElement = useCallback(() => {
    send({ type: "tool:reselectElement" });
  }, [send]);

  const handlePreviewToken = useCallback((token: string, value: string) => {
    send({ type: "tool:previewTokenValue", property: token, value });
  }, [send]);

  const handlePreviewShadow = useCallback((variableName: string, value: string, _shadowName?: string) => {
    send({ type: "tool:previewTokenValue", property: variableName, value });
  }, [send]);

  const handleCloseEditor = useCallback(() => {
    setSelectedElement(null);
    setUsagePanelOpen(false);
  }, []);

  const handleNavigateToRoute = useCallback((route: string) => {
    setIframePath(route);
  }, []);

  const handleTreeSelect = useCallback((id: string) => {
    send({ type: "tool:selectByTreeId", id });
  }, [send]);

  const handleTreeHover = useCallback((id: string) => {
    send({ type: "tool:highlightByTreeId", id });
  }, [send]);

  const handleTreeHoverEnd = useCallback(() => {
    send({ type: "tool:clearHighlight" });
  }, [send]);

  // Isolation mode: render a component in the preview route
  const handleIsolate = useCallback((entry: ComponentEntry) => {
    if (!targetUrl) return;
    setPreIsolationPath(iframePath);
    setIsolationComponent(entry);

    // Navigate iframe to the preview route
    setIframePath("/designtools-preview");

    // Generate initial combinations and send after iframe loads
    const combos = generateCombinations(entry.variants);
    const componentPath = entry.filePath.replace(/\.(tsx|ts|jsx|js)$/, "");

    // Wait a moment for iframe navigation, then send the render message
    const sendPreview = () => {
      send({
        type: "tool:renderPreview",
        dataSlot: entry.dataSlot,
        componentPath,
        exportName: entry.exportName,
        combinations: combos,
        defaultChildren: entry.name,
      });
    };

    // Send after a short delay to let the preview page load
    setTimeout(sendPreview, 1500);
  }, [targetUrl, iframePath, send]);

  const handleExitIsolation = useCallback(() => {
    setIsolationComponent(null);
    setIframePath(preIsolationPath);
  }, [preIsolationPath]);

  const handleIsolationCombinationsChange = useCallback((combos: PreviewCombination[]) => {
    if (!isolationComponent) return;
    const componentPath = isolationComponent.filePath.replace(/\.(tsx|ts|jsx|js)$/, "");
    send({
      type: "tool:renderPreview",
      dataSlot: isolationComponent.dataSlot,
      componentPath,
      exportName: isolationComponent.exportName,
      combinations: combos,
      defaultChildren: isolationComponent.name,
    });
  }, [isolationComponent, send]);

  if (!targetUrl) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: "var(--studio-bg)", color: "var(--studio-text-dimmed)" }}
      >
        Loading...
      </div>
    );
  }

  if (!bootDone) {
    return (
      <BootScreen onContinue={() => setBootDone(true)} />
    );
  }

  // Derive component name from selected element for the usage panel
  const dataSlot = selectedElement?.attributes?.["data-slot"] || null;
  const selectedComponentEntry = dataSlot
    ? componentData?.byDataSlot.get(dataSlot) ?? null
    : null;
  const selectedComponentName = selectedComponentEntry?.name || null;

  // Derive selected element's domPath-based ID for tree highlighting.
  // The tree uses getDomPath() as node IDs — we need to match against
  // the selected element. Since domPath is sent in extractElementData,
  // we read it from the raw postMessage data (stored as attributes won't have it).
  // For now, we match by finding a tree node whose id we stored.
  const selectedTreeId = selectedElement
    ? findTreeIdForElement(componentTree, selectedElement)
    : null;

  const showUsages = leftPanelTab === "usages" && selectedComponentName;

  const leftPanel = isolationComponent ? (
    <div
      className="flex flex-col border-r h-full"
      style={{
        width: 240,
        minWidth: 240,
        background: "var(--studio-surface)",
        borderColor: "var(--studio-border)",
      }}
    >
      <IsolationView
        component={isolationComponent}
        onBack={handleExitIsolation}
        onCombinationsChange={handleIsolationCombinationsChange}
      />
    </div>
  ) : (
    <div
      className="flex flex-col border-r h-full"
      style={{
        width: 240,
        minWidth: 240,
        background: "var(--studio-surface)",
        borderColor: "var(--studio-border)",
      }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center border-b shrink-0"
        style={{ borderColor: "var(--studio-border)" }}
      >
        <button
          onClick={() => setLeftPanelTab("elements")}
          className="flex-1 text-[10px] font-semibold uppercase tracking-wide py-2 text-center"
          style={{
            color: leftPanelTab === "elements" ? "var(--studio-accent)" : "var(--studio-text-dimmed)",
            borderBottom: leftPanelTab === "elements" ? "2px solid var(--studio-accent)" : "2px solid transparent",
            background: "none",
            cursor: "pointer",
          }}
        >
          Elements
        </button>
        <button
          onClick={() => setLeftPanelTab("usages")}
          className="flex-1 text-[10px] font-semibold uppercase tracking-wide py-2 text-center"
          style={{
            color: leftPanelTab === "usages" ? "var(--studio-accent)" : "var(--studio-text-dimmed)",
            borderBottom: leftPanelTab === "usages" ? "2px solid var(--studio-accent)" : "2px solid transparent",
            background: "none",
            cursor: "pointer",
            opacity: selectedComponentName ? 1 : 0.4,
          }}
          disabled={!selectedComponentName}
        >
          Usage
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {leftPanelTab === "elements" ? (
          <PageExplorer
            tree={componentTree}
            selectedId={selectedTreeId}
            onSelect={handleTreeSelect}
            onHover={handleTreeHover}
            onHoverEnd={handleTreeHoverEnd}
          />
        ) : showUsages ? (
          <UsagePanel
            componentName={selectedComponentName}
            currentPath={iframePath}
            onNavigate={handleNavigateToRoute}
            onClose={() => setLeftPanelTab("elements")}
          />
        ) : (
          <div
            className="px-4 py-6 text-[11px] text-center"
            style={{ color: "var(--studio-text-dimmed)" }}
          >
            Select a component to see usages.
          </div>
        )}
      </div>
    </div>
  );

  const editorPanel = (
    <EditorPanel
      element={selectedElement}
      theme={theme}
      iframePath={iframePath}
      onPreviewToken={handlePreviewToken}
      onPreviewShadow={handlePreviewShadow}
      onPreviewInlineStyle={handlePreviewInlineStyle}
      onRevertInlineStyles={handleRevertInlineStyles}
      onClose={handleCloseEditor}
      onReselectElement={handleReselectElement}
      onToggleUsagePanel={() => setUsagePanelOpen((v) => !v)}
      usagePanelOpen={usagePanelOpen}
      onIsolate={handleIsolate}
    />
  );

  return (
    <TooltipProvider>
      <ToolChrome
        toolName="CodeSurface"
        toolIcon={<Component1Icon />}
        selectionMode={selectionMode}
        onToggleSelectionMode={toggleSelectionMode}
        theme={theme}
        onToggleTheme={toggleTheme}
        viewportWidth={viewportWidth}
        onViewportWidthChange={setViewportWidth}
        iframePath={iframePath}
        onIframePathChange={setIframePath}
        targetUrl={targetUrl}
        iframeRef={iframeRef}
        editorPanel={editorPanel}
        leftPanel={leftPanel}
      />
    </TooltipProvider>
  );
}
