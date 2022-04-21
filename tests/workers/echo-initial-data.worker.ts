import { SharedWorker } from "ava/plugin"

const echoInitialData = async (protocol: SharedWorker.Protocol) => {
  for await (const testWorker of protocol.testWorkers()) {
    testWorker.publish(protocol.initialData)
  }
}

export default echoInitialData
