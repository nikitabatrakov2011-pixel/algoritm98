// ==================================================================
// script.js — ЛОГИКА САЙТА (без статей — они в data.js)
// ==================================================================

const VK_URL = "https://vk.com/club241723323";

const COLORS = {
  Новости: "#2d8a5f",
  Спорт: "#e6872a",
  Культура: "#4a9fd4",
  Анонсы: "#1e5fa8",
  Интервью: "#173f6a"
};

const color = c => COLORS[c] || "#173f6a";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ------------------------------------------------------------------
// ПАРСЕР ТЕКСТА (подзаголовки и цитаты)
// ------------------------------------------------------------------
function parseArticleText(text) {
  const blocks = text.split('\n\n');
  return blocks.map(b => {
    const t = b.trim();
    if (!t) return '';
    if (t.startsWith('## ')) return `<h2>${esc(t.slice(3))}</h2>`;
    if (t.startsWith('> ')) return `<blockquote>${esc(t.slice(2))}</blockquote>`;
    return `<p>${esc(t)}</p>`;
  }).join('');
}

// ------------------------------------------------------------------
// ГЛАВНАЯ
// ------------------------------------------------------------------
function renderHome() {
  const featured = ARTICLES[0];
  const fresh = ARTICLES.slice(1, 5);

  const freshHTML = fresh.map((a, i) => `
    <div class="fresh-item reveal" style="transition-delay:${i * 0.1}s" onclick="location.hash='post_${a.id}'">
      <div class="fresh-cat" style="color:${color(a.category)}">
        <span class="dot" style="background:${color(a.category)}"></span>${esc(a.category)}
      </div>
      <h4><a href="#post_${a.id}">${esc(a.title)}</a></h4>
      <p class="meta">${esc(a.author)} · ${esc(a.date)}</p>
    </div>`).join("");

  const patterns = ["pattern-1", "pattern-2", "pattern-3", "pattern-4", "pattern-5"];

  const cardsHTML = ARTICLES.map((a, i) => `
    <article class="card reveal" data-category="${esc(a.category)}" style="transition-delay:${(i % 4) * 0.1}s" onclick="location.hash='post_${a.id}'">
      <div class="card-image">
        ${a.image
          ? `<img src="${a.image}" alt="${esc(a.title)}" style="${a.imageFit === 'contain' ? 'object-fit:contain;background:#eaf1f8;padding:16px' : ''}">`
          : `<div class="${patterns[i % 5]}"></div>`}
      </div>
      <div class="card-body">
        <span class="category" style="background:${color(a.category)}">${esc(a.category)}</span>
        <h3><a href="#post_${a.id}">${esc(a.title)}</a></h3>
        <p class="lead">${esc(a.lead)}</p>
        <div class="meta"><span>${esc(a.author)}</span><span>${esc(a.date)}</span></div>
      </div>
    </article>`).join("");

  const filters = [
    ["all", "Все"],
    ["Новости", "Новости"],
    ["Спорт", "Спорт"],
    ["Культура", "Культура"],
    ["Анонсы", "Анонсы"]
  ].map(([c, n]) => `<button class="filter-btn${c === "all" ? " active" : ""}" data-filter="${c}">${n}</button>`).join("");

  const featuredImage = featured.image
    ? (featured.imageFit === "contain"
        ? `<div class="featured-logo"><img src="${featured.image}" alt="${esc(featured.title)}"></div>`
        : `<img src="${featured.image}" alt="${esc(featured.title)}" class="featured-image">`)
    : `<div class="featured-image empty"></div>`;

  return `
  <div class="wrap">
    <section class="hero">
      <div><span class="title-small">Медиацентр</span></div>
      <div class="title-huge"><span>Алгоритм</span></div>
    </section>
    <div class="grid">
      <div class="featured reveal" onclick="location.hash='post_${featured.id}'">
        ${featuredImage}
        <div class="featured-body">
          <span class="category" style="background:${color(featured.category)}">${esc(featured.category)}</span>
          <h2><a href="#post_${featured.id}">${esc(featured.title)}</a></h2>
          <p class="lead">${esc(featured.lead)}</p>
          <p class="meta">${esc(featured.author)} · ${esc(featured.date)}</p>
          <a class="read-btn" href="#post_${featured.id}">Читать статью →</a>
        </div>
      </div>
      <aside>
        <div class="fresh-title reveal">
          <h3>Свежее</h3>
          <a onclick="filterAndScroll('all'); return false;" href="#">все материалы</a>
        </div>
        ${freshHTML}
      </aside>
    </div>
    <div class="feed-head reveal" id="feed">
      <h2 class="feed-title">Лента <span class="accent">медиацентра</span></h2>
      <p class="feed-sub" id="feed-counter">${ARTICLES.length} материалов</p>
    </div>
    <div class="filters reveal">${filters}</div>
    <div class="cards-grid">${cardsHTML}</div>
    <section class="cta-banner">
      <div class="cta-left">
        <div class="cta-label">Набор открыт</div>
        <h2 class="cta-headline">Пиши. Снимай.<br>Веди соцсети.</h2>
        <p class="cta-text">Медиацентр школы № 98 ищет корреспондентов, фотографов и видеографов. Опыт не нужен — нужны идеи.</p>
        <a class="cta-btn" onclick="go('join'); return false;" href="#">Вступить в медиакласс →</a>
      </div>
      <div class="cta-right"></div>
    </section>
  </div>`;
}

// ------------------------------------------------------------------
// СТАТЬЯ
// ------------------------------------------------------------------
function renderArticle(id) {
  const a = ARTICLES.find(x => x.id === id);
  if (!a) return renderHome();

  let img;
  if (a.image && a.imageFit === "contain") {
    img = `<div style="width:100%;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#eaf1f8 0%,#f5f9fc 50%,#eaf1f8 100%);border-radius:12px;margin-bottom:40px;padding:40px"><img src="${a.image}" style="max-width:70%;max-height:100%;object-fit:contain"></div>`;
  } else if (a.image) {
    img = `<img src="${a.image}" alt="${esc(a.title)}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;margin-bottom:40px;display:block">`;
  } else {
    img = `<div class="img"></div>`;
  }

  return `
  <div class="article">
    <span class="category" style="background:${color(a.category)}">${esc(a.category)}</span>
    <h1>${esc(a.title)}</h1>
    <p class="lead">${esc(a.lead)}</p>
    <p class="meta">${esc(a.author)} · ${esc(a.date)}</p>
    ${img}
    <div class="text">${parseArticleText(a.text)}</div>
    <a class="back" onclick="go('home'); return false;" href="#">← Назад к статьям</a>
  </div>`;
}

// ------------------------------------------------------------------
// О МЕДИАЦЕНТРЕ
// ------------------------------------------------------------------
function renderAbout() {
  const facts = [
    ["01", "Мы — часть школы", "Медиацентр «Алгоритм» — официальное объединение МАОУ Школы № 98. Мы освещаем школьную жизнь."],
    ["02", "Что мы делаем", "Пишем статьи, снимаем видео, делаем фоторепортажи с мероприятий, берём интервью у учителей и учеников."],
    ["03", "Где нас читать", "На этом сайте и в нашей группе ВКонтакте. Подпишись, чтобы не пропускать свежие материалы."]
  ];

  const factsHTML = facts.map((f, i) => `
    <div class="about-card reveal" style="transition-delay:${i * 0.1}s">
      <div class="num">${f[0]}</div>
      <h3>${esc(f[1])}</h3>
      <p>${esc(f[2])}</p>
    </div>`).join("");

  const team = [
    ["Батраков Никита", "9 «А» — редактор"],
    ["Толкачева Виктория", "9 «А» — корреспондент"],
    ["Клочко Михаил", "9 «А» — корреспондент"],
    ["Корона Илья", "9 «А» — фотограф"],
    ["Дудник Ева", "9 «А» — корреспондент"]
  ];

  const teamHTML = team.map(t =>
    `<div class="team-member"><strong>${esc(t[0])}</strong><span>${esc(t[1])}</span></div>`
  ).join("");

  return `
  <div class="wrap">
    <section class="about-hero reveal">
      <span class="title-small">О нас</span>
      <h1 style="font-size:clamp(40px,5.5vw,84px);font-weight:900;letter-spacing:-2.5px;line-height:1;margin-top:16px">Медиацентр «Алгоритм»</h1>
    </section>

    <p class="about-lead reveal">Медиацентр «Алгоритм» — это команда учеников школы № 98, которая рассказывает о том, чем живёт школа. Мы пишем статьи, снимаем видео, делаем фото и ведём соцсети.</p>

    <div class="about-grid">${factsHTML}</div>

    <section class="about-section">
      <h2 class="section-title reveal">Наша команда</h2>
      <p style="font-size:16px;color:#5a6b7a;max-width:640px;margin-bottom:10px" class="reveal">Ребята, которые делают все материалы. Хочешь к нам — присоединяйся.</p>
      <div class="team-list">${teamHTML}</div>
    </section>

    <section class="vk-block reveal">
      <h3>Мы во ВКонтакте</h3>
      <p>Все свежие посты, анонсы мероприятий, фото и видео — в нашей группе. Подпишись, чтобы ничего не пропустить.</p>
      <a class="vk-btn" href="${VK_URL}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974H2.598c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.565 2.708z"/></svg>
        Подписаться на группу
      </a>
    </section>

    <a class="back reveal" onclick="go('home'); return false;" href="#">← На главную</a>
  </div>`;
}

// ------------------------------------------------------------------
// КАК К НАМ ПОПАСТЬ
// ------------------------------------------------------------------
function renderJoin() {
  const stepsData = [
    ["green", "01", "Оставь заявку", "Заполни форму ниже или подойди в Центр детских объединений после уроков."],
    ["pink", "02", "Приходи на планёрку", "Юлия Дмитриевна расскажет о ближайшей встрече редакции."],
    ["cyan", "03", "Выполни первое задание", "Небольшая заметка, серия фото или короткий ролик о жизни школы."],
    ["orange", "04", "Добро пожаловать!", "Ты в команде: получаешь доступ к технике, чату редакции и заданиям."]
  ];

  const stepsHTML = stepsData.map((s, i) => `
    <div class="step reveal" style="transition-delay:${i * 0.1}s">
      <div class="step-num ${s[0]}">${s[1]}</div>
      <div class="step-body"><h4>${esc(s[2])}</h4><p>${esc(s[3])}</p></div>
    </div>`).join("");

  const reqs = [
    "Ученик 7–11 класса нашей школы",
    "Готовность уделять 3–4 часа в неделю",
    "Умение держать слово и сдавать работу в срок",
    "Своя техника не нужна — камеры и компьютеры есть в медиацентре",
    "Опыт не обязателен — всему научим"
  ];

  const reqsHTML = reqs.map(r => `<li class="req-item">${esc(r)}</li>`).join("");

  const faqs = [
    ["Можно совмещать с другими кружками?", "Конечно. Медиацентр — не школа с уроками по расписанию."],
    ["Когда проходит набор?", "Набор открыт круглый год. Главное — желание и готовность работать в команде."],
    ["Нужно ли уметь монтировать или фотографировать?", "Нет. Мы всему научим: от основ фотографии до монтажа видео."]
  ];

  const faqHTML = faqs.map(f =>
    `<div class="faq-item"><div class="faq-q">${esc(f[0])}</div><div class="faq-a">${esc(f[1])}</div></div>`
  ).join("");

  const dirs = ["Автор", "Фотограф", "Видеограф", "SMM", "Пока не знаю"];
  const dirHTML = dirs.map(d => `<button type="button" class="direction-btn">${d}</button>`).join("");

  return `
  <div class="wrap">
    <h1 style="font-size:clamp(40px,5.5vw,80px);font-weight:900;letter-spacing:-2.5px;line-height:1;margin-bottom:20px" class="reveal">Как к нам попасть</h1>
    <p style="font-size:19px;color:#5a6b7a;max-width:640px" class="reveal">Четыре шага — и ты в редакции «Алгоритма». Никаких экзаменов, только желание делать крутые материалы.</p>
    <h2 class="steps-title reveal">Шаги записи</h2>
    <div class="steps">${stepsHTML}</div>
    <div class="two-col">
      <div>
        <h2 class="section-title reveal">Требования</h2>
        <ul class="req-list reveal">${reqsHTML}</ul>
      </div>
      <div>
        <h2 class="section-title reveal">Руководитель</h2>
        <div class="curator-card reveal">
          <div class="curator-head">
            <div class="curator-avatar">ЮД</div>
            <div>
              <div class="curator-name">Юлия Дмитриевна</div>
              <div class="curator-role">Куратор медиацентра</div>
            </div>
          </div>
          <div class="curator-info">📍 Центр детских объединений<br>📞 +7 (863) 210-30-10</div>
        </div>
      </div>
    </div>
    <h2 class="section-title reveal" style="margin-top:80px">Частые вопросы</h2>
    <div class="faq reveal">${faqHTML}</div>
    <div class="form-section">
      <h2 class="form-title">Заявка в медиакласс</h2>
      <form id="zayavka">
        <div class="form-row">
          <div class="form-field"><label>Имя и фамилия</label><input type="text" name="name" placeholder="Иванов Иван" required></div>
          <div class="form-field"><label>Класс</label><input type="text" name="class" placeholder="9 «Б»" required></div>
        </div>
        <div class="form-full form-field"><label>Как с тобой связаться</label><input type="text" name="contact" placeholder="Телефон или @ник в Telegram" required></div>
        <div class="form-full"><label style="display:block;font-size:14px;font-weight:700;margin-bottom:12px">Направление</label><div class="direction-btns">${dirHTML}</div></div>
        <div class="form-full form-field"><label>О себе (необязательно)</label><textarea name="about" placeholder="Расскажи, что тебе интересно"></textarea></div>
        <button type="submit" class="submit-btn">Отправить заявку</button>
      </form>
    </div>
  </div>`;
}

// ------------------------------------------------------------------
// РОУТЕР
// ------------------------------------------------------------------
function go(page) {
  if (page === "about") {
    document.getElementById("app").innerHTML = renderAbout();
    window.scrollTo(0, 0);
    initPage();
    location.hash = "about";
    return;
  }
  if (page === "join") {
    document.getElementById("app").innerHTML = renderJoin();
    window.scrollTo(0, 0);
    initPage();
    location.hash = "join";
    return;
  }
  document.getElementById("app").innerHTML = renderHome();
  window.scrollTo(0, 0);
  initPage();
  location.hash = "";
}

function route() {
  const h = location.hash.slice(1);
  if (h === "about") {
    document.getElementById("app").innerHTML = renderAbout();
    initPage();
    window.scrollTo(0, 0);
  } else if (h === "join") {
    document.getElementById("app").innerHTML = renderJoin();
    initPage();
    window.scrollTo(0, 0);
  } else if (h.startsWith("post_")) {
    const id = parseInt(h.replace("post_", ""));
    document.getElementById("app").innerHTML = renderArticle(id);
    initPage();
    window.scrollTo(0, 0);
  } else {
    document.getElementById("app").innerHTML = renderHome();
    initPage();
    window.scrollTo(0, 0);
  }
}

// ------------------------------------------------------------------
// АНИМАЦИИ ПОЯВЛЕНИЯ
// ------------------------------------------------------------------
function initReveals() {
  const reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    reveals.forEach(el => el.classList.add("visible"));
    return;
  }
  const vh = window.innerHeight;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.classList.remove("pre-hidden");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      el.classList.add("visible");
    } else {
      el.classList.add("pre-hidden");
      observer.observe(el);
    }
  });
}

// ------------------------------------------------------------------
// ФИЛЬТРЫ
// ------------------------------------------------------------------
function plural(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "материал";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "материала";
  return "материалов";
}

function setFilter(cat, btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === btn));
  let count = 0;
  document.querySelectorAll(".card").forEach(card => {
    const show = cat === "all" || card.getAttribute("data-category") === cat;
    if (show) {
      card.style.display = "";
      card.classList.add("visible");
      card.classList.remove("pre-hidden");
      card.style.animation = "none";
      void card.offsetWidth;
      card.style.animation = "fadeUp 0.4s ease both";
      count++;
    } else {
      card.style.display = "none";
    }
  });
  const counter = document.getElementById("feed-counter");
  if (counter) counter.textContent = count + " " + plural(count);
}

function initFilters() {
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setFilter(btn.getAttribute("data-filter"), btn);
    });
  });
}

function filterAndScroll(cat) {
  if (location.hash && location.hash !== "#feed") {
    if (location.hash === "#about" || location.hash === "#join" || location.hash.startsWith("#post_")) {
      go("home");
    }
  }
  setTimeout(() => {
    const btns = document.querySelectorAll(".filter-btn");
    btns.forEach(b => { if (b.getAttribute("data-filter") === cat) setFilter(cat, b); });
    const feed = document.getElementById("feed");
    if (feed) feed.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

// ------------------------------------------------------------------
// FAQ + НАПРАВЛЕНИЯ + ФОРМА
// ------------------------------------------------------------------
function initInteractions() {
  document.querySelectorAll(".faq-q").forEach(q => {
    q.addEventListener("click", () => q.parentElement.classList.toggle("open"));
  });

  document.querySelectorAll(".direction-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".direction-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  const form = document.getElementById("zayavka");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(form);
      const msg = `Заявка в медиакласс!
Имя: ${data.get("name")}
Класс: ${data.get("class")}
Контакт: ${data.get("contact")}
О себе: ${data.get("about") || "—"}`;
      form.innerHTML = `<p class="form-success">Спасибо! Скопируй текст ниже и отправь Юлии Дмитриевне:<br><br><textarea style="width:100%;margin-top:15px;padding:12px;font-family:monospace;font-size:13px;border-radius:6px;border:none" rows="6" readonly>${msg}</textarea></p>`;
      form.querySelector("textarea").select();
    });
  }
}

// ------------------------------------------------------------------
// ИНИЦИАЛИЗАЦИЯ
// ------------------------------------------------------------------
function initPage() {
  initReveals();
  initFilters();
  initInteractions();
}

window.addEventListener("hashchange", route);
route();