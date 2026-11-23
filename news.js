(() => {
  const section = document.getElementById('news');

  function openLinkedStory() {
    const article = document.getElementById(location.hash.slice(1));
    if (article?.matches('.story')) article.querySelector('details').open = true;
  }

  openLinkedStory();
  window.addEventListener('hashchange', openLinkedStory);
  // Selecting the current search result again does not dispatch a hashchange.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (link && link.hash && link.href === location.href) openLinkedStory();
  });

  const dialog = document.getElementById('news-photo');
  if (typeof dialog.showModal !== 'function') return;

  section.addEventListener('click', event => {
    const link = event.target.closest('[data-photo]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const caption = link.querySelector('img').alt;
    const image = document.getElementById('news-photo-image');
    image.src = link.href;
    image.alt = caption;
    document.getElementById('news-photo-caption').textContent = caption;
    dialog.showModal();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
})();
