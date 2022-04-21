import { SharedWorker } from "ava/plugin";
import crypto from 'crypto'

const random = async (protocol: SharedWorker.Protocol) => {
	for await (const testWorker of protocol.testWorkers()) {
		testWorker.publish(crypto.randomBytes(16).toString('hex'));
	}
}

export default random
