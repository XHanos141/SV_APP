/* SuppVerse BD — admin panel fingerprint gate.
   Rule: every change that writes to the database (save / publish / update / delete) must be confirmed with fingerprint.
   One central gate for the whole admin panel, so no individual save function can forget it and new ones are covered automatically.
   - DB writes  : sb.from(t).insert/update/upsert/delete  -> verified before the request is sent
   - Deletes    : sb.storage.from(b).remove              -> verified before the request is sent
   - Not gated  : reads, rpc reads, image uploads (an uploaded file changes nothing live until the row that uses it is saved)
   A cancelled / failed fingerprint resolves with { data:null, error } exactly like a failed save, so each screen's existing
   error handling runs and nothing is written. One fingerprint covers the writes of a single save (GRACE_MS), so a save that
   touches two tables prompts once.
   Needs sv-fingerprint.js and the global `sb`. Call SVAdminFpGate.install() once the admin is verified. */
(function () {
  'use strict';
  var GRACE_MS = 8000, okUntil = 0, installed = false;

  function toast(msg) {
    /* callers toast their own generic "Save failed" right after we return, so ours goes last */
    setTimeout(function () { try { if (typeof window.T === 'function') window.T(msg, '🔒'); } catch (e) {} }, 80);
  }
  function confirmed() {
    if (Date.now() < okUntil) return Promise.resolve(null);
    if (!window.SVFingerprint) return Promise.resolve(new Error('Fingerprint module not loaded'));
    return window.SVFingerprint.verify().then(function () { okUntil = Date.now() + GRACE_MS; return null; },
      function (e) { return e || new Error('Fingerprint confirmation failed'); });
  }
  function denied(err) {
    var msg = (err && err.message) || 'Fingerprint confirmation failed';
    toast(msg.indexOf('cancel') > -1 ? 'Fingerprint needed to save changes' : msg);
    return { data: null, error: { message: msg, code: 'FP_DENIED' }, count: null, status: 401, statusText: 'Fingerprint required' };
  }

  function install() {
    if (installed || !window.sb) return; installed = true;
    var sb = window.sb;

    /* 1) database writes: flag the builder, gate its then() */
    var origFrom = sb.from.bind(sb);
    var probe = origFrom('_probe').select('x'), proto = probe;
    while (proto && !Object.prototype.hasOwnProperty.call(proto, 'then')) proto = Object.getPrototypeOf(proto);
    if (!proto) { installed = false; throw new Error('SVAdminFpGate: query builder not recognised'); }
    var origThen = proto.then;
    proto.then = function (onOk, onErr) {
      var self = this;
      if (!self.__svWrite) return origThen.call(self, onOk, onErr);
      return confirmed().then(function (err) {
        if (err) return denied(err);
        return origThen.call(self);
      }).then(onOk, onErr);
    };
    sb.from = function (table) {
      var q = origFrom(table);
      ['insert', 'update', 'upsert', 'delete'].forEach(function (m) {
        var o = q[m]; if (typeof o !== 'function') return;
        q[m] = function () { var b = o.apply(q, arguments); if (b) b.__svWrite = true; return b; };
      });
      return q;
    };

    /* 2) storage deletes */
    var origStorageFrom = sb.storage.from.bind(sb.storage);
    sb.storage.from = function (bucket) {
      var s = origStorageFrom(bucket), rm = s.remove;
      s.remove = function () {
        var a = arguments;
        return confirmed().then(function (err) { return err ? denied(err) : rm.apply(s, a); });
      };
      return s;
    };
    if (window.SVFingerprint) window.SVFingerprint.enable();
  }
  window.SVAdminFpGate = { install: install };
})();
