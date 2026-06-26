# AiFinPay Docs (Mintlify)

The AiFinPay developer documentation, built with [Mintlify](https://mintlify.com)
— the same platform our competitors use. Role × language structure: pay for
services / charge for your API / reference.

## Go live at docs.aifinpay.io

1. **Push to GitHub.** Put this folder in a repo (e.g. `AiFinPay/docs`).
2. **Connect Mintlify.** Sign up at https://mintlify.com → **Connect GitHub** →
   pick the repo (and this subfolder if it isn't the repo root). Mintlify
   rebuilds on every push and gives you a preview at `<project>.mintlify.app`.
3. **Custom domain.** Mintlify dashboard → **Settings → Custom domain** →
   `docs.aifinpay.io`. Mintlify shows a CNAME target.
4. **DNS (Cloudflare, `aifinpay.io` zone).** Add a CNAME:
   `docs` → the value Mintlify gives (usually `cname.mintlify.app`), per
   Mintlify's proxied/DNS-only instruction.
5. **Assets.** Drop logo files at `logo/light.svg` + `logo/dark.svg` and
   `favicon.svg` (reuse the ones from `ofh-master/src/assets`).

Then point the main-site nav **DOCS** link at `https://docs.aifinpay.io`
(currently it points at the interim React `/docs` hub).

## Local preview

```bash
npm i -g mint
mint dev          # http://localhost:3000
```

## Structure

```
docs.json                  Mintlify config (theme, nav tree)
introduction.mdx           What AiFinPay is + role router
quickstart.mdx             Fastest path to a first paid call
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
