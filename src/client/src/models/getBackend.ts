import { enableMapSet } from "immer";
import { SocketBackend } from "./backends/socket/SocketBackend";
import { WasmBackend } from "./backends/wasm/WasmBackend";
import { SoCDP8 } from "./SoCDP8";

let pdp8: SoCDP8 | undefined;

export function getBackend() {
    if (!pdp8) {
        let url = "";
        if (window.location.toString().includes("localhost")) {
            url = "http://192.168.178.71:8000/"
        }

        enableMapSet();

        let backend;
        if (true) {
            backend = new WasmBackend();
        } else {
            backend = new SocketBackend(url);
        }

        pdp8 = new SoCDP8(backend);
    }

    return pdp8;
}
