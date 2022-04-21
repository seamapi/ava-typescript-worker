import {registerSharedWorker, SharedWorker} from "ava/plugin"
import {packageDirectorySync} from 'pkg-dir';
import path from 'path'
import {Except} from 'type-fest'

export type RegisterSharedTypeScriptWorkerOptions<Data> = Except<SharedWorker.Plugin.RegistrationOptions<'ava-4', Data>, 'supportedProtocols'>

export const registerSharedTypeScriptWorker = <Data = unknown>(options: RegisterSharedTypeScriptWorkerOptions<Data>) => {
  const loaderFilename = path.resolve(packageDirectorySync(), 'src/load-worker.mjs');

  const resolvedFilename = typeof options.filename === 'string' ? path.resolve(options.filename) : options.filename.pathname;

  return registerSharedWorker<Data>({
    ...options,
    filename: new URL(`file:${loaderFilename}#${encodeURIComponent(resolvedFilename)}`),
    supportedProtocols: ['ava-4'],
    initialData: {
      ...options.initialData,
      targetWorkerFilename: resolvedFilename
    } as any
  })
}
