"use client";

import { useState } from "react";
import benchmarkManifest from "@/content/inventoryWorkflowBenchmark.json";
import styles from "./InventoryCaseStudy.module.css";

type WorkflowId = "custom" | "shopify";

type WorkflowStage = {
  label: string;
  operatorAction: string;
  systemWork: string[];
  source: string;
};

type Workflow = {
  id: WorkflowId;
  label: string;
  shortLabel: string;
  stages: WorkflowStage[];
};

type BenchmarkManifest = {
  evidenceStatus: string;
  approvedForPublication: boolean;
  measurementProtocol: {
    minimumRecordedTrialsPerWorkflow: number;
  };
  rawSamplesSeconds: {
    customInventoryApp: number[];
    shopifyAdmin: number[];
  };
};

const workflows: Record<WorkflowId, Workflow> = {
  custom: {
    id: "custom",
    label: "Custom inventory app",
    shortLabel: "Custom app",
    stages: [
      {
        label: "Find the SKU",
        operatorAction: "Scan or type the known SKU.",
        systemWork: [
          "Wait for at least two characters and the 300 ms debounce.",
          "Run the exact-SKU Shopify GraphQL query first.",
          "On a miss, run the title-prefix GraphQL fallback; auto-select an exact or sole result.",
        ],
        source: "SearchBar.searchProducts",
      },
      {
        label: "Hydrate location stock",
        operatorAction:
          "Review the matched variant and the selected primary location.",
        systemWork: [
          "Fetch the selected product through Shopify REST, then start the REST two-location inventory request.",
          "Process the product while inventory is in flight.",
          "Map primary and secondary quantities and preserve the SKU-matched variant.",
        ],
        source: "HomePage.handleSearchSelect",
      },
      {
        label: "Confirm one unit",
        operatorAction:
          "Select the variant and confirm a decrement of one available unit.",
        systemWork: [
          "Block the action when available stock is zero or negative.",
          "Resolve the configured primary location ID.",
          "Cross the Tauri invoke boundary into the Rust command.",
        ],
        source: "HomePage.handleDecreaseInventory",
      },
      {
        label: "Persist and verify",
        operatorAction: "Wait for the persisted success state.",
        systemWork: [
          "Send Shopify REST available_adjustment: -1.",
          "Check all variants and locations; conditionally attempt product status → draft.",
          "Write the Firestore Rettifica log, refresh logs and product stock, and remember the undo target.",
        ],
        source:
          "decrease_inventory_with_logging + HomePage.handleDecreaseInventory",
      },
    ],
  },
  shopify: {
    id: "shopify",
    label: "Shopify Admin",
    shortLabel: "Shopify Admin",
    stages: [
      {
        label: "Find the SKU",
        operatorAction:
          "Open Products → Inventory and find the known SKU or variant.",
        systemWork: [
          "Present the inventory page and its location-scoped product rows.",
          "The SKU lookup is included here so both lanes begin with the same target-identification task.",
        ],
        source:
          "Shopify Help / Remove inventory, plus matched-task SKU lookup",
      },
      {
        label: "Choose location and field",
        operatorAction:
          "Select the location, then click the Available or On hand quantity.",
        systemWork: [
          "Open the quantity editor for that row and inventory state.",
        ],
        source: "Shopify Help / Remove inventory / steps 1–2",
      },
      {
        label: "Define the removal",
        operatorAction:
          "Choose Adjust by, enter one unit, select the store location as origin, and select Inventory removal as destination.",
        systemWork: [
          "Hold the adjustment inputs and any optional reason in the edit flow.",
        ],
        source: "Shopify Help / Remove inventory / steps 3–7",
      },
      {
        label: "Queue and review",
        operatorAction:
          "Click the check icon and review the pending table-cell change.",
        systemWork: [
          "Mark the change as pending.",
          "Discard the pending change if the page is left before Save.",
        ],
        source:
          "Shopify Help / Updating inventory quantities and Remove inventory / steps 8–9",
      },
      {
        label: "Save",
        operatorAction: "Click Save and wait for the applied state.",
        systemWork: [
          "Apply the pending adjustment and record the inventory update in Shopify adjustment history.",
        ],
        source:
          "Shopify Help / Adjusting inventory quantities / Remove inventory / step 10",
      },
    ],
  },
};

const benchmark = benchmarkManifest as BenchmarkManifest;

function median(values: number[]) {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function range(values: number[]) {
  return [Math.min(...values), Math.max(...values)] as const;
}

function formatSeconds(value: number) {
  return `${value.toFixed(1)} s`;
}

function getApprovedMeasurement() {
  const customSamples = benchmark.rawSamplesSeconds.customInventoryApp;
  const shopifySamples = benchmark.rawSamplesSeconds.shopifyAdmin;
  const minimumTrials =
    benchmark.measurementProtocol.minimumRecordedTrialsPerWorkflow;
  const validSamples = [...customSamples, ...shopifySamples].every(
    (sample) => Number.isFinite(sample) && sample > 0,
  );

  if (
    benchmark.evidenceStatus !== "measured-and-approved" ||
    !benchmark.approvedForPublication ||
    customSamples.length < minimumTrials ||
    shopifySamples.length < minimumTrials ||
    !validSamples
  ) {
    return null;
  }

  return {
    customMedian: median(customSamples),
    customRange: range(customSamples),
    shopifyMedian: median(shopifySamples),
    shopifyRange: range(shopifySamples),
  };
}

const approvedMeasurement = getApprovedMeasurement();

export function InventoryWorkflowComparison() {
  const [workflowId, setWorkflowId] = useState<WorkflowId>("custom");
  const [stageIndex, setStageIndex] = useState(0);
  const workflow = workflows[workflowId];
  const stage = workflow.stages[stageIndex];
  const measurement = approvedMeasurement;

  function selectWorkflow(nextWorkflowId: WorkflowId) {
    setWorkflowId(nextWorkflowId);
    setStageIndex(0);
  }

  function selectStage(nextStageIndex: number) {
    setStageIndex(nextStageIndex);
  }

  const measurementSummary = measurement
    ? `Approved single-operator sample: custom app median ${formatSeconds(
        measurement.customMedian,
      )}; Shopify Admin median ${formatSeconds(measurement.shopifyMedian)}.`
    : "No approved timing result.";
  const liveSummary = `${workflow.label}. Stage ${stageIndex + 1} of ${
    workflow.stages.length
  }: ${stage.label}. Operator action: ${stage.operatorAction} System work: ${stage.systemWork.join(
    " ",
  )} ${measurementSummary}`;

  return (
    <div className={styles.comparison}>
      <div className={styles.comparisonHeader}>
        <div>
          <p className={styles.visualKicker}>Interactive workflow explorer</p>
          <h3>Walk the human step. Inspect the system work.</h3>
        </div>
        <p className={styles.evidenceFlag}>
          {measurement
            ? "Measured single-operator sample"
            : "Workflow comparison / no timing result"}
        </p>
      </div>

      <dl className={styles.taskContract} aria-label="Matched task contract">
        <div>
          <dt>Start</dt>
          <dd>Both tools open and authenticated at their inventory entry screen.</dd>
        </div>
        <div>
          <dt>Input</dt>
          <dd>Known SKU, chosen location, available quantity greater than one.</dd>
        </div>
        <div>
          <dt>Operation</dt>
          <dd>Decrement exactly one available unit.</dd>
        </div>
        <div>
          <dt>End</dt>
          <dd>Persisted success or confirmation is visible.</dd>
        </div>
      </dl>

      <div className={styles.workflowControls}>
        <div>
          <span className={styles.controlLabel}>Workflow</span>
          <div
            className={styles.segmented}
            role="group"
            aria-label="Choose workflow"
          >
            {(Object.keys(workflows) as WorkflowId[]).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={workflowId === id}
                onClick={() => selectWorkflow(id)}
              >
                {workflows[id].label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.stepButtons}>
          <button
            type="button"
            disabled={stageIndex === 0}
            onClick={() => selectStage(stageIndex - 1)}
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => selectStage(0)}
            disabled={stageIndex === 0}
          >
            Reset
          </button>
          <button
            type="button"
            disabled={stageIndex === workflow.stages.length - 1}
            onClick={() => selectStage(stageIndex + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      <ol
        className={styles.stageRail}
        aria-label={`${workflow.label} stages`}
      >
        {workflow.stages.map((workflowStage, index) => (
          <li key={workflowStage.label}>
            <button
              type="button"
              aria-pressed={stageIndex === index}
              aria-current={stageIndex === index ? "step" : undefined}
              onClick={() => selectStage(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {workflowStage.label}
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.workflowLanes}>
        <section className={styles.workflowLane} data-lane="operator">
          <header>
            <p>Human action</p>
            <span>
              {String(stageIndex + 1).padStart(2, "0")} /{" "}
              {String(workflow.stages.length).padStart(2, "0")}
            </span>
          </header>
          <h4>{stage.label}</h4>
          <p>{stage.operatorAction}</p>
        </section>

        <section className={styles.workflowLane} data-lane="system">
          <header>
            <p>Automated system work</p>
            <span>{workflow.shortLabel}</span>
          </header>
          <h4>Work behind this stage</h4>
          <ul>
            {stage.systemWork.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.stageSource}>Source / {stage.source}</p>
        </section>
      </div>

      {measurement ? (
        <div
          className={styles.measurementReadout}
          aria-label="Approved workflow timing sample"
        >
          <dl>
            <div>
              <dt>Custom app median</dt>
              <dd>{formatSeconds(measurement.customMedian)}</dd>
              <dd>
                Range {formatSeconds(measurement.customRange[0])}–
                {formatSeconds(measurement.customRange[1])}
              </dd>
            </div>
            <div>
              <dt>Shopify Admin median</dt>
              <dd>{formatSeconds(measurement.shopifyMedian)}</dd>
              <dd>
                Range {formatSeconds(measurement.shopifyRange[0])}–
                {formatSeconds(measurement.shopifyRange[1])}
              </dd>
            </div>
          </dl>
          <p>
            Single-operator workflow sample under the environment and protocol
            recorded in the evidence manifest; not a universal performance
            benchmark.
          </p>
        </div>
      ) : (
        <p className={styles.unmeasuredNote}>
          No matched timing study is attached. This explorer compares sourced
          workflow stages only; it does not claim elapsed-time savings or that
          either path is universally faster.
        </p>
      )}

      <output
        className={styles.srOnly}
        aria-live="polite"
        aria-atomic="true"
      >
        {liveSummary}
      </output>
    </div>
  );
}
