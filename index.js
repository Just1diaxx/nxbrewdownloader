const path = require("path");
const { spawn } = require("child_process");

const isElectron = !!process.versions.electron;

if (isElectron) {
    require("./src/main.js");
} else {
    const electron = require("electron");

    const child = spawn(
        electron,
        [path.join(__dirname, "src", "main.js")],
        { stdio: "inherit" }
    );

    child.on("close", code => process.exit(code ?? 0));
}
