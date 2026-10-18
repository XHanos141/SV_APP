/* SuppVerse BD — Buy For Me request page, rendered inline in the app (no iframe, so it opens instantly).
   Originally ported from the old standalone proxy-request.html page (now removed); every class is prefixed pxr- and every rule is scoped under #pxrPage.
   Public API: SVProxyRequest.open(id) / SVProxyRequest.close() */
(function(){
var CSS="#pxrPage{--bg:#0B0F18;--surface:#141B2A;--surface2:#1A2235;--line:rgba(255,255,255,.08);--t1:#eaf2f8;--t2:#9fb0c3;--t3:#657386;--green:#2f9b68;--or:#F26430;--or-t:#FF9466;--or-bd:rgba(255,148,102,.42);--or-bg:rgba(242,100,48,.10);--red:#d95353}\n#pxrPage .pxr-card{background:#fff;border:1px solid rgba(242,100,48,.55);border-radius:16px;padding:11px 12px;box-shadow:0 2px 5px rgba(15,22,33,.10),0 10px 22px -6px rgba(242,100,48,.42),inset 0 1.5px 0 rgba(255,255,255,1),inset 0 -3px 6px rgba(10,22,40,.06)}\nhtml[data-theme=\"dark\"] #pxrPage .pxr-card{background:linear-gradient(160deg,#1b3247 0%,#141f2f 100%);border-color:rgba(255,148,102,.5);box-shadow:0 2px 5px rgba(0,0,0,.35),0 10px 22px -8px rgba(242,100,48,.4),inset 0 1px 0 rgba(255,255,255,.07),inset 0 -2px 4px rgba(0,0,0,.2)}\n#pxrPage .pxr-oh{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px}\n#pxrPage .pxr-oh-left{display:flex;flex-direction:column;gap:2px;min-width:0}\n#pxrPage .pxr-oh-idrow{display:flex;align-items:center;gap:6px;flex-wrap:wrap}\n#pxrPage .pxr-oh-label{font-size:10.5px;font-weight:700;color:#0B1220}\n#pxrPage .pxr-oh-meta{font-size:10.5px;font-weight:700;color:#0B1220;margin-top:3px}\n#pxrPage .pxr-oh-meta b{font-weight:600;color:#8794A8}\nhtml[data-theme=\"dark\"] #pxrPage .pxr-oh-label,html[data-theme=\"dark\"] #pxrPage .pxr-oh-meta{color:#F0F4FA}\n#pxrPage .pxr-oh-right{display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0}\n#pxrPage .pxr-oh-date{font-size:10.5px;font-weight:600;color:#8794A8}\n#pxrPage .pxr-rqid,#pxrPage .pxr-pxid{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:11px;color:#F26430;background:rgba(242,100,48,.12);border:1px solid rgba(242,100,48,.38);border-radius:6px;padding:3px 8px;letter-spacing:.3px;line-height:1;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;white-space:nowrap}\n#pxrPage .pxr-pxid{border-style:dashed}\nhtml[data-theme=\"dark\"] #pxrPage .pxr-rqid,html[data-theme=\"dark\"] #pxrPage .pxr-pxid{background:rgba(242,100,48,.18);border-color:rgba(255,148,102,.5);color:#FF9466}\n#pxrPage .pxr-status{font-size:10.5px;font-weight:800;letter-spacing:.2px;padding:2px 7px;border-radius:7px;white-space:nowrap;border:1.5px solid rgba(242,100,48,.4);background:rgba(242,100,48,.10);color:#F26430}\nhtml[data-theme=\"dark\"] #pxrPage .pxr-status{color:#FF9466}\n#pxrPage .pxr-status.pxr-s-ok{background:rgba(10,155,114,.10);color:#0A9B72;border-color:rgba(10,155,114,.4)}\n#pxrPage .pxr-status.pxr-s-bad{background:rgba(217,83,83,.10);color:#d95353;border-color:rgba(217,83,83,.4)}\n#pxrPage .pxr-src{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:5px;flex-shrink:0;color:#fff;font:800 10px 'Plus Jakarta Sans',sans-serif}\n#pxrPage .pxr-src svg{width:11px;height:11px}\nhtml[data-theme=\"light\"] #pxrPage{--bg:#F4F7FB;--surface:#fff;--surface2:#F3F6FB;--line:rgba(0,0,0,.08);--t1:#001f3c;--t2:#64748B;--t3:#94a3b8;--or-t:#E15A26;--or-bd:rgba(242,100,48,.38);--or-bg:rgba(242,100,48,.08)}\n#pxrPage *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\n#pxrPage{position:absolute;inset:0;overflow:hidden;margin:0;background:var(--bg);color:var(--t1);font-family:'DM Sans',system-ui,sans-serif}\n#pxrPage .pxr-app{display:flex;flex-direction:column;height:100%;max-width:520px;margin:0 auto}\n#pxrPage header{display:flex;align-items:center;gap:12px;padding:calc(env(safe-area-inset-top,0px) + 10px) 14px 10px;border-bottom:1px solid var(--line);background:var(--surface)}\n#pxrPage .pxr-back{width:34px;height:34px;border-radius:10px;border:1px solid var(--line);background:var(--surface2);color:var(--t1);display:flex;align-items:center;justify-content:center;cursor:pointer}\n#pxrPage .pxr-back svg{width:17px;height:17px}\n#pxrPage h1{margin:0;font:800 16px 'Plus Jakarta Sans',sans-serif}\n#pxrPage main{flex:1;overflow-y:auto;padding:12px 14px calc(env(safe-area-inset-bottom,0px) + 22px);display:flex;flex-direction:column;gap:13px}\n#pxrPage .pxr-label{display:flex;align-items:center;gap:6px;font:800 11px 'Plus Jakarta Sans',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--or-t);margin:0 0 7px}\n#pxrPage .pxr-label svg{width:13px;height:13px;flex-shrink:0}\n#pxrPage .pxr-idrow{display:flex;align-items:center;gap:7px;min-width:0;flex-wrap:wrap}\n#pxrPage .pxr-pxid{border:1.5px dashed var(--or-bd)}\n#pxrPage .pxr-pitem{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--line);color:inherit;text-decoration:none}\n#pxrPage .pxr-pitem:first-child{padding-top:0}\n#pxrPage .pxr-pitem:last-of-type{border-bottom:none;padding-bottom:2px}\n#pxrPage a.pxr-pitem:active{opacity:.7}\n#pxrPage .pxr-pbody{min-width:0;flex:1}\n#pxrPage .pxr-pname{font:700 13.5px/1.3 'Plus Jakarta Sans',sans-serif;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}\n#pxrPage .pxr-pgo{display:inline-block;vertical-align:-2px;margin-left:5px;width:13px;height:13px;color:var(--or-t)}\n#pxrPage .pxr-pgo svg{width:13px;height:13px;display:block}\n#pxrPage .pxr-aimark{display:inline-block;vertical-align:-2px;margin-left:5px;width:13px;height:13px;color:#F4A922}\n#pxrPage .pxr-aimark svg{width:13px;height:13px;display:block}\n#pxrPage .pxr-pmeta{margin-top:3px;font-size:12px;font-weight:600;color:var(--t2)}\n#pxrPage .pxr-pmeta b{color:var(--t1);font-weight:800}\n#pxrPage .pxr-ptotal{font:800 13.5px 'Plus Jakarta Sans',sans-serif;color:var(--t1);white-space:nowrap;padding-top:1px}\n#pxrPage .pxr-pnone{font:700 12px 'Plus Jakarta Sans',sans-serif;color:var(--t3)}\n#pxrPage .pxr-psub{display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:9px;border-top:1px solid var(--line);font-size:12.5px;font-weight:700;color:var(--t1)}\n#pxrPage .pxr-psub strong{font:800 13.5px 'Plus Jakarta Sans',sans-serif;color:var(--t1)}\n#pxrPage .pxr-note{position:relative;overflow:hidden;padding:11px 12px 11px 16px;font-size:13px;font-weight:600;line-height:1.5;white-space:pre-wrap;word-break:break-word}\n#pxrPage .pxr-note::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--or)}\n#pxrPage .pxr-warn{font-size:12px;font-weight:600;color:var(--red);line-height:1.45}\n#pxrPage .pxr-sum{display:flex;justify-content:space-between;font-size:12.5px;font-weight:600;color:var(--t1);padding:3.5px 0}\n#pxrPage .pxr-sum strong{color:var(--t1);font-weight:700}\n#pxrPage .pxr-div{border-top:1px solid var(--line);margin:7px 0}\n#pxrPage .pxr-final{display:flex;justify-content:space-between;align-items:center;margin:2px 0 8px;padding:8px 10px;border-radius:10px;background:var(--or-bg);border:1px solid var(--or-bd);font-size:12.5px;font-weight:700;color:var(--or-t)}\n#pxrPage .pxr-final strong{font:800 14px 'Plus Jakarta Sans',sans-serif}\n#pxrPage .pxr-tot{display:flex;justify-content:space-between;align-items:center}\n#pxrPage .pxr-tot b{font:700 12.5px 'DM Sans',sans-serif;color:var(--t1)}\n#pxrPage .pxr-tot2{margin-top:8px}\n#pxrPage .pxr-totval{display:inline-flex;align-items:center;gap:8px}\n#pxrPage .pxr-totnum{font:800 14px 'Plus Jakarta Sans',sans-serif;color:var(--t1)}\n#pxrPage .pxr-tot.pxr-main .pxr-totnum{font-size:15px;color:var(--or-t)}\n#pxrPage .pxr-copybtn{position:relative;width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--or-t);background:var(--or-bg);border:1px solid var(--or-bd);cursor:pointer;padding:0}\n#pxrPage .pxr-copybtn::before{content:'';position:absolute;inset:-9px -7px}\n#pxrPage .pxr-copybtn:active{transform:scale(.92);opacity:.7}\n#pxrPage .pxr-copybtn svg{width:13px;height:13px}\n#pxrPage .pxr-copybtn .pxr-idle,#pxrPage .pxr-copybtn .pxr-done{display:inline-flex}\n#pxrPage .pxr-copybtn .pxr-done{display:none}\n#pxrPage .pxr-copybtn.pxr-copied{color:#7cf0c2;background:rgba(47,216,138,.14);border-color:rgba(47,216,138,.4)}\n#pxrPage .pxr-copybtn.pxr-copied .pxr-idle{display:none !important}\n#pxrPage .pxr-copybtn.pxr-copied .pxr-done{display:inline-flex !important}\n#pxrPage .pxr-state{margin:auto;text-align:center;color:var(--t2);font-weight:600;padding:40px 20px}\n#pxrPage .pxr-toast.pxr-ok{background:#162130;border-color:rgba(255,255,255,.14);color:#fff}\n#pxrPage .pxr-toast{position:fixed;left:16px;right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 20px);background:#2a0d0d;border:1px solid var(--red);color:#ffb4b4;border-radius:12px;padding:12px 14px;font-size:13px;font-weight:600;display:none;z-index:5}";
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
  var address=c?([c.address_text,c.district].filter(Boolean).join(', ')||c._addr||''):'';
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
  function LI(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';}
  var L_USER=LI('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>');
  var L_REQ=LI('<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 13h6M9 17h4"/>');
  var L_TAG=LI('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.2"/>');
  var L_NOTE=LI('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>');
  var L_CALC=LI('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8"/>');
  var stCls=/^(paid|purchasing|ordered|shipped_intl|arrived_bd|delivered)$/.test(row.status)?' pxr-s-ok':(/^(rejected|cancelled|expired)$/.test(row.status)?' pxr-s-bad':'');
  var h='';
  h+='<section><div class="pxr-label">'+L_USER+'Customer Info</div><div id="pxrCustCard"></div></section>';
  var chIco=(typeof window.channelIcon==='function')?window.channelIcon(chKey==='messenger'?'facebook':chKey):'<span class="pxr-src" style="background:'+ch.color+'">'+esc(ch.label.charAt(0))+'</span>';
  h+='<section><div class="pxr-label">'+L_REQ+'Request</div><div class="pxr-card pxr-oh">'
    +'<div class="pxr-oh-left"><div class="pxr-oh-idrow"><span class="pxr-oh-label">Request ID</span>'+(reqNo?'<span class="pxr-rqid">'+esc(reqNo)+'</span>':'')+chIco+(pxNo?'<span class="pxr-pxid">'+esc(pxNo)+'</span>':'')+'</div>'
    +'<div class="pxr-oh-meta">Submitted <b>'+esc(when(row.created_at))+'</b></div></div>'
    +'<div class="pxr-oh-right"><span class="pxr-status'+stCls+'">'+esc(status)+'</span><span class="pxr-oh-date">'+esc(when(row.updated_at||row.created_at))+'</span></div>'
    +'</div></section>';
  var SPARK='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.3 6.7L21 11l-6.7 2.3L12 20l-2.3-6.7L3 11l6.7-2.3z"/></svg>';
  var OUT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
  var rowsHtml=items.map(function(i){
    var u=safeUrl(i.url), tag=u?'a':'div';
    var qtyTxt=i.price?(i.qty+' × '+usd(i.price)):('Qty '+i.qty);
    var priceHtml=i.price?'<span class="pxr-ptotal">'+usd(i.price*i.qty)+'</span>':'<span class="pxr-pnone">No price</span>';
    return '<'+tag+' class="pxr-pitem"'+(u?' href="'+esc(u)+'" target="_blank" rel="noopener noreferrer" aria-label="Open '+esc(i.name)+' in a new tab"':'')+'>'
      +'<div class="pxr-pbody"><div class="pxr-pname">'+esc(i.name)+(i.ai?'<span class="pxr-aimark" role="img" aria-label="AI-filled" title="AI-filled">'+SPARK+'</span>':'')+(u?'<span class="pxr-pgo">'+OUT+'</span>':'')+'</div>'
      +'<div class="pxr-pmeta"><b>'+esc(i.store||'Store not detected')+'</b> · '+qtyTxt+'</div></div>'+priceHtml+'</'+tag+'>';
  }).join('');
  h+='<section><div class="pxr-label">'+L_TAG+'Requested Products ('+items.length+')</div><div class="pxr-card">'+rowsHtml
    +'<div class="pxr-psub"><span>Items subtotal</span><strong>'+usd(productUsd)+'</strong></div></div></section>';
  if(snap.notes) h+='<section><div class="pxr-label">'+L_NOTE+'Customer Notes</div><div class="pxr-card pxr-note">'+esc(snap.notes)+'</div></section>';
  h+='<section><div class="pxr-label">'+L_CALC+'Cost Estimate</div><div class="pxr-card">'
    +(est?'<div class="pxr-sum"><span>Product cost</span><strong>'+usd(productUsd)+'</strong></div>'
      +'<div class="pxr-sum"><span>US Sales Tax ('+est.taxPct+'%)</span><strong>'+usd(est.tax)+'</strong></div>'
      +'<div class="pxr-sum"><span>Service Charge ('+est.svcPct+'%)</span><strong>'+usd(est.svc)+'</strong></div>'
      +'<div class="pxr-sum"><span>Rate</span><strong>1 USD = ৳'+est.rate+'</strong></div><div class="pxr-div"></div>'
      +(row.quote_total!=null?'<div class="pxr-final"><span>Final price sent</span><strong>'+bdt(row.quote_total)+'</strong></div>':'')
      +'<div class="pxr-tot pxr-main"><b>Total (BDT)</b><span class="pxr-totval"><span class="pxr-totnum">'+bdt(est.bdt)+'</span><button type="button" class="pxr-copybtn" data-copy="'+bdt(est.bdt)+'" aria-label="Copy total"><span class="pxr-idle">'+ICON_COPY+'</span><span class="pxr-done">'+ICON_CHECK+'</span></button></span></div>'
      +'<div class="pxr-tot pxr-tot2"><b>Total (USD)</b><span class="pxr-totval"><span class="pxr-totnum">'+usd(est.total)+'</span><button type="button" class="pxr-copybtn" data-copy="'+usd(est.total)+'" aria-label="Copy total"><span class="pxr-idle">'+ICON_COPY+'</span><span class="pxr-done">'+ICON_CHECK+'</span></button></span></div>'
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
  var f=window.sbFetch||(typeof sbFetch==='function'?sbFetch:null); if(!f) throw new Error('no client');
  var res=await Promise.all([
    f('proxy_requests?select=*,customers(full_name,phone,email,customer_code,avatar_url,address_text,district,created_at),orders(order_number)&id=eq.'+encodeURIComponent(id)),
    f('site_content?select=content&page=eq.buy_for_me&section=eq.fees').catch(function(){return null;})
  ]);
  var row=res[0]&&res[0][0];
  if(!row) return null;
  if(row.customer_id&&row.customers){
    try{
      var ct=await f('rpc/admin_customer_contact','POST',{p_customer_id:row.customer_id});
      ct=Array.isArray(ct)?ct[0]:ct;
      if(ct){ row.customers.phone=row.customers.phone||ct.phone||''; row.customers._addr=ct.address||''; }
    }catch(e){ /* card falls back to the customer's own fields */ }
  }
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
