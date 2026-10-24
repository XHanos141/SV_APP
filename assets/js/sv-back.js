/* SuppVerse BD — one back press = one step.
   Rule for the whole app: the system / browser Back button (or swipe-back) closes ONLY the top-most thing that is open —
   a modal, sheet, popup, drawer, full-screen panel, or one wizard step — never several at once and never the whole app by accident.
   Order on every Back press:
     1) the top-most open layer (modal / bottom sheet / popup / drawer / full-screen panel; panels hosting an iframe ask the
        iframe to go back one step first)
     2) a registered step hook (e.g. wizard "previous step")
     3) a registered root handler (e.g. any tab -> Overview)
     4) at the very top: "Press back again to exit" — a second Back within 2.2 s leaves the app.
   Only the top document owns browser history (one guard entry, re-armed after every Back); iframes just expose SVBack.handleBack().
   Public API: SVBack.registerLayer(selector, closeFn) · SVBack.registerHook(fn) · SVBack.registerRoot(fn) · SVBack.handleBack() */
(function () {
  'use strict';
  if (window.SVBack) return;

  var IS_TOP = window.top === window;
  var EXIT_WINDOW = 2200;

  var CAND = '[class*="overlay" i],[class*="modal" i],[class*="sheet" i],[class*="popup" i],[class*="panel" i],[class*="drawer" i],' +
             '[class*="popover" i],[class*="dialog" i],[id$="Overlay"],[id$="Modal"],[id$="Panel"],[id$="Sheet"],[id$="Popup"],[id$="Dialog"]';
  var SKIP = /backdrop|toast|tab-panel|step-panel|left-panel|middle-panel|right-panel|main-content|skeleton|loader|tooltip|sticky|preview|progress/i;
  var CLOSE_SEL = '[data-back-close],[aria-label*="close" i],[onclick*="close" i],[onclick*="cancel" i],[onclick*="dismiss" i],[onclick*="hide" i],' +
                  '.close,[class*="close"],[class*="cancel"],[class*="dismiss"]';
  var BAD_ACTION = /confirm|save|delete|remove|submit|apply|create|accept|yes|pay|print|download|send/i;

  var layerClosers = [];   // { sel, fn }
  var hooks = [];          // fn() -> true when it consumed the press
  var roots = [];          // fn() -> true when it consumed the press
  var stuck = (typeof WeakSet !== 'undefined') ? new WeakSet() : null;

  function cls(el) { var c = el.getAttribute && el.getAttribute('class'); return c || ''; }

  function isShown(el) {
    if (!el || !el.isConnected) return false;
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    // a fade-in that has only just started still counts as open (state class present) — Back must work from the very first frame
    if (parseFloat(cs.opacity) < 0.05 && !/(^|\s)(active|open|show|visible|is-open|opened|shown)(\s|$)/.test(cls(el))) return false;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    var vw = window.innerWidth, vh = window.innerHeight;
    return r.bottom > 2 && r.right > 2 && r.top < vh - 2 && r.left < vw - 2;
  }

  function zChain(el) {
    var chain = [];
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      var z = getComputedStyle(n).zIndex;
      if (z !== 'auto' && z !== '' && !isNaN(parseInt(z, 10))) chain.unshift(parseInt(z, 10));
    }
    return chain;
  }
  function cmpLayers(a, b) {          // top-most first
    var A = zChain(a), B = zChain(b), n = Math.max(A.length, B.length);
    for (var i = 0; i < n; i++) {
      var x = A[i] === undefined ? -1 : A[i], y = B[i] === undefined ? -1 : B[i];
      if (x !== y) return y - x;
    }
    if (a === b) return 0;
    var pos = a.compareDocumentPosition(b);
    if (pos & Node.DOCUMENT_POSITION_CONTAINED_BY) return 1;     // b is inside a -> b first
    if (pos & Node.DOCUMENT_POSITION_CONTAINS) return -1;
    return (pos & Node.DOCUMENT_POSITION_FOLLOWING) ? 1 : -1;     // later in DOM first
  }

  function openLayers() {
    var out = [], seen = [];
    var all = document.querySelectorAll(CAND);
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (stuck && stuck.has(el)) continue;
      if (SKIP.test(cls(el)) || (el.id && SKIP.test(el.id))) continue;
      if (el.tagName === 'IFRAME' || el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'SVG' || el.closest('svg')) continue;
      if (!el.firstElementChild) continue;                      // childless = a plain backdrop, not a layer
      var pos = getComputedStyle(el).position;
      if (pos !== 'fixed') {                                    // slide-over panels inside another layer: absolute and (nearly) full-screen
        if (pos !== 'absolute') continue;
        var rr = el.getBoundingClientRect();
        if (rr.width < window.innerWidth * 0.6 || rr.height < window.innerHeight * 0.5) continue;
      }
      if (!isShown(el)) continue;
      out.push(el);
    }
    return out.sort(cmpLayers);
  }

  function clickSafe(el) { try { el.click(); return true; } catch (e) { return false; } }

  function findCloseControl(layer) {
    var c = layer.querySelectorAll(CLOSE_SEL);
    for (var i = 0; i < c.length; i++) {
      var b = c[i], oc = b.getAttribute('onclick') || '';
      if (b.disabled || BAD_ACTION.test(oc) || BAD_ACTION.test(cls(b)) || BAD_ACTION.test(b.getAttribute('aria-label') || '')) continue;
      if (isShown(b)) return b;
    }
    return null;
  }

  function closeLayer(el) {
    for (var i = 0; i < layerClosers.length; i++) {
      var rc = layerClosers[i];
      if (el.matches(rc.sel)) { try { var r = rc.fn(el); if (r !== false) return true; } catch (e) {} }
    }
    var own = el.getAttribute('onclick') || '';
    if (/close|hide|dismiss|cancel|event\.target\s*===\s*this/i.test(own) && !BAD_ACTION.test(own)) { if (clickSafe(el)) return true; }
    var ctl = findCloseControl(el);
    if (ctl) return clickSafe(ctl);
    ['active', 'open', 'show', 'visible', 'is-open'].forEach(function (c) { el.classList.remove(c); });   // last resort
    return true;
  }

  function hostedFrame(layer) {
    var frames = layer.tagName === 'IFRAME' ? [layer] : Array.prototype.slice.call(layer.querySelectorAll('iframe'));
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      try { if (isShown(f) && f.contentWindow && f.contentWindow.SVBack) return f; } catch (e) { /* cross-origin */ }
    }
    return null;
  }

  function handleBack() {
    var layers = openLayers();
    if (layers.length) {
      var top = layers[0];
      var fr = hostedFrame(top);
      if (fr) { try { if (fr.contentWindow.SVBack.handleBack()) return true; } catch (e) {} }
      closeLayer(top);
      setTimeout(function () { if (stuck && top.isConnected && isShown(top)) stuck.add(top); }, 450);   // never trap the user behind something that cannot close
      return true;
    }
    for (var h = hooks.length - 1; h >= 0; h--) { try { if (hooks[h]() === true) return true; } catch (e) {} }
    for (var r = roots.length - 1; r >= 0; r--) { try { if (roots[r]() === true) return true; } catch (e) {} }
    return false;
  }

  function toast(msg) {
    try { if (typeof window.showToast === 'function') { window.showToast(msg); return; } } catch (e) {}
    var t = document.getElementById('sv-back-toast');
    if (!t) {
      t = document.createElement('div'); t.id = 'sv-back-toast';
      t.style.cssText = 'position:fixed;left:50%;bottom:calc(86px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:rgba(15,22,33,.92);color:#fff;font:600 12.5px "Plus Jakarta Sans",system-ui,sans-serif;padding:10px 16px;border-radius:12px;z-index:2147483000;opacity:0;transition:opacity .2s;pointer-events:none;white-space:nowrap';
      document.body.appendChild(t);
    }
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(t._h); t._h = setTimeout(function () { t.style.opacity = '0'; }, 1800);
  }

  var api = {
    registerLayer: function (sel, fn) { layerClosers.push({ sel: sel, fn: fn }); },
    registerHook: function (fn) { hooks.push(fn); },
    registerRoot: function (fn) { roots.push(fn); },
    handleBack: handleBack,
    _layers: openLayers
  };
  window.SVBack = api;

  if (!IS_TOP) return;      /* iframes: API only — the top document owns history */

  var armed = false, lastHint = 0;
  try { if (history.state && history.state.svBack) history.replaceState(null, ''); } catch (e) {}
  function arm() {
    if (armed) return;
    try { history.pushState({ svBack: 1 }, '', location.href); armed = true; } catch (e) {}
  }
  ['pointerdown', 'touchstart', 'mousedown', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, arm, { capture: true, passive: true });      // first real tap gives the page user-activation, so Chrome keeps the entry
  });
  window.addEventListener('popstate', function () {
    if (!armed) return;
    armed = false;
    if (handleBack()) { arm(); return; }
    var now = Date.now();
    if (now - lastHint < EXIT_WINDOW) { lastHint = 0; history.back(); return; }     // second Back inside the window = leave
    lastHint = now; toast('Press back again to exit'); arm();
  });
})();
