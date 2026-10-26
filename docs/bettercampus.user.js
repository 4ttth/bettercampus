// ==UserScript==
// @name         BetterCampus
// @namespace    https://4ttth.github.io/bettercampus/
// @version      0.2.0
// @description  Unofficial, mobile-friendly redesign of the HAU Campus++ student portal. Not affiliated with Holy Angel University.
// @homepageURL  https://4ttth.github.io/bettercampus/
// @supportURL   https://github.com/4ttth/bettercampus/issues
// @updateURL    https://4ttth.github.io/bettercampus/bettercampus.meta.js
// @downloadURL  https://4ttth.github.io/bettercampus/bettercampus.user.js
// @match        https://hau.campus-erp.com/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==

(function () {
'use strict';
const BC_CSS = "/* src/styles/base.css */\n/* Design tokens + resets shared by every redesigned page. */\n\n:root {\n  --bc-maroon: #7a1424;\n  --bc-maroon-deep: #4f0b16;\n  --bc-maroon-tint: #f7eced;\n  --bc-gold: #d9a441;\n\n  --bc-primary-container: #f6dadd;\n  --bc-on-primary-container: #4f0b16;\n  --bc-success: #1d6b3a;\n  --bc-success-bg: #e3f3e8;\n  --bc-warning: #8a5300;\n  --bc-warning-bg: #fdf0d9;\n\n  --bc-bg: #f6f4f2;\n  --bc-surface: #ffffff;\n  --bc-surface-2: #f1edec;\n  --bc-text: #1d1a1b;\n  --bc-muted: #6b6466;\n  --bc-border: #ddd6d7;\n  --bc-focus: #b0283c;\n  --bc-danger: #b42318;\n  --bc-danger-bg: #fdecea;\n\n  --bc-radius: 12px;\n  --bc-radius-sm: 8px;\n  --bc-shadow: 0 1px 2px rgb(0 0 0 / 0.06), 0 8px 24px rgb(0 0 0 / 0.08);\n  --bc-font: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n  --bc-tap: 48px; /* minimum touch target */\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --bc-maroon-tint: #2c1519;\n    --bc-primary-container: #5c1a25;\n    --bc-on-primary-container: #ffd9dd;\n    --bc-success: #8fd6a6;\n    --bc-success-bg: #163222;\n    --bc-warning: #f2c27a;\n    --bc-warning-bg: #3a2a10;\n    --bc-bg: #151213;\n    --bc-surface: #1f1b1c;\n    --bc-surface-2: #2a2526;\n    --bc-text: #f2eeee;\n    --bc-muted: #a99fa1;\n    --bc-border: #3a3234;\n    --bc-focus: #e0596c;\n    --bc-danger: #ff8a80;\n    --bc-danger-bg: #3a1714;\n    --bc-shadow: 0 1px 2px rgb(0 0 0 / 0.4), 0 8px 24px rgb(0 0 0 / 0.4);\n  }\n}\n\nhtml.bc-cloak body { visibility: hidden !important; }\n\n#bc-root,\n#bc-root * { box-sizing: border-box; }\n\n#bc-root {\n  font-family: var(--bc-font);\n  font-size: 16px; /* 16px+ stops iOS Safari from zooming into inputs */\n  line-height: 1.5;\n  color: var(--bc-text);\n  -webkit-text-size-adjust: 100%;\n}\n\n#bc-root .bc-muted { color: var(--bc-muted); margin: 0; }\n\n/* Buttons */\n#bc-root .bc-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  min-height: var(--bc-tap);\n  padding: 0 20px;\n  border: 0;\n  border-radius: var(--bc-radius-sm);\n  font: 600 16px/1 var(--bc-font);\n  cursor: pointer;\n  transition: background-color 0.15s, transform 0.05s;\n}\n#bc-root .bc-btn:active { transform: translateY(1px); }\n#bc-root .bc-btn--primary { background: var(--bc-maroon); color: #fff; }\n#bc-root .bc-btn--primary:hover { background: var(--bc-maroon-deep); }\n#bc-root .bc-btn.is-loading { pointer-events: none; opacity: 0.85; }\n#bc-root .bc-btn.is-loading::after {\n  content: \"\";\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgb(255 255 255 / 0.4);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: bc-spin 0.7s linear infinite;\n}\n@keyframes bc-spin { to { transform: rotate(360deg); } }\n\n#bc-root .bc-link {\n  background: none;\n  border: 0;\n  padding: 8px 0;\n  font: 500 14px var(--bc-font);\n  color: var(--bc-maroon);\n  text-decoration: none;\n  cursor: pointer;\n}\n#bc-root .bc-link:hover { text-decoration: underline; }\n#bc-root .bc-link--quiet { color: var(--bc-muted); }\n@media (prefers-color-scheme: dark) {\n  #bc-root .bc-link { color: #f08a99; }\n  #bc-root .bc-link--quiet { color: var(--bc-muted); }\n}\n\n/* Form controls */\n#bc-root .bc-field { display: block; margin: 16px 0 6px; }\n#bc-root .bc-field__label { font-size: 14px; font-weight: 600; }\n\n#bc-root input[type=\"text\"],\n#bc-root input[type=\"password\"],\n#bc-root input[type=\"email\"],\n#bc-root select {\n  display: block;\n  width: 100%;\n  min-height: var(--bc-tap);\n  padding: 10px 14px;\n  border: 1px solid var(--bc-border);\n  border-radius: var(--bc-radius-sm);\n  background: var(--bc-surface);\n  color: var(--bc-text);\n  font: 16px var(--bc-font);\n  outline: none;\n  -webkit-appearance: none;\n  appearance: none;\n}\n#bc-root input::placeholder { color: var(--bc-muted); opacity: 0.8; }\n\n#bc-root :focus-visible,\n#bc-root input:focus {\n  outline: 2px solid var(--bc-focus);\n  outline-offset: 2px;\n}\n\n#bc-root .bc-alert {\n  margin: 16px 0 0;\n  padding: 10px 14px;\n  border-radius: var(--bc-radius-sm);\n  background: var(--bc-danger-bg);\n  color: var(--bc-danger);\n  font-size: 14px;\n}\n#bc-root .bc-alert[hidden] { display: none; }\n\n/* Shown on the classic portal to turn the redesign back on. */\n.bc-reenable {\n  position: fixed;\n  left: 16px;\n  bottom: 16px;\n  z-index: 2147483647;\n  min-height: 40px;\n  padding: 0 16px;\n  border: 0;\n  border-radius: 999px;\n  background: var(--bc-maroon);\n  color: #fff;\n  font: 600 14px var(--bc-font);\n  box-shadow: var(--bc-shadow);\n  cursor: pointer;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  #bc-root * { animation: none !important; transition: none !important; }\n}\n\n/* src/styles/app.css */\n/* App shell + view components (Main.php and wrapped portal pages).\n   Breakpoints follow Material 3 window classes: compact < 600, medium 600–839,\n   expanded 840–1199, large ≥ 1200. */\n\nhtml.bc-app,\nhtml.bc-app body,\nhtml.bc-skin,\nhtml.bc-skin body {\n  margin: 0;\n  background: var(--bc-bg);\n}\nhtml.bc-app body > *:not(#bc-root),\nhtml.bc-skin body > *:not(#bc-root) {\n  display: none !important;\n}\n\n#bc-root .bc-icon {\n  width: 24px;\n  height: 24px;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 1.8;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  flex: none;\n}\n\n.bc-sr,\n#bc-root .bc-sr {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n}\n\n#bc-root .bc-skip {\n  position: fixed;\n  top: 8px;\n  left: 8px;\n  z-index: 100;\n  padding: 12px 16px;\n  border-radius: var(--bc-radius-sm);\n  background: var(--bc-maroon);\n  color: #fff;\n  transform: translateY(-200%);\n}\n#bc-root .bc-skip:focus { transform: none; }\n\n/* ---------- Navigation: bottom bar (compact) ---------- */\n#bc-root .bc-nav {\n  position: fixed;\n  z-index: 30;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  padding-bottom: env(safe-area-inset-bottom);\n  background: var(--bc-surface);\n  border-top: 1px solid var(--bc-border);\n}\n#bc-root .bc-nav__brand { display: none; }\n#bc-root .bc-nav__list {\n  display: flex;\n  height: 72px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n#bc-root .bc-nav__list li { flex: 1; }\n#bc-root .bc-nav__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  height: 100%;\n  color: var(--bc-muted);\n  text-decoration: none;\n  font: 500 12px/1 var(--bc-font);\n  letter-spacing: 0.02em;\n}\n#bc-root .bc-nav__icon {\n  display: grid;\n  place-items: center;\n  width: 56px;\n  height: 32px;\n  border-radius: 16px;\n  transition: background-color 0.2s;\n}\n#bc-root .bc-nav__item:hover .bc-nav__icon { background: var(--bc-surface-2); }\n#bc-root .bc-nav__item[aria-current=\"page\"] { color: var(--bc-text); font-weight: 700; }\n#bc-root .bc-nav__item[aria-current=\"page\"] .bc-nav__icon {\n  background: var(--bc-primary-container);\n  color: var(--bc-on-primary-container);\n}\n\n#bc-root .bc-body { padding-bottom: calc(88px + env(safe-area-inset-bottom)); }\n\n/* ---------- Top app bar ---------- */\n#bc-root .bc-topbar {\n  position: sticky;\n  top: 0;\n  z-index: 20;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-height: 64px;\n  padding: env(safe-area-inset-top) 16px 0;\n  background: var(--bc-bg);\n}\n#bc-root .bc-topbar__title {\n  flex: 1;\n  margin: 0;\n  font-size: 22px;\n  font-weight: 700;\n  line-height: 1.2;\n  outline: none;\n}\n#bc-root .bc-icon-btn {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  margin-left: -12px;\n  border-radius: 50%;\n  color: var(--bc-text);\n}\n#bc-root .bc-icon-btn:hover { background: var(--bc-surface-2); }\n\n#bc-root .bc-main {\n  max-width: 1080px;\n  margin: 0 auto;\n  padding: 4px 16px 24px;\n  outline: none;\n}\n\n/* ---------- Navigation: rail (medium + expanded) ---------- */\n@media (min-width: 600px) {\n  #bc-root .bc-nav {\n    top: 0;\n    right: auto;\n    width: 88px;\n    padding: 24px 0;\n    border-top: 0;\n    border-right: 1px solid var(--bc-border);\n  }\n  #bc-root .bc-nav__list { flex-direction: column; height: auto; gap: 12px; }\n  #bc-root .bc-nav__item { height: 64px; }\n  #bc-root .bc-body { margin-left: 88px; padding-bottom: 32px; }\n  #bc-root .bc-topbar { padding: 0 24px; }\n  #bc-root .bc-main { padding: 8px 24px 40px; }\n}\n\n/* ---------- Navigation: drawer with labels (large) ---------- */\n@media (min-width: 1200px) {\n  #bc-root .bc-nav { width: 264px; padding: 20px 12px; }\n  #bc-root .bc-nav__brand {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    padding: 0 16px 24px;\n  }\n  #bc-root .bc-nav__mark {\n    display: grid;\n    place-items: center;\n    width: 40px;\n    height: 40px;\n    border-radius: 12px;\n    background: var(--bc-maroon);\n    color: #fff;\n    font: 700 12px var(--bc-font);\n    letter-spacing: 0.06em;\n  }\n  #bc-root .bc-nav__name { font-weight: 700; }\n  #bc-root .bc-nav__list { gap: 4px; }\n  #bc-root .bc-nav__item {\n    flex-direction: row;\n    justify-content: flex-start;\n    gap: 12px;\n    height: 56px;\n    padding: 0 16px;\n    border-radius: 28px;\n    font-size: 14px;\n  }\n  #bc-root .bc-nav__icon { width: 24px; height: 24px; background: none !important; color: inherit !important; }\n  #bc-root .bc-nav__item:hover { background: var(--bc-surface-2); }\n  #bc-root .bc-nav__item[aria-current=\"page\"] {\n    background: var(--bc-primary-container);\n    color: var(--bc-on-primary-container);\n  }\n  #bc-root .bc-body { margin-left: 264px; }\n}\n\n/* ---------- Layout helpers ---------- */\n#bc-root .bc-grid { display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr); }\n#bc-root .bc-stack { display: grid; gap: 16px; }\n@media (min-width: 840px) {\n  #bc-root .bc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}\n\n/* ---------- Cards ---------- */\n#bc-root .bc-card {\n  min-width: 0;\n  padding: 20px;\n  border: 1px solid var(--bc-border);\n  border-radius: 16px;\n  background: var(--bc-surface);\n}\n#bc-root .bc-card--flush { padding: 8px 0; }\n#bc-root .bc-card--flush .bc-row { padding-left: 20px; padding-right: 16px; }\n#bc-root .bc-card__head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n#bc-root .bc-card__title {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0;\n  font-size: 15px;\n  font-weight: 700;\n}\n#bc-root .bc-card__title .bc-icon { width: 20px; height: 20px; color: var(--bc-maroon); }\n@media (prefers-color-scheme: dark) {\n  #bc-root .bc-card__title .bc-icon { color: #f08a99; }\n}\n#bc-root .bc-card__action,\n#bc-root .bc-footnote a,\n#bc-root .bc-inline-error a {\n  color: var(--bc-maroon);\n  font-size: 14px;\n  font-weight: 600;\n  text-decoration: none;\n  padding: 12px 0;\n}\n#bc-root .bc-card__action:hover { text-decoration: underline; }\n@media (prefers-color-scheme: dark) {\n  #bc-root .bc-card__action,\n  #bc-root .bc-footnote a,\n  #bc-root .bc-inline-error a { color: #f08a99; }\n}\n\n#bc-root .bc-group__title {\n  margin: 8px 20px 4px;\n  font-size: 13px;\n  font-weight: 700;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--bc-muted);\n}\n#bc-root .bc-section-title { margin: 8px 0 12px; font-size: 18px; font-weight: 700; }\n#bc-root .bc-subhead {\n  margin: 16px 0 4px;\n  font-size: 13px;\n  font-weight: 700;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--bc-muted);\n}\n#bc-root .bc-lead { margin: 0 0 16px; color: var(--bc-muted); }\n#bc-root .bc-footnote { margin: 12px 0 0; font-size: 13px; color: var(--bc-muted); }\n#bc-root .bc-empty { margin: 4px 0; color: var(--bc-muted); }\n#bc-root .bc-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }\n\n#bc-root .bc-figure {\n  margin: 0;\n  font-size: 34px;\n  font-weight: 700;\n  letter-spacing: -0.01em;\n  font-variant-numeric: tabular-nums;\n}\n#bc-root .bc-num { font-variant-numeric: tabular-nums; white-space: nowrap; }\n#bc-root .bc-debit { color: var(--bc-text); }\n#bc-root .bc-credit { color: var(--bc-success); }\n\n#bc-root .bc-btn--tonal { background: var(--bc-primary-container); color: var(--bc-on-primary-container); text-decoration: none; }\n#bc-root .bc-btn--text { background: none; color: var(--bc-maroon); padding: 0 12px; }\n#bc-root .bc-btn--primary { text-decoration: none; }\n@media (prefers-color-scheme: dark) {\n  #bc-root .bc-btn--text { color: #f08a99; }\n}\n\n/* ---------- Greeting ---------- */\n#bc-root .bc-hello { margin: 0 0 20px; }\n#bc-root .bc-hello__title { margin: 0; font-size: 26px; font-weight: 700; line-height: 1.25; }\n#bc-root .bc-hello__sub { margin: 4px 0 0; color: var(--bc-muted); }\n\n/* ---------- Next class ---------- */\n#bc-root .bc-next { padding: 16px; border-radius: 12px; background: var(--bc-maroon-tint); }\n#bc-root .bc-next__when {\n  margin: 0;\n  font-size: 13px;\n  font-weight: 700;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--bc-maroon);\n}\n@media (prefers-color-scheme: dark) {\n  #bc-root .bc-next__when { color: #f08a99; }\n}\n#bc-root .bc-next__when.is-live::before {\n  content: \"\";\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  margin-right: 6px;\n  border-radius: 50%;\n  background: currentColor;\n  vertical-align: 1px;\n}\n#bc-root .bc-next__title { margin: 4px 0 0; font-size: 18px; font-weight: 700; line-height: 1.3; }\n#bc-root .bc-next__meta { margin: 4px 0 0; color: var(--bc-muted); font-size: 14px; }\n\n/* ---------- Lists / rows ---------- */\n#bc-root .bc-list { margin: 0; padding: 0; list-style: none; }\n#bc-root .bc-list > li + li { border-top: 1px solid var(--bc-border); }\n#bc-root .bc-row {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  min-height: 56px;\n  padding: 10px 0;\n  border: 0;\n  background: none;\n  color: inherit;\n  font: inherit;\n  text-align: left;\n  text-decoration: none;\n}\n#bc-root .bc-row--link { cursor: pointer; }\n#bc-root .bc-row--link:hover { background: var(--bc-surface-2); }\n#bc-root .bc-row__icon {\n  display: grid;\n  place-items: center;\n  width: 40px;\n  height: 40px;\n  border-radius: 12px;\n  background: var(--bc-surface-2);\n  color: var(--bc-muted);\n}\n#bc-root .bc-row__icon .bc-icon { width: 20px; height: 20px; }\n#bc-root .bc-row__text { flex: 1; min-width: 0; display: flex; flex-direction: column; }\n#bc-root .bc-row__title { font-weight: 600; line-height: 1.35; overflow-wrap: anywhere; }\n#bc-root .bc-row__sub { font-size: 14px; color: var(--bc-muted); line-height: 1.4; }\n#bc-root .bc-row__trail { flex: none; font-weight: 600; }\n#bc-root .bc-row__chev { flex: none; color: var(--bc-muted); }\n#bc-root .bc-row__chev .bc-icon { width: 20px; height: 20px; }\n#bc-root .bc-row--danger { color: var(--bc-danger); }\n#bc-root .bc-row--danger .bc-row__icon { background: var(--bc-danger-bg); color: var(--bc-danger); }\n\n/* ---------- Tabs ---------- */\n#bc-root .bc-tabs {\n  display: flex;\n  gap: 4px;\n  margin: 0 0 20px;\n  overflow-x: auto;\n  border-bottom: 1px solid var(--bc-border);\n  scrollbar-width: none;\n}\n#bc-root .bc-tab {\n  flex: none;\n  display: flex;\n  align-items: center;\n  min-height: 48px;\n  padding: 0 16px;\n  border-bottom: 3px solid transparent;\n  color: var(--bc-muted);\n  font-weight: 600;\n  text-decoration: none;\n}\n#bc-root .bc-tab:hover { color: var(--bc-text); background: var(--bc-surface-2); }\n#bc-root .bc-tab[aria-current=\"page\"] { color: var(--bc-maroon); border-bottom-color: var(--bc-maroon); }\n@media (prefers-color-scheme: dark) {\n  #bc-root .bc-tab[aria-current=\"page\"] { color: #f08a99; border-bottom-color: #f08a99; }\n}\n\n/* ---------- Stats ---------- */\n#bc-root .bc-stats { display: flex; flex-wrap: wrap; gap: 12px 32px; }\n#bc-root .bc-stat { display: flex; flex-direction: column; }\n#bc-root .bc-stat__value { font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1.2; }\n#bc-root .bc-stat__label { font-size: 13px; color: var(--bc-muted); }\n\n/* ---------- Grades ---------- */\n#bc-root .bc-grade {\n  display: inline-block;\n  min-width: 48px;\n  padding: 4px 10px;\n  border-radius: 999px;\n  text-align: center;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  background: var(--bc-surface-2);\n}\n#bc-root .bc-grade--good { background: var(--bc-success-bg); color: var(--bc-success); }\n#bc-root .bc-grade--bad { background: var(--bc-danger-bg); color: var(--bc-danger); }\n#bc-root .bc-grade--pending { background: var(--bc-warning-bg); color: var(--bc-warning); }\n\n#bc-root .bc-term {\n  margin-bottom: 12px;\n  border: 1px solid var(--bc-border);\n  border-radius: 16px;\n  background: var(--bc-surface);\n}\n#bc-root .bc-term > summary {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  min-height: 56px;\n  padding: 8px 20px;\n  cursor: pointer;\n  list-style: none;\n  font-weight: 700;\n}\n#bc-root .bc-term > summary::-webkit-details-marker { display: none; }\n#bc-root .bc-term > summary::after {\n  content: \"\";\n  width: 8px;\n  height: 8px;\n  margin-left: 4px;\n  border-right: 2px solid var(--bc-muted);\n  border-bottom: 2px solid var(--bc-muted);\n  transform: rotate(45deg);\n  transition: transform 0.2s;\n}\n#bc-root .bc-term[open] > summary::after { transform: rotate(225deg); }\n#bc-root .bc-term__name { flex: 1; }\n#bc-root .bc-term__meta { font-weight: 500; font-size: 14px; color: var(--bc-muted); }\n#bc-root .bc-term .bc-list,\n#bc-root .bc-term > .bc-empty { padding: 0 20px 12px; }\n\n/* ---------- Week schedule ---------- */\n#bc-root .bc-week {\n  display: grid;\n  gap: 16px;\n  grid-template-columns: minmax(0, 1fr);\n}\n@media (min-width: 840px) {\n  #bc-root .bc-week { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}\n@media (min-width: 1200px) {\n  #bc-root .bc-week { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n}\n#bc-root .bc-day {\n  padding: 16px;\n  border: 1px solid var(--bc-border);\n  border-radius: 16px;\n  background: var(--bc-surface);\n}\n#bc-root .bc-day.is-today { border-color: var(--bc-maroon); box-shadow: inset 0 0 0 1px var(--bc-maroon); }\n#bc-root .bc-day__name { display: flex; align-items: center; gap: 8px; margin: 0 0 8px; font-size: 16px; font-weight: 700; }\n#bc-root .bc-chip {\n  padding: 2px 10px;\n  border-radius: 999px;\n  background: var(--bc-maroon);\n  color: #fff;\n  font-size: 12px;\n  font-weight: 700;\n}\n#bc-root .bc-class { padding: 10px 12px; border-radius: 10px; background: var(--bc-surface-2); }\n#bc-root .bc-class + .bc-class { margin-top: 8px; }\n#bc-root .bc-class__time { margin: 0; font-size: 13px; font-weight: 700; color: var(--bc-muted); font-variant-numeric: tabular-nums; }\n#bc-root .bc-class__title { margin: 2px 0 0; font-size: 16px; font-weight: 600; line-height: 1.35; }\n#bc-root .bc-class__meta { margin: 2px 0 0; font-size: 14px; color: var(--bc-muted); }\n\n/* ---------- Finances ---------- */\n#bc-root .bc-breakdown { display: grid; }\n#bc-root .bc-line {\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 8px 0;\n  border-top: 1px solid var(--bc-border);\n}\n#bc-root .bc-line:first-child { border-top: 0; }\n#bc-root .bc-line--strong { font-weight: 700; }\n#bc-root .bc-line--section {\n  padding-top: 16px;\n  font-size: 13px;\n  font-weight: 700;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--bc-muted);\n}\n#bc-root .bc-banner {\n  margin: 0 0 8px;\n  padding: 12px 16px;\n  border-radius: 12px;\n  background: var(--bc-surface-2);\n}\n#bc-root .bc-banner--ok { background: var(--bc-success-bg); color: var(--bc-success); }\n\n/* ---------- Me ---------- */\n#bc-root .bc-profile { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }\n#bc-root .bc-avatar {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  background: var(--bc-maroon);\n  color: #fff;\n  font-size: 20px;\n  font-weight: 700;\n}\n#bc-root .bc-profile__name { margin: 0; font-size: 20px; font-weight: 700; }\n#bc-root .bc-main > .bc-card--flush + .bc-card--flush { margin-top: 16px; }\n#bc-root .bc-main > .bc-card--flush { margin-top: 16px; }\n#bc-root .bc-about { margin-top: 24px; text-align: center; }\n\n/* ---------- Async states ---------- */\n#bc-root .bc-skel { display: grid; gap: 10px; padding: 4px 0; }\n#bc-root .bc-skel__line {\n  display: block;\n  height: 14px;\n  border-radius: 7px;\n  background: linear-gradient(90deg, var(--bc-surface-2) 0%, var(--bc-border) 50%, var(--bc-surface-2) 100%);\n  background-size: 200% 100%;\n  animation: bc-shimmer 1.4s ease-in-out infinite;\n}\n@keyframes bc-shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }\n#bc-root .bc-inline-error {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px 12px;\n  padding: 12px 16px;\n  border-radius: 12px;\n  background: var(--bc-warning-bg);\n  color: var(--bc-warning);\n}\n\n/* ---------- Dialog ---------- */\n#bc-root .bc-dialog {\n  width: min(640px, calc(100vw - 32px));\n  max-height: calc(100dvh - 64px);\n  padding: 0;\n  border: 0;\n  border-radius: 20px;\n  background: var(--bc-surface);\n  color: var(--bc-text);\n}\n#bc-root .bc-dialog::backdrop { background: rgb(0 0 0 / 0.45); }\n#bc-root .bc-dialog__head {\n  position: sticky;\n  top: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 12px 12px 24px;\n  background: var(--bc-surface);\n  border-bottom: 1px solid var(--bc-border);\n}\n#bc-root .bc-dialog__head h2 { margin: 0; font-size: 18px; }\n#bc-root .bc-dialog__body { padding: 16px 24px 24px; font-size: 15px; }\n\n/* src/styles/login.css */\n/* Login page. Mobile first: stacked brand header + form; side by side from 900px. */\n\nhtml.bc-page-login,\nhtml.bc-page-login body {\n  margin: 0;\n  min-height: 100%;\n  background: var(--bc-bg);\n}\nhtml.bc-page-login body { display: block; }\nhtml.bc-page-login .bg_school { display: none !important; }\nhtml.bc-page-login #Form1 { margin: 0; }\n\n#bc-root.bc-login {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n  min-height: 100dvh;\n}\n\n.bc-login__brand {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  padding: calc(32px + env(safe-area-inset-top)) 24px 56px;\n  background:\n    radial-gradient(120% 80% at 50% 0%, rgb(255 255 255 / 0.10), transparent 60%),\n    linear-gradient(160deg, var(--bc-maroon) 0%, var(--bc-maroon-deep) 100%);\n  color: #fff;\n}\n\n.bc-login__logo {\n  width: 88px;\n  height: 88px;\n  padding: 6px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 0 0 3px rgb(217 164 65 / 0.55), 0 8px 24px rgb(0 0 0 / 0.25);\n}\n.bc-login__logo img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  border-radius: 50%;\n}\n\n.bc-login__school {\n  margin: 16px 0 0;\n  font-family: Georgia, \"Times New Roman\", serif;\n  font-size: 24px;\n  font-weight: 600;\n  letter-spacing: 0.01em;\n  line-height: 1.2;\n}\n.bc-login__tagline {\n  margin: 4px 0 0;\n  font-size: 13px;\n  font-weight: 600;\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n  color: var(--bc-gold);\n}\n\n.bc-login__panel {\n  flex: 1;\n  display: flex;\n  justify-content: center;\n  padding: 0 16px calc(96px + env(safe-area-inset-bottom)); /* room for the reCAPTCHA badge */\n}\n\n.bc-login__card {\n  width: 100%;\n  max-width: 400px;\n  margin-top: -32px; /* overlap the brand header */\n  padding: 28px 24px;\n  border-radius: var(--bc-radius);\n  background: var(--bc-surface);\n  box-shadow: var(--bc-shadow);\n  align-self: flex-start;\n}\n\n.bc-login__title {\n  margin: 0 0 4px;\n  font-size: 22px;\n  font-weight: 700;\n  line-height: 1.25;\n}\n\n.bc-pw { position: relative; }\n#bc-root .bc-pw input { padding-right: 72px; }\n.bc-pw-toggle {\n  position: absolute;\n  top: 0;\n  right: 0;\n  height: var(--bc-tap);\n  min-width: 64px;\n  padding: 0 14px;\n  border: 0;\n  background: none;\n  color: var(--bc-muted);\n  font: 600 14px var(--bc-font);\n  cursor: pointer;\n}\n.bc-pw-toggle:hover { color: var(--bc-text); }\n\n#bc-root #cmdSubmit {\n  width: 100%;\n  margin-top: 24px;\n}\n\n#bc-root .bc-login__note {\n  margin: 20px 0 0;\n  padding-top: 16px;\n  border-top: 1px solid var(--bc-border);\n  font-size: 13px;\n  line-height: 1.5;\n  color: var(--bc-muted);\n}\n#bc-root .bc-login__note a { color: inherit; font-weight: 600; }\n\n.bc-login__footer {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin-top: 12px;\n}\n\n@media (min-width: 900px) {\n  #bc-root.bc-login { flex-direction: row; }\n\n  .bc-login__brand {\n    flex: 0 0 44%;\n    justify-content: center;\n    padding: 48px;\n  }\n  .bc-login__logo { width: 140px; height: 140px; padding: 8px; }\n  .bc-login__school { margin-top: 24px; font-size: 34px; }\n  .bc-login__tagline { font-size: 14px; }\n\n  .bc-login__panel {\n    align-items: center;\n    padding: 48px;\n  }\n  .bc-login__card {\n    margin-top: 0;\n    align-self: center;\n    padding: 40px;\n    box-shadow: none;\n    background: transparent;\n  }\n  .bc-login__title { font-size: 28px; }\n}\n\n/* src/styles/skin.css */\n/* Portal pages shown inside the shell. The portal's own stylesheets stay on (they lay\n   out its forms), so these rules only undo its page chrome and make content fit. */\n\nhtml.bc-skin #bc-root .bc-main--portal #MainContent {\n  position: static !important;\n  inset: auto !important;\n  width: auto !important;\n  max-width: 100%;\n  margin: 0 !important;\n  padding: 0 !important;\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n  background: none !important;\n  color: var(--bc-text);\n  font-family: var(--bc-font);\n}\n\n/* One typeface everywhere; the portal's own font rules would otherwise reach the shell too. */\nhtml.bc-skin #bc-root,\nhtml.bc-skin #bc-root * {\n  font-family: var(--bc-font) !important;\n}\n\nhtml.bc-skin #bc-root #MainContent table { max-width: 100%; border-color: var(--bc-border); }\nhtml.bc-skin #bc-root #MainContent td,\nhtml.bc-skin #bc-root #MainContent th { font-size: 14px; }\n\nhtml.bc-skin #bc-root #MainContent input[type=\"button\"],\nhtml.bc-skin #bc-root #MainContent input[type=\"submit\"],\nhtml.bc-skin #bc-root #MainContent input[type=\"reset\"],\nhtml.bc-skin #bc-root #MainContent button {\n  min-height: 44px;\n  margin: 4px;\n  padding: 0 18px;\n  border: 0;\n  border-radius: var(--bc-radius-sm);\n  background: var(--bc-maroon);\n  color: #fff;\n  font: 600 15px var(--bc-font);\n  cursor: pointer;\n}\nhtml.bc-skin #bc-root #MainContent input[type=\"reset\"] {\n  background: var(--bc-primary-container);\n  color: var(--bc-on-primary-container);\n}\n\nhtml.bc-skin #bc-root #MainContent input[type=\"text\"],\nhtml.bc-skin #bc-root #MainContent input[type=\"password\"],\nhtml.bc-skin #bc-root #MainContent select {\n  max-width: 420px;\n}\n\n/* The portal's privacy banner/modal is reachable from Me → Privacy notice instead. */\nhtml.bc-skin #privacyModal { display: none !important; }\n\n/* src/styles/status.css */\n/* Full-screen status: session ended / portal error (ShowError.php and in-app). */\n\nhtml.bc-status-page,\nhtml.bc-status-page body {\n  margin: 0;\n  background: var(--bc-bg);\n}\nhtml.bc-status-page body > *:not(#bc-root) { display: none !important; }\n\n#bc-root .bc-status {\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n  min-height: 100dvh;\n  padding: 24px 16px;\n  background: var(--bc-bg);\n}\n#bc-root.bc-shell > .bc-status {\n  position: fixed;\n  inset: 0;\n  z-index: 50;\n  background: rgb(0 0 0 / 0.5);\n}\n#bc-root .bc-status__card {\n  width: 100%;\n  max-width: 420px;\n  padding: 32px 28px;\n  border-radius: 20px;\n  background: var(--bc-surface);\n  box-shadow: var(--bc-shadow);\n  text-align: center;\n}\n#bc-root .bc-status__icon {\n  display: inline-grid;\n  place-items: center;\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  background: var(--bc-primary-container);\n  color: var(--bc-on-primary-container);\n}\n#bc-root .bc-status__title { margin: 16px 0 8px; font-size: 22px; font-weight: 700; }\n#bc-root .bc-status__body { margin: 0 0 24px; color: var(--bc-muted); }\n#bc-root .bc-status .bc-btn { width: 100%; }\n";
const BC_VERSION = "0.2.0";
const BC_HOMEPAGE = "https://4ttth.github.io/bettercampus/";

// src/core.js
// Shared helpers. Everything here must work in Chrome, Firefox and Safari
// (desktop + iOS), both as an extension content script and as a userscript,
// so stick to plain DOM APIs — no chrome.* / browser.* / GM_* calls.

const BC = {
  pages: {},
  OFF_KEY: 'bettercampus-off',
};

BC.isDisabled = function () {
  if (/[?&]bc=off\b/.test(location.search)) return true;
  try {
    return localStorage.getItem(BC.OFF_KEY) === '1';
  } catch (e) {
    return false;
  }
};

BC.setDisabled = function (off) {
  try {
    if (off) localStorage.setItem(BC.OFF_KEY, '1');
    else localStorage.removeItem(BC.OFF_KEY);
  } catch (e) {}
  location.reload();
};

// Runs at document_start, before <head>/<body> exist, so append to <html>.
BC.injectCSS = function (css) {
  const style = document.createElement('style');
  style.id = 'bc-styles';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
};

// Hide the old page until our layout is in place, so it doesn't flash.
// Always unhide after a timeout in case a page module throws.
BC.cloak = function () {
  document.documentElement.classList.add('bc-cloak');
  setTimeout(BC.uncloak, 2500);
};

BC.uncloak = function () {
  document.documentElement.classList.remove('bc-cloak');
};

BC.onReady = function (fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
};

// The portal has no viewport meta, so phones render it at desktop width.
BC.ensureViewport = function () {
  if (document.querySelector('meta[name="viewport"]')) return;
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
  document.head.appendChild(meta);
};

// Turn off the portal's own stylesheets (linked and inline <style>) on pages we fully redesign.
BC.disablePortalStyles = function () {
  document.querySelectorAll('link[rel~="stylesheet"]').forEach(function (link) {
    if (new URL(link.href, location.href).origin === location.origin) link.disabled = true;
  });
  document.querySelectorAll('style:not(#bc-styles)').forEach(function (style) {
    style.disabled = true;
  });
};

// Flattens nested arrays of children and drops null/false, so builders can return either.
BC.flat = function (x) {
  return [].concat(x).flat(Infinity).filter(function (c) { return c != null && c !== false; });
};

// Tiny element builder: BC.h('div', { class: 'x' }, child, 'text', [more, children], ...)
BC.h = function (tag, attrs) {
  const el = document.createElement(tag);
  Object.entries(attrs || {}).forEach(function ([k, v]) {
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
  });
  el.append(...BC.flat(Array.prototype.slice.call(arguments, 2)));
  return el;
};

// Inline SVG icons (24×24, stroked). Kept as paths so nothing loads from outside the portal.
BC.ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  academics: 'M2 9l10-5 10 5-10 5z M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5 M22 9v6',
  finances: 'M20 7V5a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15v12H5a2 2 0 0 1-2-2V6 M16 14h.01',
  me: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 3.6-6 8-6s8 2 8 6',
  chevron: 'M9 6l6 6-6 6',
  back: 'M19 12H5 M11 18l-6-6 6-6',
  external: 'M14 4h6v6 M20 4l-9 9 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  bell: 'M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z M10 21h4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
  calendar: 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',
  pay: 'M3 6h18v12H3z M3 10h18 M7 15h4',
  key: 'M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  person: 'M4 5h16v14H4z M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M6 16c.5-2 1.6-3 3-3s2.5 1 3 3 M14 9h3 M14 13h3',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
  book: 'M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2 M8 7h8',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14 M12 17h.01',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  swap: 'M7 7h13l-3-3 M17 17H4l3 3',
  logout: 'M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4 M10 17l-5-5 5-5 M5 12h11',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6',
  list: 'M8 6h12 M8 12h12 M8 18h12 M4 6h.01 M4 12h.01 M4 18h.01',
};

BC.icon = function (name) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'bc-icon');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', BC.ICONS[name] || '');
  svg.appendChild(path);
  return svg;
};

// Text helpers for portal data.
BC.text = function (el) {
  return (el ? el.textContent : '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
};

BC.num = function (s) {
  const n = parseFloat(String(s == null ? '' : s).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

BC.today = function () {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

// The portal stores names and subjects in ALL CAPS; title case reads faster.
BC.titleCase = function (s) {
  return (s || '')
    .toLowerCase()
    .replace(/[a-z][a-z']*/g, function (w, offset) {
      if (offset > 0 && /^(and|or|of|the|in|on|for|to|a|an|with|at|by|vs)$/.test(w)) return w;
      return w[0].toUpperCase() + w.slice(1);
    })
    .replace(/\b(i{1,3}|iv|vi{0,3}|ix|x)\b/gi, function (m) { return m.toUpperCase(); });
};

// Small floating pill shown on the classic portal so the redesign can be turned back on.
BC.showReenableButton = function () {
  BC.onReady(function () {
    document.body.appendChild(
      BC.h('button', {
        type: 'button',
        class: 'bc-reenable',
        onclick: function () { BC.setDisabled(false); },
      }, 'Use BetterCampus')
    );
  });
};

// src/data/parsers.js
// Turn portal pages (live document or fetched) into plain data.
// Each parser works off header text, not positions, so small layout changes don't break it.

BC.parse = {};

// Main.php: student info, current schedule, notifications, open calendar windows.
BC.parse.main = function (doc) {
  const names = Array.from(doc.querySelectorAll('#boxStudInfo .w4 p'), BC.text);
  const info = {};
  doc.querySelectorAll('#boxStudInfo .row, #boxClassSched .row').forEach(function (r) {
    const q = BC.text(r.querySelector('.box_Q'));
    if (q) info[BC.portal.key(q)] = BC.text(r.querySelector('.box_A'));
  });

  // Columns: class code, block, "CODE - TITLE", time from, time to, days, room.
  const schedule = [];
  const sched = doc.querySelector('#boxClassSched table');
  if (sched) {
    BC.portal.rows(sched).forEach(function (c) {
      if (c.length < 7 || !/^\d+$/.test(c[0])) return;
      const dash = c[2].indexOf(' - ');
      schedule.push({
        classCode: c[0],
        block: c[1],
        code: dash > 0 ? c[2].slice(0, dash).trim() : c[2],
        title: dash > 0 ? c[2].slice(dash + 3).trim() : c[2],
        from: c[3],
        to: c[4],
        days: c[5],
        room: c[6],
      });
    });
  }

  // Notification rows look like "Message... - sender (2026-10-15 13:28:36)".
  const notices = [];
  let notifCount = 0;
  doc.querySelectorAll('table').forEach(function (t) {
    if (t.id !== 'events_table' || !/Notifications/i.test(BC.text(t.tHead))) return;
    notifCount = BC.num(BC.text(t.querySelector('.notif_badge'))) || 0;
    Array.from(t.tBodies[0] ? t.tBodies[0].rows : [], BC.text).forEach(function (s) {
      if (!s || /^no (new )?notification/i.test(s)) return;
      const m = /^(.*?)\s+-\s+([\w.]+)\s+\((\d{4}-\d{2}-\d{2})[^)]*\)$/.exec(s);
      notices.push(m ? { text: m[1], from: m[2], date: m[3] } : { text: s });
    });
  });

  // txtSCalDays: "start|end|department|window~…" — school-wide windows like Faculty Evaluation.
  const raw = (doc.getElementById('txtSCalDays') || {}).value || '';
  const today = BC.today();
  const seen = new Set();
  const openNow = [];
  raw.split('~').forEach(function (entry) {
    const [start, end, dept, name] = entry.split('|');
    if (!name || !(start <= today && today <= end)) return;
    if (/PhD|Graduate|High School|Basic|Elementary|Grade School|Kinder|Pre-?school/i.test(dept)) return;
    if (/Online Application|^Editing|Encoding|Submission of Grades/i.test(name)) return; // applicant / faculty windows
    if (seen.has(name)) return;
    seen.add(name);
    openNow.push({ name: name, start: start, end: end });
  });

  return {
    lastName: (names[0] || '').replace(/,\s*$/, ''),
    givenNames: names[1] || '',
    info: info,
    term: info.classScheduleFor || '',
    schedule: schedule,
    notices: notices,
    notifCount: notifCount,
    openNow: openNow,
  };
};

// Units-weighted average of numeric grades (1.00 best, 5.00 failed). Unofficial.
BC.gwa = function (subjects) {
  let sum = 0;
  let units = 0;
  subjects.forEach(function (s) {
    const g = parseFloat(s.grade);
    if (s.units > 0 && g >= 1 && g <= 5) {
      sum += g * s.units;
      units += s.units;
    }
  });
  return units ? sum / units : null;
};

// StudentGradeInquiry.php: one table, term header rows followed by subject rows.
BC.parse.grades = function (doc) {
  const table = BC.portal.findTable(doc, ['SUBJECT CODE', 'GRADES']);
  if (!table) throw new Error('Grades table not found');
  const terms = [];
  let cur = null;
  BC.portal.rows(table).forEach(function (r) {
    const filled = r.filter(Boolean);
    if (filled.length === 1 && /\d{4}\s*-\s*\d{4}/.test(filled[0])) {
      cur = { label: filled[0], subjects: [] };
      terms.push(cur);
    } else if (cur && r.length >= 4 && r[0]) {
      cur.subjects.push({ code: r[0], grade: r[1], units: BC.num(r[2]), title: r[3] });
    }
  });
  terms.forEach(function (t) { t.gwa = BC.gwa(t.subjects); });

  const summary = {};
  doc.querySelectorAll('tr').forEach(function (tr) {
    const c = Array.from(tr.cells, BC.text);
    if (/^(Pass|Fail|Drop)$/i.test(c[0])) summary[c[0].toLowerCase()] = BC.num(c[1]);
  });

  const all = terms.flatMap(function (t) { return t.subjects; });
  return { terms: terms, summary: summary, gwa: BC.gwa(all) };
};

// ViewStudentLedgerHAU.php: student data, assessment, ledger, official receipts.
BC.parse.ledger = function (doc) {
  const find = BC.portal.findTable.bind(null, doc);
  const assessment = BC.portal.objects(find(['Particulars', 'Amount']))
    .map(function (o) { return { label: o.particulars, subtotal: BC.num(o.subtotal), amount: BC.num(o.amount) }; })
    .filter(function (o) { return o.label; });
  const balance = assessment.find(function (o) { return /^balance$/i.test(o.label); });

  const transactions = BC.portal.objects(find(['TYPE', 'DUE DATE']))
    .map(function (o) {
      return { type: o.type, date: o.dueDate, ref: o.refNo, remarks: o.remarks, debit: BC.num(o.debit), credit: BC.num(o.credit), balance: BC.num(o.balance) };
    })
    .filter(function (o) { return o.type; });

  const receipts = BC.portal.objects(find(['OR NO', 'TELLER']))
    .map(function (o) { return { term: o.sYSem, or: o.orNo, date: o.date, remarks: o.remarks, method: o.oRRemarks, amount: BC.num(o.amount) }; })
    .filter(function (o) { return /\d/.test(o.or || ''); });

  return {
    info: BC.portal.labels(doc),
    assessment: assessment,
    balance: balance ? balance.amount : null,
    transactions: transactions,
    receipts: receipts,
  };
};

// ViewStudClassRecord.php: this term's subjects and instructors.
BC.parse.records = function (doc) {
  return BC.portal.objects(BC.portal.findTable(doc, ['CLASS CODE', 'INSTRUCTOR']))
    .filter(function (o) { return /^\d+$/.test(o.classCode || ''); })
    .map(function (o) {
      return { classCode: o.classCode, code: o.code, title: o.subjects, units: BC.num(o.units), instructor: o.instructor };
    });
};

// src/data/portal.js
// Background access to other portal pages, plus helpers for reading their tables.
//
// Only read-only view pages are ever requested, with plain GETs, the same as
// clicking the portal's own menu. Never request Login.php: loading it ends the session.

BC.portal = {
  base: /\/Student\//i.test(location.pathname) ? location.pathname.replace(/\/Student\/.*$/i, '/Student/') : '/Student/',
};

BC.portal.url = function (path) {
  return BC.portal.base + path;
};

BC.SessionError = class SessionError extends Error {};

// The portal may not send a charset header; honour <meta charset> so names with Ñ survive.
BC.portal.decode = function (buf, contentType) {
  let charset = (/charset=([\w-]+)/i.exec(contentType || '') || [])[1];
  if (!charset) {
    const head = new TextDecoder('latin1').decode(buf.slice(0, 2048));
    charset = (/<meta[^>]+charset=["']?([\w-]+)/i.exec(head) || [])[1] || 'utf-8';
  }
  try {
    return new TextDecoder(charset).decode(buf);
  } catch (e) {
    return new TextDecoder('utf-8').decode(buf);
  }
};

BC.portal.fetchDoc = async function (path) {
  const res = await fetch(BC.portal.url(path), { credentials: 'same-origin' });
  if (/ShowError\.php|\/Login\.php/i.test(res.url)) throw new BC.SessionError('Session ended');
  if (!res.ok) throw new Error('Portal returned HTTP ' + res.status + ' for ' + path);
  const html = BC.portal.decode(await res.arrayBuffer(), res.headers.get('content-type'));
  return new DOMParser().parseFromString(html, 'text/html');
};

// A table's own rows as arrays of cell text (nested tables are not mixed in).
BC.portal.rows = function (table) {
  return Array.from(table.rows, function (r) { return Array.from(r.cells, BC.text); });
};

// The innermost table whose header row contains every given header text.
// Long cells are ignored so layout tables wrapping the real one don't match.
BC.portal.findTable = function (doc, headers) {
  const want = headers.map(function (h) { return h.toUpperCase(); });
  return Array.from(doc.querySelectorAll('table')).find(function (t) {
    const first = BC.portal.rows(t).find(function (r) { return r.some(Boolean); });
    if (!first) return false;
    const cells = first.filter(function (c) { return c.length < 60; }).map(function (c) { return c.toUpperCase(); });
    return want.every(function (h) { return cells.some(function (c) { return c.includes(h); }); });
  }) || null;
};

// "DUE DATE" → "dueDate", "O.R. REMARKS" → "oRRemarks"
BC.portal.key = function (s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/ (\w)/g, function (_, c) { return c.toUpperCase(); });
};

// Table rows as objects keyed by the header row.
BC.portal.objects = function (table) {
  if (!table) return [];
  const rows = BC.portal.rows(table).filter(function (r) { return r.some(Boolean); });
  if (!rows.length) return [];
  const keys = rows[0].map(BC.portal.key);
  return rows.slice(1).map(function (r) {
    const o = {};
    keys.forEach(function (k, i) { if (k) o[k] = r[i] == null ? '' : r[i]; });
    return o;
  });
};

// "Label:" / value pairs from the portal's two-column info tables.
BC.portal.labels = function (doc) {
  const out = {};
  doc.querySelectorAll('tr').forEach(function (tr) {
    const cells = Array.from(tr.cells, BC.text);
    cells.forEach(function (c, i) {
      if (!/:$/.test(c) || c.length > 40) return;
      const v = cells.slice(i + 1).find(Boolean);
      const k = BC.portal.key(c);
      if (v && !/:$/.test(v) && !(k in out)) out[k] = v;
    });
  });
  return out;
};

// src/data/store.js
// One request per portal page per visit; views share the same promise.
// Data stays in memory only — nothing personal is written to storage.

BC.store = {
  cache: {},
  sources: {
    main: function () {
      if (/\/Main\.php$/i.test(location.pathname)) return Promise.resolve(document).then(BC.parse.main);
      return BC.portal.fetchDoc('Main.php').then(BC.parse.main);
    },
    grades: function () { return BC.portal.fetchDoc('CampusNet/StudentGradeInquiry.php').then(BC.parse.grades); },
    ledger: function () { return BC.portal.fetchDoc('CampusNet/ViewStudentLedgerHAU.php').then(BC.parse.ledger); },
    records: function () { return BC.portal.fetchDoc('CampusNet/ViewStudClassRecord.php').then(BC.parse.records); },
  },
};

BC.store.load = function (key) {
  if (!BC.store.cache[key]) {
    BC.store.cache[key] = BC.store.sources[key]().catch(function (err) {
      delete BC.store.cache[key]; // allow a retry on the next view
      if (err instanceof BC.SessionError) BC.app.sessionEnded();
      throw err;
    });
  }
  return BC.store.cache[key];
};

// src/app/schedule.js
// Class-time helpers. Portal formats: days "M", "MTH", "TTH", "W", "S"; times "01:30p" / "07:00a".

BC.sched = {
  DAY_NAMES: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

// "MTH" → [1, 4]. TH and SU are matched before single letters.
BC.sched.days = function (s) {
  const out = [];
  const str = (s || '').toUpperCase().replace(/[^A-Z]/g, '');
  for (let i = 0; i < str.length; ) {
    if (str.startsWith('TH', i)) { out.push(4); i += 2; continue; }
    if (str.startsWith('SU', i)) { out.push(0); i += 2; continue; }
    const d = { M: 1, T: 2, W: 3, F: 5, S: 6 }[str[i]];
    if (d != null) out.push(d);
    i += 1;
  }
  return out;
};

// "01:30p" → minutes after midnight.
BC.sched.time = function (s) {
  const m = /(\d{1,2}):(\d{2})\s*([ap])?/i.exec(s || '');
  if (!m) return null;
  let h = +m[1] % 12;
  if ((m[3] || '').toLowerCase() === 'p') h += 12;
  return h * 60 + +m[2];
};

BC.sched.fmt = function (min) {
  if (min == null) return '';
  const h = Math.floor(min / 60);
  const m = String(min % 60).padStart(2, '0');
  return ((h % 12) || 12) + ':' + m + (h < 12 ? ' AM' : ' PM');
};

BC.sched.range = function (c) {
  return BC.sched.fmt(BC.sched.time(c.from)) + ' – ' + BC.sched.fmt(BC.sched.time(c.to));
};

BC.sched.on = function (schedule, day) {
  return schedule
    .filter(function (c) { return BC.sched.days(c.days).includes(day); })
    .sort(function (a, b) { return BC.sched.time(a.from) - BC.sched.time(b.from); });
};

// The class happening now, or the next one within a week.
BC.sched.next = function (schedule, now) {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (let d = 0; d < 7; d++) {
    const day = (now.getDay() + d) % 7;
    const list = BC.sched.on(schedule, day).filter(function (c) {
      return d > 0 || BC.sched.time(c.to) > nowMin;
    });
    if (!list.length) continue;
    const c = list[0];
    const start = BC.sched.time(c.from);
    if (d === 0 && start <= nowMin) return { cls: c, live: true, label: 'Now · until ' + BC.sched.fmt(BC.sched.time(c.to)) };
    if (d === 0) {
      const mins = start - nowMin;
      return { cls: c, label: mins <= 90 ? 'Starts in ' + mins + ' min' : 'Today at ' + BC.sched.fmt(start) };
    }
    return { cls: c, label: (d === 1 ? 'Tomorrow' : BC.sched.DAY_NAMES[day]) + ' at ' + BC.sched.fmt(start) };
  }
  return null;
};

// "2023 - 2024 1st Semester" → "1st Semester · 2023–2024"; "2023-2024 1S" → "1st Semester · 2023–2024"
BC.sched.termLabel = function (s) {
  let m = /(\d{4})\s*-\s*(\d{4})\s*(.+)/.exec(s || '');
  if (!m) return s || '';
  const sem = m[3].trim().replace(/^1S$/i, '1st Semester').replace(/^2S$/i, '2nd Semester').replace(/^(SS|S|3S)$/i, 'Summer');
  return sem + ' · ' + m[1] + '–' + m[2];
};

// src/app/shell.js
// App shell: the same four destinations on every screen size (Material 3 adaptive navigation).
//   < 600px   bottom navigation bar
//   600–1199  navigation rail
//   ≥ 1200    navigation drawer with labels
// On Main.php the destinations are hash routes; on other portal pages they link back to Main.php.

BC.app = {
  NAV: [
    { id: 'home', label: 'Home', icon: 'home', hash: '#/' },
    { id: 'academics', label: 'Academics', icon: 'academics', hash: '#/academics' },
    { id: 'finances', label: 'Finances', icon: 'finances', hash: '#/finances' },
    { id: 'me', label: 'Me', icon: 'me', hash: '#/me' },
  ],
  onMain: false,
};

BC.views = {};

BC.app.link = function (hash) {
  return BC.app.onMain ? hash : BC.portal.url('Main.php') + hash;
};

// "DELA CRUZ , JUAN P." → "Juan P. Dela Cruz"
BC.app.person = function (s) {
  const parts = (s || '').split(',');
  if (parts.length < 2) return BC.titleCase(s);
  return BC.titleCase(parts.slice(1).join(' ').trim() + ' ' + parts[0].trim());
};

// "Display Own Grades (Add/Edit/Delete)" → "Grades", "Change Own Password" → "Change Password"
BC.app.cleanTitle = function (s) {
  return (s || '')
    .replace(/\((Add\/Edit\/Delete|Update)\)/gi, '')
    .replace(/^(Display|View)\s+/i, '')
    .replace(/\bOwn\s+/i, '')
    .trim();
};

BC.app.shell = function (opts) {
  BC.app.onMain = !!opts.onMain;
  const links = {};
  const main = BC.h('main', { id: 'bc-main', class: 'bc-main', tabindex: '-1' });
  const title = BC.h('h1', { class: 'bc-topbar__title', tabindex: '-1' }, opts.title || '');
  const lead = BC.h('div', { class: 'bc-topbar__lead' });
  const actions = BC.h('div', { class: 'bc-topbar__actions' });

  const root = BC.h('div', { id: 'bc-root', class: 'bc-shell' },
    BC.h('a', {
      class: 'bc-skip',
      href: '#bc-main',
      onclick: function (e) { e.preventDefault(); main.focus(); },
    }, 'Skip to content'),
    BC.h('nav', { class: 'bc-nav', 'aria-label': 'Main' },
      BC.h('div', { class: 'bc-nav__brand' },
        BC.h('span', { class: 'bc-nav__mark', 'aria-hidden': 'true' }, 'HAU'),
        BC.h('span', { class: 'bc-nav__name' }, 'Student Portal')
      ),
      BC.h('ul', { class: 'bc-nav__list', role: 'list' },
        BC.app.NAV.map(function (n) {
          links[n.id] = BC.h('a', { class: 'bc-nav__item', href: BC.app.link(n.hash) },
            BC.h('span', { class: 'bc-nav__icon' }, BC.icon(n.icon)),
            BC.h('span', { class: 'bc-nav__label' }, n.label)
          );
          return BC.h('li', null, links[n.id]);
        })
      )
    ),
    BC.h('div', { class: 'bc-body' },
      BC.h('header', { class: 'bc-topbar' }, lead, title, actions),
      main
    )
  );

  function setActive(id) {
    Object.keys(links).forEach(function (k) {
      if (k === id) links[k].setAttribute('aria-current', 'page');
      else links[k].removeAttribute('aria-current');
    });
  }
  setActive(opts.active);

  return { root: root, main: main, title: title, lead: lead, actions: actions, setActive: setActive };
};

// Hash router for Main.php: #/section/tab
BC.app.start = function (shell) {
  let lastSection = null;
  function render() {
    const hash = location.hash;
    if (hash && !hash.startsWith('#/') && lastSection) return; // ordinary in-page anchor
    const parts = hash.replace(/^#\/?/, '').split('/');
    const id = BC.views[parts[0]] ? parts[0] : 'home';
    const view = BC.views[id];
    shell.setActive(id);
    shell.title.textContent = view.title;
    document.title = view.title + ' · HAU Student Portal';
    shell.main.replaceChildren();
    view.render(shell.main, parts[1]);
    if (lastSection !== null && lastSection !== id) {
      window.scrollTo(0, 0);
      shell.title.focus({ preventScroll: true }); // announce the new page to screen readers
    }
    lastSection = id;
  }
  window.addEventListener('hashchange', render);
  render();
};

BC.app.sessionEnded = function () {
  const root = document.getElementById('bc-root');
  if (!root || document.getElementById('bc-session')) return;
  root.appendChild(BC.ui.status({
    id: 'bc-session',
    role: 'alertdialog',
    icon: 'clock',
    title: 'Your session ended',
    body: 'You were signed out after a period of inactivity, or because your account signed in somewhere else — the portal allows one session at a time.',
    action: { label: 'Sign in again', href: BC.portal.url('Login.php') },
  }));
};

// src/app/ui.js
// Shared building blocks for views: cards, rows, tabs, async slots, status screens.

BC.ui = { _n: 0 };

BC.ui.uid = function () {
  BC.ui._n += 1;
  return 'bc-id-' + BC.ui._n;
};

BC.ui.money = function (n) {
  if (n == null) return '—';
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// "2026-10-26" → "Oct 26, 2026" (parsed as a local date, not UTC).
BC.ui.date = function (s, opts) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || '');
  if (!m) return s || '';
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-US', opts || { month: 'short', day: 'numeric', year: 'numeric' });
};

BC.ui.card = function (opts) {
  const id = BC.ui.uid();
  return BC.h('section', { class: 'bc-card' + (opts.className ? ' ' + opts.className : ''), 'aria-labelledby': id },
    BC.h('div', { class: 'bc-card__head' },
      BC.h('h2', { class: 'bc-card__title', id: id }, opts.icon ? BC.icon(opts.icon) : null, opts.title),
      opts.action ? BC.h('a', { class: 'bc-card__action', href: opts.action.href }, opts.action.label) : null
    ),
    Array.prototype.slice.call(arguments, 1)
  );
};

BC.ui.skeleton = function (lines) {
  const widths = ['70%', '92%', '55%', '84%', '63%', '76%'];
  return BC.h('div', { class: 'bc-skel', 'aria-hidden': 'true' },
    Array.from({ length: lines }, function (_, i) {
      return BC.h('span', { class: 'bc-skel__line', style: 'width:' + widths[i % widths.length] });
    })
  );
};

BC.ui.empty = function (text) {
  return BC.h('p', { class: 'bc-empty' }, text);
};

BC.ui.error = function (err, fallback) {
  const ended = err instanceof BC.SessionError;
  return BC.h('div', { class: 'bc-inline-error', role: 'status' },
    BC.h('span', null, ended ? 'Your session ended.' : "Couldn't load this from the portal."),
    !ended && fallback ? BC.h('a', { href: fallback }, 'Open the original page') : null
  );
};

// Shows a skeleton until the promise settles, then whatever render() returns.
BC.ui.async = function (promise, render, opts) {
  opts = opts || {};
  const slot = BC.h('div', { class: 'bc-async', 'aria-busy': 'true' }, BC.ui.skeleton(opts.lines || 3));
  promise
    .then(function (data) {
      const out = BC.flat(render(data));
      slot.replaceChildren();
      slot.append.apply(slot, out);
    })
    .catch(function (err) {
      console.error('[BetterCampus]', err);
      slot.replaceChildren(BC.ui.error(err, opts.fallback));
    })
    .finally(function () {
      slot.removeAttribute('aria-busy');
    });
  return slot;
};

// A list row: link (href), button (onclick) or plain.
BC.ui.row = function (o) {
  const tag = o.href ? 'a' : o.onclick ? 'button' : 'div';
  const interactive = tag !== 'div';
  return BC.h(tag, {
      class: 'bc-row' + (interactive ? ' bc-row--link' : '') + (o.tone ? ' bc-row--' + o.tone : ''),
      href: o.href || null,
      type: tag === 'button' ? 'button' : null,
      onclick: o.onclick || null,
    },
    o.icon ? BC.h('span', { class: 'bc-row__icon' }, BC.icon(o.icon)) : null,
    BC.h('span', { class: 'bc-row__text' },
      BC.h('span', { class: 'bc-row__title' }, o.title),
      o.subtitle ? BC.h('span', { class: 'bc-row__sub' }, o.subtitle) : null
    ),
    o.trailing != null ? BC.h('span', { class: 'bc-row__trail' }, o.trailing) : null,
    interactive && o.chevron !== false ? BC.h('span', { class: 'bc-row__chev' }, BC.icon(o.external ? 'external' : 'chevron')) : null
  );
};

BC.ui.list = function (rows) {
  return BC.h('ul', { class: 'bc-list', role: 'list' }, rows.map(function (r) { return BC.h('li', null, r); }));
};

// Section tabs are links (they change the URL hash), marked with aria-current.
BC.ui.tabs = function (label, tabs, active) {
  return BC.h('nav', { class: 'bc-tabs', 'aria-label': label },
    tabs.map(function (t) {
      return BC.h('a', { class: 'bc-tab', href: t.href, 'aria-current': t.id === active ? 'page' : false }, t.label);
    })
  );
};

BC.ui.stat = function (label, value) {
  return BC.h('div', { class: 'bc-stat' },
    BC.h('span', { class: 'bc-stat__value' }, value),
    BC.h('span', { class: 'bc-stat__label' }, label)
  );
};

// HAU scale: 1.00 best … 3.00 lowest pass, 5.00 failed; NF/INC/DRP are text.
BC.ui.grade = function (g) {
  const n = parseFloat(g);
  const tone = isNaN(n) ? 'pending' : n >= 5 ? 'bad' : n <= 1.75 ? 'good' : 'ok';
  return BC.h('span', { class: 'bc-grade bc-grade--' + tone },
    g || '—',
    tone === 'bad' ? BC.h('span', { class: 'bc-sr' }, ' (failed)') : null
  );
};

BC.ui.status = function (o) {
  return BC.h('div', { class: 'bc-status', id: o.id || null, role: o.role || null },
    BC.h('div', { class: 'bc-status__card' },
      BC.h('div', { class: 'bc-status__icon' }, BC.icon(o.icon || 'clock')),
      BC.h('h1', { class: 'bc-status__title' }, o.title),
      BC.h('p', { class: 'bc-status__body' }, o.body),
      o.action ? BC.h('a', { class: 'bc-btn bc-btn--primary', href: o.action.href }, o.action.label) : null
    )
  );
};

// Modal dialog (native <dialog>: focus trap, Esc to close, inert background).
BC.ui.dialog = function (title, content) {
  const id = BC.ui.uid();
  const dlg = BC.h('dialog', { class: 'bc-dialog', 'aria-labelledby': id },
    BC.h('div', { class: 'bc-dialog__head' },
      BC.h('h2', { id: id }, title),
      BC.h('button', { type: 'button', class: 'bc-btn bc-btn--text', onclick: function () { dlg.close(); } }, 'Close')
    ),
    BC.h('div', { class: 'bc-dialog__body' }, content)
  );
  dlg.addEventListener('close', function () { dlg.remove(); });
  document.getElementById('bc-root').appendChild(dlg);
  dlg.showModal();
  return dlg;
};

// src/app/views/academics.js
// Academics: Schedule · Grades · Enrollment (merges six portal pages).

BC.views.academics = {
  title: 'Academics',
  TABS: [
    { id: 'schedule', label: 'Schedule', href: '#/academics/schedule' },
    { id: 'grades', label: 'Grades', href: '#/academics/grades' },
    { id: 'enrollment', label: 'Enrollment', href: '#/academics/enrollment' },
  ],

  render: function (el, sub) {
    const v = BC.views.academics;
    const tab = v.TABS.some(function (t) { return t.id === sub; }) ? sub : 'schedule';
    el.append(BC.ui.tabs('Academics sections', v.TABS, tab), v[tab]());
  },

  schedule: function () {
    return BC.ui.async(BC.store.load('main'), function (m) {
      if (!m.schedule.length) return BC.ui.empty('No classes on your schedule this term.');
      const today = new Date().getDay();
      const days = [1, 2, 3, 4, 5, 6, 0]
        .map(function (d) { return { d: d, list: BC.sched.on(m.schedule, d) }; })
        .filter(function (x) { return x.list.length; });
      return [
        m.term ? BC.h('p', { class: 'bc-lead' }, m.term + ' · ' + m.schedule.length + ' classes') : null,
        BC.h('div', { class: 'bc-week' }, days.map(function (x) {
          return BC.h('section', { class: 'bc-day' + (x.d === today ? ' is-today' : ''), 'aria-label': BC.sched.DAY_NAMES[x.d] },
            BC.h('h2', { class: 'bc-day__name' },
              BC.sched.DAY_NAMES[x.d],
              x.d === today ? BC.h('span', { class: 'bc-chip' }, 'Today') : null
            ),
            x.list.map(function (c) {
              return BC.h('article', { class: 'bc-class' },
                BC.h('p', { class: 'bc-class__time' }, BC.sched.range(c)),
                BC.h('h3', { class: 'bc-class__title' }, BC.titleCase(c.title)),
                BC.h('p', { class: 'bc-class__meta' }, [c.room, c.code, c.block].filter(Boolean).join(' · '))
              );
            })
          );
        })),
        BC.h('p', { class: 'bc-footnote' },
          'Need the registrar’s copy? ',
          BC.h('a', { href: BC.portal.url('CampusNet/ViewStudScheduleHAU.php') }, 'Open the official schedule')
        ),
      ];
    }, { lines: 6 });
  },

  grades: function () {
    const grades = BC.store.load('grades');
    const fallback = BC.portal.url('CampusNet/StudentGradeInquiry.php');
    const recordsPage = BC.portal.url('CampusNet/ViewStudClassRecord.php');
    return BC.h('div', { class: 'bc-stack' },
      BC.ui.async(grades, function (g) {
        const s = g.summary;
        return BC.h('div', { class: 'bc-card bc-stats' },
          BC.ui.stat('GWA (unofficial)', g.gwa != null ? g.gwa.toFixed(2) : '—'),
          BC.ui.stat('Passed', s.pass != null ? s.pass : '—'),
          BC.ui.stat('Failed', s.fail != null ? s.fail : '—'),
          BC.ui.stat('Dropped', s.drop != null ? s.drop : '—')
        );
      }, { lines: 2, fallback: fallback }),

      BC.ui.card({ title: 'This term', icon: 'list', action: { label: 'Class records', href: recordsPage } },
        BC.h('p', { class: 'bc-muted' }, 'Tap a subject to see its prelim, midterm and final breakdown.'),
        BC.ui.async(BC.store.load('records'), function (rs) {
          if (!rs.length) return BC.ui.empty('No class records this term.');
          return BC.ui.list(rs.map(function (r) {
            return BC.ui.row({
              title: BC.titleCase(r.title),
              subtitle: [r.code, BC.app.person(r.instructor)].filter(Boolean).join(' · '),
              href: recordsPage + '#bc-open=' + encodeURIComponent(r.classCode),
            });
          }));
        }, { lines: 4, fallback: recordsPage })
      ),

      BC.ui.async(grades, function (g) {
        return BC.h('section', { class: 'bc-terms', 'aria-labelledby': 'bc-all-terms' },
          BC.h('h2', { class: 'bc-section-title', id: 'bc-all-terms' }, 'All terms'),
          g.terms.slice().reverse().map(function (t, i) {
            const meta = !t.subjects.length ? 'No grades' : t.gwa != null ? 'GWA ' + t.gwa.toFixed(2) : t.subjects.length + ' subjects';
            return BC.h('details', { class: 'bc-term', open: i === 0 },
              BC.h('summary', null,
                BC.h('span', { class: 'bc-term__name' }, BC.sched.termLabel(t.label)),
                BC.h('span', { class: 'bc-term__meta' }, meta)
              ),
              t.subjects.length
                ? BC.ui.list(t.subjects.map(function (s) {
                    return BC.ui.row({
                      title: BC.titleCase(s.title),
                      subtitle: s.code + (s.units ? ' · ' + s.units + ' units' : ''),
                      trailing: BC.ui.grade(s.grade),
                    });
                  }))
                : BC.ui.empty('No grades recorded for this term.')
            );
          })
        );
      }, { lines: 6, fallback: fallback })
    );
  },

  enrollment: function () {
    return BC.ui.card({ title: 'Enrollment', icon: 'calendar' },
      BC.ui.async(BC.store.load('main'), function (m) {
        const win = m.openNow.find(function (e) { return /enrol/i.test(e.name); });
        return BC.h('p', { class: 'bc-banner' + (win ? ' bc-banner--ok' : '') },
          win ? 'Enrollment is open until ' + BC.ui.date(win.end) + '.' : 'Enrollment is closed right now. Self-enrollment opens during the enrollment period.'
        );
      }, { lines: 1 }),
      BC.ui.list([
        BC.ui.row({ icon: 'academics', title: 'Self-enrollment', subtitle: 'Choose your subjects for the next term', href: BC.portal.url('CampusNet/SelfEnrollment.101.php') }),
        BC.ui.row({ icon: 'search', title: 'Find open classes', subtitle: 'Search schedules by department, block or subject', href: BC.portal.url('CampusNet/SubjSchedInqCur.101.php') }),
      ])
    );
  },
};

// src/app/views/finances.js
// Finances: Overview · Transactions · Receipts. Built from the ledger page alone,
// which already contains the assessment, every charge/payment and all official receipts.

BC.views.finances = {
  title: 'Finances',
  TABS: [
    { id: 'overview', label: 'Overview', href: '#/finances/overview' },
    { id: 'transactions', label: 'Transactions', href: '#/finances/transactions' },
    { id: 'receipts', label: 'Receipts', href: '#/finances/receipts' },
  ],
  LEDGER: 'CampusNet/ViewStudentLedgerHAU.php',
  PAY: 'GLNet/PaymentCenter.php',

  render: function (el, sub) {
    const v = BC.views.finances;
    const tab = v.TABS.some(function (t) { return t.id === sub; }) ? sub : 'overview';
    el.append(
      BC.ui.tabs('Finances sections', v.TABS, tab),
      BC.ui.async(BC.store.load('ledger'), v[tab], { lines: 6, fallback: BC.portal.url(v.LEDGER) })
    );
  },

  overview: function (l) {
    const v = BC.views.finances;
    let less = false;
    const lines = l.assessment.map(function (a) {
      if (/^less payments?$/i.test(a.label)) {
        less = true;
        return BC.h('div', { class: 'bc-line bc-line--section' }, 'Payments');
      }
      const strong = /sub ?total|^total|^balance$/i.test(a.label);
      if (/^total payment/i.test(a.label)) less = false;
      const value = a.amount != null ? a.amount : a.subtotal;
      return BC.h('div', { class: 'bc-line' + (strong ? ' bc-line--strong' : '') },
        BC.h('span', null, BC.titleCase(a.label)),
        BC.h('span', { class: 'bc-num' }, (less && !strong ? '− ' : '') + BC.ui.money(value))
      );
    });
    return BC.h('div', { class: 'bc-grid' },
      BC.ui.card({ title: 'Balance', icon: 'finances' },
        BC.h('p', { class: 'bc-figure' }, BC.ui.money(l.balance)),
        BC.h('p', { class: 'bc-muted' }, l.balance > 0 ? 'Remaining on your current assessment' : 'You’re fully paid for this assessment.'),
        BC.h('div', { class: 'bc-actions' },
          BC.h('a', { class: 'bc-btn bc-btn--primary', href: BC.portal.url(v.PAY) }, 'Pay online'),
          BC.h('a', { class: 'bc-btn bc-btn--tonal', href: BC.portal.url(v.PAY) }, 'Payment schedule')
        )
      ),
      BC.ui.card({ title: 'Assessment', icon: 'list' },
        lines.length ? BC.h('div', { class: 'bc-breakdown' }, lines) : BC.ui.empty('No assessment on record.')
      )
    );
  },

  transactions: function (l) {
    if (!l.transactions.length) return BC.ui.empty('No transactions yet.');
    const rows = l.transactions.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    return BC.h('div', { class: 'bc-card' },
      BC.h('p', { class: 'bc-muted' }, 'Charges (orders of payment) and the payments made against them, newest first.'),
      BC.ui.list(rows.map(function (t) {
        const charge = (t.debit || 0) > 0;
        return BC.ui.row({
          title: t.remarks || t.type,
          subtitle: [charge ? 'Charge' : 'Payment', BC.ui.date(t.date), t.ref].filter(Boolean).join(' · '),
          trailing: BC.h('span', { class: 'bc-num ' + (charge ? 'bc-debit' : 'bc-credit') },
            (charge ? '+ ' : '− ') + BC.ui.money(charge ? t.debit : t.credit)
          ),
        });
      }))
    );
  },

  receipts: function (l) {
    if (!l.receipts.length) return BC.ui.empty('No official receipts yet.');
    const groups = [];
    l.receipts.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }).forEach(function (r) {
      let g = groups.find(function (x) { return x.term === r.term; });
      if (!g) groups.push((g = { term: r.term, items: [] }));
      g.items.push(r);
    });
    return BC.h('div', { class: 'bc-stack' }, groups.map(function (g) {
      const total = g.items.reduce(function (s, r) { return s + (r.amount || 0); }, 0);
      return BC.ui.card({ title: BC.sched.termLabel(g.term), icon: 'receipt' },
        BC.ui.list(g.items.map(function (r) {
          return BC.ui.row({
            title: r.remarks,
            subtitle: ['OR ' + r.or, BC.ui.date(r.date), r.method ? BC.titleCase(r.method) : ''].filter(Boolean).join(' · '),
            trailing: BC.h('span', { class: 'bc-num' }, BC.ui.money(r.amount)),
          });
        })),
        BC.h('div', { class: 'bc-line bc-line--strong' }, BC.h('span', null, 'Total paid'), BC.h('span', { class: 'bc-num' }, BC.ui.money(total)))
      );
    }));
  },
};

// src/app/views/home.js
// Home: what a student checks most — next class, balance, latest grades, notices.

BC.views.home = {
  title: 'Home',

  render: function (el) {
    const main = BC.store.load('main');
    const v = BC.views.home;
    el.append(
      BC.ui.async(main, v.greeting, { lines: 2 }),
      BC.h('div', { class: 'bc-grid' },
        BC.ui.card({ title: 'Next class', icon: 'clock', action: { label: 'Full schedule', href: '#/academics/schedule' } },
          BC.ui.async(main, function (m) { return v.nextClass(m.schedule); })
        ),
        BC.ui.card({ title: 'Balance', icon: 'finances', action: { label: 'Details', href: '#/finances' } },
          BC.ui.async(BC.store.load('ledger'), v.balance, { fallback: BC.portal.url('CampusNet/ViewStudentLedgerHAU.php') })
        ),
        BC.ui.card({ title: 'Latest grades', icon: 'academics', action: { label: 'All grades', href: '#/academics/grades' } },
          BC.ui.async(BC.store.load('grades'), v.grades, { lines: 5, fallback: BC.portal.url('CampusNet/StudentGradeInquiry.php') })
        ),
        BC.ui.card({ title: 'Notices', icon: 'bell' },
          BC.ui.async(main, v.notices)
        )
      )
    );
  },

  greeting: function (m) {
    const h = new Date().getHours();
    const part = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
    const first = BC.titleCase((m.givenNames || '').split(' ')[0]);
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    return BC.h('div', { class: 'bc-hello' },
      BC.h('p', { class: 'bc-hello__title' }, 'Good ' + part + (first ? ', ' + first : '')),
      BC.h('p', { class: 'bc-hello__sub' }, date + (m.term ? ' · ' + m.term : ''))
    );
  },

  nextClass: function (schedule) {
    if (!schedule.length) return BC.ui.empty('No classes on your schedule this term.');
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const next = BC.sched.next(schedule, now);
    const later = BC.sched.on(schedule, now.getDay()).filter(function (c) {
      return c !== (next && next.cls) && BC.sched.time(c.from) > nowMin;
    });
    return [
      next ? BC.h('div', { class: 'bc-next' },
        BC.h('p', { class: 'bc-next__when' + (next.live ? ' is-live' : '') }, next.label),
        BC.h('p', { class: 'bc-next__title' }, BC.titleCase(next.cls.title)),
        BC.h('p', { class: 'bc-next__meta' }, [BC.sched.range(next.cls), next.cls.room, next.cls.code].filter(Boolean).join(' · '))
      ) : BC.ui.empty('No upcoming classes this week.'),
      later.length ? [
        BC.h('h3', { class: 'bc-subhead' }, 'Later today'),
        BC.ui.list(later.map(function (c) {
          return BC.ui.row({ title: BC.titleCase(c.title), subtitle: c.room, trailing: BC.sched.fmt(BC.sched.time(c.from)) });
        })),
      ] : null,
    ];
  },

  balance: function (l) {
    if (l.balance == null) return BC.ui.empty('No current assessment found.');
    const due = l.balance > 0;
    return [
      BC.h('p', { class: 'bc-figure' }, BC.ui.money(l.balance)),
      BC.h('p', { class: 'bc-muted' }, due ? 'Remaining on your current assessment' : 'You’re fully paid for this assessment.'),
      due ? BC.h('div', { class: 'bc-actions' },
        BC.h('a', { class: 'bc-btn bc-btn--primary', href: BC.portal.url('GLNet/PaymentCenter.php') }, 'Pay online')
      ) : null,
    ];
  },

  grades: function (g) {
    const term = g.terms.slice().reverse().find(function (t) {
      return t.subjects.some(function (s) { return !isNaN(parseFloat(s.grade)); });
    });
    if (!term) return BC.ui.empty('No grades posted yet.');
    return [
      BC.h('div', { class: 'bc-stats' },
        BC.ui.stat('Term GWA', term.gwa != null ? term.gwa.toFixed(2) : '—'),
        BC.ui.stat('Overall GWA', g.gwa != null ? g.gwa.toFixed(2) : '—')
      ),
      BC.h('h3', { class: 'bc-subhead' }, BC.sched.termLabel(term.label)),
      BC.ui.list(term.subjects.slice(0, 6).map(function (s) {
        return BC.ui.row({ title: BC.titleCase(s.title), subtitle: s.code, trailing: BC.ui.grade(s.grade) });
      })),
      BC.h('p', { class: 'bc-footnote' }, 'GWA is computed by BetterCampus from units and grades. It is unofficial.'),
    ];
  },

  notices: function (m) {
    const pageFor = function (name) {
      if (/class record/i.test(name)) return BC.portal.url('CampusNet/ViewStudClassRecord.php');
      if (/faculty eval/i.test(name)) return BC.portal.url('CampusNet/FacultyEvaluation.php');
      if (/enrol/i.test(name)) return '#/academics/enrollment';
      return null;
    };
    const open = m.openNow.map(function (e) {
      return BC.ui.row({ icon: 'calendar', title: e.name + ' is open', subtitle: 'Until ' + BC.ui.date(e.end), href: pageFor(e.name) });
    });
    const notes = m.notices.map(function (n) {
      return BC.ui.row({ icon: 'bell', title: n.text, subtitle: [n.from, n.date && BC.ui.date(n.date)].filter(Boolean).join(' · ') });
    });
    if (!open.length && !notes.length) return BC.ui.empty('Nothing new right now.');
    const more = document.querySelector('[onclick*="GoMoreNotification"]');
    return [
      BC.ui.list(open.concat(notes)),
      more ? BC.h('div', { class: 'bc-actions' },
        BC.h('button', { type: 'button', class: 'bc-btn bc-btn--text', onclick: function () { more.click(); } }, 'All notifications')
      ) : null,
    ];
  },
};

// src/app/views/me.js
// Me: profile and everything account-related, in one place (the portal had it in
// three: Student Information, Utilities and the Account dropdown).

BC.views.me = {
  title: 'Me',

  render: function (el) {
    const v = BC.views.me;
    const ledger = BC.store.load('ledger').catch(function () { return null; });
    const help = Array.from(document.querySelectorAll('a[href^="javascript:OpenHelp"]')).find(function (a) {
      return a.getAttribute('href').indexOf("'help/'") !== -1;
    });
    const privacy = document.querySelector('#privacyModal .modal-card');

    el.append(
      BC.ui.async(Promise.all([BC.store.load('main'), ledger]), v.profile, { lines: 2 }),
      v.group('Account', [
        BC.ui.row({ icon: 'key', title: 'Change password', href: BC.portal.url('Changepass.php') }),
        BC.ui.row({ icon: 'person', title: 'Full profile', subtitle: 'Personal data, family, documents submitted', href: BC.portal.url('CampusNet/ViewOwnStudProfile.php') }),
      ]),
      v.group('School', [
        BC.ui.row({ icon: 'star', title: 'Faculty evaluation', subtitle: 'Rate your instructors when evaluation is open', href: BC.portal.url('CampusNet/FacultyEvaluation.php') }),
        BC.ui.row({ icon: 'book', title: 'Library catalog', subtitle: 'Search books and materials', href: BC.portal.url('CampusNet/CatInquiry6.php') }),
      ]),
      v.group('Help', [
        help ? BC.ui.row({ icon: 'help', title: 'Portal help', onclick: function () { help.click(); } }) : null,
        privacy ? BC.ui.row({
          icon: 'shield',
          title: 'Privacy notice',
          onclick: function () {
            const copy = privacy.cloneNode(true);
            copy.querySelectorAll('button, [onclick]').forEach(function (b) { b.remove(); });
            BC.ui.dialog('Privacy notice', copy);
          },
        }) : null,
        BC.ui.row({ icon: 'swap', title: 'Switch to classic portal', subtitle: 'Turn BetterCampus off on this browser', onclick: function () { BC.setDisabled(true); } }),
      ].filter(Boolean)),
      BC.h('div', { class: 'bc-card bc-card--flush' },
        BC.ui.list([BC.ui.row({ icon: 'logout', title: 'Log out', tone: 'danger', href: BC.portal.url('Login.php'), chevron: false })])
      ),
      BC.h('p', { class: 'bc-footnote bc-about' },
        'BetterCampus ' + BC_VERSION + ' is unofficial and not affiliated with Holy Angel University. ' +
        'It only changes how the portal looks on this device; nothing is sent anywhere. ',
        BC.h('a', { href: BC_HOMEPAGE, target: '_blank', rel: 'noopener' }, 'About & updates')
      )
    );
  },

  profile: function (both) {
    const m = both[0];
    const info = (both[1] && both[1].info) || {};
    const first = BC.titleCase(m.givenNames);
    const last = BC.titleCase(m.lastName);
    const initials = ((first[0] || '') + (last[0] || '')).toUpperCase();
    return BC.h('div', { class: 'bc-card bc-profile' },
      BC.h('div', { class: 'bc-avatar', 'aria-hidden': 'true' }, initials),
      BC.h('div', null,
        BC.h('p', { class: 'bc-profile__name' }, [first, last].filter(Boolean).join(' ')),
        BC.h('p', { class: 'bc-muted' }, [m.info.studentNumber, info.courseProgram, info.yearLevel].filter(Boolean).join(' · '))
      )
    );
  },

  group: function (title, rows) {
    const id = BC.ui.uid();
    return BC.h('section', { class: 'bc-card bc-card--flush', 'aria-labelledby': id },
      BC.h('h2', { class: 'bc-group__title', id: id }, title),
      BC.ui.list(rows)
    );
  },
};

// src/pages/dashboard.js
// Main.php becomes the app. The portal's own DOM stays in the page (hidden) so its
// scripts — keep-alive timer, notifications, help popups — keep working.

BC.pages.dashboard = {
  match: function (path) {
    return /\/Main\.php$/i.test(path);
  },

  run: function () {
    if (!document.getElementById('Form1')) return false;
    BC.disablePortalStyles();
    document.documentElement.classList.add('bc-app');
    const shell = BC.app.shell({ onMain: true });
    document.body.appendChild(shell.root);
    BC.app.start(shell);
    return true;
  },
};

// src/pages/error.js
// ShowError.php: the portal's bare error page. ec=1204 means the session is gone
// (timed out, or the account signed in somewhere else).

BC.pages.error = {
  match: function (path) {
    return /\/ShowError\.php$/i.test(path);
  },

  run: function () {
    const ec = new URLSearchParams(location.search).get('ec');
    const content = document.getElementById('MainContent');
    const message = BC.text(content).slice(0, 400);
    const sessionLost = ec === '1204' || /session not found|session was lost|time ?out/i.test(message);

    BC.disablePortalStyles();
    document.documentElement.classList.add('bc-status-page');
    document.body.appendChild(BC.h('div', { id: 'bc-root' },
      sessionLost
        ? BC.ui.status({
            icon: 'clock',
            title: 'Your session ended',
            body: 'You were signed out after a period of inactivity, or because your account signed in somewhere else — the portal allows one session at a time.',
            action: { label: 'Sign in again', href: BC.portal.url('Login.php') },
          })
        : BC.ui.status({
            icon: 'help',
            title: 'Something went wrong',
            body: message || 'The portal couldn’t open this page.',
            action: { label: 'Back to Home', href: BC.portal.url('Main.php') },
          })
    ));
    return true;
  },
};

// src/pages/login.js
// Login page (/Student/Login.php).
//
// The portal uses invisible reCAPTCHA bound to the #cmdSubmit button, whose
// callback submits #Form1 to Main.php. We never recreate those controls; we
// MOVE the original nodes into a new layout inside the same <form>, so the
// reCAPTCHA binding, field names and POST target all stay exactly as they are.

BC.pages.login = {
  match: function (path) {
    return /\/login\.php$/i.test(path);
  },

  run: function () {
    const form = document.getElementById('Form1');
    const user = document.getElementById('txtUserName');
    const pass = document.getElementById('txtPassword');
    const submit = document.getElementById('cmdSubmit');
    if (!form || !user || !pass || !submit) return false; // page changed; leave it alone

    const error = document.getElementById('loginError');
    const forgot = form.querySelector('.frgtPW');
    const logo = form.querySelector('#logoCont img');
    const captcha = submit.previousElementSibling; // reCAPTCHA container sits right before the button
    const schoolName =
      (form.querySelector('#descCont h1') || {}).textContent || 'Holy Angel University';

    BC.disablePortalStyles();
    document.documentElement.classList.add('bc-page-login');

    // Better mobile keyboards / password managers. Values are never touched.
    user.setAttribute('autocomplete', 'username');
    user.setAttribute('autocapitalize', 'none');
    user.setAttribute('spellcheck', 'false');
    pass.setAttribute('autocomplete', 'current-password');
    user.placeholder = 'Student number';
    pass.placeholder = 'Password';

    const toggle = BC.h('button', {
      type: 'button',
      class: 'bc-pw-toggle',
      'aria-label': 'Show password',
      'aria-pressed': 'false',
      onclick: function () {
        const show = pass.type === 'password';
        pass.type = show ? 'text' : 'password';
        toggle.textContent = show ? 'Hide' : 'Show';
        toggle.setAttribute('aria-pressed', String(show));
        toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        pass.focus();
      },
    }, 'Show');

    submit.classList.add('bc-btn', 'bc-btn--primary');
    submit.textContent = 'Sign in';
    submit.addEventListener('click', function () {
      if (!user.value || !pass.value) return;
      submit.classList.add('is-loading');
    });
    // The portal's onRecaptchaError un-hides #loginError; stop the spinner when that happens.
    if (error) {
      new MutationObserver(function () {
        if (!error.hidden) submit.classList.remove('is-loading');
      }).observe(error, { attributes: true, attributeFilter: ['hidden'] });
      error.classList.add('bc-alert');
    }
    if (forgot) forgot.classList.add('bc-link');

    const root = BC.h('div', { id: 'bc-root', class: 'bc-login' },
      BC.h('section', { class: 'bc-login__brand' },
        logo ? BC.h('div', { class: 'bc-login__logo' }, logo) : null,
        BC.h('h1', { class: 'bc-login__school' }, schoolName.trim()),
        BC.h('p', { class: 'bc-login__tagline' }, 'Student Portal')
      ),
      BC.h('section', { class: 'bc-login__panel' },
        BC.h('div', { class: 'bc-login__card' },
          BC.h('h2', { class: 'bc-login__title' }, 'Sign in'),
          BC.h('p', { class: 'bc-muted' }, 'Use your Campus++ account.'),
          BC.h('label', { class: 'bc-field', for: 'txtUserName' },
            BC.h('span', { class: 'bc-field__label' }, 'Username')
          ),
          user,
          BC.h('label', { class: 'bc-field', for: 'txtPassword' },
            BC.h('span', { class: 'bc-field__label' }, 'Password')
          ),
          BC.h('div', { class: 'bc-pw' }, pass, toggle),
          error,
          captcha,
          submit,
          BC.h('div', { class: 'bc-login__footer' },
            forgot,
            BC.h('button', {
              type: 'button',
              class: 'bc-link bc-link--quiet',
              onclick: function () { BC.setDisabled(true); },
            }, 'Classic view')
          ),
          BC.h('p', { class: 'bc-login__note' },
            'Redesigned by ',
            BC.h('a', { href: BC_HOMEPAGE, target: '_blank', rel: 'noopener' }, 'BetterCampus'),
            ' — unofficial, not affiliated with HAU. You sign in to the real portal.'
          )
        )
      )
    );

    // Keep everything inside the original <form> so the POST still includes the fields.
    form.prepend(root);
    const old = document.getElementById('fullSz');
    if (old) old.remove();
    return true;
  },
};

// src/pages/skin.js
// Every other portal page (forms like Pay Online, Change Password, Faculty Evaluation):
// keep the page's own content and form, but put it inside the BetterCampus shell so
// navigation is the same everywhere. The portal's sidebar, header and footer are hidden.

BC.pages.skin = {
  match: function (path) {
    return /\/Student\/.+\.php$/i.test(path) && !/\/(Login|Main|ShowError)\.php$/i.test(path);
  },

  run: function () {
    const content = document.getElementById('MainContent');
    if (!content) return false;

    const path = location.pathname;
    const section = /Grade|ClassRecord|Sched|Enrol/i.test(path) ? 'academics'
      : /Ledger|GLNet\//i.test(path) ? 'finances'
      : 'me';
    const title = BC.app.cleanTitle(BC.text(document.querySelector('#HeaderMain .prog_title')) || document.title);

    document.documentElement.classList.add('bc-skin');
    const shell = BC.app.shell({ active: section, title: title });
    shell.lead.append(
      BC.h('a', { class: 'bc-icon-btn', href: BC.app.link('#/' + section), 'aria-label': 'Back' }, BC.icon('back'))
    );
    shell.main.classList.add('bc-main--portal');
    shell.main.append(content); // moved, not copied: the form and its handlers keep working
    document.body.appendChild(shell.root);
    document.title = title + ' · HAU Student Portal';

    BC.pages.skin.openFromHash();
    return true;
  },

  // Academics → "This term" links here with #bc-open=<class code> to jump straight to
  // that subject's breakdown, by clicking the portal's own OpenRawScore link for it.
  openFromHash: function () {
    const m = /#bc-open=([^&]+)/.exec(location.hash);
    if (!m) return;
    const code = decodeURIComponent(m[1]);
    history.replaceState(null, '', location.pathname + location.search);
    const link = Array.from(document.querySelectorAll('a[href*="OpenRawScore"]')).find(function (a) {
      const row = a.closest('tr');
      return row && Array.from(row.cells).some(function (td) { return BC.text(td) === code; });
    });
    if (link) link.click();
  },
};

// src/router.js
// Picks the page module for the current URL. Add new pages to src/pages/
// and they register themselves on BC.pages.

BC.route = function () {
  const path = location.pathname;
  const page = Object.values(BC.pages).find(function (p) { return p.match(path); });
  return page || null;
};

// src/main.js
// Entry point. Runs at document_start.

(function () {
  if (BC.isDisabled()) {
    BC.showReenableButton();
    BC.injectCSS(BC_CSS);
    return;
  }

  const page = BC.route();
  BC.injectCSS(BC_CSS);
  if (!page) return; // unknown page: leave it as the portal draws it

  BC.cloak();
  BC.onReady(function () {
    try {
      BC.ensureViewport();
      page.run();
    } catch (e) {
      console.error('[BetterCampus]', e);
    } finally {
      BC.uncloak();
    }
  });
})();

})();
