import assert from "node:assert/strict";
import { readFile, stat, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const works = JSON.parse(await readFile(path.join(root, "src/data/works.json"), "utf8"));
const keys = ["id", "title", "category", "kind", "width", "height", "duration", "status", "sortOrder", "mediaUrl", "posterUrl"].sort();
const ids = new Set();
const referenced = new Set();
let sawDrama = false;
let bytes = 0;
for (const [index, work] of works.entries()) {
  assert.deepEqual(Object.keys(work).sort(), keys, "Only public display fields may be exported");
  assert(!ids.has(work.id), "IDs must be unique"); ids.add(work.id);
  assert.equal(work.sortOrder, index + 1, "Keep the displayed order explicit");
  assert.equal(work.status, "published", "Do not publish draft data");
  assert(["ecommerce", "drama"].includes(work.category));
  assert(["video", "image"].includes(work.kind));
  if (work.category === "drama") sawDrama = true;
  if (work.category === "ecommerce") assert(!sawDrama, "All ecommerce must precede drama");
  assert(work.title.trim() && work.width > 0 && work.height > 0 && work.duration >= 0);
  for (const asset of [work.mediaUrl, work.posterUrl]) {
    assert(/^(media|posters)\/[a-z0-9-]+\.(mp4|webp|png|jpg|jpeg)$/i.test(asset), "Use local relative public assets");
    const size = (await stat(path.join(root, "public", asset))).size;
    assert(size > 0 && size < 100 * 1024 ** 2, "Assets must fit GitHub file limits");
    if (!referenced.has(asset)) bytes += size;
    referenced.add(asset);
  }
}
for (const folder of ["media", "posters"]) {
  for (const filename of await readdir(path.join(root, "public", folder))) {
    assert(referenced.has(`${folder}/${filename}`), `Unlisted public asset: ${folder}/${filename}`);
  }
}
assert(bytes < 900 * 1024 ** 2, "Leave capacity below the Pages site limit");
const source = await readFile(path.join(root, "src/components/gallery.tsx"), "utf8");
assert(!/chatgpt\.site|\/api\/|href=["']\/manage/.test(source), "The static gallery must be independent");
console.log(JSON.stringify({ works: works.length, ecommerce: works.filter(w=>w.category==="ecommerce").length, drama: works.filter(w=>w.category==="drama").length, bytes, checks: "passed" }));
