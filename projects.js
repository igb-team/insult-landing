(() => {
  const filters = document.querySelector('.catalog-filters');
  const cards = [...document.querySelectorAll('.catalog-card')];
  if (!filters || !cards.length) return;

  const buttons = [...filters.querySelectorAll('[data-filter]')];
  function filterByGenre(genre) {
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === genre));
    }
    for (const card of cards) {
      card.hidden = genre !== 'all' && card.dataset.genre !== genre;
    }
  }
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (button) filterByGenre(button.dataset.filter);
  });
  filters.hidden = false;

  function showLinkedGame() {
    const card = document.getElementById(location.hash.slice(1));
    if (!card || !card.matches('.catalog-card')) return;
    if (card.hidden) filterByGenre('all');
    card.scrollIntoView({block: 'start'});
  }
  window.addEventListener('hashchange', showLinkedGame);
  showLinkedGame();
})();
