# vscode-container-wasm: Containers on VSCode for the Web

A VSCode extension for running containers on VSCode for the Web, relying on [`container2wasm`](https://github.com/ktock/container2wasm) for container to wasm conversion.

This is an experimental software.

## Features

This extension runs containers on VSCode for the Web and provides Terminal to interact to it.

The containers run in the WebAssembly VM **on browser** so you don't need prepare remote containers.

HTTP(S) networking is also available in the container with restrictions by the browser (CORS-restricted and no control over [Forbidden headers](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name)) (see also "Limitation" section).

### Quick Start

1. Open `ktock/vscode-container-wasm-gcc-example` on `github.dev` : https://github.dev/ktock/vscode-container-wasm-gcc-example?vscode-coi=on  (you need `?vscode-coi=on` query in the URL)
2. Install `ktock.container-wasm` extension.
3. Run `> Run Container On Browser` in the command pallete. Then the container will be launched with the Terminal (can take some time to start the container).

![Container on browser](./docs/vscode-container-wasm-gcc.png)

## How to use

- For repository visitors:
  - Open `github.dev` for the repo (if using  `.` shortcut key, `?vscode-coi=on` needs to be manually added to the URL (this extension relies on SharedArrayBuffer))
  - Install this extension
  - Launch a container by invoking `> Run Container On Browser`

- For repository maintainers:
  - Option A:
    - Convert a container image to Wasm format using [`container2wasm`](https://github.com/ktock/container2wasm) converter. (e.g. `c2w ubuntu:22.04 out.wasm`)
    - Upload that Wasm image to a HTTP(S) server accessible from VSCode for the Web.
    - Set `container.imageLocation` (in `.vscode/settings.json`) to the URL of that image.
  - Option B:
    - Upload container image in [OCI Image Layout](https://github.com/opencontainers/image-spec/blob/v1.0.2/image-layout.md) to a HTTP(S) server accessible from the browser. Or you can use registry configured to allow CORS access.
    - Set `container.containerImage` (in `.vscode/settings.json`) to the URL of that image. Or if you used the registry as the server, write the image reference (i.e. `<registry>/<image-path>:<tag>`) there.

Example repos:
- `gcc`: https://github.com/ktock/vscode-container-wasm-gcc-example
- Debian + `curl`: https://github.com/ktock/vscode-container-wasm-debian-example

## Extension Settings

- `container.imageLocation` *string* : Specify the URI of the Wasm-formatted container image (or the prefix if the Wasm image is chunked)
- `container.imageChunks` *number* : Specify non zero value if the image is chunked with suffix (< 99) (default:0)
- `container.imageWithDecompression` *bool* : Set true if the image needs gzip decompression (default: false)
- `container.workspaceMountpoint` *string* : Specify path to mount the workspace in container (set "" to disable mount) (default: "/workspace")
- `container.networkingMode` *string* : Networking mode (enum: `["none", "fetch"]`) (default: "fetch")
- `container.containerImage` *string* : Address of container image
- `container.helperImageLocation` *string* : Specify the URI of the Wasm-formatted networking helper image.
- `container.helperImageWithDecompression` *bool* : Set true if the helper image needs decompression

## Limitation

- This extension relies on SharedArrayBuffer. `?vscode-coi=on` query is needed for `github.dev` to make this extension work.
- Networking from the container is limited to HTTP(S) and restricted by the browser's security rule (CORS-restricted, no control over [Forbidden headers](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name)). Please see also [the docs in container2wasm](https://github.com/ktock/container2wasm/tree/v0.5.1/examples/networking/fetch).

## Known Issues

- Issue tracker of vscode-container-wasm: https://github.com/ktock/vscode-container-wasm/issues
- Issue tracker of container2wasm: https://github.com/ktock/container2wasm/issues

## How it works

- Image format: Container is converted to Wasm image using [container2wasm](https://github.com/ktock/container2wasm) to make it runnable on browser.
- Wasi host: [`vscode-wasm`](https://github.com/microsoft/vscode-wasm) is used for the container image. It's patched to support containers and networking.
- Networking: NW stack running on browser and it uses the browser's Fetch API for performing HTTP(S) networking. Please see also [the docs in container2wasm](https://github.com/ktock/container2wasm/tree/v0.5.1/examples/networking/fetch).

## FAQ

### "SharedArrayBuffer is not defined" error occurs when launching the container

To make SharedArrayBuffer available, please add `?vscode-coi=on` query to the URL and reload.

## Release Notes

See https://github.com/ktock/vscode-container-wasm/releases

## Acknowledgement

This extension based on the following projects.
They are included to this project and patched for our usecase (stored at [`./src/vendor/`](./src/vendor/)).

- `vscode-wasm` (`wasm-wasi-core`) ([MIT License](https://github.com/microsoft/vscode-wasm/blob/main/LICENSE)) https://github.com/microsoft/vscode-wasm
- `browser_wasi_shim` (either of [MIT License](https://github.com/bjorn3/browser_wasi_shim/blob/main/LICENSE-MIT) and [Apache License 2.0](https://github.com/bjorn3/browser_wasi_shim/blob/main/LICENSE-APACHE)): https://github.com/bjorn3/browser_wasi_shim
