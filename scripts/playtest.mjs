import puppeteer from "puppeteer-core";
import { profile } from "../src/data/profile.js";
import { getFacts } from "../src/lib/facts.js";

const BASE = "http://127.0.0.1:4173/";
const shots = "/tmp/spirt-shots";
const errors = [];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function overflow(page) {
  return page.evaluate(() => ({
    x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    y: document.documentElement.scrollHeight - document.documentElement.clientHeight,
  }));
}

async function holdUntil(page, key, done, timeout = 8000) {
  const start = Date.now();
  let last = null;
  while (Date.now() - start < timeout) {
    await page.keyboard.down(key);
    await delay(50);
    await page.keyboard.up(key);
    last = await page.$eval("[data-testid=avatar]", (el) => ({
      x: Number(el.dataset.x),
      y: Number(el.dataset.y),
    }));
    if (done(last)) return last;
  }
  throw new Error(`bloqué sur ${key} à ${JSON.stringify(last)}`);
}

async function main() {
  const { mkdir } = await import("node:fs/promises");
  await mkdir(shots, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await page.waitForSelector("[data-testid=hub]");
  const title = await page.$eval("h1", (el) => el.textContent);
  if (!title.includes(profile.name)) throw new Error(`titre inattendu: ${title}`);
  let box = await overflow(page);
  if (box.x > 1) throw new Error(`hub dépasse en largeur (${box.x})`);
  await page.screenshot({ path: `${shots}/01-hub.png` });

  await page.click("[data-testid=notebook-open]");
  await page.waitForSelector("[data-testid=notebook]");
  const note = await page.$eval("[data-testid=notebook]", (el) => el.innerText);
  if (!note.includes("Musique")) throw new Error("le carnet ne montre pas Musique");
  if (!note.includes("Passion à identifier")) throw new Error("les passions sont dévoilées trop tôt");
  if (note.includes("Le cinéma est ma façon")) throw new Error("texte de passion visible avant le jeu");
  await page.screenshot({ path: `${shots}/02-carnet.png` });
  await page.click("[aria-label='Fermer le carnet']");

  await page.click("[data-testid=node-passions]");
  await page.waitForSelector("[data-testid=passion-card]");
  for (let guard = 0; guard < 12; guard += 1) {
    const label = await page.$eval("[data-testid=passion-card] h2", (el) => el.textContent.trim());
    if (label === "Collection complète") break;
    const truth = profile.passions.truths.some((item) => item.label === label);
    await page.click(truth ? "[data-testid=passion-yes]" : "[data-testid=passion-no]");
    await delay(200);
    const count = await page.$eval("[data-testid=progress-count]", (el) => el.textContent);
    if (count.trim().startsWith("1/")) break;
    if (guard === 11) throw new Error("aucune passion débloquée");
  }
  await page.screenshot({ path: `${shots}/03-passions.png` });

  await page.click("[data-testid=notebook-open]");
  await page.waitForSelector("[data-testid=notebook]");
  await page.waitForFunction(() => {
    const text = document.querySelector("[data-testid=notebook]")?.innerText || "";
    return ["Le cinéma", "Le son", "Les jeux", "L'image", "Les langues"].some((bit) => text.includes(bit));
  });
  await page.click("[aria-label='Fermer le carnet']");

  await page.click("[aria-label='Retour au ciel']");
  await page.waitForSelector("[data-testid=hub]");
  await page.click("[data-testid=node-studies]");
  await page.waitForSelector("[data-testid=game-studies]");
  const correct = profile.studies.map((item) => item.label);
  for (let guard = 0; guard < 20; guard += 1) {
    const labels = await page.$$eval(".film__label", (nodes) =>
      nodes.map((node) => node.childNodes[node.childNodes.length - 1].textContent.trim()),
    );
    if (labels.join("|") === correct.join("|")) break;
    const index = labels.findIndex((item, i) => item !== correct[i]);
    const from = labels.indexOf(correct[index]);
    const ups = await page.$$("[aria-label^='Monter']");
    await ups[from].click();
    if (guard === 19) throw new Error(`ordre non résolu: ${labels.join(", ")}`);
  }
  await page.click("[data-testid=study-validate]");
  await page.waitForSelector(".timeline");
  await page.waitForFunction(() => document.querySelector("[data-testid=progress-count]").textContent.includes("6/"));
  await page.screenshot({ path: `${shots}/04-etudes.png` });

  await page.click("[aria-label='Retour au ciel']");
  await page.click("[data-testid=node-languages]");
  await page.waitForSelector("[data-testid=game-languages]");
  const slips = await page.$$("[data-testid=lang-word]");
  let chosen = null;
  for (const slip of slips) {
    const word = await slip.evaluate((el) => el.textContent.trim());
    if (word === "brume") chosen = slip;
  }
  if (!chosen) throw new Error("mot brume introuvable");
  await chosen.click();
  await page.click("[data-testid=bowl-lang-fr]");
  const choices = await page.$$(".riddle button");
  for (const choice of choices) {
    const text = await choice.evaluate((el) => el.textContent);
    if (text.includes("rencontrer")) await choice.click();
  }
  await page.waitForFunction(() => document.body.innerText.includes("Une langue de plus"));
  await page.screenshot({ path: `${shots}/05-langues.png` });

  await page.click("[aria-label='Retour au ciel']");
  await page.click("[data-testid=node-personality]");
  await page.waitForSelector("[data-testid=pawn]");
  const before = await page.$eval("[data-testid=progress-count] strong", (el) => el.textContent);
  for (let step = 0; step < 4; step += 1) {
    await page.keyboard.press("ArrowDown");
    await delay(80);
  }
  await page.waitForFunction(
    (start) => document.querySelector("[data-testid=progress-count] strong").textContent !== start,
    {},
    before,
  );
  await page.screenshot({ path: `${shots}/06-labyrinthe.png` });
  box = await overflow(page);
  if (box.x > 1) throw new Error(`labyrinthe dépasse (${box.x})`);

  await page.click("[aria-label='Retour au ciel']");
  await page.click("[data-testid=node-tastes]");
  await page.waitForSelector("[data-testid=avatar]");
  await delay(200);
  const origin = await page.$eval("[data-testid=avatar]", (el) => ({ x: Number(el.dataset.x), y: Number(el.dataset.y) }));
  await holdUntil(page, "ArrowLeft", (pos) => pos.x < 108);
  const lane = await page.$eval("[data-testid=avatar]", (el) => Number(el.dataset.x));
  if (lane < 86) await holdUntil(page, "ArrowRight", (pos) => pos.x > 90);
  await holdUntil(page, "ArrowUp", (pos) => pos.y < 90);
  await holdUntil(page, "ArrowRight", (pos) => pos.x > 140);
  await page.keyboard.press("Space");
  await delay(300);
  const tasteCount = await page.$eval("[data-testid=progress-count] strong", (el) => el.textContent);
  if (Number(tasteCount) <= Number(before)) throw new Error("objet caché non ramassé");
  await page.screenshot({ path: `${shots}/07-gouts.png` });
  if (origin.x === 0) throw new Error("position initiale nulle");

  const joy = await page.$("[data-testid=joystick]");
  const joyBox = await joy.boundingBox();
  if (!joyBox || joyBox.width < 80) throw new Error("joystick trop petit");
  const x0 = await page.$eval("[data-testid=avatar]", (el) => Number(el.dataset.x));
  await page.mouse.move(joyBox.x + joyBox.width / 2, joyBox.y + joyBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(joyBox.x + joyBox.width / 2 + 36, joyBox.y + joyBox.height / 2, { steps: 4 });
  await delay(350);
  await page.mouse.up();
  const x1 = await page.$eval("[data-testid=avatar]", (el) => Number(el.dataset.x));
  if (x1 <= x0) throw new Error(`joystick inactif ${x0} -> ${x1}`);

  await page.click("[aria-label='Retour au ciel']");
  await page.click("[data-testid=node-universe]");
  await page.waitForSelector("[data-testid=avatar]");
  await delay(250);
  await holdUntil(page, "ArrowLeft", (pos) => pos.x < 220);
  await holdUntil(page, "ArrowUp", (pos) => pos.y < 95);
  await holdUntil(page, "ArrowLeft", (pos) => pos.x < 110);
  await page.keyboard.press("Space");
  await delay(250);
  await page.screenshot({ path: `${shots}/08-univers.png` });

  const ids = getFacts().map((fact) => fact.id);
  await page.evaluate((stored) => {
    localStorage.setItem("mon-univers-carnet-v1", JSON.stringify(stored));
  }, ids);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-testid=finale]");
  const finale = await page.$eval("h1", (el) => el.textContent);
  if (!finale.includes("Tu connais maintenant mon univers")) throw new Error(finale);
  await page.screenshot({ path: `${shots}/09-finale.png` });

  await page.click("[aria-label='Retour au ciel']").catch(() => {});
  await page.goto(`${BASE}#/partager`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-testid=share-empty]");
  const shareText = await page.$eval("[data-testid=share]", (el) => el.innerText);
  if (/localhost/i.test(shareText) && shareText.includes("http://localhost")) {
    throw new Error("localhost proposé comme QR");
  }
  if (await page.$("[data-testid=share-qr]")) throw new Error("QR généré sans URL publique");
  await page.type("[data-testid=share-input]", "https://mon-univers.vercel.app");
  await page.waitForSelector("[data-testid=share-qr]");
  const caption = await page.$eval(".qr figcaption", (el) => el.textContent);
  if (caption.includes("localhost")) throw new Error(`QR local: ${caption}`);
  if (!caption.startsWith("https://mon-univers.vercel.app/#/")) throw new Error(caption);
  await page.screenshot({ path: `${shots}/10-qr.png` });

  await page.setViewport({ width: 1280, height: 800 });
  await page.evaluate(() => localStorage.removeItem("mon-univers-carnet-v1"));
  await page.goto(`${BASE}?vue=ordi#/gouts`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-testid=avatar]");
  const joyDisplay = await page.$eval("[data-testid=joystick]", (el) => getComputedStyle(el).display);
  if (joyDisplay !== "none") throw new Error(`joystick desktop visible: ${joyDisplay}`);
  await page.keyboard.down("ArrowRight");
  await delay(200);
  await page.keyboard.up("ArrowRight");
  await page.screenshot({ path: `${shots}/11-desktop-gouts.png` });

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(`${BASE}?fin=1#/final`, { waitUntil: "domcontentloaded" });
  await page.evaluate((stored) => localStorage.setItem("mon-univers-carnet-v1", JSON.stringify(stored)), ids);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-testid=finale]");
  await page.click(".finale__actions .btn");
  await page.click(".finale__actions .btn");
  await page.waitForSelector("[data-testid=hub]");
  const resetCount = await page.$eval("[data-testid=progress-count]", (el) => el.textContent);
  if (!resetCount.includes("0/30")) throw new Error(`reset raté: ${resetCount}`);

  if (errors.length) {
    console.error(errors.join("\n"));
    throw new Error(`${errors.length} erreurs JavaScript`);
  }
  console.log("Parcours jouable validé.");
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
