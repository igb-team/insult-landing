(() => {
  const english = document.documentElement.lang === 'en';
  const word = (ru, en) => english ? en : ru;
  const siteRoot = new URL('./', document.currentScript.src);
  const base = new URL(english ? 'en/' : './', siteRoot).pathname;
  const leaf = location.pathname.slice(base.length).replace(/^index\.html$/, '');
  const page = leaf === 'projects.html' ? leaf : '';
  const c = (paths) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">'+paths+'</svg>';
  const searchIcon = c('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>');
  const globe = c('<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>');
  const brand = '<a class="brand" href="'+base+'" aria-label="IGB Team"><img src="'+siteRoot.pathname+'assets/brand.png" width="40" height="40" alt="">IGB TEAM</a>';
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  const main = document.querySelector('main');
  if (!main.id) main.id = 'main';
  header.innerHTML = `
    <a class="skip" href="#${main.id}">${word('К содержимому', 'Skip to content')}</a>
    <div class="mast wrap">
      ${brand}
      <div class="tools">
        <button class="search-open" type="button" aria-label="${word('Поиск', 'Search')}">${searchIcon}</button>
        <a class="language" hreflang="${english ? 'ru' : 'en'}" aria-label="${word('Switch to English', 'Переключить на русский')}">
          ${globe}${english ? 'RU' : 'EN'}
        </a>
      </div>
    </div>`;
  const language = header.querySelector('.language');
  function syncLanguageLink() {
    language.href = new URL((english ? '' : 'en/') + page + location.hash, siteRoot).href;
  }
  syncLanguageLink();
  window.addEventListener('hashchange', syncLanguageLink);
  footer.innerHTML = `
    <div class="foot wrap">
      ${brand}
      <a class="foot-contact" href="https://igb-team.carrd.co/">${word('Контакты', 'Contact')}</a>
      <small>© Insult GoatBro Team</small>
    </div>`;
  const dialog = document.createElement('dialog');
  dialog.className = 'search-box';
  dialog.setAttribute('aria-labelledby','search-title');
  dialog.innerHTML = '<div class="search-head"><h2 id="search-title">'+word('Поиск по сайту','Search the site')+'</h2><button aria-label="'+word('Закрыть','Close')+'">×</button></div><input type="search" aria-labelledby="search-title" placeholder="'+word('Название игры, мерч, новости…','Game title, merch, news…')+'"><p role="status"></p><div class="search-list"></div>';
  document.body.append(dialog);
  const field = dialog.querySelector('input');
  const status = dialog.querySelector('[role=status]');
  const results = dialog.querySelector('.search-list');
  let index = null;
  function normalize(text) {
    return text.toLocaleLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  }
  function render() {
    results.replaceChildren();
    if (!index) return;
    const terms = normalize(field.value).split(' ').filter(Boolean);
    const matches = index.map(row => {
      const title = normalize(row.title);
      const all = title+' '+normalize(row.text);
      return {row,rank:terms.filter(t=>title.includes(t)).length,found:terms.every(t=>all.includes(t))};
    }).filter(hit=>hit.found).sort((a,b)=>b.rank-a.rank);
    status.textContent = terms.length ? (matches.length ? word('Найдено: ','Results: ')+matches.length : word('Совпадений нет. Попробуйте другое слово.','No matches. Try another word.')) : word('Разделы и материалы','Pages and stories');
    for (const {row} of matches) {
      const link = document.createElement('a');
      link.href = new URL(row.url, location.href).href;
      link.textContent = row.title;
      link.addEventListener('click',()=>dialog.close());
      results.append(link);
    }
  }
  header.querySelector('.search-open').addEventListener('click',async()=>{
    dialog.showModal();
    field.focus();
    if (!index) {
      status.textContent = word('Загрузка…','Loading…');
      try {
        const groups = await Promise.all(['home','projects','news'].map(async name=>{
          const response=await fetch(base+name+'-index.json');
          if(!response.ok) throw Error();
          return response.json();
        }));
        index = groups.flat();
      } catch {
        status.textContent = word('Не удалось загрузить поиск. Откройте его ещё раз.','Search could not load. Close and reopen it to try again.');
        return;
      }
    }
    render();
  });
  field.addEventListener('input',render);
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click', e=>{if(e.target===dialog && !e.target.closest('.search-head')){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
})();
