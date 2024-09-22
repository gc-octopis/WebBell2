import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";

await enable();

console.log(`registered for autostart? ${await isEnabled()}`);