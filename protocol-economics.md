# AiFinPay Protocol Economics

**Effective date:** 14 August 2026  
**Status:** Founder-approved canonical product and engineering rule  
**Jira source of truth:** AIFINP-122

This document defines the current fee model for AiFinPay payment routes. It supersedes older examples that used a fee-bearing AIFP-2/x402 route or a `100/1` merchant split.

## AIFP-2 — x402 / agent payments

AiFinPay charges **0% protocol fee** on AIFP-2 payments.

- `treasuryBps = 0`
- `creatorBps = 0`
- the agent pays the quoted merchant/provider amount;
- the agent also pays the blockchain network transaction cost (gas) when the selected rail requires it;
- gas is a network cost, not AiFinPay revenue and not an AiFinPay protocol fee;
- no treasury, creator, reseller, or platform percentage may be silently added to the AIFP-2 route.

AIFP-2 routing must fail closed if the selected payment target is fee-bearing.

## AIFP-1 — merchant AI-traffic monetization

AiFinPay charges **exactly 1% protocol fee** on successful AIFP-1 merchant monetization transactions.

- `treasuryBps = 100`
- `creatorBps = 0`
- AiFinPay treasury: 1%
- merchant: 99% before external network/settlement costs
- creator fee: 0%

There is no additional `0.01%` creator leg in the canonical AIFP-1 profile.

## 5% contract cap

A contract may enforce a combined fee cap of **5%** as a security guardrail. The cap limits owner/configuration authority; it is **not** a business fee, default fee, target rate, or permission for a production route to charge 5%.

Canonical production profiles remain:

| Route | Treasury BPS | Creator BPS | AiFinPay fee |
|---|---:|---:|---:|
| AIFP-2 / x402 | 0 | 0 | 0% |
| AIFP-1 merchant monetization | 100 | 0 | 1% |

## Legacy deployments

Existing v1.1/v1.2 or other deployments with `100/1` or other fee-bearing splits may be retained in deployment evidence for auditability. They are **legacy historical state**, not the target economics.

They must not be selected for new AIFP-2 traffic.

## Engineering requirements

All SDKs, MCP servers, bridges, gateways, routers, contracts/programs, deployment scripts, registries, ledgers, dashboards, examples and tests must carry or derive an explicit product route and enforce the matching economics.

Required invariants:

1. AIFP-2 cannot resolve to a fee-bearing payment target.
2. AIFP-1 cannot silently resolve to the AIFP-2 `0/0` target when the merchant monetization fee is expected.
3. Fee rounding checks apply only when the corresponding configured BPS is non-zero.
4. Ledger and telemetry distinguish merchant amount, AiFinPay protocol fee, creator fee and chain gas/network cost.
5. Gas/network cost is never counted as AiFinPay protocol revenue.
6. A route is not production-ready until its economics are verified in end-to-end tests and on-chain/on-rail evidence.

## Release policy

No public SDK/package release, registry activation or new network payment route should be described as compliant with the current model until it proves:

- AIFP-2: exact provider/merchant amount, AiFinPay fee 0, creator fee 0;
- AIFP-1: merchant 99%, AiFinPay treasury 1%, creator fee 0;
- replay/idempotency protection;
- route isolation;
- reconciliation records that match the selected product route.
