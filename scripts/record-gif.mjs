// Headless walkthrough recorder → animated GIF of the LIVE deployed app.
// Uses the system Chrome (no browser download) + pure-JS PNG decode + GIF encode.
import puppeteer from "puppeteer-core";
import { PNG } from "pngjs";
import gifenc from "gifenc";
const { GIFEncoder, quantize, applyPalette } = gifenc;
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.TARGET_URL || "https://jsoeh.github.io/beyond-concierge-os/";
const OUT = process.env.OUT || "beyond-concierge-walkthrough.gif";
const W = 1280, H = 800;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// route, dwell ms, optional interaction(page)
const steps = [
  { route: "", hold: 1700 },
  { route: "", hold: 1500, act: async (p) => clickText(p, "This Year") },
  { route: "profit", hold: 1700 },
  { route: "profit", hold: 1400, act: async (p) => clickText(p, "ThinWorks Body Contouring") },
  { route: "iv", hold: 1700 },
  { route: "iv", hold: 1700, act: async (p) => clickText(p, "Dispense & deduct inventory") },
  { route: "glp1", hold: 1700 },
  { route: "inventory", hold: 1600 },
  { route: "seo", hold: 1600 },
  { route: "social", hold: 1600 },
  { route: "social", hold: 1400, act: async (p) => clickText(p, "Generate ideas") },
  { route: "ads", hold: 1600 },
  { route: "crm", hold: 1600 },
  { route: "growth", hold: 1600 },
  { route: "advisor", hold: 2000 },
];

async function clickText(page, text) {
  await page.evaluate((t) => {
    const els = [...document.querySelectorAll("button, a, tr, [role=button]")];
    const el = els.find((e) => (e.textContent || "").includes(t));
    if (el) el.click();
  }, text);
}

async function main() {
  const userDataDir = mkdtempSync(join(tmpdir(), "bc-gif-"));
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    userDataDir,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", "--force-color-profile=srgb"],
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  console.log("loading", BASE);
  await page.goto(BASE + "#/", { waitUntil: "networkidle2", timeout: 60000 });
  await wait(2500); // fonts + first chart animation

  const frames = [];
  let last = "";
  for (const [i, s] of steps.entries()) {
    if (s.route !== last) {
      await page.evaluate((r) => { location.hash = "#/" + r; }, s.route);
      await wait(1900); // lazy chunk + page transition + chart draw
      last = s.route;
    }
    if (s.act) { try { await s.act(page); } catch {} await wait(1100); }
    const buf = await page.screenshot({ type: "png" });
    const png = PNG.sync.read(Buffer.from(buf));
    frames.push({ data: new Uint8Array(png.data), hold: s.hold });
    console.log(`frame ${i + 1}/${steps.length} · /${s.route || "home"}`);
  }

  console.log("encoding GIF…");
  const gif = GIFEncoder();
  for (const f of frames) {
    const palette = quantize(f.data, 256);
    const index = applyPalette(f.data, palette);
    gif.writeFrame(index, W, H, { palette, delay: f.hold });
  }
  gif.finish();
  writeFileSync(OUT, gif.bytes());
  await browser.close();
  console.log("wrote", OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
