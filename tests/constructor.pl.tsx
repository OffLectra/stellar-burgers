import { test, expect, Page, BrowserContext } from '@playwright/test';

test.describe('Burger Constructor', () => {
  async function setupAuth({
    page,
    context
  }: {
    page: Page;
    context: BrowserContext;
  }) {
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.com', name: 'Test' }
        })
      });
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-token',
        url: 'http://localhost:4000'
      },
      {
        name: 'refreshToken',
        value: 'mock-token',
        url: 'http://localhost:4000'
      }
    ]);

    await context.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
  }

  async function setupOrderMock(page: Page) {
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: {
            _id: 'test-order-123',
            status: 'done',
            name: 'Space burger',
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
            number: 54321,
            price: 2000
          },
          name: 'Space burger'
        })
      });
    });
  }

    test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
        update: false,
        notFound: 'fallback'
    });
    });
  test.afterEach(async ({ context, page }) => {
    await context.clearCookies();
  });

  test('1. Ингредиенты загружаются и отображаются', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(
      page.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
    await expect(page.getByText('Соус Spicy-X')).toBeVisible();
  });

    test('2. Открытие и закрытие модального окна ингредиента по крестику', async ({
    page
  }) => {
    await page.goto('/');
    await page.getByText('Краторная булка N-200i').click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(
      page.locator('#modals h3').filter({ hasText: 'Краторная булка N-200i' })
    ).toBeVisible();
    await page.locator('#modals button[type="button"]').click();
    await expect(page.locator('#modals [class*="modal"]')).toHaveCount(0);
  });

  test('3. Закрытие модального окна ингредиента по оверлею', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Краторная булка N-200i').click();
  await expect(page.getByText('Детали ингредиента')).toBeVisible();
  await page.locator('#modals > div').nth(1).click({ force: true });
  await expect(page.locator('#modals [class*="modal"]')).toHaveCount(0);
});

  test('4. Добавление булки в конструктор', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Добавить' }).first().click();
    await expect(
      page.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();
    await expect(
      page.getByText('Краторная булка N-200i (низ)')
    ).toBeVisible();
  });

  test('5. Добавление начинки в конструктор', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Добавить' }).first().click();
    await page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(
      page
        .locator('.constructor-element__text')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    ).toBeVisible();
  });

  test('6. Удаление ингредиента из конструктора', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Добавить' }).first().click();
    await page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .locator('.constructor-element__row')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .locator('.constructor-element__action')
      .click();
    await expect(
      page
        .locator('.constructor-element__row')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    ).toHaveCount(0);
  });

  test('7. Создание заказа с булкой и начинкой', async ({
    page,
    context
  }) => {
    await setupAuth({ page, context });
    await setupOrderMock(page);
    await page.goto('/');

    await page.getByRole('button', { name: 'Добавить' }).first().click();
    await page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(page.locator('h2.text_type_digits-large')).toHaveText('54321');
    await expect(page.getByText('идентификатор заказа')).toBeVisible();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });

  test('8. Заказ без булки — блокировка', async ({ page, context }) => {
    await setupAuth({ page, context });
    await page.goto('/');

    await page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await page.waitForTimeout(1000);
    await expect(page.locator('h2.text_type_digits-large')).toHaveCount(0);
    await expect(page.locator('#modals [class*="modal"]')).toHaveCount(0);
  });

  test('9. Закрытие модалки и сброс конструктора', async ({
    page,
    context
  }) => {
    await setupAuth({ page, context });
    await setupOrderMock(page);
    await page.goto('/');

    await page.getByRole('button', { name: 'Добавить' }).first().click();
    await page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(page.locator('h2.text_type_digits-large')).toHaveText('54321');
    await page.locator('#modals button[type="button"]').click();
    await expect(page.locator('#modals [class*="modal"]')).toHaveCount(0);
  });

  test('10. Редирект на логин без авторизации', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Добавить' }).first().click();
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});