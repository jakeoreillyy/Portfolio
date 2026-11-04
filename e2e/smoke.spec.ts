import { expect, test, type Page } from "@playwright/test";

// Every page is prerendered, so its content shows before the client bundle has
// run. Waiting for the network to go quiet lets the bundle load and render, so
// assertions see the live app and any errors it logged.
function open(page: Page, path: string) {
  return page.goto(path, { waitUntil: "networkidle" });
}

// Console errors and uncaught exceptions, gathered so a test can assert the
// page ran cleanly.
function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test.beforeEach(async ({ page }) => {
  // Vercel serves the analytics script only on deployments. Under vite preview
  // it 404s, and the console would log that as an error on every page.
  await page.route("**/_vercel/insights/script.js", (route) =>
    route.fulfill({ contentType: "text/javascript", body: "" }),
  );
});

for (const { path, heading } of [
  { path: "/", heading: "Jake O'Reilly" },
  { path: "/contact", heading: "Get in touch." },
]) {
  test(`${path} renders its heading without console errors`, async ({ page }) => {
    const errors = collectErrors(page);
    await open(page, path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    expect(errors).toEqual([]);
  });
}

test("the empty contact form is blocked by required-field validation", async ({ page }) => {
  const contactRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/contact") contactRequests.push(request.url());
  });

  await open(page, "/contact");
  await page.getByRole("button", { name: "Send message" }).click();

  // The browser cancels the submit and focuses the first empty required field.
  const name = page.getByLabel("Name", { exact: true });
  await expect(name).toBeFocused();
  expect(await name.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  expect(contactRequests).toEqual([]);
});
