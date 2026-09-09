/* 每日生活 · 涂鸦手绘风图标库 (stroke 风格, currentColor) */
(function(){
  const P = (inner) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

  // 彩色 emoji 风格图标（用于分类主图标）
  const E = (char, size = 26) =>
    `<span style="font-size:${size}px;line-height:1;display:inline-flex;align-items:center;justify-content:center">${char}</span>`;

  const I = {
    home: P('<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5"/><path d="M9.5 20v-5h5v5" stroke-width="1.8"/>'),
    profile: P('<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>'),
    stats: P('<path d="M5 19V5"/><path d="M5 19h15"/><rect x="8" y="11" width="2.6" height="6" rx="1"/><rect x="13" y="7" width="2.6" height="10" rx="1"/>'),
    settings: P('<circle cx="12" cy="12" r="3"/><path d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>'),
    calendar: P('<rect x="4" y="5.5" width="16" height="15" rx="2.5"/><path d="M4 9.5h16M8 3.5v3.5M16 3.5v3.5"/>'),
    close: P('<path d="M6 6l12 12M18 6 6 18"/>'),
    edit: P('<path d="M14.5 5.5 18 9 9 18l-4 1 1-4z"/><path d="M13.5 6.5 17 10" stroke-width="1.6"/>'),
    trash: P('<path d="M5 7h14M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M6.5 7l.8 12.5a1.5 1 0 0 0 1.5 1.5h6.4a1.5 1.0 0 0 0 1.5-1.5L17.5 7"/>'),
    plus: P('<path d="M12 5v14M5 12h14"/>'),
    camera: P('<rect x="3.5" y="7.5" width="17" height="12" rx="3"/><circle cx="12" cy="13.5" r="3.2"/><path d="M8.5 7.5 9.5 5.5h5l1 2"/>'),
    back: P('<path d="M14 6l-6 6 6 6"/>'),
    arrow: P('<path d="M9 6l6 6-6 6"/>'),
    upload: P('<path d="M12 16V5M8 9l4-4 4 4"/><path d="M5 16v2.5a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 18.5V16"/>'),

    // 分类主图标（彩色 emoji 风格）
    diet: E('🍽️', 28),
    drink: E('🥤', 28),
    sport: E('🏃', 28),
    mood: E('😊', 28),
    consume: E('💰', 28),
    finance: E('📈', 28),
    sleep: E('🌙', 28),
    album: E('📸', 28),

    // 天气
    sun: P('<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4"/>'),
    cloud: P('<path d="M7 17.5h9.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 7 10.5 3.7 3.7 0 0 0 7 17.5z"/>'),
    rain: P('<path d="M7 14.5h9.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 7 7.5 3.7 3.7 0 0 0 7 14.5z"/><path d="M9 18l-1 2M13 18l-1 2M17 18l-1 2" stroke-width="1.6"/>'),
    snow: P('<path d="M7 14.5h9.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 7 7.5 3.7 3.7 0 0 0 7 14.5z"/><path d="M9 18h.01M12 19h.01M15 18h.01" stroke-width="2"/>'),
    wind: P('<path d="M3 9h11a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 14h14a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 12h6" stroke-width="1.6"/>'),
    fog: P('<path d="M7 13.5h9.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 7 6.5 3.7 3.7 0 0 0 7 13.5z"/><path d="M5 17h14M6.5 20h11" stroke-width="1.6"/>'),

    // 早午晚
    breakfast: P('<circle cx="9" cy="9.5" r="3.2"/><path d="M9 6.3v.2M7.4 7.6l.2.2M10.6 7.6l-.2.2"/><path d="M14 12h4a2 2 0 0 1 0 4h-4z"/><path d="M15 9c0-2 .8-3 2.5-3" stroke-width="1.5"/>'),
    lunch: P('<path d="M5 9.5h14M7 9.5c0-3 2.2-4.5 5-4.5s5 1.5 5 4.5M7 9.5v7a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 17 16.5v-7"/>'),
    dinner: P('<circle cx="12" cy="12.5" r="6.5"/><circle cx="12" cy="12.5" r="2.4" stroke-width="1.6"/>'),
    supper: P('<path d="M7 9.5h10a4 4 0 0 1-4 6.5A4 4 0 0 1 7 9.5z"/><path d="M12 9.5V6" stroke-width="1.6"/>'),

    // 饮料类型（彩色 emoji）
    milktea: E('🍵', 24),
    coffee: E('☕', 24),
    teafruit: E('🍹', 24),
    soda: E('🥤', 24),

    // 运动类型（彩色 emoji）
    ride: E('🚴', 24),
    climb: E('🧗', 24),
    run: E('🏃', 24),
    swim: E('🏊', 24),
    dumbbell: E('🏋️', 24),

    // 消费类型
    cFood: P('<path d="M6 8h12l-1 11.5a1.5 1.5 0 0 1-1.5 1.3H8.5A1.5 1.5 0 0 1 7 19.5z"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/>'),
    cTrans: P('<path d="M6 7h9a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3z"/><circle cx="8" cy="14" r="1.3"/><circle cx="15" cy="14" r="1.3"/>'),
    cShop: P('<path d="M6 8h12l-1 11.5a1.5 1.5 0 0 1-1.5 1.3H8.5A1.5 1.5 0 0 1 7 19.5z"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/>'),
    cFun: P('<circle cx="12" cy="12" r="8.5"/><path d="M9 9.5c1-1 2.5-1 3.5 0M12.5 9.5c1-1 2.5-1 3.5 0M8.5 14c1 1.6 2.4 2.4 3.5 2.4S14.5 15.6 15.5 14"/>'),
    cHome: P('<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5"/>'),
    cMedical: P('<rect x="5" y="5.5" width="14" height="14" rx="3"/><path d="M12 9v6M9 12h6"/>'),
    cOther: P('<circle cx="12" cy="12" r="8.5"/><path d="M12 8.5v.01M12 11.5v4.5" stroke-width="2"/>'),

    // 理财分类
    salary: P('<rect x="5" y="9" width="14" height="9" rx="2"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/><path d="M12 12.5v3M10.5 13.8h3" stroke-width="1.5"/>'),
    parttime: P('<path d="M14.5 5.5 18 9 9 18l-4 1 1-4z"/><path d="M13.5 6.5 17 10" stroke-width="1.6"/>'),
    invest: P('<path d="M4 15l4-4 3 3 5-6 4 4"/><path d="M16 7h4v4" stroke-width="1.6"/>'),
    redpkt: P('<rect x="5" y="4" width="14" height="16" rx="2.5"/><path d="M5 9c2.5 1.5 4 3 7 3s4.5-1.5 7-3"/><circle cx="12" cy="13.5" r="2" fill="currentColor"/>'),
    bigbuy: P('<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5"/><path d="M10 20v-4h4v4" stroke-width="1.6"/>'),

    star: P('<path d="M12 4.5l2.2 4.4 4.9.7-3.5 3.4.8 4.9L12 15.6 7.6 17.9l.8-4.9L5 9.6l4.9-.7z"/>'),
    download: P('<path d="M12 4v10M8 11l4 4 4-4"/><path d="M5 18.5h14"/>'),
    upload2: P('<path d="M12 20V10M8 13l4-4 4 4"/><path d="M5 5.5h14"/>'),
    restore: P('<path d="M5 12a7 7 0 1 0 2-4.9"/><path d="M5 4v3.5h3.5"/>'),
    info: P('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.01" stroke-width="2"/>'),
    palette: P('<path d="M12 4.5a7.5 7.5 0 1 0 0 15c1 0 1.5-.8 1.5-1.6 0-.7.6-1.2 1.3-1.2H17a2.5 2.5 0 0 0 2.5-2.5C19.5 7.7 16.2 4.5 12 4.5z"/><circle cx="8.5" cy="11" r="1" fill="currentColor"/><circle cx="12" cy="8" r="1" fill="currentColor"/><circle cx="15.5" cy="11" r="1" fill="currentColor"/>'),
    // 朋友圈：圆形取景框（太阳 + 山 + 风景）
    moments: P('<rect x="3.5" y="5" width="17" height="14" rx="4.2"/><circle cx="9.2" cy="10" r="1.8"/><path d="M4.2 16.6 8.6 12l2.6 2.7 2.3-2.4 6.3 5.1"/>'),
  };

  window.ICON = (name) => I[name] || I.cOther;
  window.ICONS = I;
})();
