#!/usr/bin/env node
// Line-ending-tolerant text comparison for drift checks. Generators emit LF,
// but a clone checked out before .gitattributes forced eol=lf (or with
// core.autocrlf=true) may hold CRLF working copies of identical content.
// Drift must mean content drift, never line-ending drift.

function normalizeEol(text) {
  return typeof text === "string" ? text.replace(/\r\n/g, "\n") : text;
}

function sameText(a, b) {
  return normalizeEol(a) === normalizeEol(b);
}

module.exports = {
  normalizeEol,
  sameText,
};
