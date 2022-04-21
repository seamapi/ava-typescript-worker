import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", "src/load-worker.mjs"],
  dts: true,
  sourcemap: true,
  format: ["cjs", "esm"],
})
