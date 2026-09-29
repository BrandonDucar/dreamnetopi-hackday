# 🐙 Dreamnetiopi — Your Business, Coordinated

[![Band Protocol](https://img.shields.io/badge/Band-Interaction_Layer-6366f1?style=for-the-badge&logo=band&logoColor=white)](https://band.ai)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Claude_3.5_&_Llama_3-7c3aed?style=for-the-badge)](https://openrouter.ai)
[![Neo4j](https://img.shields.io/badge/Neo4j-Causal_Graph-008cc1?style=for-the-badge&logo=neo4j&logoColor=white)](https://neo4j.com)
[![DuploCloud](https://img.shields.io/badge/DuploCloud-DevKit_Human_Gate-00f0ff?style=for-the-badge)](https://duplocloud.com)
[![The AI Conference 2026](https://img.shields.io/badge/The_AI_Conference-Hack_Day_2026-ff0077?style=for-the-badge)](https://aiconference.com)

> **"When plans change, your whole team knows what happens next."**  
> AI operations crew and disruption rehearsal simulator for small food makers, retail pop-ups, and recurring event operators.  
> Grounded in real business data from **Coastal Freeze Co.** (Florida artisan freeze-dried snack company).

---

## 🎬 Live Walkthrough Demo

![Dreamnetiopi Animated Demo](media/demo.webp)

> 📹 **High-Definition Video Walkthrough:** [`media/walkthrough.mp4`](media/walkthrough.mp4)

---

## 🏆 The 10-Minute Proof (What Actually Does Work)

Aligned strictly with the hackathon scoring criteria: **tools must do work, not sit in a README.**

### 1. Band Interaction Layer (Room: `pier48-rush`)
A live multi-peer coordination room connecting `@founder`, `@offer-desk`, `@campaign-desk`, and `@neo4j-tracer`.
- **Replay the stream:**
  ```bash
  node scripts/run_band_proof.js
  ```
- **Prompt:**
  ```
  @offer-desk Out of strawberries for Pier 48 rush. Push mango and blue raspberry.
  Rewrite offer. Do not publish. @mention @campaign-desk then the owner for approval.
  ```

### 2. OpenRouter (Unified Model Engine)
All LLM prompts route through OpenRouter:
- `@offer-desk`: `openrouter/anthropic/claude-3.5-sonnet` (recalculates bundle margins to 76.2%)
- `@campaign-desk`: `openrouter/meta-llama/llama-3.1-70b-instruct` (stages 5 platform drafts in Postiz)
- **Verified Receipts:** `gen-or-pier48-offer-99214` ($0.0028) & `gen-or-pier48-camp-99215` ($0.00068).

### 3. Neo4j Knowledge Graph (Causal Dependency Engine)
Eliminates hallucination in supply-chain cascades:
```cypher
MATCH (s:SKU {name:'strawberry', stock:0})-[:SUBSTITUTE]->(m:SKU {name:'mango'})
RETURN s, m
```
- Traverses 18 nodes: protects 20 online customer preorders, zeroes market strawberries, activates 50 bags of Swicy Mango Tajín.

### 4. DuploCloud (Human Gate Host)
- **Live Approval URL:** `http://localhost:4242/approve`
- Simple, high-clarity human-in-the-loop gate: **"Approve mango / blue raspberry post?"** [YES / NO]
- Owner clicks YES → commits consequence diff → triggers Postiz 5-platform dispatch & updates kitchen sealing trays.

---

## 📦 Wholesale Reorder Desk (Solo Food Maker Copilot)

Beyond weekend market chaos, Dreamnetiopi automates recurring B2B wholesale orders:
- **Input:** Paste a messy retailer email or text inquiry (*"Need 24 bags of Swicy Mango and 20 Galaxy Gelatin by Friday"*).
- **Engine:** Checks Coastal Freeze SKUs, confirms inventory availability, enforces margin floors (74.2% blended margin).
- **Output:** Generates a professional, owner-approved B2B purchase quote in under 60 seconds with 1-click Stripe/Shopify draft order dispatch.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph SENSORS ["1. Event Ingestion & Sensors"]
        Plaud["Plaud AI Voice Brief"]
        Brave["Brave Local Weather/Crowd API"]
        Sim["Similarweb Trend Intelligence"]
    end

    subgraph BRAIN ["2. Super Clawoctopus Coordination Engine"]
        Band["Band Interaction Layer (Room: pier48-rush)"]
        Neo["Neo4j Knowledge Graph (18 Nodes)"]
        OR["OpenRouter (Claude 3.5 + Llama 3.1)"]
    end

    subgraph HUMAN ["3. Human-in-the-Loop Governance"]
        Duplo["DuploCloud Approval Gate (/approve)"]
        Owner["Food Maker 1-Click Signature"]
    end

    subgraph ACTUATORS ["4. Omnichannel Dispatch"]
        Postiz["Postiz 5-Platform Broadcast"]
        Shopify["Shopify + Square Stock Lock (Merge.dev)"]
        Kitchen["Kitchen Packaging Tray Re-Route"]
    end

    SENSORS --> BRAIN
    BRAIN --> HUMAN
    HUMAN --> ACTUATORS
```

---

## 🚀 Quickstart & Running Locally

```bash
# Clone the repository
git clone https://github.com/BrandonDucar/dreamnetopi-hackday.git
cd dreamnetopi-hackday

# Start the coordination server
npm start
# -> Running live at http://localhost:4242

# Run the Band 10-Minute Proof in terminal
node scripts/run_band_proof.js

# Submit developer feedback to earn hackathon points
bash scripts/give_developer_feedback.sh
```

---

## 📋 Hackathon Project Form Information

- **Project Name:** Dreamnetiopi
- **Tagline:** Your business, coordinated. AI operations crew for small merchants and recurring events.
- **Tools Used (What actually did work):** `Band`, `OpenRouter`, `Neo4j`, `DuploCloud`
- **Demo URL:** `http://localhost:4242`
- **DuploCloud Human Gate:** `http://localhost:4242/approve`
- **GitHub Repository:** `https://github.com/BrandonDucar/dreamnetopi-hackday`

---

## 👥 Team
- **Brandon Ducar** — Founder & Food Maker, Coastal Freeze Co. / DreamNet Lead
