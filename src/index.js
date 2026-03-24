import './styles/main.scss';
import Popover from './js/Popover';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-toggle="popover"]').forEach((trigger) => {
    if (!trigger._popoverInstance) {
      const title = trigger.dataset.title || 'Заголовок';
      const content = trigger.dataset.content || 'Текст подсказки';

      new Popover(trigger, { title, content });
    }
  });
});