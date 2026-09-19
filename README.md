# AiFinPay Docs (Mintlify)

The AiFinPay developer documentation, built with [Mintlify](https://mintlify.com)
— the same platform our competitors use. Role × language structure: pay for
services / charge for your API / reference.

## Source and deployment

This repository is the canonical docs source. The `origin` remote is the
AiFinPay docs repository, whose default branch is `main`; a personal remote is
also configured for mirror or recovery workflows. Work on a branch, review it,
and merge or push through the normal repository workflow.

The intended deployment mechanism is Mintlify at `https://docs.aifinpay.io`.
The connected repository and custom-domain status must be verified in the
Mintlify project; this checkout contains no provider-side deployment metadata.
Do not create a second application deployment or move the docs into another
repository. Mintlify should read `docs.json` and publish its configured page
tree. The main site already links its **DOCS** navigation to this domain, and
its **DASHBOARD** / provider CTAs go to the self-service customer panel at
[dash.aifinpay.io](https://dash.aifinpay.io).

The logo and dark/light assets are already checked in under `logo/`; keep them
in place when editing the site.

## Local preview

```bash
npm i -g mint
mint dev          # http://localhost:3000
```

## Local link check

The repository includes a dependency-free check for local page links:

```bash
node scripts/check-internal-links.mjs
```

## Structure

```
docs.json                  Mintlify config (theme, nav tree)
introduction.mdx           What AiFinPay is + role router
skills.mdx                 Public payer and merchant skill entry
quickstart.mdx             Setup and current client availability
pay/                       Agent that PAYS (client)
  node.mdx · python.mdx · mcp.mdx · manual-flow.mdx
charge/                    Provider that gets PAID (server)
  onboarding.mdx
reference/
  networks.mdx · mcp-tools.mdx
```

All content is generated from the real SDK/backend code — keep it in sync when
the SDK changes. Token-free, non-custodial, multichain — keep the messaging
discipline (no token/stake/DAO/governance language).
