#!/usr/bin/env node
// Validator artikel yogiex.github.io.
//
// Pemakaian:
//   node scripts/check-post.mjs _posts/2026-11-20-slug.md
//   node scripts/check-post.mjs --all
//   node scripts/check-post.mjs --all --strict   # WARN ikut menggagalkan
//
// Aturan (ID dipakai di docs/artikel/FORMAT.md dan AGENTS.md):
//   A1  nama file & tanggal     A7  tag resmi & huruf kecil
//   A2  front matter baku       A8  heading body mulai ##
//   A3  panjang judul           A9  alt gambar & path gambar
//   A4  panjang subtitle        A10 tanpa field comments
//   A5  image absolut & ada     A11 referensi HTTPS
//   A6  bigimg array valid      A12 gaya bahasa  (manual, hanya pengingat)

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const POSTS_DIR = path.join(ROOT, "_posts");
const TAGS_FILE = path.join(ROOT, "_data", "tags.yml");

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const all = args.includes("--all");
const files = args.filter((a) => !a.startsWith("--"));

// Urutan front matter baku (mengikuti artikel terbaru yang sudah patuh).
const ORDER = ["layout", "title", "subtitle", "image", "bigimg", "share-img", "tags"];

// Aturan ditegakkan untuk artikel bertanggal >= CUTOVER. Artikel lama
// (sebelum cutover) hanya diberi WARN bertanda [legacy] agar bisa dibenahi
// bertahap tanpa memblokir perubahan kecil. `--strict` mencabut toleransi ini.
const CUTOVER = "2026-01-01";

const officialTags = fs
  .readFileSync(TAGS_FILE, "utf8")
  .split("\n")
  .map((l) => l.match(/^-\s+(.+)$/))
  .filter(Boolean)
  .map((m) => m[1].trim());

let problems = 0;
let currentLegacy = false;

function report(file, id, level, message) {
  const rel = path.relative(ROOT, file) || file;
  let lvl = level;
  let msg = message;
  if (currentLegacy && !strict && lvl === "FAIL") {
    lvl = "WARN";
    msg = `[legacy] ${message}`;
  }
  console.log(`${id.padEnd(3)} ${lvl.padEnd(4)} ${rel}: ${msg}`);
  if (lvl === "FAIL" || (strict && lvl === "WARN")) problems += 1;
}

function parseFrontMatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---", 4);
  if (end === -1) return null;
  const raw = text.slice(4, end);
  const body = text.slice(text.indexOf("\n", end + 4) + 1);
  return { raw, body, lines: raw.split("\n") };
}

// Parser minimal: cukup untuk front matter blog ini (string, inline array, block list).
function parseFields(lines) {
  const fields = new Map();
  for (let i = 0; i < lines.length; i += 1) {
    const m = lines[i].match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rest] = m;
    const value = rest.trim();
    if (value === "") {
      const items = [];
      let j = i + 1;
      while (j < lines.length) {
        const im = lines[j].match(/^\s+-\s*(.+)$/);
        if (!im) break;
        items.push(im[1].trim().replace(/^["']|["']$/g, ""));
        j += 1;
      }
      fields.set(key, items.length ? { type: "list", value: items } : { type: "empty", value: "" });
    } else if (value.startsWith("[")) {
      const inner = value.replace(/^\[|\]$/g, "").trim();
      const list = inner
        ? inner.split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
        : [];
      fields.set(key, { type: "list", value: list });
    } else {
      fields.set(key, { type: "scalar", value: value.replace(/^["']|["']$/g, "") });
    }
  }
  return fields;
}

function bodyWithoutCode(body) {
  const out = [];
  let fence = false;
  for (const line of body.split("\n")) {
    if (line.trim().startsWith("```")) {
      fence = !fence;
      continue;
    }
    if (!fence) out.push(line);
  }
  return out.join("\n");
}

function checkFile(file) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const base = path.basename(file);

  // A1 — nama file & tanggal
  currentLegacy = false;
  const anyDate = base.match(/^(\d{4})-(\d{2})-(\d{2})-/);
  if (anyDate) {
    currentLegacy = `${anyDate[1]}-${anyDate[2]}-${anyDate[3]}` < CUTOVER;
  }
  const nameMatch = base.match(/^(\d{4})-(\d{2})-(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/);
  if (!nameMatch) {
    report(file, "A1", "FAIL", "nama file harus YYYY-MM-DD-slug.md (huruf kecil, tanda hubung)");
  } else {
    const iso = `${nameMatch[1]}-${nameMatch[2]}-${nameMatch[3]}`;
    const date = new Date(`${iso}T00:00:00+07:00`);
    if (Number.isNaN(date.getTime())) {
      report(file, "A1", "FAIL", `tanggal "${iso}" tidak valid`);
    } else {
      const today = new Date();
      if (date.getTime() > today.getTime() + 24 * 3600 * 1000) {
        report(file, "A1", "FAIL", `tanggal ${iso} di masa depan; Jekyll tidak mem-publish-nya`);
      }
    }
  }

  const fm = parseFrontMatter(text);
  if (!fm) {
    report(file, "A2", "FAIL", "tidak ada front matter (--- di awal file)");
    return;
  }
  const fields = parseFields(fm.lines);
  const get = (k) => fields.get(k)?.value;

  // A2 — field wajib, layout, dan urutan
  const required = ["layout", "title", "subtitle", "image", "tags"];
  for (const key of required) {
    if (!fields.has(key) || get(key) === "" ) report(file, "A2", "FAIL", `field "${key}" wajib diisi`);
  }
  if (get("layout") && get("layout") !== "post") {
    report(file, "A2", "FAIL", `layout harus "post", bukan "${get("layout")}"`);
  }
  const present = ORDER.filter((k) => fields.has(k));
  const actual = [...fields.keys()].filter((k) => ORDER.includes(k));
  if (present.join(",") !== actual.join(",")) {
    report(file, "A2", "WARN", `urutan front matter baku: ${ORDER.join(", ")}`);
  }

  // A3 — panjang judul
  const title = String(get("title") ?? "");
  if (title && (title.length < 45 || title.length > 65)) {
    report(file, "A3", "WARN", `judul ${title.length} karakter (disarankan 45-65)`);
  }

  // A4 — panjang subtitle
  const subtitle = String(get("subtitle") ?? "");
  if (subtitle && (subtitle.length < 80 || subtitle.length > 160)) {
    report(file, "A4", "WARN", `subtitle ${subtitle.length} karakter (disarankan 80-160)`);
  }

  // A5 — image absolut, lokal, dan ada
  const image = String(get("image") ?? "");
  if (image) {
    if (/^https?:/i.test(image)) {
      report(file, "A5", "FAIL", "image harus file lokal, bukan URL eksternal");
    } else if (!image.startsWith("/img/")) {
      report(file, "A5", "FAIL", `image harus diawali /img/, sekarang "${image}"`);
    } else if (!fs.existsSync(path.join(ROOT, image))) {
      report(file, "A5", "FAIL", `file gambar tidak ada: ${image}`);
    }
  }

  // A6 — bigimg array valid
  if (fields.has("bigimg")) {
    const big = fields.get("bigimg");
    if (big.type !== "list" || big.value.length === 0) {
      report(file, "A6", "FAIL", 'bigimg harus array berisi path, atau key-nya dihapus (jangan bigimg: "")');
    } else {
      for (const src of big.value) {
        if (!src) report(file, "A6", "FAIL", "ada elemen bigimg kosong");
        else if (!src.startsWith("/img/") && !/^https?:/i.test(src)) {
          report(file, "A6", "FAIL", `bigimg harus path /img/... atau URL, sekarang "${src}"`);
        } else if (src.startsWith("/img/") && !fs.existsSync(path.join(ROOT, src))) {
          report(file, "A6", "FAIL", `file bigimg tidak ada: ${src}`);
        }
      }
    }
  }

  // A7 — tag resmi, huruf kecil, tanpa duplikat
  const tags = fields.get("tags");
  if (tags) {
    if (tags.type !== "list" || tags.value.length === 0) {
      report(file, "A7", "FAIL", "tags harus array, contoh: [linux, docker]");
    } else {
      const seen = new Set();
      for (const tag of tags.value) {
        if (!tag) report(file, "A7", "FAIL", "ada tag kosong (koma berlebih?)");
        else if (seen.has(tag)) report(file, "A7", "FAIL", `tag duplikat: "${tag}"`);
        seen.add(tag);
        if (tag !== tag.toLowerCase()) {
          report(file, "A7", "WARN", `tag "${tag}" harus huruf kecil`);
        }
        if (!officialTags.includes(tag)) {
          const near = officialTags.find((t) => t.toLowerCase() === tag.toLowerCase());
          report(file, "A7", "WARN", near ? `tag "${tag}" tidak ada; maksudnya "${near}"?` : `tag "${tag}" belum ada di _data/tags.yml`);
        }
      }
    }
  }

  // A10 — tanpa komentar
  if (fields.has("comments")) {
    report(file, "A10", "FAIL", "situs tidak memakai komentar; hapus field comments");
  }

  const body = fm.body;
  const prose = bodyWithoutCode(body);

  // A8 — heading body mulai dari ##
  prose.split("\n").forEach((line, i) => {
    if (/^#\s/.test(line)) {
      report(file, "A8", "FAIL", `heading "#" di body (baris ±${i + 1}); gunakan "##"`);
    }
  });

  // A9 — gambar body: alt wajib, path lokal absolut
  const bodyLines = prose.split("\n");
  bodyLines.forEach((line, i) => {
    for (const m of line.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)) {
      const [, alt, src] = m;
      if (!alt.trim()) report(file, "A9", "FAIL", `gambar tanpa alt (baris ±${i + 1}): ${src}`);
      if (/^https?:/i.test(src)) {
        report(file, "A9", "WARN", `hotlink eksternal (baris ±${i + 1}): ${src}`);
      } else if (!src.startsWith("/")) {
        report(file, "A9", "FAIL", `path gambar harus absolut (baris ±${i + 1}): ${src}`);
      } else if (!fs.existsSync(path.join(ROOT, src))) {
        report(file, "A9", "FAIL", `file gambar tidak ada (baris ±${i + 1}): ${src}`);
      }
    }
  });

  // A11 — referensi HTTPS
  const httpLinks = [...prose.matchAll(/\]\((http:\/\/[^)]+)\)/g)].map((m) => m[1]);
  if (httpLinks.length) {
    report(file, "A11", "WARN", `${httpLinks.length} tautan masih http:// (contoh: ${httpLinks[0]})`);
  }

  // A12 — pengingat manual (tidak dinilai otomatis)
  const h2 = prose.split("\n").filter((l) => /^##\s/.test(l)).length;
  if (h2 === 0) report(file, "A12", "WARN", "belum ada heading ##; cek kerangka di templates/post.md");
  if (!/^>\s*\*\*Ringkasan/m.test(prose)) {
    report(file, "A12", "WARN", "belum ada blok > **Ringkasan:** di awal body");
  }
}

if (all) {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error("folder _posts tidak ditemukan");
    process.exit(2);
  }
  for (const f of fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md")).sort()) {
    checkFile(path.join(POSTS_DIR, f));
  }
} else if (files.length) {
  for (const f of files) {
    const abs = path.resolve(ROOT, f);
    if (!fs.existsSync(abs)) {
      report(abs, "A1", "FAIL", "file tidak ditemukan");
      continue;
    }
    checkFile(abs);
  }
} else {
  console.error("pemakaian: node scripts/check-post.mjs <file...> | --all [--strict]");
  process.exit(2);
}

const mode = strict ? "strict" : "normal";
if (problems) {
  console.log(`\n${problems} masalah (${mode}). Perbaiki dulu sebelum commit.`);
  process.exit(1);
}
console.log(`\nSemua aturan wajib lolos (${mode}).`);
