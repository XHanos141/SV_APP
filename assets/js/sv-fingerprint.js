/* SuppVerse BD — shared fingerprint (passkey) confirmation.
   One file used by every admin screen. Usage in any page:
     <script src="assets/js/sv-fingerprint.js"></script>
     SVFingerprint.enable();            // once the admin is signed in (starts background warm-up)
     await SVFingerprint.verify();      // before saving any change; throws if not confirmed
   Speed: the server challenge is fetched in the background and cached, so the fingerprint
   prompt opens instantly inside the user's tap. Needs globals `sb` (Supabase client) and `SB_URL`. */
(function () {
  'use strict';
  var FN_OPTIONS = '/functions/v1/passkey-verify-options-v2';
  var FN_ASSERT  = '/functions/v1/passkey-verify-assert-v2';
  var MAX_AGE = 120000;      // reuse a prefetched challenge for 2 min (server keeps it 5 min)
  var NO_PK_TTL = 60000;     // remember "no fingerprint registered" for 1 min
  var NO_PK = { none: true };

  var enabled = false, cache = null, inflight = null, running = null, noPkUntil = 0, busyTimer = null, busyEl = null;

  function client() { return (typeof sb !== 'undefined') ? sb : window.sb; }
  function baseUrl() { return (typeof SB_URL !== 'undefined') ? SB_URL : window.SB_URL; }
  function b64uToBuf(s) {
    s = String(s).replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
    var bin = atob(s), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out.buffer;
  }
  function bufToB64u(buf) {
    var b = new Uint8Array(buf), s = '';
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function fresh() { return cache && (Date.now() - cache.at) < MAX_AGE ? cache : null; }

  async function post(path, token, body, ms) {
    var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, ms || 12000);
    try {
      var res = await fetch(baseUrl() + path, {
        method: 'POST', signal: ctl.signal,
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      var data = {}; try { data = await res.json(); } catch (e) {}
      return { ok: res.ok, status: res.status, data: data };
    } catch (e) {
      if (e && e.name === 'AbortError') throw new Error('Fingerprint server is slow — please try again.');
      throw e;
    } finally { clearTimeout(t); }
  }

  async function fetchOptions() {
    var s = await client().auth.getSession();
    var session = s && s.data && s.data.session;
    if (!session) throw new Error('Not signed in');
    var r = await post(FN_OPTIONS, session.access_token);
    if (!r.ok) {
      if (r.status === 400 && /No fingerprint/i.test(r.data.error || '')) { noPkUntil = Date.now() + NO_PK_TTL; return NO_PK; }
      throw new Error(r.data.error || 'Could not start fingerprint check');
    }
    return { options: r.data, at: Date.now() };
  }

  /* Warm up in the background. Safe to call as often as you like. */
  function prepare() {
    if (!enabled || fresh() || inflight || Date.now() < noPkUntil) return;
    if (!client()) return;
    inflight = fetchOptions().then(function (o) { cache = (o === NO_PK) ? null : o; })
      .catch(function () { cache = null; })
      .then(function () { inflight = null; });
  }

  function showBusy() {
    clearTimeout(busyTimer);
    busyTimer = setTimeout(function () {
      if (busyEl) return;
      if (!document.getElementById('svfp-style')) {
        var st = document.createElement('style'); st.id = 'svfp-style';
        st.textContent = '.svfp-busy{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 92px);transform:translateX(-50%);z-index:100001;display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;background:#162130;color:#fff;border:1px solid rgba(255,255,255,.14);font:700 12.5px "Plus Jakarta Sans",system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.3)}.svfp-busy i{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:#7c6ff7;animation:svfpspin .7s linear infinite}@keyframes svfpspin{to{transform:rotate(360deg)}}';
        document.head.appendChild(st);
      }
      busyEl = document.createElement('div'); busyEl.className = 'svfp-busy'; busyEl.innerHTML = '<i></i>Checking fingerprint…';
      document.body.appendChild(busyEl);
    }, 250);
  }
  function hideBusy() { clearTimeout(busyTimer); if (busyEl) { busyEl.remove(); busyEl = null; } }

  async function run() {
    if (Date.now() < noPkUntil) return;                 // no fingerprint registered → nothing to confirm
    var c = fresh();
    if (!c) {
      if (inflight) await inflight;
      c = fresh();
      if (!c) {
        if (Date.now() < noPkUntil) return;
        var o = await fetchOptions();
        if (o === NO_PK) return;
        c = o;
      }
    }
    if (!window.PublicKeyCredential) throw new Error('This device doesn\u2019t support fingerprint confirmation.');

    var opts = c.options;
    var publicKey = Object.assign({}, opts, {
      challenge: b64uToBuf(opts.challenge),
      allowCredentials: (opts.allowCredentials || []).map(function (x) { return Object.assign({}, x, { id: b64uToBuf(x.id) }); })
    });
    var assertion;
    try {
      assertion = await navigator.credentials.get({ publicKey: publicKey });
    } catch (e) {
      if (e && (e.name === 'NotAllowedError' || e.name === 'AbortError')) throw new Error('Fingerprint confirmation was cancelled');
      cache = null; throw e;
    }
    if (!assertion) throw new Error('Fingerprint confirmation was cancelled');
    cache = null;                                        // a challenge is single-use

    var assertionResponse = {
      id: assertion.id,
      rawId: bufToB64u(assertion.rawId),
      type: assertion.type,
      response: {
        clientDataJSON: bufToB64u(assertion.response.clientDataJSON),
        authenticatorData: bufToB64u(assertion.response.authenticatorData),
        signature: bufToB64u(assertion.response.signature),
        userHandle: assertion.response.userHandle ? bufToB64u(assertion.response.userHandle) : null
      },
      clientExtensionResults: assertion.getClientExtensionResults ? assertion.getClientExtensionResults() : {}
    };
    var s = await client().auth.getSession();
    var session = s && s.data && s.data.session;
    if (!session) throw new Error('Not signed in');
    var r = await post(FN_ASSERT, session.access_token, { assertionResponse: assertionResponse });
    if (!r.ok || !r.data.verified) throw new Error(r.data.error || 'Fingerprint did not match');
    setTimeout(prepare, 400);                            // warm the next one
  }

  /* Confirm with fingerprint. Resolves when confirmed (or nothing to confirm); throws otherwise. */
  function verify() {
    if (running) return running;
    showBusy();
    running = run().then(function () { hideBusy(); running = null; }, function (e) { hideBusy(); running = null; throw e; });
    return running;
  }

  /* Call once the admin is signed in. Starts warming up and keeps a challenge ready. */
  function enable() {
    if (enabled) { prepare(); return; }
    enabled = true;
    prepare();
    document.addEventListener('pointerdown', prepare, { capture: true, passive: true });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) prepare(); });
  }
  /* Call after a fingerprint device is added or removed. */
  function reset() { cache = null; noPkUntil = 0; prepare(); }

  window.SVFingerprint = { enable: enable, prepare: prepare, verify: verify, reset: reset };
})();
