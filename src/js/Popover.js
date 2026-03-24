// 🎯 Конфигурация по умолчанию — выносим "магические" значения
const DEFAULT_CONFIG = {
  OFFSET_PX: 10, // Отступ от элемента-триггера
  MIN_MARGIN_PX: 5, // Минимальный отступ от краёв экрана
  Z_INDEX: 1000, // Поверх остальных элементов
  ANIMATION_DURATION_MS: 150, // Длительность анимации (если добавите)
};

/**
 * Класс Popover — реализация всплывающего виджета на чистом JS
 * @example
 * new Popover(document.querySelector('#trigger'), { title: 'Заголовок', content: 'Текст' });
 */
export default class Popover {
  /**
   * @param {HTMLElement} triggerElement - элемент, по клику на который показывается popover
   * @param {Object} options - настройки: title, content, config
   */
  constructor(triggerElement, { title, content, config = {} } = {}) {
    if (!triggerElement || !(triggerElement instanceof HTMLElement)) {
      throw new Error('Popover: первый аргумент должен быть HTMLElement');
    }
    if (!title || !content) {
      throw new Error('Popover: обязательны параметры title и content');
    }

    this.trigger = triggerElement;
    this.title = title;
    this.content = content;
    this.config = { ...DEFAULT_CONFIG, ...config };

    this.popoverElement = null;
    this.isVisible = false;

    this._init();
  }

  _init() {
    // Создаём DOM-элемент popover (но не добавляем в document сразу)
    this._createPopoverElement();

    // Вешаем обработчик клика на триггер
    this.trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      this.toggle();
    });

    // Закрываем по клику вне popover и триггера
    document.addEventListener('click', (event) => {
      if (
        this.isVisible &&
        !this.trigger.contains(event.target) &&
        !this.popoverElement.contains(event.target)
      ) {
        this.hide();
      }
    });

    // Закрываем по нажатию Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  _createPopoverElement() {
    // 🧱 Создаём структуру: .popover > .popover__arrow + .popover__body > .popover__title + .popover__content
    this.popoverElement = document.createElement('div');
    this.popoverElement.className = 'popover';
    this.popoverElement.setAttribute('role', 'tooltip');
    this.popoverElement.style.zIndex = this.config.Z_INDEX;
    this.popoverElement.hidden = true; // Скрыт по умолчанию

    // Стрелочка
    const arrow = document.createElement('div');
    arrow.className = 'popover__arrow';
    this.popoverElement.appendChild(arrow);

    // Тело
    const body = document.createElement('div');
    body.className = 'popover__body';

    const title = document.createElement('h3');
    title.className = 'popover__title';
    title.textContent = this.title;

    const content = document.createElement('div');
    content.className = 'popover__content';
    content.textContent = this.content;

    body.appendChild(title);
    body.appendChild(content);
    this.popoverElement.appendChild(body);

    // Добавляем в body (для позиционирования через JS)
    document.body.appendChild(this.popoverElement);
  }

  /**
   * Показывает popover и позиционирует его
   */
  show() {
    if (this.isVisible) return;

    this.popoverElement.hidden = false;
    this.isVisible = true;

    // 📐 Позиционируем после того, как элемент добавлен в DOM и отрендерен
    requestAnimationFrame(() => {
      this._position();
    });

    // 🎯 Для тестов: кастомное событие
    this.trigger.dispatchEvent(
      new CustomEvent('popover:show', { detail: { popover: this } }),
    );
  }

  /**
   * Скрывает popover
   */
  hide() {
    if (!this.isVisible) return;

    this.popoverElement.hidden = true;
    this.isVisible = false;

    this.trigger.dispatchEvent(
      new CustomEvent('popover:hide', { detail: { popover: this } }),
    );
  }

  /**
   * Переключает видимость
   */
  toggle() {
    this.isVisible ? this.hide() : this.show();
  }

  /**
   * 📐 Позиционирует popover над триггером, по центру по горизонтали
   * Использует только пиксели (без translate/transform)
   */
  _position() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const popoverRect = this.popoverElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // 📍 Вертикаль: всегда сверху от триггера
    const top = triggerRect.top - popoverRect.height - this.config.OFFSET_PX;

    // 📍 Горизонталь: центр триггера минус половина ширины popover
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    let left = triggerCenter - popoverRect.width / 2;

    // 🛡 Не даём вылезти за пределы экрана
    if (left < this.config.MIN_MARGIN_PX) {
      left = this.config.MIN_MARGIN_PX;
    }
    const maxLeft =
      viewportWidth - popoverRect.width - this.config.MIN_MARGIN_PX;
    if (left > maxLeft) {
      left = maxLeft;
    }

    // 💡 Применяем позиционирование в пикселях (как просили в задании)
    this.popoverElement.style.position = 'fixed';
    this.popoverElement.style.top = `${Math.round(top)}px`;
    this.popoverElement.style.left = `${Math.round(left)}px`;
  }

  /**
   * Обновляет контент (для динамических данных)
   * @param {string} title - новый заголовок
   * @param {string} content - новый текст
   */
  updateContent(title, content) {
    this.title = title;
    this.content = content;

    const titleEl = this.popoverElement.querySelector('.popover__title');
    const contentEl = this.popoverElement.querySelector('.popover__content');

    if (titleEl) titleEl.textContent = title;
    if (contentEl) contentEl.textContent = content;
  }

  /**
   * Удаляет popover из DOM и очищает обработчики
   */
  destroy() {
    this.hide();
    this.popoverElement?.remove();
    this.trigger?.removeEventListener('click', this.toggle);
  }
}
