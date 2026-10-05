/* SuppVerse BD — Buy For Me request page, rendered inline in the app (no iframe, so it opens instantly).
   Ported from proxy-request.html; every class is prefixed pxr- and every rule is scoped under #pxrPage.
   Public API: SVProxyRequest.open(id) / SVProxyRequest.close() */
(function(){
var CSS="#pxrPage{--bg:#0f1621;--surface:#162130;--surface2:#1d2c3e;--line:rgba(255,255,255,.08);--t1:#eaf2f8;--t2:#9fb0c3;--t3:#657386;--purple:#7c6ff7;--green:#2f9b68;--orange:#F26430;--orange-t:#FF9466;--red:#d95353;--wa:#25D366;--fb:#1877F2;--ig:#E1306C;--web:#7c6ff7}\nhtml[data-theme=\"light\"] #pxrPage{--bg:#F4F7FB;--surface:#fff;--surface2:#EEF2F8;--line:rgba(0,0,0,.08);--t1:#001f3c;--t2:#64748B;--t3:#94a3b8;--orange-t:#E15A26}\n#pxrPage *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\n#pxrPage{margin:0;height:100%;background:var(--bg);color:var(--t1);font-family:'DM Sans',system-ui,sans-serif}\n#pxrPage .pxr-app{display:flex;flex-direction:column;height:100%;max-width:520px;margin:0 auto}\n#pxrPage header{display:flex;align-items:center;gap:12px;padding:calc(env(safe-area-inset-top,0px) + 12px) 16px 12px;border-bottom:1px solid var(--line);background:var(--surface)}\n#pxrPage .pxr-back{width:36px;height:36px;border-radius:11px;border:1px solid var(--line);background:var(--surface2);color:var(--t1);display:flex;align-items:center;justify-content:center;cursor:pointer}\n#pxrPage .pxr-back svg{width:18px;height:18px}\n#pxrPage h1{margin:0;font:800 16px 'Plus Jakarta Sans',sans-serif}\n#pxrPage main{flex:1;overflow-y:auto;padding:16px 16px calc(env(safe-area-inset-bottom,0px) + 24px);display:flex;flex-direction:column;gap:16px}\n#pxrPage .pxr-label{font:800 11px 'Plus Jakarta Sans',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--purple);margin:0 0 8px}\n#pxrPage .pxr-card{background:rgba(124,111,247,.07);border:1px solid rgba(124,111,247,.18);border-radius:16px;padding:14px}\n#pxrPage .pxr-b-guest{color:var(--red);background:rgba(217,83,83,.16)}\n#pxrPage .pxr-rows{margin-top:12px;display:flex;flex-direction:column;gap:8px}\n#pxrPage .pxr-row{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--t2)}\n#pxrPage .pxr-row a{color:inherit;text-decoration:none}\n#pxrPage .pxr-verified svg{width:15px;height:15px;color:#2fd88a}\n#pxrPage .pxr-rqid,#pxrPage .pxr-pxid{font:800 11.5px 'Plus Jakarta Sans',sans-serif;color:var(--orange-t);border-radius:7px;padding:3px 9px;letter-spacing:.3px;white-space:nowrap;background:rgba(242,100,48,.06)}\n#pxrPage .pxr-rqid{border:1.5px solid rgba(242,100,48,.6)}\n#pxrPage .pxr-pxid{border:1.5px dashed rgba(242,100,48,.6)}\n#pxrPage .pxr-row.pxr-between{justify-content:space-between}\n#pxrPage .pxr-row .pxr-lbl{display:inline-flex;align-items:center;gap:8px}\n#pxrPage .pxr-row .pxr-val{font-weight:700;color:var(--t1)}\n#pxrPage .pxr-ri2{width:16px;height:16px;flex-shrink:0;color:var(--t3);display:inline-flex}\n#pxrPage .pxr-ri2 svg{width:16px;height:16px}\n#pxrPage .pxr-req-top{display:flex;align-items:center;justify-content:space-between;gap:10px}\n#pxrPage .pxr-status{font:800 11px 'Plus Jakarta Sans',sans-serif;color:var(--orange-t);background:rgba(242,100,48,.15);border-radius:8px;padding:4px 9px}\n#pxrPage .pxr-req-top + .pxr-rows{margin-top:12px}\n#pxrPage .pxr-call{width:20px;height:20px;border-radius:6px;background:var(--green);display:inline-flex;align-items:center;justify-content:center}\n#pxrPage .pxr-call svg{width:11px;height:11px;color:#fff}\n#pxrPage .pxr-pitem{display:grid;grid-template-columns:12px 1fr;gap:8px;align-items:start;padding:12px 0;border-bottom:1px dashed var(--line);color:inherit;text-decoration:none}\n#pxrPage .pxr-pitem:first-child{padding-top:0}\n#pxrPage .pxr-pitem:last-of-type{border-bottom:none;padding-bottom:0}\n#pxrPage a.pxr-pitem:active{opacity:.7}\n#pxrPage .pxr-pnum{font:800 14px/1.3 'Plus Jakarta Sans',sans-serif;color:var(--t3)}\n#pxrPage .pxr-pbody{min-width:0}\n#pxrPage .pxr-ptop{display:flex;align-items:flex-start;gap:8px}\n#pxrPage .pxr-pname{flex:1;min-width:0;font:700 14px/1.3 'Plus Jakarta Sans',sans-serif;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}\n#pxrPage .pxr-aimark{display:inline-block;vertical-align:-2px;margin-left:5px;width:14px;height:14px;color:#F4A922}\n#pxrPage .pxr-aimark svg{width:14px;height:14px;display:block}\n#pxrPage .pxr-pgo{width:16px;height:16px;flex-shrink:0;margin-top:2px;color:var(--purple)}\n#pxrPage .pxr-pgo svg{width:16px;height:16px;display:block}\n#pxrPage .pxr-pbot{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:5px}\n#pxrPage .pxr-pmeta{display:flex;align-items:baseline;flex-wrap:wrap;gap:0 6px;font-size:12px;font-weight:700;min-width:0;color:var(--t2)}\n#pxrPage .pxr-pdot{color:var(--t3)}\n#pxrPage .pxr-pstore{color:var(--t1);font-weight:800}\n#pxrPage .pxr-pprice{flex-shrink:0}\n#pxrPage .pxr-ptotal{font:800 15px 'Plus Jakarta Sans',sans-serif;color:var(--green);white-space:nowrap}\n#pxrPage .pxr-pnone{font:700 12px 'Plus Jakarta Sans',sans-serif;color:var(--t3)}\n#pxrPage .pxr-psub{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid var(--line);font-size:13px;font-weight:700;color:var(--t2)}\n#pxrPage .pxr-psub strong{font:800 15px 'Plus Jakarta Sans',sans-serif;color:var(--t1)}\n#pxrPage .pxr-help{font-size:11.5px;font-weight:600;color:var(--t2);margin-top:8px;line-height:1.45}\n#pxrPage .pxr-warn{font-size:12px;font-weight:600;color:var(--red);line-height:1.45}\n#pxrPage .pxr-note{font-size:13px;font-weight:600;line-height:1.5;white-space:pre-wrap;word-break:break-word}\n#pxrPage .pxr-sum{display:flex;justify-content:space-between;font-size:13px;font-weight:600;color:var(--t2);padding:4px 0}\n#pxrPage .pxr-sum strong{color:var(--t1);font-weight:700}\n#pxrPage .pxr-div{border-top:1px solid var(--line);margin:8px 0}\n#pxrPage .pxr-tot{display:flex;justify-content:space-between;align-items:center}\n#pxrPage .pxr-tot b{font:800 13px 'Plus Jakarta Sans',sans-serif}\n#pxrPage .pxr-tot2{margin-top:10px}\n#pxrPage .pxr-totval{display:inline-flex;align-items:center;gap:8px}\n#pxrPage .pxr-totnum{font:800 17px 'Plus Jakarta Sans',sans-serif;color:var(--t1)}\n#pxrPage .pxr-copybtn{position:relative;width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#c4bdfd;background:rgba(124,111,247,.14);border:1px solid rgba(124,111,247,.3);cursor:pointer;padding:0}\n#pxrPage html[data-theme=\"light\"] .pxr-copybtn{color:#5b4fd6}\n#pxrPage .pxr-copybtn::before{content:'';position:absolute;inset:-9px -7px}\n#pxrPage .pxr-copybtn:active{transform:scale(.92);opacity:.7}\n#pxrPage .pxr-copybtn svg{width:13px;height:13px}\n#pxrPage .pxr-copybtn .pxr-idle,#pxrPage .pxr-copybtn .pxr-done{display:inline-flex}\n#pxrPage .pxr-copybtn .pxr-done{display:none}\n#pxrPage .pxr-copybtn.pxr-copied{color:#7cf0c2;background:rgba(47,216,138,.14);border-color:rgba(47,216,138,.4)}\n#pxrPage .pxr-copybtn.pxr-copied .pxr-idle{display:none !important}\n#pxrPage .pxr-copybtn.pxr-copied .pxr-done{display:inline-flex !important}\n#pxrPage .pxr-state{margin:auto;text-align:center;color:var(--t2);font-weight:600;padding:40px 20px}\n#pxrPage .pxr-toast.pxr-ok{background:#162130;border-color:rgba(255,255,255,.14);color:#fff}\n#pxrPage .pxr-toast{position:fixed;left:16px;right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 20px);background:#2a0d0d;border:1px solid var(--red);color:#ffb4b4;border-radius:12px;padding:12px 14px;font-size:13px;font-weight:600;display:none}\n#pxrPage{position:absolute;inset:0;overflow:hidden}\n#pxrPage .pxr-toast{z-index:5}";
var SHELL="<div id=\"pxrPage\"><div class=\"pxr-app\"><header><button class=\"pxr-back\" id=\"pxrBack\" aria-label=\"Back\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"15 18 9 12 15 6\"/></svg></button><h1>Buy For Me Request</h1></header><main id=\"pxrRoot\"></main></div><div class=\"pxr-toast\" id=\"pxrToast\"></div></div>";
var CHANNELS={whatsapp:{label:'WhatsApp',color:'#25D366'},messenger:{label:'Messenger',color:'#1877F2'},facebook:{label:'Messenger',color:'#1877F2'},instagram:{label:'Instagram',color:'#E1306C'},website:{label:'Website',color:'#7c6ff7'}};
var STATUS={pending_quote:'Awaiting quote',quoted:'Quote sent',approved:'Awaiting payment',paid:'Paid',purchasing:'Purchasing',ordered:'Ordered',shipped_intl:'Shipped',arrived_bd:'Arrived in BD',delivered:'Delivered',rejected:'Rejected',cancelled:'Cancelled',expired:'Quote expired'};
var CUR={id:null,channel:'website'};
var ICON_COPY='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
var ICON_CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>';
var ICON_CHAT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 01-1.3 4.5A8.5 8.5 0 0112 20.5a8.4 8.4 0 01-4-1L3 21l1.5-4.7a8.4 8.4 0 01-1-4.3 8.5 8.5 0 014.5-7.5A8.4 8.4 0 0111.5 3H12a8.5 8.5 0 019 8v.5z"/></svg>';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function safeUrl(u){
  u=String(u||'').trim().replace(/\s+/g,'');
  if(!u) return '';
  if(/^https?:\/\//i.test(u)) return u;
  if(/^[a-z][a-z0-9+.-]*:/i.test(u)) return '';           /* other schemes (javascript:, data:) blocked */
  if(/^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/|\?|#|$)/i.test(u)) return 'https://'+u;  /* iherb.com/..., www.x.com/... */
  return '';
}
/* Open product links reliably: new tab first, fall back to the parent app if the browser blocks it */
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('#pxrPage a.pxr-pitem'); if(!a) return;
  e.preventDefault();
  var u=a.getAttribute('href'); if(!u) return;
  var w=null; try{ w=window.open(u,'_blank'); }catch(x){}
  if(w){ try{ w.opener=null; }catch(x){} return; }
  try{ window.postMessage({type:'sv-open-url',url:u},window.location.origin); }catch(x){}
});
function usd(n){return '$'+(Number(n)||0).toFixed(2);}
function bdt(n){return '৳'+Math.round(Number(n)||0).toLocaleString('en-US');}
function when(iso){
  var d=new Date(iso); if(isNaN(d)) return '';
  var M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var h=d.getHours(), ap=h>=12?'pm':'am'; h=h%12||12;
  return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear()+', '+h+':'+('0'+d.getMinutes()).slice(-2)+' '+ap;
}
function initials(n){var p=String(n||'?').trim().split(/\s+/);return ((p[0]||'?')[0]+(p.length>1?p[p.length-1][0]:'')).toUpperCase();}
function toast(m,ok){var t=document.getElementById('pxrToast');t.textContent=m;t.className='pxr-toast'+(ok?' pxr-ok':'');t.style.display='block';clearTimeout(t._h);t._h=setTimeout(function(){t.style.display='none';},ok?1600:2600);}
async function copyText(text){
  try{ if(navigator.clipboard&&window.isSecureContext){ await navigator.clipboard.writeText(text); return true; } }catch(e){}
  try{ var ta=document.createElement('textarea'); ta.value=text; ta.setAttribute('readonly',''); ta.style.cssText='position:fixed;top:0;left:0;opacity:0;'; document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0,text.length); var ok=document.execCommand('copy'); document.body.removeChild(ta); return ok; }catch(e){ return false; }
}
document.addEventListener('click',function(e){
  var b=e.target.closest('#pxrPage .pxr-copybtn'); if(!b) return;
  copyText(b.dataset.copy).then(function(ok){
    if(ok){ b.classList.add('pxr-copied'); setTimeout(function(){ b.classList.remove('pxr-copied'); },1400); toast(b.dataset.copy+' copied',true); }
    else toast("Couldn't copy — select and copy manually");
  });
});

/* Public entry point: render(row, fees). row = proxy_requests row joined with customers + orders. */
function renderProxyRequest(row, fees){
  var snap=row.product_snapshot||{};
  var items=(Array.isArray(snap.items)&&snap.items.length)?snap.items:[{name:snap.name,store:snap.store,url:row.source_url,qty:snap.qty,price:snap.price,ai:snap.ai}];
  items=items.map(function(i){return{name:i.name||'Unnamed product',store:i.store||'',url:i.url||'',qty:Math.max(1,parseInt(i.qty,10)||1),price:Number(i.price)||0,ai:!!i.ai};});
  var c=row.customers||null;
  var registered=!!(c&&(row.customer_id||c.customer_code));
  var name=(c&&c.full_name)||snap.name_guess||'Guest';
  var phone=snap.whatsapp||(c&&c.phone)||'';
  var address=c?[c.district,c.address_text].filter(Boolean).join(', '):'';
  var chKey=(snap.contact&&snap.contact.channel)||'website';
  var ch=CHANNELS[chKey]||CHANNELS.website;
  var reqNo=row.request_no||'';
  var pxNo=(row.orders&&row.orders.order_number)||'';
  var status=STATUS[row.status||'pending_quote']||String(row.status||'').replace(/_/g,' ');
  CUR.id=row.id; CUR.channel=chKey; CUR.phone=phone; CUR.name=name; CUR.px=reqNo;
  var productUsd=items.reduce(function(a,i){return a+i.qty*i.price;},0);
  var est=null;
  if(fees&&Number(fees.usd_rate)>0){
    var tax=productUsd*(Number(fees.sales_tax)||0)/100, svc=productUsd*(Number(fees.service_charge)||0)/100;
    est={tax:tax,svc:svc,total:productUsd+tax+svc,rate:Number(fees.usd_rate),taxPct:Number(fees.sales_tax)||0,svcPct:Number(fees.service_charge)||0};
    est.bdt=est.total*est.rate;
  }
    var phoneClean=String(phone).replace(/[^\d+]/g,'');
  var avatar=(c&&c.avatar_url&&safeUrl(c.avatar_url))?'<img class="pxr-avatar" src="'+esc(c.avatar_url)+'" alt="">':'<div class="pxr-avatar">'+esc(initials(name))+'</div>';
  var h='';
  h+='<section><div class="pxr-label">Customer Info</div><div id="pxrCustCard"></div></section>';
  var CLOCK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>';
  h+='<section><div class="pxr-label">Request</div><div class="pxr-card">'
    +'<div class="pxr-req-top"><span class="pxr-status">'+esc(status)+'</span>'+(reqNo?'<span class="pxr-rqid">'+esc(reqNo)+'</span>':'')+'</div>'
    +'<div class="pxr-rows">'
    +'<div class="pxr-row pxr-between"><span class="pxr-lbl"><span class="pxr-ri2">'+CLOCK+'</span>Submitted</span><span class="pxr-val">'+esc(when(row.created_at))+'</span></div>'
    +(pxNo?'<div class="pxr-row pxr-between"><span class="pxr-lbl">Order</span><span class="pxr-pxid">'+esc(pxNo)+'</span></div>':'')
    +'</div></div></section>';
  var SPARK='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.3 6.7L21 11l-6.7 2.3L12 20l-2.3-6.7L3 11l6.7-2.3z"/></svg>';
  var OUT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
  var rowsHtml=items.map(function(i,idx){
    var u=safeUrl(i.url), tag=u?'a':'div';
    var lineTotal=i.price*i.qty;
    var chip='<span class="pxr-pnum">'+(idx+1)+'</span>';
    var priceHtml=i.price?'<span class="pxr-pprice"><span class="pxr-ptotal">'+usd(lineTotal)+'</span></span>':'<span class="pxr-pnone">No price</span>';
    var qtyTxt=i.price?(i.qty+' × '+usd(i.price)):('Qty '+i.qty);
    return '<'+tag+' class="pxr-pitem"'+(u?' href="'+esc(u)+'" target="_blank" rel="noopener noreferrer" aria-label="Open '+esc(i.name)+' in a new tab"':'')+'>'
      +chip+'<div class="pxr-pbody"><div class="pxr-ptop"><div class="pxr-pname">'+esc(i.name)+(i.ai?'<span class="pxr-aimark" role="img" aria-label="AI-filled" title="AI-filled">'+SPARK+'</span>':'')+'</div>'+(u?'<span class="pxr-pgo">'+OUT+'</span>':'')+'</div>'
      +'<div class="pxr-pbot"><div class="pxr-pmeta"><span class="pxr-pstore">'+esc(i.store||'Store not detected')+'</span><span class="pxr-pdot">·</span><span>'+qtyTxt+'</span></div>'+priceHtml+'</div></div></'+tag+'>';
  }).join('');
  h+='<section><div class="pxr-label">Requested Products ('+items.length+')</div><div class="pxr-card">'+rowsHtml
    +'<div class="pxr-psub"><span>Items subtotal</span><strong>'+usd(productUsd)+'</strong></div></div>'
    +'</section>';
  if(snap.notes) h+='<section><div class="pxr-label">Customer Notes</div><div class="pxr-card"><div class="pxr-note">'+esc(snap.notes)+'</div></div></section>';
  h+='<section><div class="pxr-label">Cost Estimate</div><div class="pxr-card">'
    +(est?'<div class="pxr-sum"><span>Product cost</span><strong>'+usd(productUsd)+'</strong></div>'
      +'<div class="pxr-sum"><span>US Sales Tax ('+est.taxPct+'%)</span><strong>'+usd(est.tax)+'</strong></div>'
      +'<div class="pxr-sum"><span>Service Charge ('+est.svcPct+'%)</span><strong>'+usd(est.svc)+'</strong></div>'
      +'<div class="pxr-sum"><span>Rate</span><strong>1 USD = ৳'+est.rate+'</strong></div><div class="pxr-div"></div>'
      +(row.quote_total!=null?'<div class="pxr-sum"><span>Final price sent</span><strong>'+bdt(row.quote_total)+'</strong></div>':'')
      +'<div class="pxr-tot"><b>Total (USD)</b><span class="pxr-totval"><span class="pxr-totnum">'+usd(est.total)+'</span><button type="button" class="pxr-copybtn" data-copy="'+usd(est.total)+'" aria-label="Copy total"><span class="pxr-idle">'+ICON_COPY+'</span><span class="pxr-done">'+ICON_CHECK+'</span></button></span></div>'
      +'<div class="pxr-tot pxr-tot2"><b>Total (BDT)</b><span class="pxr-totval"><span class="pxr-totnum">'+bdt(est.bdt)+'</span><button type="button" class="pxr-copybtn" data-copy="'+bdt(est.bdt)+'" aria-label="Copy total"><span class="pxr-idle">'+ICON_COPY+'</span><span class="pxr-done">'+ICON_CHECK+'</span></button></span></div>'
     :'<div class="pxr-warn">Fee settings are not saved yet. Open Website → Buy For Me → Fee &amp; Markup Rates and press Save Changes.</div>')
    +'</div></section>';
  document.getElementById('pxrRoot').innerHTML=h;
  SVCustomerCard.mount(document.getElementById('pxrCustCard'),{
    name:name, customer_id:(c&&c.customer_code)||'', customer_since:(c&&c.created_at)||'',
    phone:(c&&c.phone)||'', email:(c&&c.email)||'', address:address, avatar_url:(c&&c.avatar_url)||'', verified:registered
  });
}

/* ---- inline host ---- */
var cache={}, mounted=false;
function mount(){
  if(mounted) return true;
  var panel=document.getElementById('proxyRequestPanel'); if(!panel) return false;
  var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  panel.innerHTML=SHELL;
  document.getElementById('pxrBack').onclick=function(){ if(typeof window.closeProxyDetails==='function') window.closeProxyDetails(); };
  mounted=true; return true;
}
function setRoot(h){ var r=document.getElementById('pxrRoot'); if(r) r.innerHTML='<div class="pxr-state">'+h+'</div>'; }
async function load(id){
  if(typeof sbFetch!=='function') throw new Error('no client');
  var res=await Promise.all([
    sbFetch('proxy_requests?select=*,customers(full_name,phone,email,customer_code,avatar_url,address_text,district,created_at),orders(order_number)&id=eq.'+encodeURIComponent(id)),
    sbFetch('site_content?select=content&page=eq.buy_for_me&section=eq.fees').catch(function(){return null;})
  ]);
  var row=res[0]&&res[0][0];
  if(!row) return null;
  return {row:row,fees:(res[1]&&res[1][0]&&res[1][0].content)||null};
}
window.SVProxyRequest={
  open:function(id){
    if(!mount()) return;
    var root=document.getElementById('pxrRoot'); root.scrollTop=0;
    var hit=cache[id];
    if(hit) renderProxyRequest(hit.row,hit.fees); else setRoot('Loading request…');
    load(id).then(function(d){
      if(!d){ if(!hit) setRoot('Request not found, or you do not have access.'); return; }
      var same=hit&&JSON.stringify(hit)===JSON.stringify(d);
      cache[id]=d;
      if(!same){ var top=root.scrollTop; renderProxyRequest(d.row,d.fees); root.scrollTop=top; }
    }).catch(function(e){ console.error('[BFM]',e); var m=String((e&&e.message)||e||'').replace(/[<>&]/g,'').slice(0,220); if(!hit) setRoot('Could not load this request.<br><small style="opacity:.7;font-size:11px;word-break:break-word">'+m+'</small>'); });
  },
  close:function(){}
};
})();
