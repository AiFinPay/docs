# AGENTS.md — AiFinPay public docs

Mintlify site: pages are `.mdx`/`.md` files, navigation lives in `docs.json`.

## Docs follow what runs

Docs describe the product; they never lead it. Before writing or changing a claim, check it against the source:

- API routes, fields and errors: `backend/openapi.yaml` in AiFinPay/aifinpay-web (generated from the routes).
- Networks and contract addresses: the `@aifinpay/deployments` registry and the live `https://aifinpay.io/api/health`, `/manifesto.json`, `/.well-known/x402.json`.
- SDK, MCP and gate versions and options: AiFinPay/sdk `main` and the published packages on npm and PyPI.
- Dashboard screens and labels: AiFinPay/paywall-dashboard `main`.

If the code and a page disagree, the page is wrong or the code has a bug — say which in the PR. Use `aifinpay.io` URLs only (`aifinpay.company` is retired). No secrets, keys or tokens in pages or examples.

## Linked surfaces

This repository is the docs surface.

AiFinPay information lives in five places that must agree: the backend API (AiFinPay/aifinpay-web `backend/`), the public site (aifinpay-web `frontend/products/marketing-app`, `/llms.txt`, `/manifesto.json`, `/.well-known/x402.json`), the merchant dashboard (AiFinPay/paywall-dashboard), the SDK, MCP and gate packages (AiFinPay/sdk) and the public docs (AiFinPay/docs). A change in one silently makes the others wrong, so check them in the same piece of work, not later.

| If you change | Also check |
|---|---|
| networks, contract addresses, `@aifinpay/deployments`, served chains | backend health, manifesto and x402.json · SDK supported networks (Node, Python, MCP) · dashboard network pickers, Fund and wallets · site `llms.txt` and network pages · docs |
| an API route, field or error code | `backend/openapi.yaml` · dashboard `app/src/lib/api.ts` and `scripts/backend-compatibility.test.mjs` · SDK clients and types · docs API reference |
| prices, fees, plans, quotas | backend fee maths · site pricing · dashboard billing copy · SDK quote and fee handling · docs |
| auth, step-up, sessions, password reset | dashboard Settings and sign-in · docs merchant guide |
| webhooks, receipts, signatures, JWKS | SDK verify helpers · dashboard webhook editor · docs |
| gateway, paywall, DNS, domains, slugs | dashboard Sites, Gateway and DNS queue · SDK gate packages (Node, Python) · docs onboarding |
| MCP tools or the skill | docs MCP page · site developer entry · `llms.txt` |
| dashboard UI text or components | docs screenshots and the names of buttons and sections |

In the PR description, add a section **Linked surfaces** with one line per surface: `updated (link)`, `not affected — why`, or `follow-up: <PR link>`. "Not affected" without a reason means not checked. A surface in another repository gets its own PR there, linked from this one. Contracts (`aifinpay-polygon`, `aifinpay-protocol`) belong to the Contracts owner: write a proposal, do not edit.
