# Dreamnetiopi

**A merchant-operations rehearsal prototype: turn a disruption into a reviewed response.**

[Project homepage](https://brandonducar.github.io/BrandonDucar/projects/dreamnetopi-hackday/) | [Contribute](CONTRIBUTING.md)

Built around small food-maker and event-operator scenarios inspired by Coastal
Freeze Co. This public repository explores inventory substitutions, work queues,
owner approval, and reusable playbooks. It is not a production control plane for
a real store, kitchen, payment account, or cloud cluster.

## Prototype, Not Provider Proof

The repository contains preloaded business state and simulated integrations.
Code-generated IDs, hashes, timestamps, and status labels are not independent
provider receipts. A browser demo or successful script does not prove an external
action occurred.

| Area | What this repository establishes |
| --- | --- |
| Merchant dashboard | A rehearsal interface backed by example operational state |
| Coordination and approval | Prototype flows to evaluate before granting real authority |
| Compiler/playbook concept | A design for reducing repeated reasoning; no independently established token, cost, or latency savings |
| Sponsor integrations | Example adapters and simulations; inspect each before supplying credentials |
| Cloud telemetry | Not independently verified cluster, energy, carbon, or GPU measurements |
| Commerce/social actions | No assertion that Shopify, Stripe, Postiz, or kitchen changes were executed |
| ProofStack | Demo output alone does not establish durable external write/read verification |

Earlier README copy presented cost, latency, margin, cloud telemetry, and
provider-receipt claims without a reproducible evidence bundle. Those claims
have been removed. This project makes no food-safety certification, FDA
compliance, zero-carbon, profitability, or hallucination-elimination guarantee.
Some prototype UI and script labels still require the same cleanup; treat them
as simulation output until independently verified.

## Inspect And Run Locally

```bash
git clone https://github.com/BrandonDucar/dreamnetopi-hackday.git
cd dreamnetopi-hackday
# Read server.js and integrations/ before running or adding credentials.
npm start
```

The server uses port 4242 by default. Open <http://localhost:4242> on an isolated
development machine. The current `server.listen(PORT)` does not explicitly bind
to loopback; do not expose it to an untrusted network or deploy it as a secure
multi-user service. Do not add production credentials to a rehearsal.

`npm test` invokes `scripts/test_system_health.js`. Scripts named `proof:*` are
not a certification process. Review their effects and configuration before
running them, and classify every artifact by its actual origin.

## The Intended Loop

```text
Observed disruption -> typed event -> candidate response -> owner review
  -> separately authorized execution -> independent receipt -> reusable lesson
```

The last three transitions require real integrations and evidence. Simulating
them is useful for testing policy, but cannot substitute for execution or revenue.

## Production Acceptance Criteria

1. Label synthetic data at every API, UI, and export boundary.
2. Replace desired adapters with scoped, authenticated provider integrations.
3. Test rejection, retries, idempotency, ambiguous outcomes, and revocation.
4. Capture an external action ID and independent readback for each real effect.
5. Benchmark compiler savings with reproducible inputs and a baseline.
6. Harden HTTP access, state durability, authorization, and deployment configuration.

These are requirements, not statements that the work is complete.

## Team And Rights

Brandon Ducar / DreamNet. Created for The AI Conference Hack Day 2026.
Sponsor names describe integration targets, not endorsements or prize awards.
See [LICENSE](LICENSE) for the MIT terms already declared in package metadata.
Media and third-party dependencies retain their own rights.
