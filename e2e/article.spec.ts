import { test, expect } from '@playwright/test'

test.describe('Article Page', () => {
  test('should load an article when clicking from home page', async ({ page }) => {
    await page.goto('/')
    
    // Wait for articles to load
    await page.waitForSelector('article, .article-card, [class*="article"]', { timeout: 10000 })
    
    // Click on the first article
    const firstArticle = page.locator('article, .article-card, [class*="article"]').first()
    await firstArticle.click()
    
    // Should navigate to an article page
    await expect(page).not.toHaveURL('/')
  })

  test('should display article content', async ({ page }) => {
    // Navigate directly to an article
    await page.goto('/article/00-8周学习计划总览')
    
    // Should show article title
    await expect(page.getByRole('heading')).toBeVisible()
  })

  test('should load article questions', async ({ page }) => {
    await page.goto('/article/00-8周学习计划总览')
    
    // Wait for article to load
    await page.waitForSelector('.article-content, article', { timeout: 10000 })
    
    // Should show question blocks
    await expect(page.getByText('Q')).toBeVisible()
  })

  test('should allow answering questions in article', async ({ page }) => {
    await page.goto('/article/00-8周学习计划总览')
    
    // Wait for content
    await page.waitForSelector('.article-content, article', { timeout: 10000 })
    
    // Find and click an answer option
    const option = page.locator('.q-block-wrapper .space-y-2 > div').first()
    if (await option.isVisible()) {
      await option.click()
      
      // Should show result
      await expect(page.getByText(/正确|错误/)).toBeVisible()
    }
  })

  test('should show progress indicator', async ({ page }) => {
    await page.goto('/article/00-8周学习计划总览')
    
    // Should show some progress info
    await expect(page.getByText(/已答|未作答/)).toBeVisible()
  })
})
