window.KB_DATA = {
  "meta": {"resolve": "21.1", "label": "21.1", "manual": "https://documents.blackmagicdesign.com/UserManuals/DaVinciResolveReferenceManual.pdf", "reference": {"table": "reference/resolve-21.1-article-table.tsv", "text": "reference/resolve-21.1-article-text.tsv"}, "source": {"name": "DaVinci Resolve Club — DaVinci Resolve keyboard shortcuts (Resolve 21.1, updated 2026-09-27)", "url": "https://davinciresolveclub.com/"}, "status": {"en": "Every key assignment is checked against the reference table and text of the DaVinci Resolve Club article for Resolve 21.1 (default “DaVinci Resolve” preset) with tools/verify_shortcuts.py.", "pl": "Każde przypisanie klawisza jest sprawdzane z tabelą i tekstem artykułu DaVinci Resolve Club dla Resolve 21.1 (domyślny preset „DaVinci Resolve”) skryptem tools/verify_shortcuts.py."}, "macVerified": true, "verified": "2026-09-28"},
  "start": [
    {"step": {"en": "Play & mark", "pl": "Odtwarzaj i zaznaczaj"}, "keys": ["J", "K", "L", "I", "O"], "text": {"en": "Shuttle with J / K / L, stop, then set In and Out with I / O.", "pl": "Przewijaj J / K / L, zatrzymaj, potem ustaw In i Out klawiszami I / O."}},
    {"step": {"en": "Cut at the playhead", "pl": "Tnij w miejscu głowicy"}, "keys": ["Ctrl+Backslash", "B", "A"], "text": {"en": "Split Clip for one cut. B only for many click-cuts — and A the moment you're done.", "pl": "Split Clip do pojedynczego cięcia. B tylko do wielu cięć kliknięciem — i od razu A, gdy skończysz."}},
    {"step": {"en": "Trim & move between edits", "pl": "Trymuj i skacz po cięciach"}, "keys": ["T", "Up", "Down", "Comma", "Period"], "text": {"en": "Trim Edit Mode, jump to the previous / next edit, nudge one frame.", "pl": "Tryb trymowania, skok do poprzedniego / następnego cięcia, przesunięcie o klatkę."}},
    {"step": {"en": "Stay oriented", "pl": "Nie zgub się"}, "keys": ["M", "N", "Shift+Z", "Ctrl+Z"], "text": {"en": "Marker, snapping, fit the timeline — and undo when in doubt.", "pl": "Marker, przyciąganie, cała oś czasu w oknie — a w razie wątpliwości cofnij."}}
  ],
  "setup": [
    {"icon": "⌨️", "title": {"en": "Check the keyboard preset", "pl": "Sprawdź preset klawiatury"}, "text": {"en": "DaVinci Resolve → Keyboard Customization. This sheet assumes the default “DaVinci Resolve” preset; the Premiere Pro, Final Cut Pro and Avid presets assign keys differently.", "pl": "DaVinci Resolve → Keyboard Customization. Ta ściąga zakłada domyślny preset „DaVinci Resolve”; presety Premiere Pro, Final Cut Pro i Avid przypisują klawisze inaczej."}, "src": "Resolve, Premiere, Final Cut, or Avid Preset?"},
    {"icon": "💾", "title": {"en": "Save your own preset first", "pl": "Najpierw zapisz własny preset"}, "text": {"en": "Options menu → Save As New Preset before changing any key, then Export Preset and keep a dated copy. In 21.1 and later, new user presets pick up later factory-default updates that don't conflict.", "pl": "Menu opcji → Save As New Preset, zanim zmienisz jakikolwiek klawisz, potem Export Preset i trzymaj kopię z datą. Od 21.1 nowe presety użytkownika przejmują późniejsze zmiany domyślnych skrótów, które z niczym nie kolidują."}, "src": "How to Customize Shortcuts Without Breaking the Map; Free vs Studio and Resolve 21 Notes"},
    {"icon": "🆓", "title": {"en": "Free or Studio — same keys", "pl": "Free czy Studio — te same klawisze"}, "text": {"en": "Keyboard Customization and every editing command on this sheet work in both editions. Mapping a key to a Studio-only effect doesn't unlock it in Free.", "pl": "Keyboard Customization i wszystkie polecenia montażowe z tej ściągi działają w obu wersjach. Przypisanie klawisza do efektu tylko ze Studio nie odblokowuje go w wersji Free."}, "src": "Free vs Studio and Resolve 21 Notes"},
    {"icon": "💻", "title": {"en": "Laptop: F-keys and Delete", "pl": "Laptop: klawisze F i Delete"}, "text": {"en": "F9–F12 may need Fn or an operating-system setting. On compact Mac keyboards the key labelled Delete acts as Backspace; Forward Delete needs Fn.", "pl": "F9–F12 mogą wymagać Fn albo zmiany w ustawieniach systemu. Na małych klawiaturach Maca klawisz Delete działa jak Backspace; Forward Delete wymaga Fn."}, "src": "Mark, Insert, and Overwrite Without Guessing; Essential DaVinci Resolve 21 Shortcuts"},
    {"icon": "🎞", "title": {"en": "Project settings before import", "pl": "Ustawienia projektu przed importem"}, "text": {"en": "File → Project Settings → Master Settings: choose the timeline resolution and frame rate before you import media and build timelines.", "pl": "File → Project Settings → Master Settings: wybierz rozdzielczość i liczbę klatek osi czasu, zanim zaimportujesz materiał i zbudujesz osie czasu."}, "src": "Resolve menu (not covered by the article)"},
    {"icon": "🐢", "title": {"en": "Proxy / optimized media", "pl": "Proxy / optimized media"}, "text": {"en": "Playback stutters on heavy camera files? Right-click the clips in the Media Pool → Generate Proxy Media or Generate Optimized Media, and let playback use them (Playback menu).", "pl": "Odtwarzanie się tnie przy ciężkich plikach z kamery? Kliknij klipy prawym w Media Pool → Generate Proxy Media lub Generate Optimized Media i pozwól odtwarzaniu z nich korzystać (menu Playback)."}, "src": "Resolve menu (not covered by the article)"},
    {"icon": "🧊", "title": {"en": "Render cache", "pl": "Render cache"}, "text": {"en": "Playback → Render Cache → Smart pre-renders heavy effects and transitions in the background, so the timeline plays in real time.", "pl": "Playback → Render Cache → Smart renderuje w tle ciężkie efekty i przejścia, żeby oś czasu grała płynnie."}, "src": "Resolve menu (not covered by the article)"}
  ],
  "categories": [
    {
      "id": "stuck",
      "icon": "🆘",
      "name": {"en": "Help, I'm stuck!", "pl": "Ratunku, utknąłem!"},
      "where": {"en": "Typical beginner problems and the key that fixes them", "pl": "Typowe problemy początkujących i klawisz, który je rozwiązuje"},
      "tips": [{"en": "Before changing anything, click the panel where the command should act — many commands depend on page, mode and focus.", "pl": "Zanim cokolwiek zmienisz, kliknij panel, w którym polecenie ma działać — wiele poleceń zależy od strony, trybu i aktywnego panelu."}, {"en": "Wrong command fires? In Keyboard Customization select the key on the visual keyboard: one key can carry application- and panel-specific actions.", "pl": "Odpala się złe polecenie? W Keyboard Customization zaznacz klawisz na wirtualnej klawiaturze: jeden klawisz może mieć akcje dla całej aplikacji i dla konkretnych paneli."}],
      "groups": [
        {
          "name": {"en": "Timeline surprises", "pl": "Niespodzianki na osi czasu"},
          "items": [
            {"k": "Ctrl+Z", "en": "Ripple Delete removed too much", "pl": "Ripple Delete usunął za dużo", "l": 1, "h": {"en": "Undo straight away, then check the selected clips, track auto-select, linked selection and locked tracks.", "pl": "Od razu cofnij, potem sprawdź zaznaczone klipy, auto-select ścieżek, linked selection i zablokowane ścieżki."}, "cmd": "Undo"},
            {"k": "A", "en": "Every click cuts my clip", "pl": "Każde kliknięcie tnie mi klip", "l": 1, "h": {"en": "You are still in Blade Edit Mode. A returns to the normal selection pointer.", "pl": "Nadal jesteś w trybie Blade. A przywraca zwykły kursor zaznaczania."}, "cmd": "Selection Mode"},
            {"k": "N", "en": "The playhead or an edit keeps jumping to nearby boundaries", "pl": "Głowica lub cięcie ciągle przeskakuje do pobliskich krawędzi", "l": 1, "h": {"en": "Snapping is on. N toggles it off — and on again.", "pl": "Włączone przyciąganie (snapping). N je wyłącza — i włącza z powrotem."}, "cmd": "Toggle snapping"},
            {"k": "Shift+Z", "en": "I'm lost in the timeline / zoomed in too far", "pl": "Zgubiłem się na osi czasu / za duże przybliżenie", "l": 1, "h": {"en": "Shows the complete timeline; press again to restore the previous zoom.", "pl": "Pokazuje całą oś czasu; ponowne wciśnięcie przywraca poprzedni zoom."}, "cmd": "Fit timeline in window"},
            {"k": "W", "en": "J / K / L trim instead of playing", "pl": "J / K / L trymują zamiast odtwarzać", "l": 2, "h": {"en": "Dynamic Trim Mode is on. Press W again to leave it.", "pl": "Włączony Dynamic Trim Mode. Wciśnij W ponownie, żeby z niego wyjść."}, "cmd": "Dynamic Trim Mode"},
            {"k": "Ctrl+Shift+L", "en": "Picture and sound select separately (or together when you don't want them to)", "pl": "Obraz i dźwięk zaznaczają się osobno (albo razem, gdy tego nie chcesz)", "l": 2, "h": {"en": "Linked selection decides whether linked picture and sound select together.", "pl": "Linked selection decyduje, czy powiązany obraz i dźwięk zaznaczają się razem."}, "cmd": "Toggle linked selection"},
            {"k": "D", "en": "A clip is still on the timeline but doesn't show or play", "pl": "Klip jest na osi czasu, ale go nie widać ani nie słychać", "l": 2, "h": {"en": "It may be disabled. D toggles the selected clip on or off without deleting it.", "pl": "Może być wyłączony. D włącza lub wyłącza zaznaczony klip bez usuwania go."}, "cmd": "Enable or disable clip"}
          ]
        },
        {
          "name": {"en": "Export & keys", "pl": "Eksport i klawisze"},
          "items": [
            {"k": "I|O", "en": "The export covers only part of the timeline", "pl": "Eksport obejmuje tylko część osi czasu", "l": 1, "h": {"en": "Stale In and Out marks are the first thing to check — they also set the render range.", "pl": "Najpierw sprawdź stare punkty In i Out — one wyznaczają też zakres renderu."}, "cmd": ["Mark In", "Mark Out"]},
            {"k": "Esc", "en": "A shortcut types into a text field instead", "pl": "Skrót wpisuje się w pole tekstowe", "l": 1, "h": {"en": "A text field has focus. Press Escape if it makes sense, click the timeline or viewer and try again.", "pl": "Aktywne jest pole tekstowe. Wciśnij Escape, jeśli to ma sens, kliknij oś czasu lub podgląd i spróbuj ponownie."}, "hc": 1, "src": "Why a DaVinci Resolve Shortcut Does Not Work → A shortcut types into a field instead"}
          ]
        }
      ]
    },
    {
      "id": "pages",
      "icon": "🗂",
      "name": {"en": "Pages & project", "pl": "Strony i projekt"},
      "where": {"en": "Anywhere in Resolve", "pl": "W całym programie"},
      "tips": [{"en": "Page shortcuts are especially useful on a single display.", "pl": "Skróty stron przydają się zwłaszcza na jednym monitorze."}, {"en": "Learn the command name along with the key: the preset, OS, keyboard layout, page and focused panel can all change what a key does.", "pl": "Ucz się nazwy polecenia razem z klawiszem: preset, system, układ klawiatury, strona i aktywny panel mogą zmienić działanie klawisza."}],
      "groups": [
        {
          "name": {"en": "Switch page", "pl": "Przełącz stronę"},
          "items": [
            {"k": "Shift+2", "en": "Media page", "pl": "Strona Media", "l": 1, "h": {"en": "Import and organize footage.", "pl": "Import i porządkowanie materiału."}, "cmd": "Media page"},
            {"k": "Shift+3", "en": "Cut page", "pl": "Strona Cut", "l": 2, "cmd": "Cut page"},
            {"k": "Shift+4", "en": "Edit page", "pl": "Strona Edit", "l": 1, "cmd": "Edit page"},
            {"k": "Shift+5", "en": "Fusion page", "pl": "Strona Fusion", "l": 3, "cmd": "Fusion page"},
            {"k": "Shift+6", "en": "Color page", "pl": "Strona Color", "l": 2, "cmd": "Color page"},
            {"k": "Shift+7", "en": "Fairlight page", "pl": "Strona Fairlight", "l": 2, "cmd": "Fairlight page"},
            {"k": "Shift+8", "en": "Deliver page", "pl": "Strona Deliver", "l": 1, "h": {"en": "Render / export.", "pl": "Render / eksport."}, "cmd": "Deliver page"}
          ]
        },
        {
          "name": {"en": "Project & clipboard", "pl": "Projekt i schowek"},
          "items": [
            {"k": "Ctrl+S", "en": "Save project", "pl": "Zapisz projekt", "l": 1, "cmd": "Save project"},
            {"k": "Ctrl+Z", "en": "Undo", "pl": "Cofnij", "l": 1, "cmd": "Undo"},
            {"k": "Ctrl+Shift+Z", "en": "Redo", "pl": "Ponów", "l": 1, "cmd": "Redo"},
            {"k": "Ctrl+X", "en": "Cut", "pl": "Wytnij", "l": 2, "cmd": "Cut"},
            {"k": "Ctrl+C", "en": "Copy", "pl": "Kopiuj", "l": 1, "cmd": "Copy"},
            {"k": "Ctrl+V", "en": "Paste", "pl": "Wklej", "l": 1, "h": {"en": "Pastes at the active destination.", "pl": "Wkleja w aktywnym miejscu docelowym."}, "cmd": "Paste"}
          ]
        }
      ]
    },
    {
      "id": "playback",
      "icon": "▶",
      "name": {"en": "Playback & J/K/L", "pl": "Odtwarzanie i J/K/L"},
      "where": {"en": "Source or timeline viewer that has focus", "pl": "Aktywny podgląd źródła lub osi czasu"},
      "tips": [{"en": "Landing on one exact frame: shuttle close with L, stop with K, then step with the arrow keys — no wild mouse scrubbing.", "pl": "Trafienie w konkretną klatkę: dojedź blisko L, zatrzymaj K, potem krokuj strzałkami — bez szarpania myszą."}, {"en": "In Dynamic Trim Mode (W) the same J / K / L trim the selected edit instead of playing.", "pl": "W Dynamic Trim Mode (W) te same J / K / L trymują zaznaczone cięcie zamiast odtwarzać."}],
      "groups": [
        {
          "name": {"en": "Shuttle", "pl": "Przewijanie"},
          "items": [
            {"k": "J", "en": "Play reverse", "pl": "Odtwarzaj do tyłu", "l": 1, "h": {"en": "Press again to shuttle faster.", "pl": "Kolejne naciśnięcia przyspieszają."}, "cmd": "Play reverse"},
            {"k": "K", "en": "Stop", "pl": "Stop", "l": 1, "cmd": "Stop"},
            {"k": "L", "en": "Play forward", "pl": "Odtwarzaj do przodu", "l": 1, "h": {"en": "Press again to shuttle faster.", "pl": "Kolejne naciśnięcia przyspieszają."}, "cmd": "Play forward"},
            {"k": "K+J", "en": "Slow reverse playback", "pl": "Powolne odtwarzanie do tyłu", "l": 2, "h": {"en": "Hold K and J together.", "pl": "Przytrzymaj razem K i J."}, "hc": 1, "src": "Playback: Build J-K-L Muscle Memory First"},
            {"k": "K+L", "en": "Slow forward playback", "pl": "Powolne odtwarzanie do przodu", "l": 2, "h": {"en": "Hold K and L together.", "pl": "Przytrzymaj razem K i L."}, "hc": 1, "src": "Playback: Build J-K-L Muscle Memory First"},
            {"k": "K+J|K+L", "en": "Step one frame with J / L", "pl": "Krok o jedną klatkę klawiszami J / L", "l": 3, "h": {"en": "Keep K held and tap J or L.", "pl": "Trzymaj K i stukaj J albo L."}, "hc": 1, "src": "Playback: Build J-K-L Muscle Memory First"}
          ]
        },
        {
          "name": {"en": "Frame by frame", "pl": "Klatka po klatce"},
          "items": [
            {"k": "Left", "en": "Step one frame back", "pl": "Klatka wstecz", "l": 1, "cmd": "Step one frame back"},
            {"k": "Right", "en": "Step one frame forward", "pl": "Klatka do przodu", "l": 1, "cmd": "Step one frame forward"}
          ]
        }
      ]
    },
    {
      "id": "marking",
      "icon": "📍",
      "name": {"en": "In / Out & markers", "pl": "In / Out i markery"},
      "where": {"en": "Source viewer or timeline", "pl": "Podgląd źródła lub oś czasu"},
      "tips": [{"en": "Use I / O in the Source Viewer to choose a shot before editing it in; on the timeline they define a playback, render or replace range.", "pl": "W podglądzie źródła I / O wybierają fragment ujęcia przed wstawieniem; na osi czasu wyznaczają zakres odtwarzania, renderu lub podmiany."}, {"en": "Timeline markers follow a ripple only when Timeline → Ripple Timeline Markers is enabled.", "pl": "Markery osi czasu przesuwają się przy ripple tylko po włączeniu Timeline → Ripple Timeline Markers."}],
      "groups": [
        {
          "name": {"en": "Range", "pl": "Zakres"},
          "items": [
            {"k": "I", "en": "Mark In", "pl": "Ustaw punkt In", "l": 1, "h": {"en": "Start of a source, timeline or render range.", "pl": "Początek zakresu źródła, osi czasu lub renderu."}, "cmd": "Mark In"},
            {"k": "O", "en": "Mark Out", "pl": "Ustaw punkt Out", "l": 1, "h": {"en": "End of a source, timeline or render range.", "pl": "Koniec zakresu źródła, osi czasu lub renderu."}, "cmd": "Mark Out"}
          ]
        },
        {
          "name": {"en": "Markers", "pl": "Markery"},
          "items": [
            {"k": "M", "en": "Add marker at the playhead", "pl": "Dodaj marker w miejscu głowicy", "l": 1, "cmd": "Add marker"},
            {"k": "M M", "en": "Open the marker's details", "pl": "Otwórz szczegóły markera", "l": 2, "h": {"en": "Press M again at the same location.", "pl": "Wciśnij M ponownie w tym samym miejscu."}, "hc": 1, "src": "Timeline Navigation and View Shortcuts"}
          ]
        }
      ]
    },
    {
      "id": "editing",
      "icon": "🎬",
      "name": {"en": "Editing on the timeline", "pl": "Montaż na osi czasu"},
      "where": {"en": "Edit page (source viewer → timeline)", "pl": "Strona Edit (podgląd źródła → oś czasu)"},
      "tips": [{"en": "Learning Insert and Overwrite makes track targeting and duration consequences visible — even if you still drag clips sometimes.", "pl": "Nauka Insert i Overwrite pokazuje, jak działa wybór ścieżek docelowych i co dzieje się z długością — nawet jeśli czasem dalej przeciągasz klipy."}, {"en": "Before any ripple, check the selected clips or range, track locks, linked selection and Sync Locks — they decide which downstream tracks move.", "pl": "Przed każdym ripple sprawdź zaznaczenie lub zakres, blokady ścieżek, linked selection i Sync Locks — to one decydują, które dalsze ścieżki się przesuną."}, {"en": "After closing dialogue gaps, look at the waveforms and listen across the join.", "pl": "Po zamknięciu luk w dialogu obejrzyj przebiegi fali i posłuchaj miejsca łączenia."}],
      "groups": [
        {
          "name": {"en": "Source → timeline", "pl": "Źródło → oś czasu"},
          "items": [
            {"k": "F9", "en": "Insert edit", "pl": "Wstaw (insert)", "l": 2, "h": {"en": "Later timeline content moves right.", "pl": "Dalsza zawartość osi czasu przesuwa się w prawo."}, "cmd": "Insert edit"},
            {"k": "F10", "en": "Overwrite edit", "pl": "Nadpisz (overwrite)", "l": 2, "h": {"en": "Replaces timeline material without moving later content.", "pl": "Zastępuje materiał bez przesuwania dalszej zawartości."}, "cmd": "Overwrite edit"},
            {"k": "F11", "en": "Replace edit", "pl": "Podmień (replace)", "l": 3, "h": {"en": "Matches the source and timeline positions.", "pl": "Dopasowuje pozycję w źródle i na osi czasu."}, "cmd": "Replace edit"},
            {"k": "F12", "en": "Place on top", "pl": "Umieść na wierzchu", "l": 3, "h": {"en": "Video above existing clips, audio below, on the first empty track.", "pl": "Obraz nad istniejącymi klipami, dźwięk pod nimi, na pierwszej wolnej ścieżce."}, "cmd": "Place on top"},
            {"k": "Shift+F11", "en": "Fit to Fill", "pl": "Fit to Fill (dopasuj do luki)", "l": 3, "h": {"en": "Retimes the source range to fill the destination duration.", "pl": "Zmienia tempo zakresu źródła, by wypełnił docelową długość."}, "cmd": "Fit to Fill"},
            {"k": "Shift+F12", "en": "Append to end of timeline", "pl": "Dołącz na koniec osi czasu", "l": 2, "cmd": "Append to end"}
          ]
        },
        {
          "name": {"en": "Cut & remove", "pl": "Cięcie i usuwanie"},
          "items": [
            {"k": "Ctrl+Backslash", "en": "Split clip at the playhead", "pl": "Przetnij klip w miejscu głowicy", "l": 1, "h": {"en": "Cuts without changing the pointer mode; follows timeline track targeting.", "pl": "Tnie bez zmiany trybu kursora; działa według wybranych ścieżek."}, "cmd": "Split Clip at playhead"},
            {"k": "D", "en": "Enable / disable clip", "pl": "Włącz / wyłącz klip", "l": 2, "h": {"en": "Without deleting it.", "pl": "Bez usuwania."}, "cmd": "Enable or disable clip"},
            {"k": "Ctrl+Shift+X", "en": "Ripple cut", "pl": "Wytnij z zamknięciem luki (ripple cut)", "l": 2, "h": {"en": "Cuts to the clipboard and closes the gap.", "pl": "Wycina do schowka i zamyka lukę."}, "cmd": "Ripple cut selection"},
            {"k": "Del", "en": "Ripple delete", "pl": "Usuń z zamknięciem luki (ripple delete)", "l": 2, "h": {"en": "The manual calls this key Forward Delete (Fn+Delete on a compact Mac keyboard). Plain Delete leaves a gap — verify the assignment in Keyboard Customization.", "pl": "Manual nazywa ten klawisz Forward Delete (Fn+Delete na małej klawiaturze Maca). Zwykłe usuwanie zostawia lukę — sprawdź przypisanie w Keyboard Customization."}, "cmd": "Ripple Delete (Forward Delete)"}
          ]
        }
      ]
    },
    {
      "id": "trimming",
      "icon": "✂️",
      "name": {"en": "Trimming", "pl": "Trymowanie"},
      "where": {"en": "Edit page timeline", "pl": "Oś czasu na stronie Edit"},
      "tips": [{"en": "In Dynamic Trim Mode check the highlighted edge before pressing J or L — turning the mode on can select the nearest edit automatically.", "pl": "W Dynamic Trim Mode sprawdź podświetloną krawędź, zanim wciśniesz J lub L — włączenie trybu potrafi sam zaznaczyć najbliższe cięcie."}, {"en": "Resolve 21.1 switches to Trim Edit Mode when you enter Dynamic Trim. The highlighted selection and the mode — not the key alone — decide what changes.", "pl": "Resolve 21.1 włącza Trim Edit Mode, gdy wchodzisz w Dynamic Trim. O tym, co się zmieni, decyduje podświetlone zaznaczenie i tryb — nie sam klawisz."}],
      "groups": [
        {
          "name": {"en": "Modes", "pl": "Tryby"},
          "items": [
            {"k": "T", "en": "Trim Edit Mode", "pl": "Tryb trymowania (Trim Edit Mode)", "l": 1, "h": {"en": "Ripple, roll, slip and slide trims.", "pl": "Trymowanie ripple, roll, slip i slide."}, "cmd": "Trim Edit Mode"},
            {"k": "W", "en": "Dynamic Trim Mode", "pl": "Dynamic Trim Mode (trymowanie J/K/L)", "l": 2, "h": {"en": "Select an edit point first; J and L then trim during playback, K stops. W again leaves the mode.", "pl": "Najpierw zaznacz punkt cięcia; J i L trymują w trakcie odtwarzania, K zatrzymuje. Ponowne W wyłącza tryb."}, "cmd": "Dynamic Trim Mode"}
          ]
        },
        {
          "name": {"en": "Nudge & trim to playhead", "pl": "Przesuwanie i trymowanie do głowicy"},
          "items": [
            {"k": "Comma|Period", "en": "Nudge 1 frame left / right", "pl": "Przesuń o 1 klatkę w lewo / w prawo", "l": 2, "h": {"en": "Moves the selected clip or edit.", "pl": "Przesuwa zaznaczony klip lub cięcie."}, "cmd": ["Nudge left 1 frame", "Nudge right 1 frame"]},
            {"k": "Shift+Comma|Shift+Period", "en": "Fast nudge 5 frames left / right", "pl": "Szybkie przesunięcie o 5 klatek w lewo / w prawo", "l": 2, "h": {"en": "Uses the default fast-nudge amount.", "pl": "Według domyślnej wartości szybkiego przesunięcia."}, "cmd": ["Fast nudge left 5 frames", "Fast nudge right 5 frames"]},
            {"k": "Shift+LBracket", "en": "Trim start to playhead", "pl": "Przytnij początek klipu do głowicy", "l": 2, "cmd": "Trim start to playhead"},
            {"k": "Shift+RBracket", "en": "Trim end to playhead", "pl": "Przytnij koniec klipu do głowicy", "l": 2, "cmd": "Trim end to playhead"},
            {"k": "E", "en": "Extend edit to playhead", "pl": "Przeciągnij cięcie do głowicy", "l": 3, "h": {"en": "Moves the selected edit point to the playhead.", "pl": "Przenosi zaznaczony punkt cięcia do głowicy."}, "cmd": "Extend edit to playhead"}
          ]
        }
      ]
    },
    {
      "id": "tools",
      "icon": "🖱",
      "name": {"en": "Tools & selection", "pl": "Narzędzia i zaznaczanie"},
      "where": {"en": "Edit page timeline", "pl": "Oś czasu na stronie Edit"},
      "tips": [{"en": "For one precise cut at the playhead use Split Clip and leave the pointer alone. Blade mode suits several visual cuts — but accidental cuts pile up while the pointer stays a razor.", "pl": "Do jednego precyzyjnego cięcia w miejscu głowicy użyj Split Clip i nie zmieniaj kursora. Tryb Blade nadaje się do wielu cięć „na oko” — ale przypadkowe cięcia mnożą się, dopóki kursor jest żyletką."}],
      "groups": [
        {
          "name": {"en": "Pointer modes", "pl": "Tryby kursora"},
          "items": [
            {"k": "A", "en": "Selection Mode", "pl": "Tryb zaznaczania (Selection)", "l": 1, "cmd": "Selection Mode"},
            {"k": "B", "en": "Blade Edit Mode", "pl": "Tryb żyletki (Blade)", "l": 1, "h": {"en": "Every click cuts — press A when you're done.", "pl": "Każde kliknięcie tnie — po skończeniu wciśnij A."}, "cmd": "Blade Edit Mode"}
          ]
        },
        {
          "name": {"en": "Snapping & linking", "pl": "Przyciąganie i łączenie"},
          "items": [
            {"k": "N", "en": "Toggle snapping", "pl": "Przełącz przyciąganie (snapping)", "l": 1, "cmd": "Toggle snapping"},
            {"k": "Ctrl+Shift+L", "en": "Toggle linked selection", "pl": "Przełącz linked selection", "l": 2, "cmd": "Toggle linked selection"}
          ]
        },
        {
          "name": {"en": "Select forward", "pl": "Zaznacz do przodu"},
          "items": [
            {"k": "Y", "en": "Select clips forward on the current track", "pl": "Zaznacz klipy dalej na bieżącej ścieżce", "l": 3, "cmd": "Select clips forward on current track"},
            {"k": "Alt+Y", "en": "Select clips forward on all tracks", "pl": "Zaznacz klipy dalej na wszystkich ścieżkach", "l": 3, "cmd": "Select clips forward on all tracks"}
          ]
        }
      ]
    },
    {
      "id": "navigation",
      "icon": "🧭",
      "name": {"en": "Timeline navigation", "pl": "Nawigacja po osi czasu"},
      "where": {"en": "Timeline", "pl": "Oś czasu"},
      "tips": [{"en": "Up / Down follow the active tracks: if they skip an edit, check which tracks are targeted.", "pl": "↑ / ↓ zależą od aktywnych ścieżek: jeśli pomijają cięcie, sprawdź, które ścieżki są wybrane."}],
      "groups": [
        {
          "name": {"en": "Move & view", "pl": "Ruch i widok"},
          "items": [
            {"k": "Up|Down", "en": "Previous / next edit", "pl": "Poprzednie / następne cięcie", "l": 1, "cmd": ["Previous edit or clip", "Next edit or clip"]},
            {"k": "Shift+Z", "en": "Fit timeline in window", "pl": "Cała oś czasu w oknie", "l": 1, "h": {"en": "Press again to restore the zoom.", "pl": "Ponowne wciśnięcie przywraca zoom."}, "cmd": "Fit timeline in window"}
          ]
        }
      ]
    }
  ]
};
