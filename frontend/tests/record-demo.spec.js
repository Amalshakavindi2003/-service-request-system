const { test } = require('@playwright/test');

test('record full demo (admin then user)', async ({ page }) => {
  // Admin flow
  await page.goto('/login');
  await page.click('text=Use Admin Demo');
  await page.click('text=Login');
  await page.waitForURL('/admin');

  await page.goto('/admin/requests');
  await page.waitForTimeout(800);
  await page.goto('/analytics');
  await page.waitForTimeout(800);

  // Log out
  await page.click('text=Logout');
  await page.waitForURL('/login');

  // User flow
  await page.click('text=Use User Demo');
  await page.click('text=Login');
  await page.waitForURL('/dashboard');

  await page.goto('/dashboard/service-catalog');
  await page.waitForTimeout(600);
  await page.goto('/dashboard/help-center');
  await page.waitForTimeout(600);
  await page.goto('/dashboard/notifications');
  await page.waitForTimeout(600);

  // End - video will be saved in default video folder
});