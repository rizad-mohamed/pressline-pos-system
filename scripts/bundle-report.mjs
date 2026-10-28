import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
const root = ".next/static/chunks";
function files(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(join(path, entry.name))
      : [join(path, entry.name)],
  );
}
const assets = files(root)
  .filter((path) => /\.(js|css)$/.test(path))
  .map((path) => {
    const bytes = readFileSync(path);
    return { path, bytes: bytes.length, gzipBytes: gzipSync(bytes).length };
  });
console.log(
  JSON.stringify(
    {
      scope:
        "All generated route assets combined; not an initial-page transfer or runtime performance score",
      javascript: assets
        .filter((a) => a.path.endsWith(".js"))
        .reduce(
          (r, a) => ({
            files: r.files + 1,
            bytes: r.bytes + a.bytes,
            gzipBytes: r.gzipBytes + a.gzipBytes,
          }),
          { files: 0, bytes: 0, gzipBytes: 0 },
        ),
      css: assets
        .filter((a) => a.path.endsWith(".css"))
        .reduce(
          (r, a) => ({
            files: r.files + 1,
            bytes: r.bytes + a.bytes,
            gzipBytes: r.gzipBytes + a.gzipBytes,
          }),
          { files: 0, bytes: 0, gzipBytes: 0 },
        ),
      largest: assets.toSorted((a, b) => b.bytes - a.bytes).slice(0, 5),
    },
    null,
    2,
  ),
);
