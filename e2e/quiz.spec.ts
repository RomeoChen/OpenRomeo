import { test, expect } from '@playwright/test'

test.describe('Quiz Page', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/quiz')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should load the quiz page', async ({ page }) => {
    await expect(page).toHaveURL(/\/quiz/)
    await expect(page.getByText('刷题练习')).toBeVisible()
  })

  test('should display the first question', async ({ page }) => {
    await expect(page.getByText('W1')).toBeVisible()
    await expect(page.getByText('已答')).toBeVisible()
  })

  test('should allow selecting an answer', async ({ page }) => {
    // Click the first option
    const firstOption = page.locator('button').filter({ hasText: /^A\./ }).first()
    await firstOption.click()
    
    // Should show the answer section
    await expect(page.getByText('查看答案')).toBeVisible()
  })

  test('should show answer when clicking the answer toggle', async ({ page }) => {
    // Click the first option
    const firstOption = page.locator('button').filter({ hasText: /^A\./ }).first()
    await firstOption.click()
    
    // Click the answer toggle button
    await page.getByText('查看答案').click()
    
    // Should show the answer content
    await expect(page.getByText('收起答案')).toBeVisible()
  })

  test('should navigate to next question', async ({ page }) => {
    // Click next button
    await page.getByText('下一题').click()
    
    // Should show W2 indicator
    await expect(page.getByText('W2')).toBeVisible()
  })

  test('should navigate to previous question', async ({ page }) => {
    // First go to next question
    await page.getByText('下一题').click()
    await expect(page.getByText('W2')).toBeVisible()
    
    // Then go back
    await page.getByText('上一题').click()
    await expect(page.getByText('W1')).toBeVisible()
  })

  test('should jump to specific week', async ({ page }) => {
    // Click on week 3 button
    await page.getByRole('button', { name: 'W3' }).click()
    
    // Should show W3 indicator
    await expect(page.getByText('W3')).toBeVisible()
  })

  test('should save progress to localStorage', async ({ page }) => {
    // Answer a question
    const firstOption = page.locator('button').filter({ hasText: /^A\./ }).first()
    await firstOption.click()
    
    // Check if localStorage has the progress
    const progress = await page.evaluate(() => {
      return localStorage.getItem('open-romeo-quiz-progress')
    })
    expect(progress).toBeTruthy()
  })

  test('should toggle dark/light mode', async ({ page }) => {
    // Find the dark mode toggle
    const toggle = page.locator('.n-switch')
    await toggle.click()
    
    // Check if background color changed
    const bg = await page.locator('body').evaluate(el => {
      return window.getComputedStyle(el).backgroundColor
    })
    // Should be light mode (white-ish)
    expect(bg).not.toBe('rgb(0, 0, 0)')
  })

  test('should use keyboard navigation', async ({ page }) => {
    // Press right arrow to go to next question
    await page.keyboard.press('ArrowRight')
    await expect(page.getByText('W2')).toBeVisible()
    
    // Press left arrow to go back
    await page.keyboard.press('ArrowLeft')
    await expect(page.getByText('W1')).toBeVisible()
  })

  test('should reset progress when clicking reset button', async ({ page }) => {
    // First answer a question
    const firstOption = page.locator('button').filter({ hasText: /^A\./ }).first()
    await firstOption.click()
    
    // Handle the confirm dialog
    page.on('dialog', dialog => dialog.accept())
    
    // Click reset button
    await page.getByText('重置').click()
    
    // Progress should be reset
    await expect(page.getByText('0 /')).toBeVisible()
  })
})
