import { test, expect } from '@playwright/test';

const LANGUAGES = ['uk', 'en', 'de', 'ru', 'fr', 'pl'];

test.describe('Automobility Multi-Language & Logic Tests', () => {

    test('homepage switches languages correctly', async ({ page }) => {
        const descriptions = {
            uk: 'Автосервіс на колесах',
            en: 'Mobile car service',
            de: 'Mobiler Autoservice',
            ru: 'Автосервис на колесах',
            fr: 'Service auto mobile',
            pl: 'Mobilny serwis samochodowy'
        };

        const diagnostics = {
            uk: 'Діагностика на виїзді',
            en: 'Mobile Diagnostics',
            de: 'Mobile Diagnose',
            ru: 'Диагностика на выезде',
            fr: 'Diagnostic Mobile',
            pl: 'Mobilna Diagnostyka'
        };

        for (const lang of LANGUAGES) {
            // Set localStorage language and reload
            await page.goto('/');
            await page.evaluate(`localStorage.setItem("language", "${lang}")`);
            await page.reload();

            // Check hero description
            const descRegex = new RegExp(descriptions[lang as keyof typeof descriptions], 'i');
            await expect(page.locator('p').filter({ hasText: descRegex })).toBeVisible();

            // Check mobile diagnostics
            const diagText = diagnostics[lang as keyof typeof diagnostics];
            await expect(page.locator(`text=${diagText}`).first()).toBeVisible();
        }
    });

    test('dashboard logical flow and ordering', async ({ page }) => {
        // Force uk language for testing specific text
        await page.goto('/dashboard');
        await page.evaluate(`localStorage.setItem("language", "uk")`);
        await page.reload();

        // Ensure elements loaded
        await expect(page.locator('h1', { hasText: 'Привіт' })).toBeVisible();

        // Click on services
        const oilChange = page.locator('div.premium-card').filter({ hasText: 'Заміна масла' });
        await oilChange.click();

        // Complete the new Oil Flow
        await expect(page.locator('h2', { hasText: 'Дані автомобіля' })).toBeVisible();
        await page.fill('input[placeholder="Марка авто (напр. BMW)"]', 'BMW');
        await page.fill('input[placeholder="Модель (напр. X5)"]', 'X5');
        await page.fill('input[placeholder="VIN-код (17 символів)"]', 'WBA12345678');
        await page.fill('input[placeholder="Поточний пробіг (км)"]', '125000');
        await page.click('button:has-text("Розрахувати")');

        await expect(page.locator('h2', { hasText: 'Вибір масла' })).toBeVisible();
        await page.click('div.premium-card:has-text("Motul 8100 X-clean")');

        await expect(page.locator('h2', { hasText: 'Зручні доповнення' })).toBeVisible();
        await page.click('button:has-text("Додати до замовлення")');
        // End of Oil Flow

        const diag = page.locator('div.premium-card').filter({ hasText: 'Діагностика на виїзді' });
        await diag.click();

        // Assert checkout bar appears
        const orderSection = page.locator('div.glass').filter({ hasText: 'Замовити' }).first();
        await expect(orderSection).toBeVisible();

        // Wait for the text to appear (can be 2 or 3 depending if flow returns multiple count or single service id 'oil')
        // We know 'oil' and 'diagnostics' are in the array -> length is 2.
        await expect(orderSection.locator('text=2 послуги обрано')).toBeVisible();

        // Complete order
        await orderSection.locator('button', { hasText: 'Замовити' }).click();

        // Success message
        await expect(page.locator('h2', { hasText: 'Замовлення прийнято!' })).toBeVisible();

        // Go back
        await page.locator('button', { hasText: 'На головну' }).click();
        await expect(page.locator('text=Оберіть послуги')).toBeVisible();
    });

    test('admin panel loads and has data without crashing', async ({ page }) => {
        await page.goto('/admin');
        await page.evaluate(`localStorage.setItem("language", "uk")`);
        await page.reload();

        await expect(page.locator('h1', { hasText: 'Ядро Automobility' })).toBeVisible();

        // Wait for table to be visible
        await expect(page.locator('table')).toBeVisible();

        // Check tabs
        const verifTab = page.locator('button', { hasText: 'Верифікація' });
        await verifTab.click();

        await expect(page.locator('button', { hasText: 'Нові майстри' })).toBeVisible();
    });

    test('mechanic page redirects if not logged in', async ({ page }) => {
        await page.goto('/mechanic');
        // Because of localStorage check, it redirects to /mechanic/login
        await expect(page).toHaveURL(/.*\/mechanic\/login/);
    });

    test('mechanic login flow and list loading', async ({ page }) => {
        await page.goto('/mechanic/login');
        await page.evaluate(`localStorage.setItem("language", "uk")`);
        await page.reload();

        await expect(page.locator('h2', { hasText: 'Вхід для майстрів' })).toBeVisible();

        await page.fill('input[placeholder="ID Майстра"]', 'm123');
        await page.fill('input[placeholder="Пароль"]', 'password');
        await page.click('button:has-text("Увійти")');

        await expect(page).toHaveURL(/\/mechanic/);
        await expect(page.locator('h1', { hasText: 'Панель майстра' })).toBeVisible();
    });

});
