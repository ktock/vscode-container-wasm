# Debian container on VS Code

1. Open this page on `github.dev`: https://github.dev/ktock/vscode-container-wasm/tree/main/examples/debian?vscode-coi=on (if using `.` shortcut key, you need to add `?vscode-coi=on` query manually in the URL)
2. Install `ktock.vscode-container-wasm` extension.
3. Run `> Run Container On Browser` in the command pallete. Then the container will be launched with the Terminal (can take some time to start the container)

## Container

This will launch the following `debian:sid-slim`-based container served from https://ktock.github.io/container2wasm-demo/

```dockerfile
FROM debian:sid-slim
RUN apt-get update && apt-get install -y curl
```

The workspace is visible at `/workspace` in the container.

Note that this extension doesn't require remote container.
This extension downloads the Wasm image converted from the container and runs it in the WebAssembly VM in your browser.

You can customize `setting.json` if you want to load other containers.

## Networking

Running the following in the container will get the contents of the GitHub Pages.

```
$ curl https://ktock.github.io/container2wasm-demo/
```

HTTP(S) networking is available in the contaienr with restrictions by the browser (CORS-restricted and no control over [Forbidden headers](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name)). (see also the project [`README`](../README.md)).

## More info about the container

The container is served from [container2wasm-demo](https://github.com/ktock/container2wasm-demo) repo.
Please see that repo for more information.
