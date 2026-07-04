import { expect, test } from "@playwright/test";

test("landing loads with the manifesto claim", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /give your phone/i }),
  ).toBeVisible();
});

test("embedded demo drives the real body: clamp + estop latch", async ({
  page,
}) => {
  await page.goto("/#live");
  const demo = page.locator("#live");

  // wait for the body link to come up
  await expect(demo.getByRole("log")).toContainText("link up", {
    timeout: 15_000,
  });

  // look left → mock mind emits gaze(-45), body steps it (≤25°/cmd)
  await demo.getByPlaceholder(/try/i).fill("look left");
  await demo.getByRole("button", { name: "Send" }).click();
  await expect(demo.getByRole("log")).toContainText("clamped pose={pan:-25", {
    timeout: 10_000,
  });

  // estop latches, subsequent motion refused by the BODY
  await demo
    .getByRole("button", { name: "Emergency stop", exact: true })
    .click();
  await expect(demo.getByRole("log")).toContainText("ESTOP sent");
  await demo.getByPlaceholder(/try/i).fill("look right");
  await demo.getByRole("button", { name: "Send" }).click();
  await expect(demo.getByRole("log")).toContainText(
    "✗ estopped — motion locked",
    { timeout: 10_000 },
  );
});

test("console live drives the sim for a signed-in (dev-auth) user", async ({
  page,
}) => {
  await page.goto("/console/live");
  await expect(page.getByRole("log")).toContainText("link up", {
    timeout: 15_000,
  });
  await page.locator("#stimulus").fill("please nod");
  await page.getByRole("button", { name: /^Send/ }).click();
  await expect(page.getByRole("log")).toContainText("nod{", {
    timeout: 10_000,
  });
  await expect(page.getByRole("log")).toContainText("✓");
});

test("waitlist stores and returns a position", async ({ page }) => {
  await page.goto("/#waitlist");
  const email = `pw-${Date.now()}@example.com`;
  const section = page.locator("#waitlist");
  await section.getByLabel("Email").fill(email);
  await section.getByRole("button", { name: "Join the waitlist" }).click();
  await expect(page.getByText(/position #\d+/)).toBeVisible({
    timeout: 10_000,
  });
});
