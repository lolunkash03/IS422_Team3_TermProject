const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");
const puppeteer = require("puppeteer");

// =========================
// Config
// =========================

// If BASE_URL is NOT set, we use a local static server.
// If you want to point at your deployed site instead, set:
//   BASE_URL=https://is424-term-project.web.app node app.js
const USE_LOCAL_SERVER = !process.env.BASE_URL;
const BASE_URL =
  process.env.BASE_URL || `http://localhost:${process.env.PORT || 0}/`; // actual port resolved after server starts

// Visible browser, generous timeout for slow networks
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 1000);
let lastDialogMessage = null;

// Admin credentials (for blog creation)
const adminCreds = {
  email: "lcui42@wisc.edu",
  password: "Ksidasd",
};

// =========================
// Helpers
// =========================

function buildRandomUser() {
  const now = Date.now();
  return {
    email: `tester_${now}@example.com`,
    password: `Pass${now}a!`,
  };
}

async function fillInput(page, selector, value) {
  const el = await page.waitForSelector(selector, { visible: true });
  await el.click({ clickCount: 3 });
  await el.type(value);
}

async function waitForAuthMode(page, mode, timeout = 3000) {
  const className =
    mode === "signed-in" ? "auth-cached-signed-in" : "auth-cached-signed-out";
  await page.waitForFunction(
    (expectedClass) =>
      document.documentElement.classList.contains(expectedClass),
    { timeout },
    className
  );
}

async function openAuth(page, mode) {
  await page.waitForSelector("#authModal");

  // Try the intended trigger first (e.g., navbar "Sign In"/"Sign Up")
  const trigger =
    (await page.$(`a[href="#auth"][data-mode="${mode}"]`)) ||
    (await page.$('a[href="#auth"]'));
  if (trigger) {
    await trigger.click();
  }

  const desiredSelector = mode === "signup" ? "#signUpForm" : "#signInForm";

  // Ensure the modal opens and the right form is visible even if site JS is flaky
  await page.evaluate(
    (desiredSelector, mode) => {
      const modal = document.getElementById("authModal");
      if (modal && !modal.classList.contains("is-active")) {
        modal.classList.add("is-active");
      }
      const signIn = document.getElementById("signInForm");
      const signUp = document.getElementById("signUpForm");
      if (signIn && signUp) {
        const showSignUp = mode === "signup";
        signIn.style.display = showSignUp ? "none" : "block";
        signUp.style.display = showSignUp ? "block" : "none";
      }
    },
    desiredSelector,
    mode
  );

  await page.waitForSelector(desiredSelector, { visible: true });
}

async function waitForSignedOut(page) {
  await waitForAuthMode(page, "signed-out", 5000);
  await page.waitForSelector('[data-auth="signed-out"]', {
    visible: true,
    timeout: 5000,
  });
}

async function waitForSignedIn(page) {
  await waitForAuthMode(page, "signed-in", 5000);
  await page.waitForFunction(
    () => {
      const el = document.querySelector("#signOutBtn");
      return el && window.getComputedStyle(el).display !== "none";
    },
    { timeout: 5000 }
  );
}

async function ensureNavReadyForClick(page) {
  await page.evaluate(() => {
    // Close any active modals that might overlay the navbar
    document.querySelectorAll(".modal.is-active").forEach((m) => {
      m.classList.remove("is-active");
    });

    // Expand navbar menu if burger is present (mobile layout)
    const burger = document.querySelector(".navbar-burger");
    const targetId =
      burger?.dataset.target || burger?.getAttribute("data-target");
    if (burger && targetId) {
      const menu = document.getElementById(targetId);
      if (menu && !burger.classList.contains("is-active")) {
        burger.classList.add("is-active");
        menu.classList.add("is-active");
      }
    }

    // Make sure the nav is in view
    window.scrollTo({ top: 0, behavior: "auto" });
  });

  await page.waitForSelector("#signOutBtn", { visible: true });
}

async function signUpNewUser(page) {
  const user = buildRandomUser();
  console.log("Signing up user:", user.email);

  await openAuth(page, "signup");
  await fillInput(page, "#signUpEmail", user.email);
  await fillInput(page, "#signUpPassword", user.password);

  await Promise.all([
    page.click('#signUpForm button[type="submit"]'),
    waitForSignedIn(page),
  ]);

  console.log("Sign up success, signing out...");
  await ensureNavReadyForClick(page);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {}),
    page.click("#signOutBtn"),
  ]);

  await waitForSignedOut(page);
  console.log("Signed out after sign up.");

  return user;
}

async function signInAsAdmin(page) {
  lastDialogMessage = null;
  console.log("Signing in as admin:", adminCreds.email);
  await openAuth(page, "signin");
  await fillInput(page, "#signInEmail", adminCreds.email);
  await fillInput(page, "#signInPassword", adminCreds.password);

  try {
    await Promise.all([
      page.click('#signInForm button[type="submit"]'),
      waitForSignedIn(page),
    ]);
  } catch (err) {
    const detail = lastDialogMessage
      ? ` (page dialog: ${lastDialogMessage})`
      : "";
    throw new Error(
      `Admin sign in failed${detail}: ${err.message || err}. ` +
        "Double-check admin credentials and that Firebase auth allows email/password sign-in."
    );
  }

  console.log("Admin sign in success.");
  await page.waitForSelector("#openCreateBlogModalBtn", { visible: true });
}

async function createBlog(page) {
  const title = `Automated Blog ${new Date().toISOString()}`;
  const content = ["This blog was created by the Puppeteer 67."].join(" ");

  console.log("Creating blog:", title);
  await page.click("#openCreateBlogModalBtn");
  await page.waitForSelector("#createBlogModal.is-active", { visible: true });

  await fillInput(page, "#blogTitle", title);
  await fillInput(page, "#blogContent", content);

  await Promise.all([
    page.click('#createBlogForm button[type="submit"]'),
    page.waitForSelector("#createBlogModal", { visible: false }),
  ]);

  await page.waitForFunction(
    (expectedTitle) => {
      const titles = [
        ...document.querySelectorAll("#blogCards .card .title"),
      ].map((el) => el.textContent.trim());
      return titles.some((t) => t.includes(expectedTitle));
    },
    {},
    title
  );

  console.log("Blog published and visible:", title);
}

function startStaticServer(rootDir) {
  const mimeMap = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const parsed = url.parse(req.url);
        let pathname = decodeURIComponent(parsed.pathname || "/");
        if (pathname === "/") pathname = "/Blog.html";

        const safePath = path.normalize(path.join(rootDir, pathname));
        if (!safePath.startsWith(rootDir)) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }

        if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }

        const ext = path.extname(safePath).toLowerCase();
        const mime = mimeMap[ext] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": mime });
        fs.createReadStream(safePath).pipe(res);
      } catch (err) {
        console.error("[static server] error", err);
        res.writeHead(500);
        res.end("Server error");
      }
    });

    server.listen(process.env.PORT || 0, () => {
      const { port } = server.address();
      resolve({
        server,
        url: `http://localhost:${port}/Blog.html`,
      });
    });

    server.on("error", reject);
  });
}

// =========================
// Main
// =========================

async function main() {
  let server;
  let targetUrl = BASE_URL;

  if (USE_LOCAL_SERVER) {
    const started = await startStaticServer(__dirname);
    server = started.server;
    targetUrl = started.url;
    console.log("Static server started at:", targetUrl);
  }

  const browser = await puppeteer.launch({
    headless: false, //  always show test Chrome
    slowMo: 80, //  Slow down actions so you can see them
    defaultViewport: null, //  Normal window size
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // Mac path
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT_MS);
  page.on("dialog", async (dialog) => {
    lastDialogMessage = dialog.message();
    console.warn("[browser dialog]", dialog.type(), dialog.message());
    await dialog.accept().catch(() => {});
  });

  // Log browser console/errors to help diagnose issues
  page.on("console", (msg) =>
    console.log("[browser console]", msg.type(), msg.text())
  );
  page.on("pageerror", (err) =>
    console.error("[browser pageerror]", err.message || err)
  );
  page.on("requestfailed", (req) =>
    console.error(
      "[browser requestfailed]",
      req.url(),
      req.failure()?.errorText
    )
  );

  try {
    console.log("Opening app at:", targetUrl);
    await page.goto(targetUrl, { waitUntil: "networkidle2" });

    await signUpNewUser(page);
    await signInAsAdmin(page);
    await createBlog(page);

    console.log("All flows completed.");
  } catch (err) {
    console.error("Test run failed:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    if (server) {
      server.close();
    }
  }
}

main();
