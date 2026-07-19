# Handoff spec — quote-signed protocol fee (Polygon + Solana)

**For:** smart-contract dev · **From:** AiFinPay backend · **2026-07-09**

## Why

Fee is hardcoded in the splitter as 9899/100/1 bps and the splitter isn't upgradeable.
The team wants graded fees (by payment size / by agent 30-day volume / fee caps). Doing
that as multiple contract versions = multiple migrations (address changes ripple through
SDK, backend, docs). Instead: **one contract change** that lets the on-chain split use a
fee rate signed by AiFinPay's quoter. Then every fee schedule (A/B/C in the fee-spec)
becomes pure off-chain policy in the quote service — zero further migrations.

## What to build

A new payment function that accepts a **quoter-signed feeBps** and splits accordingly.

### Polygon (Solidity — new fn alongside payStable)

```
payStableSigned(
    address token,
    uint256 amount,          // TOTAL the agent pays (minor units)
    address merchant,
    address ipCreator,
    string  orderId,
    uint16  feeBps,          // protocol fee in bps, 0..1000 (0%..10%)
    uint64  expiry,          // unix seconds; block.timestamp must be <= expiry
    bytes   sig              // ECDSA sig over the tuple below by AIFP_FEE_SIGNER
)
```

- Recover signer from `keccak256(abi.encodePacked(token, amount, merchant, ipCreator, orderId, feeBps, expiry, block.chainid, address(this)))` (EIP-191 personal_sign or EIP-712 — your call, tell us which so we match).
- **require** signer == `AIFP_FEE_SIGNER` (an address set at deploy / settable by the Gnosis Safe owner), `block.timestamp <= expiry`, `feeBps <= 1000`.
- Replay guard: mark `orderId` used (mapping) so a signed quote can't be reused.
- Split: `treasuryFee = amount*feeBps/10000` (floor); `ipCreatorFee` = keep the existing 1 bp creator OR make it a second signed field `ipBps` (preferred — covers fee-spec #6 configurable creator pointer); `merchantAmount = amount - treasuryFee - ipCreatorFee` (remainder to merchant, same as today).
- Emit the SAME `Payment` event you emit now (payer, merchant, token, totalAmount, merchantAmount, treasuryAmount, ipCreatorAmount, orderId) so our verifier reads both paths identically.
- Keep the existing `payStable` (flat 1%) as the fallback for agents that don't fetch a signed quote.

### Solana (Anchor — new instruction, same idea)

`b2b_pay_signed(amount: u64, order_id: String, fee_bps: u16, expiry: i64, sig: [u8;64])`
- Verify the ed25519 sig (via the ed25519 program / instruction introspection) over
  `(amount, merchant, ip_creator, order_id, fee_bps, expiry, program_id)` by the
  configured fee signer pubkey stored in the config PDA.
- Same split math + remainder-to-merchant + same event fields as `b2b_pay_with_split`.
- (This composes with the separate `b2b_pay_spl` SPL-USDC request — same signing pattern.)

## Config / ops
- `AIFP_FEE_SIGNER` (EVM address / Solana pubkey) settable only by the Safe / config
  authority. We'll rotate it independently of the treasury key.
- Bounds: `feeBps <= 1000` hard cap in the contract (defense-in-depth even if signer is
  compromised).

## Backend side (we do this)
- Quoter service signs `(…, feeBps, expiry)` per quote; `feeBps` comes from the active
  schedule (flat 1% now; later cap / size / volume tiers — all off-chain).
- `/v1/pay` verifier: for the signed path, read `feeBps` from the event and check it
  matches the quote; everything else identical to today.

## Acceptance test (we run on mainnet once deployed)
1. `/v1/quote` returns feeBps + a signature.
2. Agent calls `payStableSigned(amount, …, feeBps=35, expiry, sig)`.
3. On-chain: treasury gets `amount*35/10000`, merchant gets the remainder; event carries feeBps-consistent amounts and orderId=quote_id.
4. Replay of the same orderId reverts. Expired signature reverts. feeBps>1000 reverts.
5. `/v1/pay` verifies and issues the quota receipt.

Once this is on mainnet (Safe upgrade + updated ABI/IDL), the graded fee schedule ships
with zero further contract work.
