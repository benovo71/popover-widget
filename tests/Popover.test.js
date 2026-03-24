/**
 * @jest-environment jsdom
 */
import Popover from '../src/js/Popover';

describe('Popover class', () => {
  let trigger;
  let popover;

  beforeEach(() => {
    // 🧹 Очищаем DOM перед каждым тестом
    document.body.innerHTML = '<button id="trigger">Click me</button>';
    trigger = document.getElementById('trigger');
  });

  afterEach(() => {
    popover?.destroy();
    jest.clearAllMocks();
  });

  test('создаёт экземпляр с валидными параметрами', () => {
    expect(() => {
      popover = new Popover(trigger, {
        title: 'Test',
        content: 'Content',
      });
    }).not.toThrow();
  });

  test('бросает ошибку, если нет title или content', () => {
    expect(() => new Popover(trigger, { title: 'Only title' })).toThrow();
    expect(() => new Popover(trigger, { content: 'Only content' })).toThrow();
  });

  test('по клику на триггер показывается popover', () => {
    popover = new Popover(trigger, { title: 'Hi', content: 'There' });

    trigger.click();

    expect(popover.isVisible).toBe(true);
    expect(popover.popoverElement.hidden).toBe(false);
  });

  test('popover позиционируется над триггером', () => {
    // 📐 Задаём моковые размеры для предсказуемого теста
    trigger.getBoundingClientRect = () => ({
      top: 200,
      left: 100,
      width: 120,
      height: 40,
    });

    popover = new Popover(trigger, { title: 'Pos', content: 'Test' });
    trigger.click();

    // Ждём requestAnimationFrame
    return new Promise((resolve) => {
      setTimeout(() => {
        const styles = popover.popoverElement.style;
        const top = parseInt(styles.top, 10);
        const left = parseInt(styles.left, 10);

        // Проверяем, что позиционирование в пикселях (строки с "px")
        expect(styles.top).toMatch(/^\d+px$/);
        expect(styles.left).toMatch(/^\d+px$/);

        // Popover должен быть выше триггера (200 - высота popover - отступ)
        expect(top).toBeLessThan(200);

        // Центр триггера: 100 + 60 = 160, popover центрируется относительно него
        expect(left).toBeLessThan(160 + 50); // + допуск на ширину
        expect(left).toBeGreaterThan(160 - 100);

        resolve();
      }, 50);
    });
  });

  test('клик вне popover закрывает его', () => {
    popover = new Popover(trigger, { title: 'Close', content: 'Test' });
    trigger.click(); // Открыли
    expect(popover.isVisible).toBe(true);

    // Клик в "пустое место"
    document.body.click();

    expect(popover.isVisible).toBe(false);
    expect(popover.popoverElement.hidden).toBe(true);
  });

  test('нажатие Escape закрывает popover', () => {
    popover = new Popover(trigger, { title: 'Escape', content: 'Test' });
    trigger.click();

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    expect(popover.isVisible).toBe(false);
  });

  test('updateContent меняет текст в открытом popover', () => {
    popover = new Popover(trigger, { title: 'Old', content: 'Old content' });
    trigger.click();

    popover.updateContent('New Title', 'New Content');

    const titleEl = popover.popoverElement.querySelector('.popover__title');
    const contentEl = popover.popoverElement.querySelector('.popover__content');

    expect(titleEl.textContent).toBe('New Title');
    expect(contentEl.textContent).toBe('New Content');
  });
});
