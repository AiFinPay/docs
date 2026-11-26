#!/usr/bin/env node

// Client versions are stated once, in snippets/current-versions.mdx.
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const source = "snippets/current-versions.mdx";
// Describes the tool set of one MCP release, not what pays today.
const exempt = new Set([source, "reference/mcp-tools.mdx"]);
const clientName = /@aifinpay\/(?:agent|mcp)\b|\baifinpay-agent\b|\bpayable_fetch\b|\bfetchPaid\b|\bfetch_paid\b|\bMCP\b|\bNode SDK\b|\bPython SDK\b/;
const version = /(?<![\w.])\d+\.\d+\.(?:\d+|x)(?![\w.])/;

const files = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) walk(file);
    else if (/\.(md|mdx)$/.test(name)) files.push(file);
  }
})(root);

const problems = [];
for (const file of files) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (exempt.has(rel)) continue;
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let inFence = false;
  let paragraph = [];
  const flush = () => {
    const text = paragraph.map((p) => p.text).join(" ");
    if (clientName.test(text) && version.test(text)) {
      const hit = paragraph.find((p) => version.test(p.text)) ?? paragraph[0];
      problems.push(`${rel}:${hit.n}: ${hit.text.trim()}`);
    }
    paragraph = [];
  };
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) {
      flush();
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    if (line.trim() === "") flush();
    else paragraph.push({ n: i + 1, text: line });
  });
  flush();
}

if (problems.length) {
  console.error(`Client versions belong in ${source} only:\n` + problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`OK: client versions are stated only in ${source}`);
}
