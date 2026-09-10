
/* v25 polish: migration, transaction audit, no fake fantasy schedule, mobile-safe error/update banner */
function dccMigrateLegacy(){
 if(localStorage.getItem(STORAGE_KEY))return false;
 const keys=["dcc_v24_mobile_state","dcc_v23_state","dcc_v22_state","dcc_v21_intel","dcc_v20_state","dcc_v19_state"];
 for(const k of keys){try{const raw=localStorage.getItem(k);if(raw){const st=JSON.parse(raw);if(st&&Array.isArray(st.teams)){applyState(st);leagueConfig=dccNormalizeConfig(st.leagueConfig||{});saveState();showToast("v25 upgraded your saved league data");return true}}}catch(e){}}
 return false;
}
function dccEnhanceTransactionLog(){
 const oldExecute=window.executeTrade;
 if(typeof oldExecute==="function"&&!oldExecute.__v25wrapped){
  window.executeTrade=function(){const a=teams[tradeTeamAIdx],b=teams[tradeTeamBIdx],ga=a?.roster?.filter(p=>tradeSelA.has(p.name)).map(p=>p.name)||[],gb=b?.roster?.filter(p=>tradeSelB.has(p.name)).map(p=>p.name)||[];oldExecute.apply(this,arguments);if(ga.length&&gb.length){activityLog.unshift({id:Date.now()+Math.random(),timestamp:Date.now(),type:"TRADE",team:`${a.name} ⇄ ${b.name}`,teamIdx:tradeTeamAIdx,player:ga.join(", "),details:`${a.name} sent ${ga.join(", ")} · ${b.name} sent ${gb.join(", ")}`});activityLog=activityLog.slice(0,500);saveState();if(typeof renderLeagueActivity==="function")renderLeagueActivity()}};window.executeTrade.__v25wrapped=true;
 }
}
function dccUpdateBanner(){
 if(document.getElementById("dccUpdateBanner"))return;const b=document.createElement("div");b.id="dccUpdateBanner";b.style.cssText="display:none;position:fixed;left:10px;right:10px;bottom:12px;z-index:999;background:#111b2e;border:1px solid rgba(93,224,183,.35);border-radius:12px;padding:10px;box-shadow:0 10px 40px rgba(0,0,0,.35);font-size:10px;align-items:center;justify-content:space-between;gap:8px";b.innerHTML='<span><b>Draft Command Center updated.</b> Reload to use the newest version.</span><button class="primary btnsm" id="dccReload">RELOAD</button>';document.body.appendChild(b);document.getElementById("dccReload").onclick=()=>location.reload();
 if("serviceWorker" in navigator)navigator.serviceWorker.addEventListener("message",e=>{if(e.data?.type==="DCC_UPDATE")b.style.display="flex"});
}
const _v25BaseRender=window.render;
window.render=function(){try{_v25BaseRender?.apply(this,arguments)}catch(e){console.warn("base render error",e)}try{renderManager();renderRosters();renderPlanner();renderMatchup();renderLeagueAnalyzer();renderSuggestedTrades();renderTierList();renderWaivers();dccRenderHealth();setTimeout(dccAddDetailButtons,0)}catch(e){console.warn("v25 render error",e)}};
function dccBoot(){
 const migrated=dccMigrateLegacy();dccLoadConfig();dccApplyConfigToRuntime();
 // Do not invent fantasy opponents. Round-robin seeding is available as an explicit draft tool only.
 dccEnhanceTransactionLog();dccUpdateBanner();dccRenderSettings();if(migrated)render();
 document.querySelectorAll('#nav button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.page==='settings')setTimeout(dccRenderSettings,0)}));
 if(!localStorage.getItem("dcc_v25_upgrade_ack")){localStorage.setItem("dcc_v25_upgrade_ack","1");saveState()}
}
setTimeout(dccBoot,120);
