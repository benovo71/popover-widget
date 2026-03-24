/**
 * @jest-environment jsdom
 */
import Popover from '../src/js/Popover';

describe('Popover class', () => {
  let trigger;
  let popover;

  beforeEach(() => {
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
    trigger.getBoundingClientRect = () => ({
      top: 200,
      left: 100,
      width: 120,
      height: 40,
    });

    popover = new Popover(trigger, { title: 'Pos', content: 'Test' });
    trigger.click();

    return new Promise((resolve) => {
      setTimeout(() => {
        const styles = popover.popoverElement.style;

        expect(styles.top).toMatch(/^\d+px$/);
        expect(styles.left).toMatch(/^\d+px$/);

        resolve();
      }, 50);
    });
  });

  test('клик вне popover закрывает его', () => {
    popover = new Popover(trigger, { title: 'Close', content: 'Test' });
    trigger.click();
    expect(popover.isVisible).toBe(true);

    document.body.click();

    expect(popover.isVisible).toBe(false);
  });

  test('нажатие Escape закрывает popover', () => {
    popover = new Popover(trigger, { title: 'Escape', content: 'Test' });
    trigger.click();

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    expect(popover.isVisible).toBe(false);
  });
});