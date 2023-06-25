import "@esbuild-kit/cjs-loader"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

const loadTypeScriptWorker = async ({ negotiateProtocol }) => {
  const protocol = await negotiateProtocol(["ava-4"]).ready()

  const {
    initialData: { targetWorkerFilename },
  } = protocol

  delete protocol.initialData.targetWorkerFilename

  await require(targetWorkerFilename).default(protocol)
}

export default loadTypeScriptWorker
