// Import only the owner's verified display copies. Never copy the source folder wholesale.
import { readFile, writeFile, copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifestPath = process.argv[2];
if (!manifestPath) throw new Error("Usage: node scripts/import-media.mjs <verified-manifest.json>");
const records = JSON.parse(await readFile(manifestPath, "utf8"));
const mediaRoot = path.dirname(path.resolve(manifestPath));
const publicRoot = path.join(root, "public");
const publicWorks = [];
const ids = new Set();
for (const item of [...records].sort((a, b) =>
  (a.category === "ecommerce" ? 0 : 1) - (b.category === "ecommerce" ? 0 : 1) || a.order - b.order)) {
  if (!item.verified || !["ecommerce", "drama"].includes(item.category) || ids.has(item.id)) {
    throw new Error(`Invalid or unverified work: ${item.id}`);
  }
  ids.add(item.id);
  for (const relative of [item.mediaRelativePath, item.posterRelativePath]) {
    if (!/^(media|posters)\/[a-z0-9-]+\.(mp4|webp|png|jpg|jpeg)$/i.test(relative)) {
      throw new Error(`Unsupported asset path for ${item.id}`);
    }
    const source = path.join(mediaRoot, relative);
    const destination = path.join(publicRoot, relative);
    if (relative === item.mediaRelativePath && (await stat(source)).size !== item.size) {
      throw new Error(`Media size does not match verification: ${item.id}`);
    }
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }
  publicWorks.push({
    id: item.id, title: item.title, category: item.category, kind: item.kind,
    width: item.width, height: item.height, duration: item.duration || 0,
    status: "published", sortOrder: publicWorks.length + 1,
    mediaUrl: item.mediaRelativePath, posterUrl: item.posterRelativePath,
  });
}
await mkdir(path.join(root, "src/data"), { recursive: true });
await writeFile(path.join(root, "src/data/works.json"), JSON.stringify(publicWorks, null, 2) + "\n");
console.log(`Imported ${publicWorks.length} works; only public display fields were exported.`);
