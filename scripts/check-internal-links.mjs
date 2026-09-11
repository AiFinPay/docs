#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const configPath = path.join(root, "docs.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const pages = new Set();
const files = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) walk(file);
    else if (/\.(md|mdx)$/.test(name)) files.push(file);
  }
}

function configuredPages() {
  for (const tab of config.navigation?.tabs ?? []) {
    for (const group of tab.groups ?? []) {
      for (const page of group.pages ?? []) pages.add(`/${page}`);
    }
  }
}

walk(root);
configuredPages();
const missingFiles = [...pages].filter(
  (page) => !fs.existsSync(path.join(root, `${page.slice(1)}.mdx`)),
);
const missingLinks = [];
const linkPattern = /(?:\]\(|href=["'])(\/[A-Za-z0-9_./-]+)/g;

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(linkPattern)) {
    const target = match[1].replace(/[?#].*$/, "");
    if (!pages.has(target) && !fs.existsSync(path.join(root, `${target.slice(1)}.mdx`))) {
      missingLinks.push(`${path.relative(root, file)} -> ${target}`);
    }
  }
}

if (missingFiles.length || missingLinks.length) {
  if (missingFiles.length) console.error("Missing configured pages:\n" + missingFiles.join("\n"));
  if (missingLinks.length) console.error("Missing internal links:\n" + missingLinks.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`OK: ${pages.size} configured pages and no missing internal links`);
}
