import './styles/main.scss';
import Popover from './js/Popover';

document.addEventListener('DOMContentLoaded', () => {
  // Ищем все элементы с атрибутом data-toggle="popover"
  document.querySelectorAll('[data-toggle="popover"]').forEach((trigger) => {
    const title = trigger.dataset.title || 'Заголовок';
    const content = trigger.dataset.content || 'Текст подсказки';

    new Popover(trigger, { title, content });
  });

  // Пример программной инициализации
  const demoBtn = document.getElementById('demo-trigger');
  if (demoBtn && !demoBtn._popoverInstance) {
    new Popover(demoBtn, {
      title: 'Пример Popover',
      content: 'Этот виджет реализован на чистом JavaScript без jQuery!',
    });
  }
});
