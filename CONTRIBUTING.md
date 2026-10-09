# Contributing to dreamnetopi-hackday

Start with the README's implementation boundaries. Please propose a bounded
change and include a reproducible example, the version tested, and observed
results. A successful test is not a provider receipt or production certification.

## Useful contributions

- Explicit simulation labels in API responses, UI, and exported artifacts.
- Tests that reject synthetic provider IDs as real external execution evidence.
- Reproducible compiler benchmarks with both inputs and baseline methodology.

## Before opening a PR

1. Keep changes focused; explain the failure or user need.
2. Inspect package scripts before running them. Never use production credentials
   or publish/pay/deploy as part of a test.
3. Include the exact checks you ran and their results. State anything untested.
4. Preserve provenance, upstream attribution, license terms, and human gates.
5. Do not include customer data, location histories, private conversations,
   tokens, or filesystem paths that reveal another person's environment.

The `proof:*` script names do not certify their results. Review scripts and effects before execution; use an isolated development environment.

Report bugs through this repository's Issues tab. For a suspected secret leak,
do not paste the secret into an issue; describe the affected surface without
disclosing sensitive values.
