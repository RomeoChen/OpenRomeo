import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the home page', async ({ page }) => {
    await expect(page).toHaveTitle(/OpenRomeo/i)
  })

  test('should display navigation header', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
    await expect(page.getByText('OpenRomeo')).toBeVisible()
  })

  test('should navigate to quiz page when clicking quiz link', async ({ page }) => {
    // Look for the quiz link
    const quizLink = page.getByText('刷题').first()
    await quizLink.click()
    await expect(page).toHaveURL(/\/quiz/)
  })

  test('should display article list', async ({ page }) => {
    // Should show some articles
    const articles = page.locator('article, .article-card, [class*="article"]').first()
    await expect(articles).toBeVisible({ timeout: 10000 })
  })
})
