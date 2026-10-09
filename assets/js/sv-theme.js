/* SuppVerse shared theme — one source of truth for every page that lives under the main app.
   Storage key "svbd-theme" ("light" | "dark", default dark — identical to app.html).
   Loaded by: admin_profile, admin_panel, inbox, voucher-hub.
   API: svTheme.get() · svTheme.set('light'|'dark') · svTheme.toggle() · svTheme.onChange(fn(theme)) */
(function () {
  if (window.svTheme) return;
  var KEY = 'svbd-theme', root = document.documentElement, subs = [], current = null;
  var norm = function (t) { return t === 'light' ? 'light' : 'dark'; };
  function read() { try { return norm(localStorage.getItem(KEY)); } catch (e) { return 'dark'; } }
  function paint(t) {
    root.setAttribute('data-theme', t);
    var sync = function () {
      if (document.body) document.body.classList.toggle('dark-mode', t === 'dark');
      var hub = document.getElementById('voucherHubPanel');
      if (hub) hub.setAttribute('data-theme', t);
    };
    if (document.body) sync(); else document.addEventListener('DOMContentLoaded', sync);
  }
  function apply(t, persist) {
    t = norm(t);
    if (persist) { try { localStorage.setItem(KEY, t); } catch (e) {} }
    var changed = t !== current;
    current = t;
    paint(t);
    if (changed) subs.slice().forEach(function (fn) { try { fn(t); } catch (e) {} });
  }
  window.svTheme = {
    get: function () { return current || read(); },
    set: function (t) { apply(t, true); },
    toggle: function () { apply(current === 'dark' ? 'light' : 'dark', true); },
    onChange: function (fn) { subs.push(fn); try { fn(current); } catch (e) {} }
  };
  apply(read(), false);
  /* other tabs / frames changed the main toggle */
  window.addEventListener('storage', function (e) { if (e.key === KEY) apply(read(), false); });
  /* main app broadcast (postMessage) */
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d) return;
    if (d.type === 'sv-theme') apply(d.dark ? 'dark' : 'light', true);
    else if (d.type === 'SET_THEME') apply(d.theme, true);
  });
  /* back/forward cache + tab re-focus */
  window.addEventListener('pageshow', function () { apply(read(), false); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) apply(read(), false); });
})();
