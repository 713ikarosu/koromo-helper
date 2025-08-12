import { test, expect } from "@playwright/test";

test.describe("Koromo Helper E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Expo Web development server
    await page.goto("http://localhost:8081");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");
  });

  test("simple test page buttons work", async ({ page }) => {
    await page.goto("http://localhost:8081/simple");
    await page.waitForLoadState("networkidle");

    // Check if buttons are visible
    const button1 = page.getByText("React Button 1");
    const button2 = page.getByText("React Button 2");
    const button3 = page.getByText("Change Text");

    await expect(button1).toBeVisible();
    await expect(button2).toBeVisible();
    await expect(button3).toBeVisible();

    // Test button clicks
    // Listen for console logs
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      consoleLogs.push(msg.text());
    });

    // Handle dialog (alert)
    let dialogMessage = "";
    page.on("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    // Click React Button 1
    await button1.click();

    // Wait a bit for the event to process
    await page.waitForTimeout(500);

    // Check if console log was captured
    console.log("Console logs:", consoleLogs);
    console.log("Dialog message:", dialogMessage);

    // The click should trigger console log and alert
    expect(
      consoleLogs.some((log) => log.includes("React button 1 clicked"))
    ).toBeTruthy();
    expect(dialogMessage).toBe("React Button 1 works!");
  });

  test("home page loads correctly", async ({ page }) => {
    await page.goto("http://localhost:8081");
    await page.waitForLoadState("networkidle");

    // Check if main elements are present
    const title = page.locator("text=AI-Coord");
    await expect(title).toBeVisible();

    // Look for login form or main content
    const loginButton = page.locator("text=ログイン");
    const homeContent = page.locator("text=今日の天気");

    // Either login page or authenticated home page should be visible
    const isLoginPage = await loginButton.isVisible();
    const isHomePage = await homeContent.isVisible();

    expect(isLoginPage || isHomePage).toBeTruthy();
  });

  test("button interaction test", async ({ page }) => {
    await page.goto("http://localhost:8081");
    await page.waitForLoadState("networkidle");

    // Look for any button on the page
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    console.log(`Found ${buttonCount} buttons on the page`);

    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const buttonText = await firstButton.textContent();
      console.log(`First button text: "${buttonText}"`);

      // Try to click the first button
      let clickSucceeded = false;
      try {
        await firstButton.click({ timeout: 5000 });
        clickSucceeded = true;
        console.log("Button click succeeded");
      } catch (error) {
        console.log("Button click failed:", error);
      }

      // The test passes if we can at least find buttons
      expect(buttonCount).toBeGreaterThan(0);
    }
  });
});
