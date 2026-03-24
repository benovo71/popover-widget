// 🎯 Конфигурация игры — все значения вынесены в константы
const DEFAULT_CONFIG = {
  OFFSET_PX: 10,
  MIN_MARGIN_PX: 5,
  Z_INDEX: 1000,
  ANIMATION_DURATION_MS: 150,
};

/**
 * Класс Popover — реализация всплывающего виджета на чистом JS
 */
export default class Popover {
  constructor(triggerElement, { title, content, config = {} } = {}) {
    if (!triggerElement || !(triggerElement instanceof HTMLElement)) {
      throw new Error('Popover: первый аргумент должен быть HTMLElement');
    }
    if (!title || !content) {
      throw new Error('Popover: обязательны параметры title и content');
    }

    // 🔥 Проверка: не создан ли уже popover для этого элемента
    if (triggerElement._popoverInstance) {
      console.warn('Popover: для этого элемента уже создан popover');
      return triggerElement._popoverInstance;
    }

    this.trigger = triggerElement;
    this.title = title;
    this.content = content;
    this.config = { ...DEFAULT_CONFIG, ...config };

    this.popoverElement = null;
    this.isVisible = false;

    // 🔥 Сохраняем ссылку на экземпляр в элементе
    this.trigger._popoverInstance = this;

    this._init();
  }

  _init() {
    this._createPopoverElement();

    this.trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault(); // 🔥 Предотвращаем стандартное поведение
      this.toggle();
    });

    document.addEventListener('click', (event) => {
      if (
        this.isVisible &&
        !this.trigger.contains(event.target) &&
        !this.popoverElement.contains(event.target)
      ) {
        this.hide();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  _createPopoverElement() {
    this.popoverElement = document.createElement('div');
    this.popoverElement.className = 'popover';
    this.popoverElement.setAttribute('role', 'tooltip');
    this.popoverElement.style.zIndex = this.config.Z_INDEX;
    this.popoverElement.hidden = true;

    const arrow = document.createElement('div');
    arrow.className = 'popover__arrow';
    this.popoverElement.appendChild(arrow);

    const body = document.createElement('div');
    body.className = 'popover__body';

    const titleEl = document.createElement('h3');
    titleEl.className = 'popover__title';
    titleEl.textContent = this.title;

    const contentEl = document.createElement('div');
    contentEl.className = 'popover__content';
    contentEl.textContent = this.content;

    body.appendChild(titleEl);
    body.appendChild(contentEl);
    this.popoverElement.appendChild(body);

    document.body.appendChild(this.popoverElement);
  }

  show() {
    if (this.isVisible) return;

    // 🔥 Скрываем все остальные popover'ы
    document.querySelectorAll('.popover').forEach((popover) => {
      popover.hidden = true;
    });
    document.querySelectorAll('[data-toggle="popover"]').forEach((el) => {
      if (el._popoverInstance) {
        el._popoverInstance.isVisible = false;
      }
    });

    this.popoverElement.hidden = false;
    this.isVisible = true;

    requestAnimationFrame(() => {
      this._position();
    });

    this.trigger.dispatchEvent(
      new CustomEvent('popover:show', { detail: { popover: this } }),
    );
  }

  hide() {
    if (!this.isVisible) return;

    this.popoverElement.hidden = true;
    this.isVisible = false;

    this.trigger.dispatchEvent(
      new CustomEvent('popover:hide', { detail: { popover: this } }),
    );
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  _position() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const popoverRect = this.popoverElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 🔥 Рассчитываем позицию
    let top = triggerRect.top - popoverRect.height - this.config.OFFSET_PX;
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    let left = triggerCenter - popoverRect.width / 2;

    // 🔥 Не даём вылезти за левый край
    if (left < this.config.MIN_MARGIN_PX) {
      left = this.config.MIN_MARGIN_PX;
    }

    // 🔥 Не даём вылезти за правый край
    const maxLeft =
      viewportWidth - popoverRect.width - this.config.MIN_MARGIN_PX;
    if (left > maxLeft) {
      left = maxLeft;
    }

    // 🔥 Если не помещается сверху — показываем снизу
    if (top < this.config.MIN_MARGIN_PX) {
      top = triggerRect.bottom + this.config.OFFSET_PX;
    }

    // 🔥 Не даём вылезти за нижний край
    const maxTop =
      viewportHeight - popoverRect.height - this.config.MIN_MARGIN_PX;
    if (top > maxTop) {
      top = maxTop;
    }

    this.popoverElement.style.position = 'fixed';
    this.popoverElement.style.top = `${Math.round(top)}px`;
    this.popoverElement.style.left = `${Math.round(left)}px`;
  }

  updateContent(title, content) {
    this.title = title;
    this.content = content;

    const titleEl = this.popoverElement.querySelector('.popover__title');
    const contentEl = this.popoverElement.querySelector('.popover__content');

    if (titleEl) titleEl.textContent = title;
    if (contentEl) contentEl.textContent = content;
  }

  destroy() {
    this.hide();
    this.popoverElement?.remove();
    this.trigger?.removeEventListener('click', this.toggle);
    // 🔥 Очищаем ссылку
    if (this.trigger && this.trigger._popoverInstance === this) {
      delete this.trigger._popoverInstance;
    }
  }
}
