#!/usr/bin/env node
// project-crew orchestrator — reads crew.js, builds DAG, outputs execution plan
// Usage: node orchestrator.js <crew.js path>

const fs = require('fs');
const path = require('path');

// ── DAG Core ──

function buildDAG(steps) {
  const nodes = new Map();
  const edges = [];
  const outputMap = new Map();

  for (const step of steps) {
    nodes.set(step.id, step);
    if (step.output) {
      const outputs = Array.isArray(step.output) ? step.output : [step.output];
      for (const f of outputs) outputMap.set(f, step.id);
    }
  }

  for (const step of steps) {
    if (!step.input) continue;
    const inputs = Array.isArray(step.input) ? step.input : [step.input];
    for (const f of inputs) {
      const from = outputMap.get(f);
      if (from && from !== step.id) edges.push([from, step.id]);
    }
  }

  return { nodes, edges };
}

function detectCycle(nodes, edges) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map([...nodes.keys()].map(k => [k, WHITE]));
  function dfs(node) {
    color.set(node, GRAY);
    for (const [from, to] of edges) {
      if (from !== node) continue;
      if (color.get(to) === GRAY) return true;
      if (color.get(to) === WHITE && dfs(to)) return true;
    }
    color.set(node, BLACK);
    return false;
  }
  return [...nodes.keys()].some(id => color.get(id) === WHITE && dfs(id));
}

function topologicalSort(nodes, edges) {
  const inDegree = new Map([...nodes.keys()].map(k => [k, 0]));
  for (const [, to] of edges) inDegree.set(to, inDegree.get(to) + 1);
  const queue = [...inDegree.entries()].filter(([, d]) => d === 0).map(([id]) => id);
  const layers = [];
  while (queue.length) {
    layers.push([...queue]);
    const next = [];
    for (const id of queue) {
      for (const [from, to] of edges) {
        if (from !== id) continue;
        inDegree.set(to, inDegree.get(to) - 1);
        if (inDegree.get(to) === 0) next.push(to);
      }
    }
    queue.length = 0;
    queue.push(...next);
  }
  return layers;
}

function countInDegree(nodes, edges) {
  const deg = new Map([...nodes.keys()].map(k => [k, 0]));
  for (const [, to] of edges) deg.set(to, deg.get(to) + 1);
  return deg;
}

function countOutDegree(nodes, edges) {
  const deg = new Map([...nodes.keys()].map(k => [k, 0]));
  for (const [from] of edges) deg.set(from, deg.get(from) + 1);
  return deg;
}

function inferMode(steps, edges, explicitMode) {
  if (explicitMode) return explicitMode;
  const { nodes } = buildDAG(steps);
  if (steps.some(s => s.await === 'human')) return 'approval';
  if (detectCycle(nodes, edges)) return 'event-loop';
  if (steps.some(s => s.loop)) return 'event-loop';

  const layers = topologicalSort(nodes, edges);
  const inDeg = countInDegree(nodes, edges);
  const outDeg = countOutDegree(nodes, edges);
  const startNodes = [...inDeg.entries()].filter(([, d]) => d === 0).length;
  const mergeNodes = [...inDeg.entries()].filter(([, d]) => d > 1).length;
  const forkNodes = [...outDeg.entries()].filter(([, d]) => d > 1).length;

  if (steps.length === layers.length && steps.length > 1) return 'pipeline';
  if ((startNodes === 1 && forkNodes > 0 && mergeNodes === 0) ||
      (startNodes > 1 && mergeNodes === 0 && forkNodes === 0)) return 'fan-out';
  if (mergeNodes > 0 && forkNodes === 0) return 'map-reduce';
  return 'dag';
}

// ── Retry / Fallback / Log ──

function parseRetry(step) {
  if (!step.retry) return { max: 0, delay: 0 };
  if (typeof step.retry === 'number') return { max: step.retry, delay: 3000 };
  return { max: step.retry.max || 3, delay: step.retry.delay || 5000 };
}

function parseFallback(step) {
  return step.fallback || null;
}

// ── Execution Plan Generator ──

function generatePlan(crewPath) {
  const crewDef = require(path.resolve(crewPath));
  const steps = crewDef.steps || [];
  if (!steps.length) {
    return { project: crewDef.name, error: "No steps defined" };
  }

  const { nodes, edges } = buildDAG(steps);
  const mode = inferMode(steps, edges, crewDef.mode);
  const layers = topologicalSort(nodes, edges);

  // Build dependency map
  const deps = {};
  for (const step of steps) deps[step.id] = [];
  for (const [from, to] of edges) deps[to].push(from);

  // Build execution plan
  const executionPlan = layers.map((layer, i) => ({
    layer: i,
    steps: layer.map(id => {
      const step = nodes.get(id);
      const stepInfo = { id };
      if (step.skill) stepInfo.skill = step.skill;
      if (step.await) stepInfo.await = step.await;
      const retry = parseRetry(step);
      if (retry.max > 0) stepInfo.retry = retry;
      const fallback = parseFallback(step);
      if (fallback) stepInfo.fallback = fallback;
      return stepInfo;
    }),
    mode: i === 0 ? 'start' : mode,
  }));

  // Build step configs for each step (retry, fallback)
  const stepConfigs = {};
  for (const step of steps) {
    const retry = parseRetry(step);
    const fallback = parseFallback(step);
    if (retry.max > 0 || fallback) {
      stepConfigs[step.id] = {};
      if (retry.max > 0) stepConfigs[step.id].retry = retry;
      if (fallback) stepConfigs[step.id].fallback = fallback;
    }
  }

  return {
    project: crewDef.name,
    workdir: crewDef.workdir || `/tmp/crew-${crewDef.name}`,
    inferredMode: mode,
    executionPlan,
    dependencies: deps,
    stepConfigs: Object.keys(stepConfigs).length > 0 ? stepConfigs : undefined,
    logFormat: {
      description: "Per-step execution log entry",
      schema: {
        timestamp: "ISO8601",
        project: "string",
        step: "string",
        status: "success|failed|retrying|fallback",
        duration: "ms",
        tokens: "number (estimated)",
        output: "string (file path or null)",
      },
    },
  };
}

// ── CLI ──

const crewPath = process.argv[2];
if (!crewPath) {
  console.error("Usage: node orchestrator.js <crew.js path>");
  process.exit(1);
}

try {
  const plan = generatePlan(crewPath);
  console.log(JSON.stringify(plan, null, 2));
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
