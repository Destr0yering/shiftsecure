import { spawn, spawnSync } from "node:child_process";

const host = "127.0.0.1";
const port = "3000";
const baseUrl = `http://${host}:${port}`;
const testEnvironment = {
  ...process.env,
  NODE_ENV: "production",
  SHIFTSECURE_DB_PATH: ":memory:",
};

const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    host,
    "--port",
    port,
  ],
  {
    env: testEnvironment,
    stdio: "inherit",
  },
);

async function waitForServer() {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before E2E startup (${server.exitCode})`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("Timed out waiting for the E2E server");
}

async function stopServer() {
  if (server.exitCode !== null || server.pid === undefined) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], {
      stdio: "ignore",
    });
  } else {
    server.kill("SIGTERM");
  }

  if (server.exitCode === null) {
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 2_000);
      server.once("exit", () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }
}

let exitCode = 1;

try {
  await waitForServer();

  const playwright = spawn(
    process.execPath,
    ["node_modules/@playwright/test/cli.js", "test"],
    {
      env: { ...testEnvironment, PLAYWRIGHT_TEST_BASE_URL: baseUrl },
      stdio: "inherit",
    },
  );

  exitCode = await new Promise((resolve, reject) => {
    playwright.once("error", reject);
    playwright.once("exit", (code) => resolve(code ?? 1));
  });
} finally {
  await stopServer();
}

process.exit(exitCode);
