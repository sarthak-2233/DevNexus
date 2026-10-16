
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function runNpm(args, projectDirectory, timeout) {
  return execFileAsync("npm.cmd", args, {
    cwd: projectDirectory,
    timeout,
    maxBuffer: 5 * 1024 * 1024,
    windowsHide: true,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
}

export async function validateProductionBuild(
  projectDirectory,
  { installDependencies = true } = {}
) {
  try {
    if (installDependencies) {
      console.log(
        "Installing dependencies in:",
        projectDirectory
      );

      const installResult = await runNpm(
        ["install", "--no-audit", "--no-fund"],
        projectDirectory,
        600000
      );

      console.log(
        installResult.stdout ||
          "Dependency installation completed."
      );
    } else {
      console.log(
        "Skipping dependency installation; using existing node_modules."
      );
    }

    console.log("Running production build...");

    const buildResult = await runNpm(
      ["run", "build"],
      projectDirectory,
      120000
    );

    return {
      success: true,
      message: "Production build completed successfully.",
      output: [
        buildResult.stdout,
        buildResult.stderr,
      ]
        .filter(Boolean)
        .join("\n"),
    };
  } catch (error) {
    const details = [
      error.stdout,
      error.stderr,
      error.message,
      error.code ? `Error code: ${error.code}` : "",
      error.signal ? `Signal: ${error.signal}` : "",
      error.killed
        ? "The command was terminated."
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    console.error(
      "Production build failed:\n",
      details
    );

    return {
      success: false,
      message: "Production build failed.",
      output: details.slice(-12000),
    };
  }
}
