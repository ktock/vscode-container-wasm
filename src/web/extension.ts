import RIL from './../vendor/wasm-wasi-core/src/web/ril';
RIL.install();

import { Wasm, WasmProcess, WasiCoreImpl, ProcessOptions, WorkspaceFolderDescriptor, MemoryFileSystem, MemoryFileSystemDescriptor, MountPointDescriptor } from './../vendor/wasm-wasi-core/src/common/api';
import { BrowserWasiProcess } from './../vendor/wasm-wasi-core/src/web/process';
import { commands, ExtensionContext, Uri, window, workspace, WorkspaceFolder } from 'vscode';
import { createStack } from './net/stack';

export async function activate(context: ExtensionContext) {
    commands.registerCommand('container-wasm.run', async () => {
        const networkingMode = workspace.getConfiguration('container').networkingMode;
        let stackWorker: any = null;
        let net: any = null;
        if (networkingMode == "fetch") {
            const response = await fetch(Uri.joinPath(context.extensionUri, "dist/web/stack-worker.js").toString());
            const code = new Blob([await response.text()], { type: "application/javascript" });
            stackWorker = new Worker(URL.createObjectURL(code));
            net = createStack(stackWorker);
        }
        const image = workspace.getConfiguration('container').imageLocation;
        const chunks = workspace.getConfiguration('container').imageChunks;
        let bits: ArrayBuffer;
        try {
            const url = Uri.parse(image, true);
            if (!(url.scheme === "http" || url.scheme === "https")) {
                throw new Error("unrecognized url");
            }
            if (chunks > 0) {
                let format = (s: string) => image + s + '.wasm';
                let files = [];
                for (let i = 0; i < chunks; i++) {
                    let s = i.toString();
                    while (s.length < 2) s = "0" + s;
                    files[i] = s;
                }
                files = files.map(format);
                let list: Promise<any>[] = [];
                files.forEach(file => list.push(fetch(file)));

                const resps = await Promise.all(list)
                let results: Promise<any>[] = [];
                resps.forEach(r => results.push(r['arrayBuffer']()));
                const ab = await Promise.all(results)
                const blob = new Blob(ab);
                bits = await blob.arrayBuffer();
            } else {
                const resp = await fetch(image);
                bits = await resp['arrayBuffer']();
            }
        } catch (_) {
            const url = Uri.joinPath(context.extensionUri, image);
            try {
                bits = await workspace.fs.readFile(url);
            } catch (error : any) {
                // Show an error message if something goes wrong.
                await window.showErrorMessage(error.message);
                return;
            }
        }
        
        // Load the WASM API
        const wasm: Wasm = await wasiCoreExt_activate(context)

        // Create a pseudoterminal to provide stdio to the WASM process.
        const pty = wasm.createPseudoterminal();
        const terminal = window.createTerminal({
            name: 'Run Wasm',
            pty,
            isTransient: true
        });
        terminal.show(true);

        try {
            const module = await WebAssembly.compile(bits);

            let workspaceMountpoint = workspace.getConfiguration('container').workspaceMountpoint;
            let mountDescs: MountPointDescriptor[] = [];
            if (workspaceMountpoint != "") {
                workspaceMountpoint = workspaceMountpoint.replace(/\/+$/, ""); // trailing slash unsupported by wasm-wasi
                mountDescs = workspaceFolderDescriptorWithMountPoint(workspaceMountpoint);
            }
            let opts: ProcessOptions = {
                stdio: pty.stdio,
                mountPoints: mountDescs,
            }

            if (net != null) {
                // fill fetch-based networking options
                const certFs: MemoryFileSystem = await wasm.createMemoryFileSystem();
                const certD: Uint8Array = await net.wait_cert();
                certFs.createFile("proxy.crt", certD);
                const mfd: MemoryFileSystemDescriptor = {
	            kind: 'memoryFileSystem',
	            fileSystem: certFs,
	            mountPoint: "/.wasmenv"
                }
                opts.mountPoints.push(mfd);
                const mac = "02:XX:XX:XX:XX:XX".replace(/X/g, function() {
                    return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
                });
                opts.args = ['--net=socket', '--mac', mac];
                opts.env = {
                    "SSL_CERT_FILE": "/.wasmenv/proxy.crt",
                    "https_proxy": "http://192.168.127.253:80",
                    "http_proxy": "http://192.168.127.253:80",
                    "HTTPS_PROXY": "http://192.168.127.253:80",
                    "HTTP_PROXY": "http://192.168.127.253:80"
                };
                opts.net = net;
            }

            // Create a WASM process.
            const process = await wasm.createProcess('wasm', module, opts);
            
            const id = addProcess(wasm, stackWorker, process);
            const result = await process.run();
            deleteProcess(id);

            if (result !== 0) {
                await window.showErrorMessage(`Process ended with error: ${result}`);
            }
        } catch (error : any) {
            // Show an error message if something goes wrong.
            await window.showErrorMessage(error.message);
        }
    });
}

// This method is called when your extension is deactivated
export function deactivate() {
    processes = {};
}

async function wasiCoreExt_activate(context: ExtensionContext) {
    return WasiCoreImpl.create(context, BrowserWasiProcess, async (source) => {
	return WebAssembly.compileStreaming(fetch(source.toString()));
    });
}

let processes = {};
var curID = 0;
var maxID = 0x7FFFFFFF;
function getID() {
    var startID = curID;
    while (true) {
        if (processes[curID] == undefined) {
            return curID;
        }
        if (curID >= maxID) {
            curID = 0;
        } else {
            curID++;
        }
        if (curID == startID) {
            return -1; // exhausted
        }
    }
    return curID;
}

function addProcess(wasm: Wasm, stackWorker: Worker, process: WasmProcess) {
    const id: number = getID();
    processes[id] = {wasm, stackWorker, process};
    return id;
}

function deleteProcess(id: number) {
    delete processes[id]
}

function workspaceFolderDescriptorWithMountPoint(mountpoint: string) {
    let descs: MountPointDescriptor[] = [];
    const folders = workspace.workspaceFolders;
    if (folders !== undefined) {
	if (folders.length === 1) {
	    descs.push(createWorkspaceFolderDescriptor(folders[0], mountpoint, true));
	} else {
	    for (const folder of folders) {
		descs.push(createWorkspaceFolderDescriptor(folder, mountpoint, false));
	    }
	}
    }
    return descs;
}

function createWorkspaceFolderDescriptor(folder: WorkspaceFolder, mountpoint: string, single: boolean): MountPointDescriptor {
    const p: string = single ? mountpoint : mountpoint + "/" + folder.name;
    return { kind: 'vscodeFileSystem', uri: folder.uri, mountPoint: p};
}
