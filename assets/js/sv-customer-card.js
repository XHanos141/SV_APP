/* SuppVerse BD shared Customer ID card.
   Visual source of truth: the card in inbox.html (itself ported from SV-Web profile.html).
   Usage:  SVCustomerCard.mount(containerEl, { name, customer_id, customer_since, phone, email, address, avatar_url })
   Keep markup/classes identical to inbox.html so the card looks the same everywhere. */
(function(){
  var ICONS = {
    pin:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"/></svg>',
    mail:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    copy:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>'
  };
  var VERIFIED_SVG = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m21.5609 10.7386-1.36-1.58001c-.26-.3-.47-.86-.47-1.26v-1.7c0-1.06-.87-1.93-1.93-1.93h-1.7c-.39 0-.96-.21-1.26-.47l-1.58-1.36c-.69-.59-1.82-.59-2.52 0l-1.57004 1.37c-.3.25-.87.46-1.26.46h-1.73c-1.06 0-1.93.87-1.93 1.93v1.71c0 .39-.21.95-.46 1.25l-1.35 1.59001c-.58.69-.58 1.81 0 2.5l1.35 1.59c.25.3.46.86.46 1.25v1.71c0 1.06.87 1.93 1.93 1.93h1.73c.39 0 .96.21 1.26.47l1.58004 1.36c.69.59 1.82.59 2.52 0l1.58-1.36c.3-.26.86-.47 1.26-.47h1.7c1.06 0 1.93-.87 1.93-1.93v-1.7c0-.39.21-.96.47-1.26l1.36-1.58c.58-.69.58-1.83-.01-2.52m-5.4-.63-4.83 4.83c-.14.14-.33.22-.53.22s-.39-.08-.53-.22l-2.42004-2.42c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l1.89004 1.89 4.3-4.30001c.29-.29.77-.29 1.06 0s.29.77 0 1.06001"/></svg>';
  var CSS = "  .cs-idcard{\n    position:relative; overflow:hidden; border-radius:16px; padding:12px 14px 8px; color:#fff; margin-bottom:0;\n    background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(255,255,255,0.06) 0%,transparent 65%),radial-gradient(ellipse 60% 80% at -10% 0%,rgba(124,111,247,0.22) 0%,transparent 55%),linear-gradient(135deg,#0f3258 0%,#002248 28%,#001f3c 60%,#000d20 100%);\n    box-shadow:0 10px 30px rgba(0,20,50,0.28);\n  }\n  .cs-idcard::after{ content:''; position:absolute; inset:0; pointer-events:none;\n    background:repeating-linear-gradient(115deg,transparent 0 26px,rgba(255,255,255,0.03) 26px 27px); }\n  .idc-top{ display:flex; align-items:center; gap:12px; position:relative; z-index:1; }\n  .idc-avatar{\n    width:46px; height:46px; border-radius:50%; flex-shrink:0;\n    background:linear-gradient(135deg,#0A9BDC,#4fb7ea);\n    display:flex; align-items:center; justify-content:center;\n    font-family:'Plus Jakarta Sans',system-ui,sans-serif; font-weight:800; font-size:16px; color:#fff;\n    box-shadow:0 4px 14px rgba(45,190,245,0.35),inset 0 1px 0 rgba(255,255,255,0.25);\n  }\n  .idc-main{ flex:1; min-width:0; }\n  .idc-name-row{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }\n  .idc-name{ font-family:'Plus Jakarta Sans',system-ui,sans-serif; font-size:16px; font-weight:800; letter-spacing:-.2px; overflow-wrap:anywhere; }\n  .idc-verified{\n    font-family:'Plus Jakarta Sans',system-ui,sans-serif; font-size:11px; font-weight:800; letter-spacing:.3px; color:#7cf0c2;\n    display:flex; align-items:center; gap:3px;\n  }\n  .idc-verified svg{ width:14px; height:14px; color:#2fd88a; }\n  .idc-email{ font-size:11.5px; color:rgba(255,255,255,0.55); margin-top:2px; font-weight:600; overflow-wrap:anywhere; }\n  .idc-since{ font-size:11px; color:rgba(255,255,255,0.45); margin-top:2px; font-weight:600; }\n  .cid-wrap{ display:flex; align-items:center; gap:7px; margin-top:5px; position:relative; z-index:1; flex-wrap:wrap; }\n  .cid-label{ font-size:11px; font-weight:700; color:rgba(255,255,255,0.6); }\n  .cid-row{\n    display:inline-flex; align-items:center; gap:4px; padding:2px 6px 2px 8px; border-radius:8px; width:fit-content;\n    background:rgba(124,111,247,0.18); border:1px solid rgba(124,111,247,0.4);\n  }\n  .cid-value{ font-family:'Plus Jakarta Sans',system-ui,sans-serif; font-size:11px; font-weight:800; color:#c4bdfd; letter-spacing:.2px; }\n  .cid-copy{\n    position:relative; width:18px; height:18px; border:none; flex-shrink:0; cursor:pointer; background:transparent;\n    display:flex; align-items:center; justify-content:center; color:#c4bdfd; transition:opacity .15s;\n  }\n  .cid-copy::before{ content:''; position:absolute; inset:-11px; }   /* 44px touch target */\n  .cid-copy:active{ opacity:.6; }\n  .cid-copy svg{ width:13px; height:13px; }\n  .cid-copy::before{ inset:-13px; }\n  .cid-copy.copied{ color:#7cf0c2; }\n  .cid-copy .cs-done{ display:none; }\n  .cid-copy.copied .cs-idle{ display:none !important; }\n  .cid-copy.copied .cs-done{ display:inline-flex; }\n  .idc-info{ position:relative; z-index:1; margin-top:9px; padding-top:7px; border-top:1px solid rgba(255,255,255,0.10); display:flex; flex-direction:column; gap:4px; }\n  .idc-row{ display:flex; align-items:center; gap:7px; min-width:0; }\n  .idc-row__icon{ width:22px; height:22px; border-radius:7px; flex:0 0 auto; display:flex; align-items:center; justify-content:center;\n    background:rgba(255,255,255,0.07); color:#8fd3f4; }\n  .idc-row__icon svg{ width:13px; height:13px; }\n  .idc-row__body{ min-width:0; flex:1; }\n  .idc-copy{ position:relative; width:26px; height:26px; border-radius:8px; flex:0 0 auto; align-self:center; display:flex; align-items:center; justify-content:center;\n    color:#c4bdfd; background:rgba(124,111,247,0.14); border:1px solid rgba(124,111,247,0.3); transition:transform .12s ease, opacity .15s; }\n  .idc-copy::before{ content:''; position:absolute; inset:-9px -7px; }   /* 44px touch target */\n  .idc-copy:active{ transform:scale(.92); opacity:.7; }\n  .idc-copy svg{ width:13px; height:13px; }\n  .idc-copy .cs-done{ display:none; }\n  .idc-copy.copied{ color:#7cf0c2; background:rgba(47,216,138,0.14); border-color:rgba(47,216,138,0.4); }\n  .idc-copy.copied .cs-idle{ display:none !important; }\n  .idc-copy.copied .cs-done{ display:inline-flex; }\n  .idc-row__lbl{ font-size:10px; font-weight:800; letter-spacing:.6px; text-transform:uppercase; color:rgba(255,255,255,0.45); }\n  .idc-row__val{ font-size:13px; font-weight:600; color:rgba(255,255,255,0.92); line-height:1.35; white-space:normal; overflow-wrap:anywhere; word-break:break-word; }\n  .idc-row__val[data-act]{ cursor:pointer; }\n  .idc-row__val.is-open{ white-space:normal; overflow-wrap:anywhere; }\n  .idc-row__val.is-empty{ color:rgba(255,255,255,0.4); font-weight:500; font-style:italic; }\n  .cs-idcard .idc-avatar img{ width:100%; height:100%; border-radius:50%; object-fit:cover; display:block; }\n  .cs-idcard .idc-avatar{ overflow:hidden; }\n  .svcc-toast{ position:fixed; left:50%; bottom:calc(env(safe-area-inset-bottom,0px) + 24px); transform:translateX(-50%); background:#162130; color:#fff; border:1px solid rgba(255,255,255,.14); border-radius:12px; padding:10px 14px; font:600 13px 'DM Sans',system-ui,sans-serif; z-index:99999; opacity:0; pointer-events:none; transition:opacity .2s; }\n  .svcc-toast.show{ opacity:1; }\n";

  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function safeUrl(u){ return /^https?:\/\//i.test(u||'') ? u : ''; }
  function fmtDate(iso){
    var d = new Date(iso); if (isNaN(d)) return '';
    var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + M[d.getMonth()] + ' ' + d.getFullYear();
  }
  function injectCss(){
    if (document.getElementById('svcc-style')) return;
    var st = document.createElement('style'); st.id = 'svcc-style'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function copyBtn(cls, val, what){
    return '<button type="button" class="'+cls+'" data-act="copy" data-copy="'+esc(val)+'" data-what="'+esc(what)+'" aria-label="Copy '+esc(what)+'">'
      + '<span class="cs-idle" style="display:inline-flex">'+ICONS.copy+'</span><span class="cs-done">'+ICONS.check+'</span></button>';
  }
  function row(field, icon, val, emptyText, expandable){
    return '<div class="idc-row" data-field="'+field+'"><span class="idc-row__icon" aria-hidden="true">'+icon+'</span>'
      + '<div class="idc-row__body"><div class="idc-row__val'+(val?'':' is-empty')+'"'
      + (val && expandable ? ' data-act="toggle-val" role="button" tabindex="0" aria-expanded="false" title="Tap to show full text"' : '')
      + '>'+(val?esc(val):emptyText)+'</div></div>'
      + (val ? copyBtn('idc-copy', val, field.charAt(0).toUpperCase()+field.slice(1)) : '') + '</div>';
  }
  function html(c){
    c = c || {};
    var name = c.name || 'SuppVerse Customer';
    var av = safeUrl(c.avatar_url) ? '<img src="'+esc(c.avatar_url)+'" alt="">' : esc(name.trim().charAt(0).toUpperCase());
    var verified = c.verified !== false;
    return '<section class="cs-idcard" aria-label="Customer ID card">'
      + '<div class="idc-top"><div class="idc-avatar" aria-hidden="true">'+av+'</div><div class="idc-main">'
      + '<div class="idc-name-row"><span class="idc-name">'+esc(name)+'</span>'+(verified?'<span class="idc-verified">'+VERIFIED_SVG+'Verified</span>':'')+'</div>'
      + (c.customer_since && fmtDate(c.customer_since) ? '<div class="idc-since">Customer since '+esc(fmtDate(c.customer_since))+'</div>' : '')
      + '<div class="cid-wrap"><span class="cid-label">Customer ID</span><div class="cid-row"><span class="cid-value">'+esc(c.customer_id||'')+'</span>'
      + (c.customer_id ? copyBtn('cid-copy', c.customer_id, 'Customer ID') : '') + '</div></div>'
      + '</div></div>'
      + '<div class="idc-info">'
      + row('phone', ICONS.phone, c.phone, 'No phone on file', false)
      + row('email', ICONS.mail, c.email, 'No email on file', true)
      + row('address', ICONS.pin, c.address, 'No address on file', true)
      + '</div></section>';
  }
  function toast(msg){
    var t = document.querySelector('.svcc-toast');
    if (!t){ t = document.createElement('div'); t.className = 'svcc-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove('show'); }, 1800);
  }
  async function copyText(text){
    try{ if (navigator.clipboard && window.isSecureContext){ await navigator.clipboard.writeText(text); return true; } }catch(e){}
    try{
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly','');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;'; document.body.appendChild(ta);
      ta.select(); ta.setSelectionRange(0, text.length);
      var ok = document.execCommand('copy'); document.body.removeChild(ta); return ok;
    }catch(e){ return false; }
  }
  function bind(root){
    root.addEventListener('click', function(e){
      var el = e.target.closest('[data-act]'); if (!el || !root.contains(el)) return;
      if (el.dataset.act === 'toggle-val'){
        var open = el.classList.toggle('is-open'); el.setAttribute('aria-expanded', String(open)); return;
      }
      if (el.dataset.act === 'copy'){
        var val = el.dataset.copy; if (!val){ toast('Nothing to copy'); return; }
        copyText(val).then(function(ok){
          if (ok){ el.classList.add('copied'); setTimeout(function(){ el.classList.remove('copied'); }, 1400);
            toast(el.dataset.what === 'Customer ID' ? 'Customer ID '+val+' copied' : (el.dataset.what||'Value')+' copied'); }
          else toast("Couldn't copy — select and copy manually");
        });
      }
    });
  }
  function mount(el, cust){ injectCss(); el.innerHTML = html(cust); if (!el._svccBound){ bind(el); el._svccBound = true; } }
  window.SVCustomerCard = { html: html, mount: mount };
})();
