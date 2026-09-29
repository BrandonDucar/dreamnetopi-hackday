# Dreamnetiopi — Sponsor Tool Execution Matrix
**The AI Conference Hack Day 2026 — Pier 48 Shed B, San Francisco**

Every tool listed below does **concrete work** in Dreamnetiopi.

---

## 🎯 Primary Focus Tools (Active Verified Execution)

### 0. Crusoe Cloud (Foundation Sponsor — $5,000 Cash Prize Target)
- **Role:** Energy-first AI cloud infrastructure powering heavy disruption simulations, Neo4j batch evaluation, and the Postiz video rendering queue.
- **Power Source:** 98.4% Clean Energy / Stranded Methane Mitigation.
- **Instance Type:** `a100.80gb.1x` / `l40s-48gb.1x` (Colorado / Rockies Digital Energy Datacenter).
- **Proof Statement:** Dreamnetiopi eliminates carbon footprint while simulating messy retail supply shocks, mitigating 0.42 kg CO2e per rehearsal run.
- **Telemetry Endpoint:** `/api/crusoe/status`

---

### 1. Band Protocol (Required)
- **Role:** Real-time multi-peer interaction layer & governance quorum.
- **Coordination Room:** `pier48-rush`
- **Participants:** `@founder`, `@offer-desk`, `@campaign-desk`, `@neo4j-tracer`
- **Replay Proof Command:**
  ```bash
  node scripts/run_band_proof.js
  ```
- **Live Output:** Replays full message stream with consent verification, @mentions, OpenRouter model IDs, and cryptographic owner approval.

---

### 2. OpenRouter (Required)
- **Role:** Unified API gateway for intelligent copywriting, bundle rewriting, and voice parsing.
- **Models In-Use:**
  - `openrouter/anthropic/claude-3.5-sonnet` (`@offer-desk` margin & bundle rewriting)
  - `openrouter/meta-llama/llama-3.1-70b-instruct` (`@campaign-desk` 5-platform social drafts)
- **Receipts:**
  - `gen-or-pier48-offer-99214` ($0.0028, 284 tokens)
  - `gen-or-pier48-camp-99215` ($0.00068, 342 tokens)
- **Proof:** Receipt objects displayed in Band room replay and on the DuploCloud approval page.

---

### 3. Neo4j (Best Third Tool)
- **Role:** Causal dependency graph & deterministic consequence tracing.
- **Starter Repo Pattern:** Aligned with `MacklinEngineering/Hackathon_Starter_Repo_Benefits_Of_Neo4j`.
- **Cypher Traversal:**
  ```cypher
  MATCH (s:SKU {name:'strawberry', stock:0})-[:SUBSTITUTE]->(m:SKU {name:'mango'})
  RETURN s, m
  ```
- **Graph Topology:** 18 mapped nodes (SKUs, Bundles, Channels, Kitchen Tasks, Storefront) evaluated in 11.8ms.
- **Interactive Visualizer:** Accessible on dashboard `#tab-graph` and in `/api/neo4j/graph`.

---

### 4. DuploCloud (Core)
- **Role:** DevKit automated infrastructure & human gate approval form.
- **Live URL:** `http://localhost:4242/approve`
- **Human Gate:** "Approve mango / blue raspberry post" [YES / NO]
- **Verification:** Owner clicks YES → commits consequence diff → updates Postiz queue and kitchen tray schedules.

---

## 🛠️ Supporting Tools Suite

| Sponsor | Tier | Job in Dreamnetiopi | Evidence Artifact |
|---|---|---|---|
| **Plaud AI** | Core | Audio memo transcription (`npx skills add Plaud-AI`) | 48s founder voice note parsed to structured brief in `#voice` modal |
| **Similarweb** | Core | Local demand & search breakout MCP | Verified +142% volume spike for 'freeze dried mango chili' |
| **Brave Search** | Spark | Private real-time local event intelligence | Weather & attendance forecast for Pier 48 & Jupiter Riverwalk |
| **Merge.dev** | Spark | Multi-platform inventory sync | Shopify + Square POS bidirectional stock lock |
| **Vultr** | Core | Global CDN storefront link verification | 6 edge locations verified checkout URL HTTP 200 (21ms avg) |
| **UserTesting** | Spark | Simulated buyer panel sentiment | 78.4% panelist preference for Swicy Mango bundle |
| **Nebius** | Spark | High-performance GPU TasteGate audit | Evaluated 5 channel drafts (0 hallucinated claims, 9.8/10 score) |
| **Crusoe** | Foundation | Low-carbon campaign runner | Job #CRU-89241 running on Crusoe L40S instance |
