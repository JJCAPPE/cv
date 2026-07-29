#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WIDTH = 2400;
const HEIGHT = 1350;
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.resolve(
  scriptDirectory,
  "../public/media/projects/inventory-system",
);

const palette = {
  bg: "#0b0b0a",
  bgTint: "#0c100d",
  panel: "#161614",
  surface: "#1d1d1a",
  surfaceRaised: "#262620",
  line: "#4b4a41",
  lineSoft: "#34342e",
  fg: "#f1efe8",
  muted: "#aaa79f",
  subtle: "#77746d",
  accent: "#e6d12a",
  warning: "#d87943",
  ink: "#11110f",
  warmTop: "#f1efe8",
  warmFront: "#d9d5ca",
  warmSide: "#aaa59a",
};

function ledgerEntry({
  id,
  display,
  claim,
  source,
  truthStatus,
  surfaces,
  confidence = "verified",
  notes = "",
}) {
  const scope =
    truthStatus === "default"
      ? "default"
      : truthStatus === "historical/excluded"
        ? "historical"
        : "optional";

  return {
    id,
    display: Array.isArray(display) ? display : [display],
    claim,
    source,
    truthStatus,
    scope,
    surfaces,
    confidence,
    notes,
  };
}

/**
 * Project-local truth ledger.
 *
 * Visible text is emitted only through claimText/claimBlock, and every
 * connector carries a data-claim attribute pointing to one of these entries.
 * Excluded concepts stay in the ledger so they cannot drift back into the
 * production path during visual polishing.
 */
const sourceLedger = [
  ledgerEntry({
    id: "document.cover.title",
    display: ["INVENTORY", "EXECUTION STACK"],
    claim: "The cover is a compact derivative of the current inventory execution path.",
    source:
      "inventario-cappellettoshop@3b2169e6: src/components/SearchBar.tsx::searchProducts; src/components/HomePage.tsx::handleSearchSelect,handleDecreaseInventory; src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging",
    truthStatus: "default",
    surfaces: ["cover"],
  }),
  ledgerEntry({
    id: "document.cover.desc",
    display:
      "Exploded inventory application stack from staff input through React, Tauri, Rust, Shopify, Firestore, and refresh.",
    claim: "Accessible description of the compact execution stack.",
    source:
      "inventario-cappellettoshop@3b2169e6: current decrement execution path",
    truthStatus: "default",
    surfaces: ["cover"],
  }),
  ledgerEntry({
    id: "document.decrement.title",
    display: ["EXACT SKU →", "ONE-UNIT ADJUSTMENT"],
    claim: "The detailed master follows exact-SKU lookup into a one-unit available adjustment.",
    source:
      "src/components/SearchBar.tsx::searchProducts; src/components/HomePage.tsx::handleDecreaseInventory",
    truthStatus: "default",
    surfaces: ["master", "companion"],
  }),
  ledgerEntry({
    id: "document.decrement.desc",
    display:
      "Detailed non-atomic execution path for exact-SKU search, two-location hydration, one-unit Shopify adjustment, conditional status handling, Firestore logging, and refresh.",
    claim: "Accessible description of the default decrement view and its failure boundary.",
    source:
      "src/components/HomePage.tsx::handleSearchSelect,handleDecreaseInventory; src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging",
    truthStatus: "default",
    surfaces: ["master", "companion"],
  }),
  ledgerEntry({
    id: "document.recovery.title",
    display: ["RECOVERY PATHS /", "TWO DIFFERENT GUARANTEES"],
    claim: "Undo and transfer rollback have different behavior and guarantees.",
    source:
      "src-tauri/src/inventory/mod.rs::undo_decrease_inventory_with_logging,transfer_inventory_between_locations",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "document.recovery.desc",
    display:
      "Companion view of one-unit undo with possible product reactivation and two-location transfer with destination-failure source rollback and non-rolled-back logging warnings.",
    claim: "Accessible description of recovery and rollback scope.",
    source:
      "src-tauri/src/inventory/mod.rs::undo_decrease_inventory_with_logging,transfer_inventory_between_locations",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "meta.source",
    display: "SOURCE SNAPSHOT / 3b2169e6",
    claim: "All runtime labels are grounded in the inspected inventory repository snapshot.",
    source: "inventario-cappellettoshop git commit 3b2169e6",
    truthStatus: "default",
    surfaces: ["cover", "master", "companion"],
  }),
  ledgerEntry({
    id: "meta.default",
    display: "SOLID / DEFAULT",
    claim: "Solid connectors represent the default execution path.",
    source:
      "src/components/HomePage.tsx::handleDecreaseInventory; src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging",
    truthStatus: "default",
    surfaces: ["cover", "master", "companion"],
  }),
  ledgerEntry({
    id: "meta.conditional",
    display: "DASHED / CONDITIONAL OR RECOVERY",
    claim: "Dashed connectors represent fallback, conditional, or recovery behavior.",
    source:
      "src/components/SearchBar.tsx::searchProducts; src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging,undo_decrease_inventory_with_logging,transfer_inventory_between_locations",
    truthStatus: "conditional",
    surfaces: ["cover", "master", "companion"],
  }),
  ledgerEntry({
    id: "meta.nonAtomic",
    display: ["NON-ATOMIC BOUNDARY", "SHOPIFY CAN CHANGE BEFORE LATER WORK FAILS"],
    claim:
      "The default decrement is sequential; the Shopify write precedes the zero check, optional status update, and Firestore log.",
    source: "src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging",
    truthStatus: "conditional",
    surfaces: ["master", "companion", "caption"],
    confidence: "verified",
    notes: "Do not describe this sequence as a transaction or atomic operation.",
  }),
  ledgerEntry({
    id: "layer.operator",
    display: ["01 / OPERATOR", "STAFF INPUT"],
    claim: "A staff action initiates search and later confirms the adjustment.",
    source:
      "src/components/SearchBar.tsx; src/components/HomePage.tsx::handleDecreaseInventory",
    truthStatus: "default",
    surfaces: ["cover", "master"],
  }),
  ledgerEntry({
    id: "operator.scan",
    display: ["SCAN OR TYPE", "KNOWN SKU"],
    claim: "The staff member scans or types a known SKU.",
    source: "src/components/SearchBar.tsx::document paste/keydown handlers,searchProducts",
    truthStatus: "default",
    surfaces: ["cover", "master"],
  }),
  ledgerEntry({
    id: "operator.review",
    display: ["REVIEW VARIANT", "PRIMARY LOCATION"],
    claim: "The operator reviews the selected variant and primary location stock.",
    source: "src/components/HomePage.tsx::handleSearchSelect and variant selection UI",
    truthStatus: "default",
    surfaces: ["master"],
  }),
  ledgerEntry({
    id: "operator.confirm",
    display: ["CONFIRM", "DECREMENT ONE UNIT"],
    claim: "The operator confirms the requested one-unit decrease.",
    source: "src/components/HomePage.tsx::handleDecreaseInventory",
    truthStatus: "default",
    surfaces: ["cover", "master"],
  }),
  ledgerEntry({
    id: "layer.react",
    display: ["02 / REACT", "SEARCH + HYDRATE"],
    claim: "React coordinates search, selection, location hydration, validation, and refresh.",
    source:
      "src/components/SearchBar.tsx::searchProducts; src/components/HomePage.tsx::handleSearchSelect,handleDecreaseInventory",
    truthStatus: "default",
    surfaces: ["cover", "master"],
  }),
  ledgerEntry({
    id: "search.gate",
    display: ["≥ 2 CHARACTERS", "300 ms DEBOUNCE"],
    claim: "Search waits for at least two characters and is debounced by 300 milliseconds.",
    source: "src/components/SearchBar.tsx::searchProducts and debounced search effect",
    truthStatus: "default",
    surfaces: ["master"],
  }),
  ledgerEntry({
    id: "search.exact",
    display: ["EXACT SKU", "GRAPHQL FIRST"],
    claim: "The first remote search is an exact-SKU Shopify GraphQL query.",
    source:
      "src/components/SearchBar.tsx::searchProducts; src/services/tauri.ts::ProductAPI.findProductByExactSkuGraphQL; src-tauri/src/products/mod.rs::find_product_by_exact_sku_graphql",
    truthStatus: "default",
    surfaces: ["cover", "master"],
  }),
  ledgerEntry({
    id: "search.fallback",
    display: ["MISS → TITLE PREFIX", "GRAPHQL FALLBACK"],
    claim: "When exact SKU misses, the current UI calls the title-prefix GraphQL search.",
    source:
      "src/components/SearchBar.tsx::searchProducts; src-tauri/src/products/mod.rs::search_products_by_name_graphql",
    truthStatus: "conditional",
    surfaces: ["master"],
  }),
  ledgerEntry({
    id: "search.autoSelect",
    display: ["AUTO-SELECT", "EXACT OR SOLE RESULT"],
    claim: "An exact SKU or sole search result is selected automatically.",
    source: "src/components/SearchBar.tsx::searchProducts",
    truthStatus: "default",
    surfaces: ["master"],
  }),
  ledgerEntry({
    id: "hydrate.overlap",
    display: ["PRODUCT FETCH", "INVENTORY IN FLIGHT"],
    claim:
      "After product fetch, the two-location inventory request overlaps synchronous product processing.",
    source: "src/components/HomePage.tsx::handleSearchSelect",
    truthStatus: "default",
    surfaces: ["master"],
  }),
  ledgerEntry({
    id: "hydrate.locations",
    display: ["PRIMARY + SECONDARY", "LOCATION MAPPING"],
    claim: "Inventory levels are mapped into primary and secondary location quantities.",
    source:
      "src/components/HomePage.tsx::handleSearchSelect; src/services/tauri.ts::InventoryAPI.getInventoryLevelsForLocations",
    truthStatus: "default",
    surfaces: ["cover", "master"],
  }),
  ledgerEntry({
    id: "validation.stock",
    display: ["VALIDATE", "AVAILABLE > 0"],
    claim: "The UI blocks a decrease when the selected variant quantity is zero or negative.",
    source: "src/components/HomePage.tsx::handleDecreaseInventory",
    truthStatus: "default",
    surfaces: ["master"],
  }),
  ledgerEntry({
    id: "layer.ipc",
    display: ["03 / TAURI", "IPC MEMBRANE"],
    claim: "Tauri invoke commands form the frontend-to-Rust boundary.",
    source:
      "src/services/tauri.ts; src-tauri/src/main.rs::tauri::generate_handler!",
    truthStatus: "default",
    surfaces: ["cover", "master", "companion"],
  }),
  ledgerEntry({
    id: "ipc.location",
    display: ["RESOLVE CONFIGURED", "LOCATION ID"],
    claim: "The frontend resolves the chosen primary location to a configured Shopify location ID.",
    source:
      "src/components/HomePage.tsx::handleDecreaseInventory; src-tauri/src/location/mod.rs; src-tauri/src/utils/mod.rs::AppConfig",
    truthStatus: "default",
    surfaces: ["master"],
  }),
  ledgerEntry({
    id: "ipc.command",
    display: ["INVOKE", "decrease_inventory_with_logging"],
    claim: "The frontend invokes the logged decrement Rust command.",
    source:
      "src/services/tauri.ts::InventoryAPI.decreaseInventoryWithLogging; src-tauri/src/main.rs::tauri::generate_handler!",
    truthStatus: "default",
    surfaces: ["master"],
  }),
  ledgerEntry({
    id: "layer.rust",
    display: ["04 / RUST", "SEQUENTIAL ORCHESTRATION"],
    claim: "Rust executes adjustment, checks, optional status work, and logging sequentially.",
    source: "src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging",
    truthStatus: "default",
    surfaces: ["cover", "master", "companion"],
  }),
  ledgerEntry({
    id: "rust.adjust",
    display: ["REST ADJUST", "available_adjustment: -1"],
    claim: "The current default decrement sends available_adjustment -1 to Shopify REST.",
    source:
      "src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging,adjust_inventory",
    truthStatus: "default",
    surfaces: ["cover", "master"],
  }),
  ledgerEntry({
    id: "rust.zeroCheck",
    display: ["ZERO ACROSS ALL", "VARIANTS + LOCATIONS?"],
    claim: "After the write, the command checks inventory across every product variant and location.",
    source:
      "src-tauri/src/inventory/mod.rs::has_zero_inventory_across_all_locations",
    truthStatus: "default",
    surfaces: ["master", "companion"],
  }),
  ledgerEntry({
    id: "rust.draft",
    display: ["IF ZERO", "REST STATUS → DRAFT"],
    claim: "A true zero result conditionally attempts to set product status to draft through REST.",
    source:
      "src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging,update_product_status",
    truthStatus: "conditional",
    surfaces: ["master", "companion"],
  }),
  ledgerEntry({
    id: "rust.log",
    display: ["FIRESTORE REST", "Rettifica / -1"],
    claim: "The decrement creates an application-owned Firestore Rettifica log with adjustment -1.",
    source:
      "src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging; src-tauri/src/firebase/mod.rs::FirebaseClient.create_log",
    truthStatus: "default",
    surfaces: ["cover", "master"],
  }),
  ledgerEntry({
    id: "layer.services",
    display: ["05 / SERVICES", "SHOPIFY + FIRESTORE"],
    claim: "Shopify and Firestore are distinct external service boundaries.",
    source:
      "src-tauri/src/inventory/mod.rs; src-tauri/src/firebase/mod.rs::FirebaseClient.create_log",
    truthStatus: "default",
    surfaces: ["cover", "master", "companion"],
  }),
  ledgerEntry({
    id: "service.shopifyRead",
    display: ["SHOPIFY GRAPHQL", "EXACT + TITLE SEARCH"],
    claim: "The exact-SKU and title-prefix search paths use Shopify GraphQL.",
    source:
      "src-tauri/src/products/mod.rs::find_product_by_exact_sku_graphql,search_products_by_name_graphql",
    truthStatus: "default",
    surfaces: ["cover", "master"],
  }),
  ledgerEntry({
    id: "service.shopifyWrite",
    display: ["SHOPIFY REST", "PRODUCT + STOCK + WRITES"],
    claim:
      "Selected-product and inventory-level reads, the default adjustment, and product status paths use Shopify REST.",
    source:
      "src-tauri/src/products/mod.rs::get_product_by_id; src-tauri/src/inventory/mod.rs::get_inventory_levels_for_locations,adjust_inventory,update_product_status",
    truthStatus: "default",
    surfaces: ["cover", "master", "companion"],
  }),
  ledgerEntry({
    id: "service.shopifyHydrate",
    display: "REST PRODUCT + STOCK READS",
    claim:
      "Selection hydration fetches the product and two-location inventory levels through Shopify REST.",
    source:
      "src/components/HomePage.tsx::handleSearchSelect; src-tauri/src/products/mod.rs::get_product_by_id; src-tauri/src/inventory/mod.rs::get_inventory_levels_for_locations",
    truthStatus: "default",
    surfaces: ["master"],
  }),
  ledgerEntry({
    id: "service.firestore",
    display: ["FIRESTORE", "APP-OWNED AUDIT LOG"],
    claim: "The application writes its own audit entries through Firestore REST.",
    source: "src-tauri/src/firebase/mod.rs::FirebaseClient.create_log",
    truthStatus: "default",
    surfaces: ["cover", "master", "companion"],
  }),
  ledgerEntry({
    id: "refresh.default",
    display: ["REFRESH LOGS + PRODUCT", "REMEMBER UNDO TARGET"],
    claim:
      "After success, the UI refreshes logs and product/location data and stores the last modified variant for undo.",
    source: "src/components/HomePage.tsx::handleDecreaseInventory",
    truthStatus: "default",
    surfaces: ["cover", "master"],
  }),
  ledgerEntry({
    id: "recovery.undo.label",
    display: ["A / UNDO LAST CHANGE", "ONE UNIT BACK"],
    claim: "The UI exposes an undo for the last modified variant.",
    source: "src/components/HomePage.tsx::handleUndoChange",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.undo.precheck",
    display: ["CHECK PREVIOUS", "ALL-LOCATION ZERO STATE"],
    claim: "Undo records whether the product was at zero before adding a unit.",
    source:
      "src-tauri/src/inventory/mod.rs::undo_decrease_inventory_with_logging",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.undo.adjust",
    display: ["SHOPIFY REST", "available_adjustment: +1"],
    claim: "Undo adds one available unit through the same REST adjustment endpoint.",
    source:
      "src-tauri/src/inventory/mod.rs::undo_decrease_inventory_with_logging,adjust_inventory",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.undo.active",
    display: ["IF PREVIOUSLY ZERO", "REST STATUS → ACTIVE"],
    claim: "If the product had zero inventory before undo, reactivation is attempted.",
    source:
      "src-tauri/src/inventory/mod.rs::undo_decrease_inventory_with_logging,update_product_status",
    truthStatus: "conditional",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.undo.log",
    display: ["FIRESTORE REST", "Annullamento / +1"],
    claim: "Undo creates an Annullamento Firestore log with adjustment +1.",
    source:
      "src-tauri/src/inventory/mod.rs::undo_decrease_inventory_with_logging; src-tauri/src/firebase/mod.rs::FirebaseClient.create_log",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.undo.refresh",
    display: ["REFRESH", "LOGS + LOCATION STOCK"],
    claim: "The UI refreshes logs and product/location data after undo.",
    source: "src/components/HomePage.tsx::handleUndoChange",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.transfer.label",
    display: ["B / TWO-LOCATION TRANSFER", "ONE UNIT MOVED"],
    claim: "The transfer workflow moves one unit between configured locations.",
    source:
      "src/components/HomePage.tsx::executeBatchTransfer,handleUndoTransfer; src-tauri/src/inventory/mod.rs::transfer_inventory_between_locations",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.transfer.source",
    display: ["SOURCE LOCATION", "REST / -1"],
    claim: "Transfer first decrements the source location by one.",
    source:
      "src-tauri/src/inventory/mod.rs::transfer_inventory_between_locations",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.transfer.destination",
    display: ["DESTINATION LOCATION", "REST / +1"],
    claim: "Transfer next increments the destination location by one.",
    source:
      "src-tauri/src/inventory/mod.rs::transfer_inventory_between_locations",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.transfer.rollback",
    display: ["DESTINATION FAILS", "SOURCE ROLLBACK / +1"],
    claim: "A failed destination adjustment triggers a source +1 rollback attempt.",
    source:
      "src-tauri/src/inventory/mod.rs::transfer_inventory_between_locations",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.transfer.rollbackFailure",
    display: ["ROLLBACK CAN FAIL", "CRITICAL ERROR RETURNED"],
    claim: "If the compensating source adjustment also fails, the command returns a critical error.",
    source:
      "src-tauri/src/inventory/mod.rs::transfer_inventory_between_locations",
    truthStatus: "conditional",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.transfer.logs",
    display: ["TWO FIRESTORE LOGS", "Trasferimento / -1 +1"],
    claim: "A successful transfer attempts one log per location.",
    source:
      "src-tauri/src/inventory/mod.rs::transfer_inventory_between_locations",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "recovery.transfer.logWarning",
    display: ["LOG FAILURE = WARNING", "SHOPIFY WRITES STAY APPLIED"],
    claim: "Transfer log failures are warnings and do not roll back successful Shopify adjustments.",
    source:
      "src-tauri/src/inventory/mod.rs::transfer_inventory_between_locations",
    truthStatus: "conditional",
    surfaces: ["companion", "caption"],
  }),
  ledgerEntry({
    id: "recovery.transfer.undo",
    display: ["UI UNDO TRANSFER", "CALL SAME FLOW IN REVERSE"],
    claim: "The UI undo-transfer handler reverses source and destination and calls the transfer command again.",
    source: "src/components/HomePage.tsx::handleUndoTransfer",
    truthStatus: "recovery",
    surfaces: ["companion"],
  }),
  ledgerEntry({
    id: "excluded.graphqlAdjustment",
    display: "DEFAULT GRAPHQL INVENTORY ADJUSTMENT",
    claim: "GraphQL is not the current default decrement write path.",
    source:
      "src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging calls adjust_inventory, not adjust_inventory_graphql",
    truthStatus: "historical/excluded",
    surfaces: ["nowhere"],
    confidence: "excluded",
  }),
  ledgerEntry({
    id: "excluded.variantDeletion",
    display: "DELETE OR REMOVE A VARIANT",
    claim: "The app adjusts available quantity; it does not delete a Shopify variant.",
    source:
      "src/components/HomePage.tsx::handleDecreaseInventory; src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging",
    truthStatus: "historical/excluded",
    surfaces: ["nowhere"],
    confidence: "excluded",
  }),
  ledgerEntry({
    id: "excluded.atomic",
    display: "ATOMIC TRANSACTION",
    claim: "The decrement and transfer flows do not provide general transaction semantics.",
    source:
      "src-tauri/src/inventory/mod.rs::decrease_inventory_with_logging,transfer_inventory_between_locations",
    truthStatus: "historical/excluded",
    surfaces: ["nowhere"],
    confidence: "excluded",
  }),
  ledgerEntry({
    id: "excluded.realtime",
    display: "REAL-TIME FIREBASE HISTORY",
    claim: "The current history UI refreshes logs; it is not shown as a real-time subscription.",
    source:
      "src/components/HomePage.tsx::handleDecreaseInventory,handleUndoChange; src/contexts/LogContext.tsx",
    truthStatus: "historical/excluded",
    surfaces: ["nowhere"],
    confidence: "excluded",
  }),
  ledgerEntry({
    id: "excluded.historyExperiment",
    display: "SHOPIFY INVENTORY-HISTORY ATTRIBUTION",
    claim: "Rolled-back history experiments are not part of the current execution path.",
    source: "inventario-cappellettoshop git history; absent from 3b2169e6 runtime",
    truthStatus: "historical/excluded",
    surfaces: ["nowhere"],
    confidence: "excluded",
  }),
  ledgerEntry({
    id: "excluded.performance",
    display: "70% / 80% / 60% / 43%",
    claim: "The previous performance percentages have no matched benchmark artifact.",
    source:
      "cv-site source/history audit; inventario-cappellettoshop source/history audit",
    truthStatus: "historical/excluded",
    surfaces: ["nowhere"],
    confidence: "excluded",
  }),
];

const ledgerById = new Map(sourceLedger.map((entry) => [entry.id, entry]));

function claim(id) {
  const entry = ledgerById.get(id);
  if (!entry) {
    throw new Error(`Unknown source-ledger claim: ${id}`);
  }
  return entry;
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function attrString(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => {
      const attributeName =
        key === "className"
          ? "class"
          : key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      return `${attributeName}="${esc(value === true ? "" : value)}"`;
    })
    .join(" ");
}

function element(name, attributes = {}, children = "") {
  const renderedAttributes = attrString(attributes);
  return `<${name}${renderedAttributes ? ` ${renderedAttributes}` : ""}>${children}</${name}>`;
}

function empty(name, attributes = {}) {
  const renderedAttributes = attrString(attributes);
  return `<${name}${renderedAttributes ? ` ${renderedAttributes}` : ""}/>`;
}

function group(children, attributes = {}) {
  return element("g", attributes, children);
}

function rect(x, y, width, height, attributes = {}) {
  return empty("rect", { x, y, width, height, ...attributes });
}

function line(x1, y1, x2, y2, attributes = {}) {
  return empty("line", { x1, y1, x2, y2, ...attributes });
}

function pathElement(d, attributes = {}) {
  return empty("path", { d, ...attributes });
}

function circle(cx, cy, r, attributes = {}) {
  return empty("circle", { cx, cy, r, ...attributes });
}

function polygon(points, attributes = {}) {
  return empty("polygon", {
    points: points.map(([x, y]) => `${x},${y}`).join(" "),
    ...attributes,
  });
}

function claimText(id, x, y, lineIndex = 0, attributes = {}) {
  const entry = claim(id);
  const value = entry.display[lineIndex];
  if (value === undefined) {
    throw new Error(`Missing display line ${lineIndex} for ${id}`);
  }
  return element(
    "text",
    { x, y, dataClaim: id, ...attributes },
    esc(value),
  );
}

function claimBlock(id, x, y, attributes = {}, lineHeight = 28) {
  const entry = claim(id);
  return element(
    "text",
    { x, y, dataClaim: id, ...attributes },
    entry.display
      .map((value, index) =>
        element(
          "tspan",
          { x, dy: index === 0 ? 0 : lineHeight },
          esc(value),
        ),
      )
      .join(""),
  );
}

function definitions(prefix) {
  const style = `
    .display{font-family:"Arial Narrow","Barlow Condensed","Helvetica Neue",Arial,sans-serif;font-stretch:condensed}
    .sans{font-family:"Geist","Helvetica Neue",Arial,sans-serif}
    .mono{font-family:"Geist Mono","SFMono-Regular",Menlo,Consolas,monospace}
    .title{fill:${palette.fg};font-size:76px;font-weight:600;letter-spacing:-.025em}
    .cover-title{fill:${palette.fg};font-size:112px;font-weight:600;letter-spacing:-.035em}
    .kicker{fill:${palette.accent};font-size:16px;font-weight:650;letter-spacing:.13em}
    .layer-index{fill:${palette.accent};font-size:15px;font-weight:650;letter-spacing:.12em}
    .layer-title{fill:${palette.fg};font-size:28px;font-weight:600;letter-spacing:.02em}
    .node-title{fill:${palette.fg};font-size:18px;font-weight:650;letter-spacing:.04em}
    .node-detail{fill:${palette.muted};font-size:14px;letter-spacing:.025em}
    .cover-label{fill:${palette.fg};font-size:22px;font-weight:650;letter-spacing:.08em}
    .cover-detail{fill:${palette.muted};font-size:15px;letter-spacing:.08em}
    .micro{fill:${palette.muted};font-size:13px;letter-spacing:.1em}
    .tiny{fill:${palette.subtle};font-size:11px;letter-spacing:.09em}
    .warning-text{fill:${palette.warning};font-size:14px;font-weight:650;letter-spacing:.08em}
    .outline{stroke:${palette.line};stroke-width:1.5;stroke-linejoin:round;vector-effect:non-scaling-stroke}
    .outline-strong{stroke:${palette.fg};stroke-width:2;stroke-linejoin:round;vector-effect:non-scaling-stroke}
    .fine{stroke:${palette.line};stroke-width:1;fill:none;vector-effect:non-scaling-stroke}
    .fine-soft{stroke:${palette.lineSoft};stroke-width:1;fill:none;vector-effect:non-scaling-stroke}
    .default-flow{stroke:${palette.accent};stroke-width:3;fill:none;stroke-linecap:square;stroke-linejoin:round;marker-end:url(#${prefix}-arrow-accent);vector-effect:non-scaling-stroke}
    .conditional-flow{stroke:${palette.muted};stroke-width:2;fill:none;stroke-dasharray:10 9;stroke-linecap:square;stroke-linejoin:round;marker-end:url(#${prefix}-arrow-muted);vector-effect:non-scaling-stroke}
    .warning-flow{stroke:${palette.warning};stroke-width:2.5;fill:none;stroke-dasharray:6 7;stroke-linecap:square;stroke-linejoin:round;marker-end:url(#${prefix}-arrow-warning);vector-effect:non-scaling-stroke}
  `.trim();

  return element(
    "defs",
    {},
    [
      element("style", {}, style),
      element(
        "marker",
        {
          id: `${prefix}-arrow-accent`,
          viewBox: "0 0 10 10",
          refX: 8,
          refY: 5,
          markerWidth: 7,
          markerHeight: 7,
          orient: "auto-start-reverse",
        },
        pathElement("M0 0L10 5L0 10Z", { fill: palette.accent }),
      ),
      element(
        "marker",
        {
          id: `${prefix}-arrow-muted`,
          viewBox: "0 0 10 10",
          refX: 8,
          refY: 5,
          markerWidth: 6,
          markerHeight: 6,
          orient: "auto-start-reverse",
        },
        pathElement("M0 0L10 5L0 10Z", { fill: palette.muted }),
      ),
      element(
        "marker",
        {
          id: `${prefix}-arrow-warning`,
          viewBox: "0 0 10 10",
          refX: 8,
          refY: 5,
          markerWidth: 6,
          markerHeight: 6,
          orient: "auto-start-reverse",
        },
        pathElement("M0 0L10 5L0 10Z", { fill: palette.warning }),
      ),
      element(
        "pattern",
        {
          id: `${prefix}-grid`,
          width: 48,
          height: 48,
          patternUnits: "userSpaceOnUse",
        },
        [
          line(0, 0, 48, 0, {
            stroke: palette.lineSoft,
            strokeWidth: 1,
            strokeOpacity: 0.42,
          }),
          line(0, 0, 0, 48, {
            stroke: palette.lineSoft,
            strokeWidth: 1,
            strokeOpacity: 0.42,
          }),
          circle(0, 0, 1.7, { fill: palette.line }),
        ].join(""),
      ),
    ].join(""),
  );
}

function svgDocument({ prefix, titleId, descriptionId, content }) {
  const title = claim(titleId).display.join(" ");
  const description = claim(descriptionId).display.join(" ");
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="${prefix}-title ${prefix}-description">`,
    element("title", { id: `${prefix}-title` }, esc(title)),
    element("desc", { id: `${prefix}-description` }, esc(description)),
    element(
      "metadata",
      { id: `${prefix}-source-ledger` },
      esc(JSON.stringify(sourceLedger)),
    ),
    definitions(prefix),
    rect(0, 0, WIDTH, HEIGHT, { fill: palette.bg }),
    rect(0, 0, WIDTH, HEIGHT, {
      fill: `url(#${prefix}-grid)`,
      opacity: 0.42,
    }),
    content,
    "</svg>",
  ].join("\n");
}

function flow(id, d, kind = "default", attributes = {}) {
  const className =
    kind === "conditional"
      ? "conditional-flow"
      : kind === "warning"
        ? "warning-flow"
        : "default-flow";
  return pathElement(d, {
    className,
    dataClaim: id,
    ...attributes,
  });
}

function isoSlab({
  x,
  y,
  width,
  height,
  depth = 18,
  claimId,
  fill = palette.panel,
  accent = false,
  children = "",
}) {
  const dx = depth;
  const dy = -Math.round(depth * 0.55);
  return group(
    [
      polygon(
        [
          [x, y],
          [x + dx, y + dy],
          [x + width + dx, y + dy],
          [x + width, y],
        ],
        {
          fill: accent ? palette.accent : palette.surfaceRaised,
          stroke: palette.line,
          strokeWidth: 1.5,
          vectorEffect: "non-scaling-stroke",
        },
      ),
      polygon(
        [
          [x + width, y],
          [x + width + dx, y + dy],
          [x + width + dx, y + height + dy],
          [x + width, y + height],
        ],
        {
          fill: accent ? "#9b8c16" : palette.ink,
          stroke: palette.line,
          strokeWidth: 1.5,
          vectorEffect: "non-scaling-stroke",
        },
      ),
      rect(x, y, width, height, {
        fill,
        stroke: accent ? palette.accent : palette.line,
        strokeWidth: accent ? 2 : 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      children,
    ].join(""),
    { dataClaim: claimId },
  );
}

function layerHeader(claimId, x, y) {
  return [
    claimText(claimId, x, y, 0, { className: "mono layer-index" }),
    claimText(claimId, x, y + 40, 1, { className: "display layer-title" }),
    line(x, y + 58, x + 250, y + 58, {
      stroke: palette.line,
      strokeWidth: 1,
      vectorEffect: "non-scaling-stroke",
    }),
  ].join("");
}

function nodeCard({
  claimId,
  x,
  y,
  width,
  height = 96,
  mode = "default",
}) {
  const entry = claim(claimId);
  const stroke =
    mode === "warning"
      ? palette.warning
      : mode === "conditional"
        ? palette.muted
        : palette.line;
  const dash = mode === "conditional" || mode === "warning" ? "8 7" : undefined;
  const titleClass =
    mode === "warning" ? "mono warning-text" : "mono node-title";

  return group(
    [
      rect(x, y, width, height, {
        fill: palette.bg,
        stroke,
        strokeWidth: mode === "default" ? 1 : 1.5,
        strokeDasharray: dash,
        vectorEffect: "non-scaling-stroke",
      }),
      rect(x, y, 5, height, {
        fill:
          mode === "warning"
            ? palette.warning
            : mode === "conditional"
              ? palette.muted
              : palette.accent,
      }),
      claimText(claimId, x + 22, y + 35, 0, { className: titleClass }),
      entry.display[1]
        ? claimText(claimId, x + 22, y + 64, 1, {
            className:
              mode === "warning" ? "mono warning-text" : "mono node-detail",
          })
        : "",
    ].join(""),
    { dataClaim: claimId },
  );
}

function warningMarker(claimId, x, y) {
  return group(
    [
      polygon(
        [
          [x, y - 18],
          [x + 18, y + 16],
          [x - 18, y + 16],
        ],
        {
          fill: palette.warning,
          stroke: palette.ink,
          strokeWidth: 2,
          vectorEffect: "non-scaling-stroke",
        },
      ),
      line(x, y - 7, x, y + 5, {
        stroke: palette.ink,
        strokeWidth: 3,
        vectorEffect: "non-scaling-stroke",
      }),
      circle(x, y + 10, 2, { fill: palette.ink }),
    ].join(""),
    { dataClaim: claimId },
  );
}

function coverArtwork() {
  const slabs = [
    {
      id: "layer.services",
      x: 650,
      y: 275,
      width: 1120,
      labelX: 705,
      labelId: "service.shopifyWrite",
    },
    {
      id: "layer.rust",
      x: 590,
      y: 465,
      width: 1180,
      labelX: 645,
      labelId: "rust.adjust",
    },
    {
      id: "layer.ipc",
      x: 530,
      y: 655,
      width: 1240,
      labelX: 585,
      labelId: "layer.ipc",
    },
    {
      id: "layer.react",
      x: 470,
      y: 845,
      width: 1300,
      labelX: 525,
      labelId: "search.exact",
    },
    {
      id: "layer.operator",
      x: 410,
      y: 1035,
      width: 1360,
      labelX: 465,
      labelId: "operator.scan",
    },
  ];

  const slabMarkup = slabs
    .map((slab, index) => {
      const isIpc = slab.id === "layer.ipc";
      const extra =
        index === 0
          ? [
              rect(slab.x + 720, slab.y + 25, 160, 60, {
                fill: palette.surfaceRaised,
                stroke: palette.line,
                strokeWidth: 1,
              }),
              rect(slab.x + 910, slab.y + 25, 160, 60, {
                fill: palette.surfaceRaised,
                stroke: palette.line,
                strokeWidth: 1,
              }),
              claimText("service.shopifyRead", slab.x + 800, slab.y + 61, 0, {
                className: "mono tiny",
                textAnchor: "middle",
              }),
              claimText("service.firestore", slab.x + 990, slab.y + 61, 0, {
                className: "mono tiny",
                textAnchor: "middle",
              }),
            ].join("")
          : "";

      return isoSlab({
        x: slab.x,
        y: slab.y,
        width: slab.width,
        height: isIpc ? 74 : 116,
        depth: isIpc ? 12 : 28,
        claimId: slab.id,
        fill: isIpc ? palette.accent : palette.panel,
        accent: isIpc,
        children: [
          claimText(
            slab.labelId,
            slab.labelX,
            slab.y + (isIpc ? 47 : 44),
            isIpc ? 1 : 0,
            {
            className: isIpc
              ? "mono cover-label"
              : "display cover-label",
            fill: isIpc ? palette.ink : undefined,
            },
          ),
          !isIpc && claim(slab.labelId).display[1]
            ? claimText(
                slab.labelId,
                slab.labelX,
                slab.y + 78,
                1,
                {
                  className: "mono cover-detail",
                },
              )
            : "",
          extra,
        ].join(""),
      });
    })
    .join("");

  return [
    claimBlock("document.cover.title", 460, 130, {
      className: "display cover-title",
    }, 92),
    claimText("meta.source", 1900, 92, 0, {
      className: "mono kicker",
      textAnchor: "end",
    }),
    line(1710, 126, 1900, 126, {
      stroke: palette.accent,
      strokeWidth: 3,
      vectorEffect: "non-scaling-stroke",
    }),
    slabMarkup,
    flow(
      "rust.adjust",
      "M1880 1110V990H1840V915H1880V800H1840V716H1880V600H1840V526H1880V395",
    ),
    circle(1880, 1110, 13, {
      fill: palette.accent,
      stroke: palette.ink,
      strokeWidth: 3,
    }),
    group(
      [
        rect(1500, 180, 330, 112, {
          fill: palette.accent,
          stroke: palette.ink,
          strokeWidth: 3,
        }),
        claimText("operator.confirm", 1528, 224, 0, {
          className: "display cover-label",
          fill: palette.ink,
        }),
        claimText("rust.adjust", 1528, 263, 1, {
          className: "mono cover-detail",
          fill: palette.ink,
        }),
      ].join(""),
      { dataClaim: "rust.adjust" },
    ),
    flow("rust.draft", "M1880 619H1728", "conditional"),
    group(
      [
        rect(1460, 588, 260, 62, {
          fill: palette.bg,
          stroke: palette.muted,
          strokeWidth: 1.5,
          strokeDasharray: "8 7",
          vectorEffect: "non-scaling-stroke",
        }),
        claimText("rust.draft", 1480, 613, 0, {
          className: "mono node-title",
        }),
        claimText("rust.draft", 1480, 638, 1, {
          className: "mono tiny",
        }),
      ].join(""),
      { dataClaim: "rust.draft" },
    ),
    claimText("meta.default", 460, 1240, 0, { className: "mono micro" }),
    line(460, 1265, 600, 1265, {
      stroke: palette.accent,
      strokeWidth: 3,
    }),
    claimText("meta.conditional", 650, 1240, 0, {
      className: "mono micro",
    }),
    line(650, 1265, 840, 1265, {
      stroke: palette.muted,
      strokeWidth: 2,
      strokeDasharray: "10 9",
    }),
    claimText("refresh.default", 1710, 1240, 0, {
      className: "mono micro",
      textAnchor: "end",
    }),
    claimText("refresh.default", 1710, 1267, 1, {
      className: "mono tiny",
      textAnchor: "end",
    }),
  ].join("");
}

function decrementArtwork() {
  const operator = isoSlab({
    x: 90,
    y: 350,
    width: 330,
    height: 760,
    depth: 24,
    claimId: "layer.operator",
    children: [
      layerHeader("layer.operator", 122, 402),
      nodeCard({
        claimId: "operator.scan",
        x: 122,
        y: 500,
        width: 265,
      }),
      nodeCard({
        claimId: "operator.review",
        x: 122,
        y: 660,
        width: 265,
      }),
      nodeCard({
        claimId: "operator.confirm",
        x: 122,
        y: 820,
        width: 265,
      }),
      flow("operator.scan", "M254 596V652"),
      flow("operator.review", "M254 756V812"),
    ].join(""),
  });

  const react = isoSlab({
    x: 500,
    y: 305,
    width: 460,
    height: 805,
    depth: 24,
    claimId: "layer.react",
    children: [
      layerHeader("layer.react", 532, 357),
      nodeCard({
        claimId: "search.gate",
        x: 532,
        y: 450,
        width: 390,
        height: 82,
      }),
      nodeCard({
        claimId: "search.exact",
        x: 532,
        y: 560,
        width: 185,
        height: 92,
      }),
      nodeCard({
        claimId: "search.fallback",
        x: 737,
        y: 560,
        width: 185,
        height: 92,
        mode: "conditional",
      }),
      nodeCard({
        claimId: "search.autoSelect",
        x: 532,
        y: 682,
        width: 390,
        height: 82,
      }),
      nodeCard({
        claimId: "hydrate.overlap",
        x: 532,
        y: 794,
        width: 185,
        height: 96,
      }),
      nodeCard({
        claimId: "hydrate.locations",
        x: 737,
        y: 794,
        width: 185,
        height: 96,
      }),
      nodeCard({
        claimId: "validation.stock",
        x: 532,
        y: 920,
        width: 390,
        height: 82,
      }),
      flow("search.exact", "M624 532V552"),
      flow("search.fallback", "M717 606H729", "conditional"),
      flow("search.autoSelect", "M624 652V674"),
      flow("search.autoSelect", "M829 652V674", "conditional"),
      flow("hydrate.overlap", "M727 723V784"),
      flow("hydrate.locations", "M717 842H729"),
      flow("validation.stock", "M727 890V912"),
    ].join(""),
  });

  const ipc = isoSlab({
    x: 1040,
    y: 260,
    width: 270,
    height: 850,
    depth: 14,
    claimId: "layer.ipc",
    fill: "#181811",
    accent: true,
    children: [
      layerHeader("layer.ipc", 1068, 312),
      nodeCard({
        claimId: "ipc.location",
        x: 1068,
        y: 540,
        width: 214,
        height: 110,
      }),
      nodeCard({
        claimId: "ipc.command",
        x: 1068,
        y: 790,
        width: 214,
        height: 132,
      }),
      flow("ipc.command", "M1175 650V780"),
    ].join(""),
  });

  const rust = isoSlab({
    x: 1390,
    y: 215,
    width: 440,
    height: 895,
    depth: 24,
    claimId: "layer.rust",
    children: [
      layerHeader("layer.rust", 1422, 267),
      nodeCard({
        claimId: "rust.adjust",
        x: 1422,
        y: 430,
        width: 376,
        height: 96,
      }),
      nodeCard({
        claimId: "rust.zeroCheck",
        x: 1422,
        y: 588,
        width: 376,
        height: 96,
      }),
      nodeCard({
        claimId: "rust.draft",
        x: 1422,
        y: 746,
        width: 376,
        height: 96,
        mode: "conditional",
      }),
      nodeCard({
        claimId: "rust.log",
        x: 1422,
        y: 904,
        width: 376,
        height: 96,
      }),
      flow("rust.zeroCheck", "M1610 526V578"),
      flow("rust.draft", "M1610 684V736", "conditional"),
      flow("rust.log", "M1610 842V894", "conditional"),
      flow("rust.log", "M1780 684V894"),
    ].join(""),
  });

  const services = isoSlab({
    x: 1910,
    y: 170,
    width: 400,
    height: 940,
    depth: 24,
    claimId: "layer.services",
    children: [
      layerHeader("layer.services", 1942, 222),
      nodeCard({
        claimId: "service.shopifyRead",
        x: 1942,
        y: 380,
        width: 336,
        height: 96,
      }),
      nodeCard({
        claimId: "service.shopifyWrite",
        x: 1942,
        y: 540,
        width: 336,
        height: 96,
      }),
      nodeCard({
        claimId: "service.firestore",
        x: 1942,
        y: 860,
        width: 336,
        height: 96,
      }),
      nodeCard({
        claimId: "refresh.default",
        x: 1942,
        y: 990,
        width: 336,
        height: 96,
      }),
    ].join(""),
  });

  return [
    claimBlock("document.decrement.title", 92, 92, {
      className: "display title",
    }, 70),
    claimText("meta.source", 2308, 80, 0, {
      className: "mono kicker",
      textAnchor: "end",
    }),
    operator,
    react,
    ipc,
    rust,
    services,
    flow("operator.scan", "M420 548H492"),
    flow("operator.confirm", "M420 868H470V961H524"),
    flow("validation.stock", "M922 961H1000V595H1060"),
    flow("ipc.command", "M1310 846H1382V478"),
    flow("service.shopifyRead", "M960 606H1018V190H1880V428H1902"),
    claimText("service.shopifyRead", 1050, 178, 1, {
      className: "mono tiny",
    }),
    flow(
      "service.shopifyHydrate",
      "M922 842H988V1130H1872V610H1902",
    ),
    claimText("service.shopifyHydrate", 1120, 1118, 0, {
      className: "mono tiny",
    }),
    flow("rust.adjust", "M1830 478H1902V588"),
    flow("rust.draft", "M1830 794H1902V588", "conditional"),
    flow("rust.log", "M1830 952H1902V908"),
    flow(
      "refresh.default",
      "M1942 1038H1866V1128H712V1010",
    ),
    warningMarker("meta.nonAtomic", 1868, 548),
    group(
      [
        rect(1470, 1150, 840, 112, {
          fill: palette.bg,
          stroke: palette.warning,
          strokeWidth: 1.5,
          strokeDasharray: "7 7",
          vectorEffect: "non-scaling-stroke",
        }),
        warningMarker("meta.nonAtomic", 1510, 1206),
        claimText("meta.nonAtomic", 1548, 1192, 0, {
          className: "mono warning-text",
        }),
        claimText("meta.nonAtomic", 1548, 1224, 1, {
          className: "mono node-detail",
        }),
      ].join(""),
      { dataClaim: "meta.nonAtomic" },
    ),
    claimText("meta.default", 92, 1288, 0, { className: "mono micro" }),
    line(92, 1312, 242, 1312, {
      stroke: palette.accent,
      strokeWidth: 3,
    }),
    claimText("meta.conditional", 290, 1288, 0, {
      className: "mono micro",
    }),
    line(290, 1312, 492, 1312, {
      stroke: palette.muted,
      strokeWidth: 2,
      strokeDasharray: "10 9",
    }),
  ].join("");
}

function recoveryArtwork() {
  const undoAssembly = isoSlab({
    x: 90,
    y: 280,
    width: 1030,
    height: 870,
    depth: 26,
    claimId: "recovery.undo.label",
    children: [
      claimText("recovery.undo.label", 130, 345, 0, {
        className: "mono layer-index",
      }),
      claimText("recovery.undo.label", 130, 395, 1, {
        className: "display layer-title",
      }),
      nodeCard({
        claimId: "recovery.undo.precheck",
        x: 130,
        y: 500,
        width: 380,
        height: 100,
      }),
      nodeCard({
        claimId: "recovery.undo.adjust",
        x: 610,
        y: 500,
        width: 460,
        height: 100,
      }),
      nodeCard({
        claimId: "recovery.undo.active",
        x: 130,
        y: 700,
        width: 380,
        height: 100,
        mode: "conditional",
      }),
      nodeCard({
        claimId: "recovery.undo.log",
        x: 610,
        y: 700,
        width: 460,
        height: 100,
      }),
      nodeCard({
        claimId: "recovery.undo.refresh",
        x: 130,
        y: 900,
        width: 940,
        height: 100,
      }),
      flow("recovery.undo.adjust", "M510 550H600"),
      flow("recovery.undo.active", "M840 600V650H320V690", "conditional"),
      flow("recovery.undo.log", "M840 600V690"),
      flow("recovery.undo.log", "M510 750H600", "conditional"),
      flow("recovery.undo.refresh", "M840 800V890"),
      flow("recovery.undo.refresh", "M320 800V890", "conditional"),
    ].join(""),
  });

  const transferAssembly = isoSlab({
    x: 1260,
    y: 280,
    width: 1050,
    height: 870,
    depth: 26,
    claimId: "recovery.transfer.label",
    children: [
      claimText("recovery.transfer.label", 1300, 345, 0, {
        className: "mono layer-index",
      }),
      claimText("recovery.transfer.label", 1300, 395, 1, {
        className: "display layer-title",
      }),
      nodeCard({
        claimId: "recovery.transfer.source",
        x: 1300,
        y: 500,
        width: 370,
        height: 110,
      }),
      nodeCard({
        claimId: "recovery.transfer.destination",
        x: 1900,
        y: 500,
        width: 370,
        height: 110,
      }),
      nodeCard({
        claimId: "recovery.transfer.rollback",
        x: 1475,
        y: 700,
        width: 620,
        height: 100,
        mode: "conditional",
      }),
      nodeCard({
        claimId: "recovery.transfer.rollbackFailure",
        x: 1300,
        y: 865,
        width: 370,
        height: 100,
        mode: "warning",
      }),
      nodeCard({
        claimId: "recovery.transfer.logs",
        x: 1900,
        y: 865,
        width: 370,
        height: 100,
      }),
      nodeCard({
        claimId: "recovery.transfer.undo",
        x: 1475,
        y: 1035,
        width: 620,
        height: 80,
        mode: "conditional",
      }),
      flow("recovery.transfer.destination", "M1670 555H1890"),
      flow(
        "recovery.transfer.rollback",
        "M2085 610V650H1785V690",
        "conditional",
      ),
      flow(
        "recovery.transfer.rollback",
        "M1475 750H1410V620H1485",
        "conditional",
      ),
      flow(
        "recovery.transfer.rollbackFailure",
        "M1785 800V830H1485V855",
        "warning",
      ),
      flow("recovery.transfer.logs", "M2085 610V855"),
      flow(
        "recovery.transfer.undo",
        "M2085 965V1025H1785",
        "conditional",
      ),
    ].join(""),
  });

  return [
    claimBlock("document.recovery.title", 92, 92, {
      className: "display title",
    }, 70),
    claimText("meta.source", 2308, 80, 0, {
      className: "mono kicker",
      textAnchor: "end",
    }),
    undoAssembly,
    transferAssembly,
    group(
      [
        rect(90, 1200, 1030, 82, {
          fill: palette.bg,
          stroke: palette.line,
          strokeWidth: 1,
        }),
        claimText("meta.nonAtomic", 126, 1235, 0, {
          className: "mono warning-text",
        }),
        claimText("meta.nonAtomic", 126, 1262, 1, {
          className: "mono node-detail",
        }),
      ].join(""),
      { dataClaim: "meta.nonAtomic" },
    ),
    group(
      [
        rect(1260, 1200, 1050, 82, {
          fill: palette.bg,
          stroke: palette.warning,
          strokeWidth: 1.5,
          strokeDasharray: "7 7",
        }),
        warningMarker("recovery.transfer.logWarning", 1300, 1241),
        claimText("recovery.transfer.logWarning", 1338, 1234, 0, {
          className: "mono warning-text",
        }),
        claimText("recovery.transfer.logWarning", 1338, 1261, 1, {
          className: "mono node-detail",
        }),
      ].join(""),
      { dataClaim: "recovery.transfer.logWarning" },
    ),
    claimText("meta.default", 92, 1320, 0, { className: "mono tiny" }),
    claimText("meta.conditional", 360, 1320, 0, {
      className: "mono tiny",
    }),
  ].join("");
}

const outputs = [
  {
    filename: "inventory-cover-exploded.svg",
    content: svgDocument({
      prefix: "inventory-cover",
      titleId: "document.cover.title",
      descriptionId: "document.cover.desc",
      content: coverArtwork(),
    }),
  },
  {
    filename: "inventory-decrement-exploded.svg",
    content: svgDocument({
      prefix: "inventory-decrement",
      titleId: "document.decrement.title",
      descriptionId: "document.decrement.desc",
      content: decrementArtwork(),
    }),
  },
  {
    filename: "inventory-recovery-exploded.svg",
    content: svgDocument({
      prefix: "inventory-recovery",
      titleId: "document.recovery.title",
      descriptionId: "document.recovery.desc",
      content: recoveryArtwork(),
    }),
  },
];

await mkdir(outputDirectory, { recursive: true });
await Promise.all(
  outputs.map(({ filename, content }) =>
    writeFile(path.join(outputDirectory, filename), `${content}\n`, "utf8"),
  ),
);

for (const { filename } of outputs) {
  process.stdout.write(`${path.relative(process.cwd(), path.join(outputDirectory, filename))}\n`);
}
