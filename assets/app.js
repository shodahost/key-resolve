/* DaVinci Resolve Shortcuts — Cheat Sheet
 * Renders assets/data.js (window.KB_DATA). No build step, no dependencies,
 * works from file:// as well as from any static host. */
(function () {
  'use strict';

  var D = window.KB_DATA;
  var M = D.meta;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };

  // ------------------------------------------------------------ storage
  function load(key, def) {
    try { var v = localStorage.getItem(key); return v == null ? def : JSON.parse(v); } catch (e) { return def; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private mode */ }
  }

  var ua = navigator.userAgentData && navigator.userAgentData.platform || navigator.platform || navigator.userAgent || '';
  var S = Object.assign({
    lang: /^pl\b/i.test(navigator.language || '') ? 'both' : 'en', // 'en' | 'pl' | 'both'
    os: /mac|iphone|ipad/i.test(ua) ? 'mac' : 'win',
    density: 'comfortable',
    theme: 'auto',
    hints: true,
    hideLearned: false,
    level: 3,
    startClosed: false,
    quizDir: 'a2k',
    quizLearned: false
  }, load('kr.settings', {}));
  var learned = new Set(load('kr.learned', []));
  var pinned = new Set(load('kr.pinned', []));
  var view = { cat: 'all', q: '' };

  function saveSettings() { save('kr.settings', S); }

  // ------------------------------------------------------------ i18n
  var UI = {
    title: ['DaVinci Resolve<br>Keyboard Shortcuts', 'DaVinci Resolve<br>Skróty klawiszowe'],
    badge: ['DaVinci Resolve ' + M.label + ' · Cheat Sheet', 'DaVinci Resolve ' + M.label + ' · Ściąga'],
    subtitle: ['Shortcuts for DaVinci Resolve ' + M.label + ', grouped by task. Filter by level, pin what you need, quiz yourself — and keep it open on your second screen while you edit.',
      'Skróty DaVinci Resolve ' + M.label + ' pogrupowane według zadań. Filtruj poziom, przypinaj, co potrzebne, ćwicz na fiszkach — i trzymaj ściągę na drugim ekranie podczas montażu.'],
    searchPh: ['Search an action or keys…  e.g. split, ripple, shift z', 'Szukaj akcji lub klawiszy…  np. przetnij, ripple, shift z'],
    all: ['All', 'Wszystko'],
    pinned: ['My sheet', 'Moja ściąga'],
    levelNames: [['Start', 'Core', 'Pro'], ['Start', 'Podstawy', 'Pro']],
    levelSeg: [['Start', 'Core', 'All'], ['Start', 'Podstawy', 'Wszystko']],
    levelTips: [['Only the essentials for your first days', 'Essentials + everyday shortcuts', 'Everything, including pro shortcuts'],
      ['Tylko absolutne podstawy na pierwsze dni', 'Podstawy + skróty na co dzień', 'Wszystko, łącznie ze skrótami pro']],
    quiz: ['Quiz', 'Quiz'],
    quizTip: ['Flashcards from the current view', 'Fiszki z bieżącego widoku'],
    settings: ['View options', 'Opcje widoku'],
    themeTip: ['Toggle light / dark', 'Przełącz jasny / ciemny'],
    minimize: ['Minimize header', 'Zwiń nagłówek'],
    expand: ['Expand header', 'Rozwiń nagłówek'],
    shortcuts: ['shortcuts', ['skrót', 'skróty', 'skrótów']],
    verified: ['checked against the reference', 'sprawdzonych ze źródłem'],
    learned: ['Learned', 'Nauczone'],
    markLearned: ['Mark as learned', 'Oznacz jako nauczone'],
    unmarkLearned: ['Learned — click to undo', 'Nauczone — kliknij, by cofnąć'],
    pin: ['Pin to My sheet', 'Przypnij do Mojej ściągi'],
    unpin: ['Pinned — click to unpin', 'Przypięte — kliknij, by odpiąć'],
    command: ['Command in the reference', 'Polecenie w źródle'],
    builtIn: ['Built-in behaviour (not a key assignment)', 'Wbudowane zachowanie (nie przypisanie klawisza)'],
    source: ['Source', 'Źródło'],
    studioOnly: ['DaVinci Resolve Studio only', 'Tylko w DaVinci Resolve Studio'],
    tip: ['Pro tip', 'Pro tip'],
    startTitle: ['Start here', 'Zacznij tutaj'],
    startLead: ['Four habits that make Resolve click. Master these before anything else.', 'Cztery nawyki, dzięki którym Resolve „zaskoczy”. Opanuj je przed wszystkim innym.'],
    hide: ['Hide', 'Ukryj'],
    setupTitle: ['Set up Resolve for learning', 'Ustaw Resolve do nauki'],
    setupLead: ['Settings worth checking before your first real project.', 'Ustawienia, które warto sprawdzić przed pierwszym prawdziwym projektem.'],
    manual: ['Reference Manual', 'Reference Manual'],
    noResults: ['No results', 'Brak wyników'],
    noResultsText: ['Try other words (English or Polish) or keys like “ctrl b”.', 'Spróbuj innych słów (po polsku lub angielsku) albo klawiszy, np. „ctrl b”.'],
    clearSearch: ['Clear search', 'Wyczyść wyszukiwanie'],
    results: ['results for', ['wynik dla', 'wyniki dla', 'wyników dla']],
    comboResults: ['shortcuts use', ['skrót używa', 'skróty używają', 'skrótów używa']],
    pinnedEmpty: ['Your sheet is empty', 'Twoja ściąga jest pusta'],
    pinnedEmptyText: ['Click the ☆ next to any shortcut to pin it here — build a small sheet for your current project.', 'Kliknij ☆ przy dowolnym skrócie, aby go tu przypiąć — zbuduj małą ściągę do bieżącego projektu.'],
    allLearned: ['Everything here is learned 🎉', 'Wszystko tutaj już umiesz 🎉'],
    allLearnedText: ['Turn off “Hide learned” in the view options to see them again.', 'Wyłącz „Ukryj nauczone” w opcjach widoku, aby je znów zobaczyć.'],
    showAll: ['Show everything', 'Pokaż wszystko'],
    language: ['Language', 'Język'],
    keysFor: ['Keys for', 'Klawisze dla'],
    density: ['Density', 'Gęstość'],
    comfortable: ['Comfortable', 'Wygodna'],
    compact: ['Compact', 'Kompaktowa'],
    theme: ['Theme', 'Motyw'],
    auto: ['Auto', 'Auto'],
    light: ['Light', 'Jasny'],
    dark: ['Dark', 'Ciemny'],
    showHints: ['Show hints', 'Pokazuj wskazówki'],
    showHintsSub: ['Extra explanations under shortcuts', 'Dodatkowe wyjaśnienia pod skrótami'],
    hideLearned: ['Hide learned', 'Ukryj nauczone'],
    hideLearnedSub: ['Focus on what you still need', 'Skup się na tym, czego jeszcze nie umiesz'],
    print: ['Print / PDF', 'Drukuj / PDF'],
    reset: ['Reset progress', 'Resetuj postęp'],
    resetConfirm: ['Clear all learned marks and pins?', 'Wyczyścić wszystkie oznaczenia nauczonych i przypięte?'],
    showStart: ['Show “Start here”', 'Pokaż „Zacznij tutaj”'],
    quizTitle: ['Flashcards', 'Fiszki'],
    card: ['card', 'fiszka'],
    a2k: ['Action → keys', 'Akcja → klawisze'],
    k2a: ['Keys → action', 'Klawisze → akcja'],
    includeLearned: ['include learned', 'z nauczonymi'],
    reveal: ['Show answer', 'Pokaż odpowiedź'],
    notYet: ['Not yet', 'Jeszcze nie'],
    knew: ['Knew it', 'Umiem'],
    quizEmpty: ['No cards in the current view.', 'Brak fiszek w bieżącym widoku.'],
    quizDone: ['Round complete!', 'Runda zakończona!'],
    again: ['Another round', 'Kolejna runda'],
    close: ['Close', 'Zamknij'],
    whatKeys: ['Which keys?', 'Jakie klawisze?'],
    whatDoes: ['What does it do?', 'Co to robi?'],
    footerNote: ['Assumes the default “DaVinci Resolve” keyboard preset (DaVinci Resolve → Keyboard Customization, Ctrl+Alt+K). Many keys act on the panel under focus, and some only work on a specific page.',
      'Zakłada domyślny preset klawiatury „DaVinci Resolve” (DaVinci Resolve → Keyboard Customization, Ctrl+Alt+K). Wiele klawiszy działa w aktywnym panelu, a niektóre tylko na konkretnej stronie.'],
    footerMacOk: ['macOS keys are checked against the macOS column of the same reference (Ctrl → ⌘ Cmd, Alt → ⌥ Option).', 'Klawisze macOS są sprawdzone z kolumną macOS tego samego źródła (Ctrl → ⌘ Cmd, Alt → ⌥ Option).'],
    footerMacNo: ['macOS keys are converted automatically (Ctrl → ⌘ Cmd, Alt → ⌥ Option) and have not been verified.',
      'Klawisze macOS są przeliczane automatycznie (Ctrl → ⌘ Cmd, Alt → ⌥ Option) i nie zostały zweryfikowane.'],
    sourceLabel: ['Source', 'Źródło'],
    studioLegend: ['Studio = feature available only in the paid DaVinci Resolve Studio.', 'Studio = funkcja dostępna tylko w płatnej wersji DaVinci Resolve Studio.']
  };
  var uiIdx = function () { return S.lang === 'pl' ? 1 : 0; };
  function t(key) { var v = UI[key][uiIdx()]; return Array.isArray(v) ? v[2] : v; }
  // Count + noun with Polish plural forms (1 skrót, 2 skróty, 5 skrótów).
  function tn(n, key) {
    var v = UI[key][uiIdx()];
    if (!Array.isArray(v)) return n + ' ' + v;
    var d = n % 10, dd = n % 100;
    return n + ' ' + (n === 1 ? v[0] : d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? v[1] : v[2]);
  }
  // Heading text: primary language, plus the other one underneath in "both" mode.
  function tb(key) { return S.lang === 'both' ? esc(UI[key][0]) + '<span class="alt">' + esc(UI[key][1]) + '</span>' : esc(t(key)); }
  function bi(o) {
    if (!o) return '';
    if (S.lang === 'pl') return esc(o.pl);
    if (S.lang === 'en') return esc(o.en);
    return esc(o.en) + '<span class="alt">' + esc(o.pl) + '</span>';
  }
  function one(o) { return S.lang === 'pl' ? o.pl : o.en; }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fold(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l'); }

  // ------------------------------------------------------------ data
  var MANUAL = M.manual;
  var ITEMS = [];
  var CATS = D.categories;
  CATS.forEach(function (c) {
    c.groups.forEach(function (g) {
      g.items.forEach(function (it) {
        var rec = { id: c.id + '|' + it.k + '|' + it.en, cat: c, group: g, it: it };
        rec.chords = chordKeys(it.k).concat(it.mk ? chordKeys(it.mk) : []);
        rec.hay = fold([it.en, it.pl, it.h ? it.h.en + ' ' + it.h.pl : '', g.name.en, g.name.pl, c.name.en, c.name.pl,
          keyWords(it.k), it.mk ? keyWords(it.mk) : '', it.st ? 'studio' : ''].join(' '));
        ITEMS.push(rec);
      });
    });
  });
  var VERIFIED = ITEMS.filter(function (r) { return r.it.cmd; }).length;

  // ------------------------------------------------------------ keys
  var KEY_LABEL = {
    Tab: 'Tab', Space: 'Space', Enter: 'Enter', Esc: 'Esc', Del: 'Del', Backspace: 'Backspace', Home: 'Home', End: 'End',
    PgUp: 'PgUp', PgDn: 'PgDn', Up: '↑', Down: '↓', Left: '←', Right: '→',
    NumDot: 'Num .', NumPlus: 'Num +', NumMinus: 'Num −', NumSlash: 'Num /', NumStar: 'Num *', NumEnter: 'Num Enter',
    Grave: '`', Comma: ',', Period: '.', Slash: '/', Backslash: '\\', LBracket: '[', RBracket: ']', Minus: '−', Equal: '=',
    Semicolon: ';', Quote: "'", '0-9': '0 – 9'
  };
  var KEY_TITLE = { Grave: 'Grave accent / tilde (key under Esc)', Comma: 'Comma', Period: 'Period', Slash: 'Slash', Backslash: 'Backslash', Minus: 'Minus', Quote: 'Apostrophe', Semicolon: 'Semicolon' };
  var MAC_LABEL = { Enter: '↩ Return', Backspace: '⌫ Delete', Del: '⌦ Del', Esc: 'esc' };
  var MOUSE = { LMB: ['LMB', 'LPM', 'L'], RMB: ['RMB', 'PPM', 'R'], MMB: ['MMB', 'ŚPM', 'M'], Wheel: ['Wheel', 'Kółko', 'W'] };

  function mouseSvg(b) {
    var fill = '';
    if (b === 'L') fill = '<path class="b" d="M5.4 1.6A4.6 4.6 0 0 0 1.5 6.2v.8h3.9z"/>';
    if (b === 'R') fill = '<path class="b" d="M6.6 1.6a4.6 4.6 0 0 1 3.9 4.6v.8H6.6z"/>';
    if (b === 'M' || b === 'W') fill = '<rect class="b" x="4.9" y="2.6" width="2.2" height="4" rx="1.1"/>';
    return '<svg viewBox="0 0 12 16" aria-hidden="true"><rect x=".75" y=".75" width="10.5" height="14.5" rx="5.25" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
      (b === 'M' || b === 'W' ? '' : '<path d="M6 1v6" stroke="currentColor" stroke-width="1.1"/>') + fill + '</svg>';
  }

  // Keys in data.js use Windows/Linux names. On macOS Resolve maps Ctrl to ⌘ Cmd and
  // Alt to ⌥ Option; "Meta" is the physical Control key (⌃) on a Mac.
  function modLabel(m) {
    if (S.os !== 'mac') return m === 'Meta' ? 'Win' : m;
    if (m === 'Ctrl') return '⌘ Cmd';
    if (m === 'Alt') return '⌥ Opt';
    if (m === 'Shift') return '⇧ Shift';
    if (m === 'Meta') return '⌃ Ctrl';
    return m;
  }

  function mainKey(tok) {
    var drag = /-Drag$/.test(tok), dbl = /^2x/.test(tok);
    var k = tok.replace(/-Drag$/, '').replace(/^2x/, '');
    var li = S.lang === 'pl' ? 1 : 0;
    if (MOUSE[k]) {
      var sub = drag ? (li ? 'przeciągnij' : 'drag') : dbl ? (li ? '2× klik' : 'double') : '';
      return '<kbd class="mouse" title="' + esc(MOUSE[k][0]) + '">' + mouseSvg(MOUSE[k][2]) + esc(MOUSE[k][li]) + (sub ? ' <span class="sub">' + sub + '</span>' : '') + '</kbd>';
    }
    var label = (S.os === 'mac' && MAC_LABEL[k]) || KEY_LABEL[k] || (/^Num\d$/.test(k) ? 'Num ' + k.slice(3) : k);
    var title = KEY_TITLE[k] ? ' title="' + esc(KEY_TITLE[k]) + '"' : '';
    return (dbl ? '<span class="then">2×</span>' : '') + '<kbd' + title + '>' + esc(label) + '</kbd>';
  }

  var MODS = ['Ctrl', 'Alt', 'Shift', 'Meta'];
  function renderChord(ch) {
    var toks = ch.split('+');
    var main = toks[toks.length - 1];
    var mods = toks.slice(0, -1);
    var parts = mods.map(function (m) { return '<kbd class="mod">' + esc(modLabel(m)) + '</kbd>'; });
    // A lone modifier ("hold Shift while dragging") is still shown as a modifier key.
    parts.push(MODS.indexOf(main) >= 0 ? '<kbd class="mod">' + esc(modLabel(main)) + '</kbd>' : mainKey(main));
    return '<span class="combo">' + parts.join('<span class="plus">+</span>') + '</span>';
  }

  // The keys to show for an item on the current platform.
  function itemKeys(it) { return S.os === 'mac' && it.mk ? it.mk : it.k; }

  function renderKeys(k) {
    return '<div class="keys">' + k.split('|').map(function (alt) {
      return alt.split(' ').map(renderChord).join('<span class="then">›</span>');
    }).join('<span class="or">/</span>') + '</div>';
  }

  // Normalised chords for key-combo search: "ctrl+shift+s", "num5", "lmb"…
  function normChord(mods, main) {
    var order = ['ctrl', 'shift', 'alt', 'meta'];
    return order.filter(function (m) { return mods.indexOf(m) >= 0; }).concat([main]).join('+');
  }
  function chordKeys(k) {
    var out = [];
    k.split('|').forEach(function (alt) {
      alt.split(' ').forEach(function (ch) {
        var toks = ch.split('+');
        var main = toks.pop().replace(/-Drag$/, '').replace(/^2x/, '').toLowerCase();
        out.push(normChord(toks.map(function (m) { return m.toLowerCase(); }), main));
      });
    });
    return out;
  }
  function keyWords(k) {
    return k.replace(/[|+]/g, ' ').replace(/-Drag/g, ' drag przeciagnij').replace(/2x/g, 'double ')
      .replace(/\bNum(\w+)/g, 'num$1 numpad $1').replace(/\bCtrl\b/g, 'ctrl cmd').replace(/\bAlt\b/g, 'alt option').replace(/\bMeta\b/g, 'meta control')
      .replace(/\bLMB\b/g, 'lmb click lpm').replace(/\bRMB\b/g, 'rmb right ppm').replace(/\bMMB\b/g, 'mmb middle spm').replace(/\bWheel\b/g, 'wheel scroll kolko');
  }

  var MOD_ALIAS = { ctrl: 'ctrl', control: 'ctrl', ctl: 'ctrl', strg: 'ctrl', cmd: 'ctrl', command: 'ctrl', '⌘': 'ctrl',
    shift: 'shift', '⇧': 'shift', alt: 'alt', option: 'alt', opt: 'alt', '⌥': 'alt', meta: 'meta', '⌃': 'meta' };
  var KEY_ALIAS = {
    '.': 'period', ',': 'comma', '/': 'slash', '\\': 'backslash', ';': 'semicolon', "'": 'quote', '`': 'grave', '~': 'grave', tilde: 'grave', '[': 'lbracket', ']': 'rbracket',
    '-': 'minus', '=': 'equal', esc: 'esc', escape: 'esc', delete: 'del', del: 'del', return: 'enter', enter: 'enter',
    pageup: 'pgup', pagedown: 'pgdn', pgup: 'pgup', pgdn: 'pgdn', '↑': 'up', '↓': 'down', '←': 'left', '→': 'right',
    click: 'lmb', lpm: 'lmb', ppm: 'rmb', spm: 'mmb', scroll: 'wheel', kolko: 'wheel', space: 'space', spacja: 'space',
    'num.': 'numdot', 'num+': 'numplus', 'num-': 'numminus', 'num/': 'numslash', 'num*': 'numstar', numenter: 'numenter'
  };
  var NAMED = /^(f([1-9]|1[0-2])|tab|space|enter|esc|del|backspace|home|end|pgup|pgdn|up|down|left|right|num[0-9]|numdot|numplus|numminus|numslash|numstar|numenter|grave|comma|period|slash|backslash|semicolon|quote|lbracket|rbracket|minus|equal|lmb|rmb|mmb|wheel)$/;

  function parseCombo(q) {
    var s = fold(q).trim().replace(/\bnumpad\s*|\bnum\s+/g, 'num');
    var toks = s.split(/\s*\+\s*|\s+/).filter(Boolean);
    if (!toks.length || toks.length > 4) return null;
    var mods = [], main = null;
    for (var i = 0; i < toks.length; i++) {
      var tk = toks[i];
      if (MOD_ALIAS[tk]) { if (mods.indexOf(MOD_ALIAS[tk]) < 0) mods.push(MOD_ALIAS[tk]); continue; }
      if (main) return null;
      main = KEY_ALIAS[tk] || tk;
    }
    if (!main) return null;
    var isKey = /^[a-z0-9]$/.test(main) || NAMED.test(main);
    if (!isKey) return null;
    // A lone word like "tab" or "home" could also be a text search; only
    // single characters, F-keys and numpad keys are treated as keys on their own.
    if (!mods.length && toks.length === 1 && !/^([a-z0-9]|f\d+|num\w+|[.,/\\;'`~\[\]=-])$/.test(toks[0])) return null;
    return normChord(mods, main);
  }

  // ------------------------------------------------------------ filtering
  function levelOk(r) { return (r.it.l || 1) <= S.level; }

  function currentMatch() {
    var q = view.q.trim();
    if (q) {
      var combo = parseCombo(q);
      if (combo) return { combo: combo, fn: function (r) { return r.chords.indexOf(combo) >= 0; } };
      var words = fold(q).split(/\s+/).filter(Boolean);
      return { words: words, fn: function (r) { return words.every(function (w) { return r.hay.indexOf(w) >= 0; }); } };
    }
    return {
      fn: function (r) {
        if (view.cat === 'pinned') return pinned.has(r.id);
        if (view.cat !== 'all' && r.cat.id !== view.cat) return false;
        if (!levelOk(r)) return false;
        if (S.hideLearned && learned.has(r.id)) return false;
        return true;
      }
    };
  }

  function highlight(text, words) {
    var html = esc(text);
    if (!words || !words.length) return html;
    words.forEach(function (w) {
      if (w.length < 2) return;
      var re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      html = html.replace(/(^|>)([^<]*)/g, function (m, a, b) { return a + b.replace(re, '<mark>$1</mark>'); });
    });
    return html;
  }

  // ------------------------------------------------------------ render
  var ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.7 2.7L16.5 9.5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>'
  };

  function srcText(it) {
    var parts = [];
    if (it.cmd) parts.push(t('command') + ': ' + [].concat(it.cmd).join(', '));
    if (it.hc) parts.push(t('builtIn'));
    if (it.src) parts.push(t('source') + ': ' + it.src);
    return parts.join('\n');
  }

  function rowHtml(r, words) {
    var it = r.it, L = learned.has(r.id), P = pinned.has(r.id);
    var lvlName = UI.levelNames[uiIdx()][(it.l || 1) - 1];
    var primary = S.lang === 'pl' ? it.pl : it.en;
    var act = '<span class="act-text" title="' + esc(srcText(it)) + '">' + highlight(primary, words) + '</span>';
    var studio = it.st ? '<span class="studio" title="' + esc(t('studioOnly')) + '">Studio</span>' : '';
    var info = it.hc ? '<span class="hc-mark" title="' + esc(srcText(it)) + '" aria-label="' + esc(t('builtIn')) + '">ⓘ</span>' : '';
    var alt = S.lang === 'both' ? '<span class="alt">' + highlight(it.pl, words) + '</span>' : '';
    var hint = '';
    if (it.h) {
      hint = '<span class="hint">' + (S.lang === 'pl' ? highlight(it.h.pl, words) : highlight(it.h.en, words)) +
        (S.lang === 'both' ? '<span class="alt">' + highlight(it.h.pl, words) + '</span>' : '') + '</span>';
    }
    return '<div class="row' + (L ? ' learned' : '') + (it.hc ? ' hc' : '') + '" data-id="' + esc(r.id) + '">' +
      renderKeys(itemKeys(it)) +
      '<div class="txt"><div class="act"><span class="lv l' + (it.l || 1) + '" title="' + esc(lvlName) + '"></span>' + act + studio + info + '</div>' + alt + hint + '</div>' +
      '<div class="row-actions">' +
      '<button class="ra learn" type="button" data-act="learn" aria-pressed="' + L + '" title="' + esc(t(L ? 'unmarkLearned' : 'markLearned')) + '" aria-label="' + esc(t('markLearned')) + '">' + ICON.check + '</button>' +
      '<button class="ra pin" type="button" data-act="pin" aria-pressed="' + P + '" title="' + esc(t(P ? 'unpin' : 'pin')) + '" aria-label="' + esc(t('pin')) + '">' + ICON.star + '</button>' +
      '</div></div>';
  }

  function catProgress(c) {
    var all = ITEMS.filter(function (r) { return r.cat === c; });
    var n = all.filter(function (r) { return learned.has(r.id); }).length;
    return { n: n, total: all.length };
  }

  function renderSections() {
    var m = currentMatch();
    var searching = !!view.q.trim();
    var html = '', shown = 0;
    CATS.forEach(function (c) {
      var groupsHtml = '', count = 0;
      c.groups.forEach(function (g) {
        var rows = ITEMS.filter(function (r) { return r.cat === c && r.group === g && m.fn(r); });
        if (!rows.length) return;
        count += rows.length;
        groupsHtml += '<div class="group"><span class="group-tag">' + bi(g.name) + '</span><div class="grid">' +
          rows.map(function (r) { return rowHtml(r, m.words); }).join('') + '</div></div>';
      });
      if (!count) return;
      shown += count;
      var p = catProgress(c);
      var pct = p.total ? Math.round(100 * p.n / p.total) : 0;
      var tips = (!searching && view.cat !== 'pinned' && c.tips.length)
        ? '<div class="tips">' + c.tips.map(function (tp) { return '<div class="tip"><b>' + esc(t('tip')) + '</b><span>' + bi(tp) + '</span></div>'; }).join('') + '</div>'
        : '';
      html += '<section class="cat" id="cat-' + c.id + '" data-cat="' + c.id + '">' +
        '<div class="cat-head"><div class="cat-icon" aria-hidden="true">' + c.icon + '</div>' +
        '<div><h2>' + bi(c.name) + '</h2><div class="cat-where">' + esc(one(c.where)) + '</div></div>' +
        '<div class="cat-meta">' + esc(tn(count, 'shortcuts')) + '<br>' + esc(t('learned')) + ' ' + p.n + '/' + p.total +
        '<div class="bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div></div></div>' +
        groupsHtml + tips + '</section>';
    });
    $('sections').innerHTML = html;

    // Info line for searches.
    var info = $('searchInfo');
    if (searching) {
      info.hidden = false;
      info.innerHTML = m.combo
        ? esc(tn(shown, 'comboResults')).replace(/^\d+/, '<b>$&</b>') + ' ' + renderKeys(comboToToken(m.combo))
        : esc(tn(shown, 'results')).replace(/^\d+/, '<b>$&</b>') + ' “' + esc(view.q.trim()) + '”';
    } else info.hidden = true;

    // Empty states.
    var empty = $('empty');
    if (shown) { empty.hidden = true; }
    else {
      empty.hidden = false;
      var title, text, btn = '';
      if (searching) { title = t('noResults'); text = t('noResultsText'); btn = '<button class="btn" type="button" data-do="clear">' + esc(t('clearSearch')) + '</button>'; }
      else if (view.cat === 'pinned') { title = t('pinnedEmpty'); text = t('pinnedEmptyText'); }
      else { title = t('allLearned'); text = t('allLearnedText'); btn = '<button class="btn" type="button" data-do="showLearned">' + esc(t('showAll')) + '</button>'; }
      empty.innerHTML = '<div class="big">' + (searching ? '🔍' : view.cat === 'pinned' ? '☆' : '🎉') + '</div><strong>' + esc(title) + '</strong><p>' + esc(text) + '</p>' + btn;
    }
    return shown;
  }

  function comboToToken(norm) {
    var names = { ctrl: 'Ctrl', shift: 'Shift', alt: 'Alt' };
    return norm.split('+').map(function (p) {
      if (names[p]) return names[p];
      var special = { meta: 'Meta', backslash: 'Backslash', semicolon: 'Semicolon', numdot: 'NumDot', numplus: 'NumPlus', numminus: 'NumMinus', numslash: 'NumSlash', numstar: 'NumStar', numenter: 'NumEnter', pgup: 'PgUp', pgdn: 'PgDn', lbracket: 'LBracket', rbracket: 'RBracket', lmb: 'LMB', rmb: 'RMB', mmb: 'MMB', backspace: 'Backspace' };
      if (special[p]) return special[p];
      if (/^num\d$/.test(p)) return 'Num' + p.slice(3);
      if (/^f\d+$/.test(p)) return p.toUpperCase();
      return p.charAt(0).toUpperCase() + p.slice(1);
    }).join('+');
  }

  function renderChips() {
    var visibleCount = function (c) {
      return ITEMS.filter(function (r) { return r.cat === c && levelOk(r) && !(S.hideLearned && learned.has(r.id)); }).length;
    };
    var active = view.q.trim() ? null : view.cat;
    var chip = function (id, icon, label, n, extra) {
      return '<button class="chip' + (extra || '') + '" type="button" data-cat="' + id + '" aria-pressed="' + (active === id) + '"><span aria-hidden="true">' + icon + '</span>' + esc(label) +
        (n != null ? '<span class="n">' + n + '</span>' : '') + '</button>';
    };
    var html = chip('all', '✦', t('all'), null) + chip('pinned', '★', t('pinned'), pinned.size);
    CATS.forEach(function (c, i) { html += chip(c.id, c.icon, one(c.name), visibleCount(c), i === 0 ? ' sep' : ''); });
    $('chips').innerHTML = html;
    var act = $('chips').querySelector('[aria-pressed="true"]');
    if (act && act.scrollIntoView && view.cat !== 'all') {
      var box = $('chips'), l = act.offsetLeft - box.offsetLeft;
      if (l < box.scrollLeft || l + act.offsetWidth > box.scrollLeft + box.clientWidth) box.scrollLeft = l - 40;
    }
  }

  function renderLevels() {
    var names = UI.levelSeg[uiIdx()], tips = UI.levelTips[uiIdx()];
    var html = '';
    for (var i = 1; i <= 3; i++) {
      var dots = '';
      for (var j = 1; j <= i; j++) dots += '<span class="lv l' + j + '"></span>';
      html += '<button type="button" role="radio" data-level="' + i + '" aria-checked="' + (S.level === i) + '" title="' + esc(tips[i - 1]) + '">' +
        '<span style="display:inline-flex;gap:2px">' + dots + '</span><span class="txt-full">' + esc(names[i - 1]) + '</span></button>';
    }
    $('levels').innerHTML = html;
    $('levels').setAttribute('aria-label', 'Level');
  }

  function renderStart() {
    var el = $('start');
    var show = view.cat === 'all' && !view.q.trim() && !S.startClosed;
    el.hidden = !show;
    if (!show) return;
    el.innerHTML = '<button class="close" type="button" data-do="closeStart" title="' + esc(t('hide')) + '" aria-label="' + esc(t('hide')) + '">✕</button>' +
      '<h2>🚀 ' + tb('startTitle') + '</h2><p class="lead">' + esc(t('startLead')) + '</p><div class="steps">' +
      D.start.map(function (s) {
        return '<div class="step"><h3>' + esc(one(s.step)) + '</h3><div class="keys">' +
          s.keys.map(function (k) { return renderKeys(k).replace(/^<div class="keys">|<\/div>$/g, ''); }).join('') +
          '</div><p>' + esc(one(s.text)) + '</p></div>';
      }).join('') + '</div>';
  }

  function renderSetup() {
    var el = $('setup');
    var show = (view.cat === 'all' || view.cat === 'stuck') && !view.q.trim();
    el.hidden = !show;
    if (!show) return;
    el.innerHTML = '<h2>⚙️ ' + tb('setupTitle') + '</h2><p>' + esc(t('setupLead')) + '</p><div class="cards">' +
      D.setup.map(function (s) {
        return '<div class="card"><div class="ic" aria-hidden="true">' + s.icon + '</div><div><h3>' + esc(one(s.title)) + '</h3><p>' + esc(one(s.text)) + '</p>' +
          (s.src ? '<small class="card-src">📖 ' + esc(s.src) + '</small>' : '') + '</div></div>';
      }).join('') + '</div>';
  }

  function renderHeader() {
    root.lang = S.lang === 'pl' ? 'pl' : 'en';
    $('title').innerHTML = UI.title[uiIdx()];
    $('badgeText').textContent = t('badge');
    $('subtitle').innerHTML = S.lang === 'both' ? esc(UI.subtitle[0]) + '<span class="alt">' + esc(UI.subtitle[1]) + '</span>' : esc(t('subtitle'));
    var n = ITEMS.filter(function (r) { return learned.has(r.id); }).length;
    var pct = Math.round(100 * n / ITEMS.length);
    var names = UI.levelNames[uiIdx()];
    $('stats').innerHTML =
      '<span class="stat">' + esc(tn(ITEMS.length, 'shortcuts')).replace(/^\d+/, '<b>$&</b>') + '</span>' +
      (VERIFIED ? '<span class="stat"><span class="ok">✔</span><b>' + VERIFIED + '</b> ' + esc(t('verified')) + '</span>' : '') +
      '<span class="stat">' + esc(t('learned')) + ' <b>' + n + '</b>/' + ITEMS.length + '<span class="bar"><i style="width:' + pct + '%"></i></span></span>' +
      '<span class="stat"><span class="lv l1"></span>' + esc(names[0]) + ' <span class="lv l2"></span>' + esc(names[1]) + ' <span class="lv l3"></span>' + esc(names[2]) + '</span>';
    $('search').placeholder = t('searchPh');
    $('search').setAttribute('aria-label', t('searchPh'));
    $('quizLabel').textContent = t('quiz');
    $('quizBtn').title = t('quizTip');
    $('settingsBtn').title = t('settings');
    $('settingsBtn').setAttribute('aria-label', t('settings'));
    var dark = effectiveTheme() === 'dark';
    $('themeBtn').innerHTML = dark ? ICON.moon : ICON.sun;
    $('themeBtn').title = t('themeTip');
    $('themeBtn').setAttribute('aria-label', t('themeTip'));
    updateMinBtn();
  }

  function renderFooter() {
    var studio = ITEMS.some(function (r) { return r.it.st; });
    $('footer').innerHTML =
      '<p>DaVinci Resolve ' + esc(M.label) + ' · ' + esc(tn(ITEMS.length, 'shortcuts')) + ' · ' +
      '<a href="' + esc(MANUAL) + '" target="_blank" rel="noopener">' + esc(t('manual')) + ' ↗</a> · ' +
      '<a href="https://github.com/shodahost/key-resolve" target="_blank" rel="noopener">GitHub ↗</a></p>' +
      '<p>' + bi(M.status) + (M.verified ? ' (' + esc(M.verified) + ')' : '') + '</p>' +
      '<p>' + esc(t('sourceLabel')) + ': <a href="' + esc(M.source.url) + '" target="_blank" rel="noopener">' + esc(M.source.name) + ' ↗</a></p>' +
      '<p>' + bi({ en: UI[M.macVerified ? 'footerMacOk' : 'footerMacNo'][0], pl: UI[M.macVerified ? 'footerMacOk' : 'footerMacNo'][1] }) + '</p>' +
      '<p class="note">💡 ' + bi({ en: UI.footerNote[0], pl: UI.footerNote[1] }) +
      (studio ? '<span class="note-studio"><span class="studio">Studio</span> ' + bi({ en: UI.studioLegend[0], pl: UI.studioLegend[1] }) + '</span>' : '') + '</p>';
  }

  function renderSettings() {
    var seg = function (key, opts) {
      return '<div class="seg" role="radiogroup">' + opts.map(function (o) {
        return '<button type="button" role="radio" data-set="' + key + '" data-val="' + o[0] + '" aria-checked="' + (String(S[key]) === String(o[0])) + '">' + esc(o[1]) + '</button>';
      }).join('') + '</div>';
    };
    var sw = function (key, label, sub) {
      return '<label class="opt"><span>' + esc(t(label)) + '<small>' + esc(t(sub)) + '</small></span>' +
        '<button type="button" class="switch" role="switch" data-toggle="' + key + '" aria-checked="' + !!S[key] + '" aria-label="' + esc(t(label)) + '"></button></label>';
    };
    $('settings').innerHTML =
      '<div><h3>' + esc(t('language')) + '</h3>' + seg('lang', [['en', 'English'], ['pl', 'Polski'], ['both', 'EN + PL']]) + '</div>' +
      '<div><h3>' + esc(t('keysFor')) + '</h3>' + seg('os', [['win', 'Windows / Linux'], ['mac', 'macOS']]) + '</div>' +
      '<div><h3>' + esc(t('density')) + '</h3>' + seg('density', [['comfortable', t('comfortable')], ['compact', t('compact')]]) + '</div>' +
      '<div><h3>' + esc(t('theme')) + '</h3>' + seg('theme', [['auto', t('auto')], ['light', t('light')], ['dark', t('dark')]]) + '</div>' +
      '<div>' + sw('hints', 'showHints', 'showHintsSub') + sw('hideLearned', 'hideLearned', 'hideLearnedSub') + '</div>' +
      '<div class="actions">' +
      '<button class="btn" type="button" data-do="print">🖨 ' + esc(t('print')) + '</button>' +
      (S.startClosed ? '<button class="btn" type="button" data-do="openStart">🚀 ' + esc(t('showStart')) + '</button>' : '') +
      '<button class="btn danger" type="button" data-do="reset">↺ ' + esc(t('reset')) + '</button></div>';
    $('settings').setAttribute('aria-label', t('settings'));
  }

  function applyView() {
    root.classList.toggle('compact', S.density === 'compact');
    root.classList.toggle('no-hints', !S.hints);
    if (S.theme === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', S.theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = effectiveTheme() === 'dark' ? '#0a0b0f' : '#f4f5fa';
  }

  function renderAll() {
    applyView();
    renderHeader();
    renderLevels();
    renderChips();
    renderStart();
    renderSections();
    renderSetup();
    renderFooter();
    if (!$('settings').hidden) renderSettings();
  }

  var pending = false;
  function update(opts) {
    if (!opts || opts.hash !== false) writeHash();
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; renderAll(); });
  }

  // ------------------------------------------------------------ theme / header
  function effectiveTheme() {
    if (S.theme !== 'auto') return S.theme;
    return window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: light)');
    var onMq = function () { if (S.theme === 'auto') update({ hash: false }); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
  }

  function updateMinBtn() {
    var on = root.classList.contains('hero-min');
    var b = $('minBtn');
    b.setAttribute('aria-expanded', String(!on));
    b.title = t(on ? 'expand' : 'minimize');
    b.setAttribute('aria-label', b.title);
  }
  $('minBtn').addEventListener('click', function () {
    var on = !root.classList.contains('hero-min');
    root.classList.toggle('hero-min', on);
    try { localStorage.setItem('kr.heroMin', on ? '1' : '0'); } catch (e) {}
    updateMinBtn();
  });

  $('themeBtn').addEventListener('click', function () {
    S.theme = effectiveTheme() === 'dark' ? 'light' : 'dark';
    saveSettings(); update({ hash: false });
  });

  // ------------------------------------------------------------ hash (shareable view)
  function writeHash() {
    var p = [];
    if (view.cat !== 'all') p.push('c=' + encodeURIComponent(view.cat));
    if (view.q.trim()) p.push('q=' + encodeURIComponent(view.q.trim()));
    var h = p.length ? '#' + p.join('&') : '';
    if (location.hash !== h) {
      try { history.replaceState(null, '', h || location.pathname + location.search); } catch (e) { /* file:// in some browsers */ }
    }
  }
  function readHash() {
    var h = location.hash.replace(/^#/, '');
    h.split('&').forEach(function (kv) {
      var i = kv.indexOf('='); if (i < 0) return;
      var k = kv.slice(0, i), v = decodeURIComponent(kv.slice(i + 1));
      if (k === 'c' && (v === 'pinned' || CATS.some(function (c) { return c.id === v; }))) view.cat = v;
      if (k === 'q') view.q = v;
    });
    $('search').value = view.q;
  }

  // ------------------------------------------------------------ interactions
  function setCat(id) {
    view.cat = id; view.q = ''; $('search').value = '';
    update();
    var main = document.querySelector('main');
    var tb = $('toolbar');
    var y = main.getBoundingClientRect().top + scrollY - tb.offsetHeight + 1;
    if (scrollY > y) scrollTo({ top: y, behavior: 'auto' });
  }

  $('chips').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    setCat(b.dataset.cat);
  });
  $('levels').addEventListener('click', function (e) {
    var b = e.target.closest('[data-level]'); if (!b) return;
    S.level = +b.dataset.level; saveSettings(); update({ hash: false });
  });

  var searchTimer;
  $('search').addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { view.q = $('search').value; update(); }, 60);
  });

  document.addEventListener('click', function (e) {
    var ra = e.target.closest('.ra[data-act]');
    if (ra) {
      var id = ra.closest('.row').dataset.id;
      var set = ra.dataset.act === 'learn' ? learned : pinned;
      if (set.has(id)) set.delete(id); else set.add(id);
      save(ra.dataset.act === 'learn' ? 'kr.learned' : 'kr.pinned', Array.from(set));
      update({ hash: false });
      return;
    }
    var d = e.target.closest('[data-do]');
    if (d) {
      var what = d.dataset.do;
      if (what === 'clear') { view.q = ''; $('search').value = ''; update(); $('search').focus(); }
      if (what === 'showLearned') { S.hideLearned = false; S.level = 3; saveSettings(); update({ hash: false }); }
      if (what === 'closeStart') { S.startClosed = true; saveSettings(); update({ hash: false }); }
      if (what === 'openStart') { S.startClosed = false; saveSettings(); setCat('all'); closeSettings(); }
      if (what === 'print') { closeSettings(); setTimeout(function () { window.print(); }, 50); }
      if (what === 'reset' && confirm(t('resetConfirm'))) {
        learned.clear(); pinned.clear(); save('kr.learned', []); save('kr.pinned', []); update({ hash: false });
      }
      return;
    }
    var st = e.target.closest('[data-set]');
    if (st) { S[st.dataset.set] = st.dataset.val; saveSettings(); update({ hash: false }); return; }
    var tg = e.target.closest('[data-toggle]');
    if (tg) { S[tg.dataset.toggle] = !S[tg.dataset.toggle]; saveSettings(); update({ hash: false }); return; }
    var sp = $('settings');
    if (!sp.hidden && !e.target.closest('#settings') && !e.target.closest('#settingsBtn')) closeSettings();
  });

  function openSettings() { renderSettings(); $('settings').hidden = false; $('settingsBtn').setAttribute('aria-expanded', 'true'); }
  function closeSettings() { $('settings').hidden = true; $('settingsBtn').setAttribute('aria-expanded', 'false'); }
  $('settingsBtn').addEventListener('click', function () { if ($('settings').hidden) openSettings(); else closeSettings(); });

  // Sticky toolbar border.
  var tbEl = $('toolbar');
  addEventListener('scroll', function () { tbEl.classList.toggle('stuck', tbEl.getBoundingClientRect().top <= 0 && scrollY > 10); }, { passive: true });

  addEventListener('keydown', function (e) {
    var inField = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (!$('quiz').hidden) { quizKey(e); return; }
    if (e.key === '/' && !inField && !e.ctrlKey && !e.metaKey) { e.preventDefault(); $('search').focus(); $('search').select(); }
    else if (e.key === 'Escape') {
      if (!$('settings').hidden) { closeSettings(); $('settingsBtn').focus(); }
      else if (view.q) { view.q = ''; $('search').value = ''; update(); }
      else if (inField) document.activeElement.blur();
    }
  });

  addEventListener('hashchange', function () { view.cat = 'all'; view.q = ''; readHash(); update({ hash: false }); });

  // ------------------------------------------------------------ quiz (flashcards)
  var Q = null;
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function quizPool() {
    var m = currentMatch();
    return ITEMS.filter(function (r) {
      if (view.q.trim()) { if (!m.fn(r)) return false; }
      else {
        if (view.cat === 'pinned') { if (!pinned.has(r.id)) return false; }
        else if (view.cat !== 'all' && r.cat.id !== view.cat) return false;
        if (!levelOk(r)) return false;
      }
      return S.quizLearned || !learned.has(r.id);
    });
  }
  function openQuiz() {
    Q = { deck: shuffle(quizPool()), i: 0, shown: false, ok: 0, done: 0, last: document.activeElement };
    $('quiz').hidden = false;
    renderQuiz();
  }
  function closeQuiz() {
    $('quiz').hidden = true;
    var last = Q && Q.last; Q = null;
    update({ hash: false });
    if (last && last.focus) last.focus();
  }
  function renderQuiz() {
    var card = $('quizCard');
    var seg = '<div class="seg" role="radiogroup">' + [['a2k', t('a2k')], ['k2a', t('k2a')]].map(function (o) {
      return '<button type="button" role="radio" data-qdir="' + o[0] + '" aria-checked="' + (S.quizDir === o[0]) + '">' + esc(o[1]) + '</button>';
    }).join('') + '</div>';
    var top = '<div class="quiz-top"><h2 id="quizTitle">🎴 ' + esc(t('quizTitle')) + '</h2><span class="score">' +
      (Q.done ? '✔ ' + Q.ok + '/' + Q.done + ' · ' : '') + esc(t('card')) + ' ' + Math.min(Q.i + 1, Q.deck.length) + '/' + Q.deck.length + '</span>' +
      '<button class="x" type="button" data-q="close" title="' + esc(t('close')) + '" aria-label="' + esc(t('close')) + '">✕</button></div>' +
      '<div class="quiz-opts">' + seg + '<label class="opt" style="gap:8px;display:inline-flex;align-items:center;cursor:pointer">' +
      '<button type="button" class="switch" role="switch" data-q="learned" aria-checked="' + !!S.quizLearned + '" aria-label="' + esc(t('includeLearned')) + '"></button>' + esc(t('includeLearned')) + '</label></div>';
    if (!Q.deck.length) {
      card.innerHTML = top + '<div class="q-empty">' + esc(t(Q.done ? 'quizDone' : 'quizEmpty')) + '</div>';
      return;
    }
    if (Q.i >= Q.deck.length) {
      card.innerHTML = top + '<div class="q-face"><div class="q-prompt">' + esc(t('quizDone')) + '</div><div class="q-cat">✔ ' + Q.ok + ' / ' + Q.done + '</div></div>' +
        '<div class="q-btns"><button class="btn primary" type="button" data-q="again">↻ ' + esc(t('again')) + '</button></div>';
      card.querySelector('[data-q="again"]').focus();
      return;
    }
    var r = Q.deck[Q.i], it = r.it;
    var action = '<div class="q-prompt">' + bi({ en: it.en, pl: it.pl }) + '</div>';
    var keys = renderKeys(itemKeys(it));
    var hint = it.h ? '<span class="hint">' + bi(it.h) + '</span>' : '';
    var a2k = S.quizDir === 'a2k';
    var face = '<div class="q-face"><div class="q-cat">' + r.cat.icon + ' ' + esc(one(r.cat.name)) + ' · ' + esc(one(r.group.name)) + '</div>' +
      (a2k ? action : keys) +
      (Q.shown
        ? '<div class="q-answer">' + (a2k ? keys : action) + hint + '</div>'
        : '<div class="q-q" aria-label="' + esc(t(a2k ? 'whatKeys' : 'whatDoes')) + '">?</div><div class="q-cat">' + esc(t(a2k ? 'whatKeys' : 'whatDoes')) + '</div>') +
      '</div>';
    var btns = Q.shown
      ? '<div class="q-btns"><button class="btn" type="button" data-q="no">✗ ' + esc(t('notYet')) + ' <span class="k">1</span></button>' +
        '<button class="btn ok" type="button" data-q="yes">✓ ' + esc(t('knew')) + ' <span class="k">2</span></button></div>'
      : '<div class="q-btns"><button class="btn primary" type="button" data-q="reveal">' + esc(t('reveal')) + ' <span class="k">Space</span></button></div>';
    card.innerHTML = top + face + btns;
    var f = card.querySelector(Q.shown ? '[data-q="yes"]' : '[data-q="reveal"]');
    if (f) f.focus();
  }
  function quizAnswer(knew) {
    var r = Q.deck[Q.i];
    Q.done++;
    if (knew) { Q.ok++; learned.add(r.id); save('kr.learned', Array.from(learned)); }
    Q.i++; Q.shown = false;
    renderQuiz();
  }
  $('quiz').addEventListener('click', function (e) {
    if (e.target === $('quiz')) { closeQuiz(); return; }
    var b = e.target.closest('[data-q],[data-qdir]'); if (!b) return;
    if (b.dataset.qdir) { S.quizDir = b.dataset.qdir; saveSettings(); renderQuiz(); return; }
    var a = b.dataset.q;
    if (a === 'close') closeQuiz();
    else if (a === 'reveal') { Q.shown = true; renderQuiz(); }
    else if (a === 'yes') quizAnswer(true);
    else if (a === 'no') quizAnswer(false);
    else if (a === 'again') { Q.deck = shuffle(quizPool()); Q.i = 0; Q.ok = 0; Q.done = 0; Q.shown = false; renderQuiz(); }
    else if (a === 'learned') { S.quizLearned = !S.quizLearned; saveSettings(); Q.deck = shuffle(quizPool()); Q.i = 0; Q.shown = false; renderQuiz(); }
  });
  function quizKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeQuiz(); return; }
    if (!Q || Q.i >= Q.deck.length) return;
    if (!Q.shown && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); Q.shown = true; renderQuiz(); }
    else if (Q.shown && (e.key === '1' || e.key === 'ArrowLeft')) { e.preventDefault(); quizAnswer(false); }
    else if (Q.shown && (e.key === '2' || e.key === 'ArrowRight')) { e.preventDefault(); quizAnswer(true); }
    else if (e.key === 'Tab') {
      // Keep focus inside the dialog.
      var f = $('quizCard').querySelectorAll('button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  $('quizBtn').addEventListener('click', openQuiz);

  // ------------------------------------------------------------ go
  readHash();
  renderAll();
})();
