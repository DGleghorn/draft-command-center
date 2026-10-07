// AI Market Terminal V0.8.2 — PGA Event Intelligence
const VERSION='dcc-ai-worker-v0.8.35-props-endpoint-recovery';
const MODEL='@cf/google/gemma-4-26b-a4b-it',PROMPT_VERSION='dcc-chief-analyst-cf-v6.2';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, X-DCC-Secret','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Max-Age':'86400','Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'};
const json=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:cors});
const clean=(s,n=500)=>String(s??'').replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').trim().slice(0,n);
function modelText(x){
 if(typeof x==='string')return x;
 // Cloudflare Workers AI synchronous text generation returns {response:string, usage:{...}}.
 if(typeof x?.response==='string')return x.response;
 // Defensive compatibility for wrapped REST/OpenAI-compatible response shapes.
 if(typeof x?.result?.response==='string')return x.result.response;
 if(typeof x?.choices?.[0]?.message?.content==='string')return x.choices[0].message.content;
 if(typeof x?.choices?.[0]?.text==='string')return x.choices[0].text;
 if(typeof x?.output_text==='string')return x.output_text;
 if(Array.isArray(x?.response))return x.response.map(y=>typeof y==='string'?y:(y?.text||y?.content||'')).join('\n');
 return '';
}
function responseShape(x){
 try{
  if(x==null)return 'null';
  if(typeof x!=='object')return typeof x;
  const keys=Object.keys(x).slice(0,12);
  const types=keys.map(k=>`${k}:${Array.isArray(x[k])?'array':typeof x[k]}`);
  return types.join(', ')||'object:no-enumerable-keys';
 }catch{return 'uninspectable'}
}
const pass=(id,why='No valid AI row returned.')=>({gameId:String(id),decision:'PASS',marketType:'spread',side:'home',confidence:0,fairLine:'',edge:'',reasons:[],risks:[why],explanation:'PASS — '+why,_fallback:true});
function finiteField(v){const n=Number(String(v??'').trim());return Number.isFinite(n)?n:null}
function marketLineFor(g,marketType,side){
 if(marketType==='spread'){const home=finiteField(g?.market?.spread);if(home==null)return null;return side==='home'?home:-home}
 if(marketType==='total')return finiteField(g?.market?.total);
 return null
}
function normalizeAnalyticalRow(row,g){
 if(row.decision==='PASS')return row;
 const fair=finiteField(row.fairLine),reportedEdge=finiteField(row.edge),marketLine=marketLineFor(g,row.marketType,row.side);
 if(fair==null||reportedEdge==null||marketLine==null)return {...row,decision:'PASS',confidence:0,fairLine:'',edge:'',reasons:[],risks:['Actionable row lacked a numeric fair line, edge, or market line.'],explanation:'PASS — actionable AI row failed deterministic fair-line validation.',_normalizedInvalid:true};
 let calculated;
 if(row.marketType==='spread')calculated=marketLine-fair;
 else if(row.side==='over')calculated=fair-marketLine;
 else calculated=marketLine-fair;
 if(!(calculated>0)||Math.abs(calculated-reportedEdge)>0.35)return {...row,decision:'PASS',confidence:0,fairLine:'',edge:'',reasons:[],risks:[`Actionable row failed edge math: market ${marketLine}, fair ${fair}, reported edge ${reportedEdge}.`],explanation:'PASS — deterministic verification rejected inconsistent fair-line/edge math.',_normalizedInvalid:true};
 return {...row,fairLine:String(fair),edge:String(Number(calculated.toFixed(2))),_edgeVerified:true}
}
function parseLineProtocol(raw,s){
 const games=new Map(s.games.map(g=>[String(g.id),g])),candidates=new Map();
 let text=String(raw??'').replace(/<think>[\s\S]*?<\/think>/gi,'').replace(/```[\s\S]*?```/g,m=>m.replace(/```(?:text|txt)?/gi,'').replace(/```/g,''));
 for(const original of text.split(/\r?\n/)){
  let line=original.trim().replace(/^[-*]\s*/,'').replace(/^\|/,'').replace(/\|$/,''); if(!line||!line.includes('|'))continue;
  const p=line.split('|').map(x=>x.trim()); if(p.length<5)continue;
  const id=String(p[0]).replace(/^GAME[_\s-]*/i,'').trim(); if(!games.has(id))continue;
  const decision=String(p[1]).toUpperCase(),market=String(p[2]).toUpperCase(),side=String(p[3]).toUpperCase();
  const confidence=Number(String(p[4]).replace(/[^0-9.]/g,''));
  if(!['BET','LEAN','PASS'].includes(decision)||!Number.isFinite(confidence))continue;
  const na=v=>['N/A','NA','NONE','-',''].includes(String(v??'').trim().toUpperCase());
  let marketType,normalizedSide;
  if(decision==='PASS'){
   if(confidence!==0)continue;
   if(!(na(market)||['SPREAD','TOTAL'].includes(market)))continue;
   marketType=market==='TOTAL'?'total':'spread';
   const allowed=marketType==='spread'?['HOME','AWAY']:['OVER','UNDER'];
   if(!(na(side)||allowed.includes(side)))continue;
   normalizedSide=allowed.includes(side)?side.toLowerCase():(marketType==='spread'?'home':'over');
  }else{
   if(!['SPREAD','TOTAL'].includes(market))continue;
   marketType=market.toLowerCase();
   const allowed=marketType==='spread'?['HOME','AWAY']:['OVER','UNDER'];
   let resolvedSide=side;
   if(marketType==='spread'&&!allowed.includes(resolvedSide)){
    const g=games.get(id),home=String(g?.home?.abbr||g?.home||'').toUpperCase(),away=String(g?.away?.abbr||g?.away||'').toUpperCase();
    if(resolvedSide===home)resolvedSide='HOME';else if(resolvedSide===away)resolvedSide='AWAY';
   }
   if(!allowed.includes(resolvedSide))continue;
   normalizedSide=resolvedSide.toLowerCase();
  }
  const normField=v=>na(v)?'':clean(v,80);
  let row={gameId:id,decision,marketType,side:normalizedSide,_fallback:false,confidence:decision==='PASS'?0:Math.max(0,Math.min(100,confidence)),fairLine:normField(p[5]),edge:normField(p[6]),reasons:normField(p[7])?[clean(p[7],150)]:[],risks:normField(p[8])?[normField(p[8])]:[],explanation:normField(p[9])||normField(p[7])||'The supplied market data does not establish an edge.'};
  row=normalizeAnalyticalRow(row,games.get(id));
  const rank={BET:3,LEAN:2,PASS:1},prev=candidates.get(id); if(!prev||rank[row.decision]>rank[prev.decision]||(rank[row.decision]===rank[prev.decision]&&row.confidence>prev.confidence))candidates.set(id,row);
 }
 return s.games.map(g=>candidates.get(String(g.id))||pass(g.id,'AI output row was missing or malformed.'));
}
function buildAnalysis(raw,s){
 const bets=parseLineProtocol(raw,s),usable=bets.filter(b=>!b._fallback).length;
 return{model:MODEL,provider:'Cloudflare Workers AI',promptVersion:PROMPT_VERSION,reviewedAt:new Date().toISOString(),
 slateSummary:`Workers AI line review completed; ${usable}/${s.games.length} rows parsed with a scored decision.`,
 audit:'DraftKings market verification remains deterministic in the dashboard.',
 challenge:'Exactly one normalized decision is retained per game; malformed or missing rows are forced to PASS.',sources:[],bets,validated:usable===s.games.length};
}

const PROP_MARKETS='player_pass_yds,player_pass_completions,player_rush_yds,player_rec_yds,player_receptions';
const PROP_MAP={player_pass_yds:'passing_yards',player_pass_completions:'completions',player_rush_yds:'rushing_yards',player_rec_yds:'receiving_yards',player_receptions:'receptions'};
const teamKey=x=>clean(x,100).toLowerCase().replace(/[^a-z0-9]/g,'');
const stablePlayerId=(name,team='')=>{let h=2166136261;for(const c of `${name}|${team}`.toLowerCase()){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return `name-${(h>>>0).toString(16)}`};
async function espnGameMap(season,week,sport='nfl'){
 const league=sport==='cfb'?'college-football':'nfl';
 const u=`https://site.api.espn.com/apis/site/v2/sports/football/${league}/scoreboard?dates=${encodeURIComponent(season)}&seasontype=2&week=${encodeURIComponent(week)}&limit=100`;
 const r=await fetch(u,{headers:{Accept:'application/json'}});if(!r.ok)throw new Error(`ESPN matchup map HTTP ${r.status}`);const d=await r.json(),out=[];
 for(const e of d.events||[]){const cs=e.competitions?.[0]?.competitors||[],h=cs.find(x=>x.homeAway==='home')?.team||{},a=cs.find(x=>x.homeAway==='away')?.team||{};out.push({id:String(e.id),home:[h.displayName,h.shortDisplayName,h.name,h.abbreviation].filter(Boolean).map(teamKey),away:[a.displayName,a.shortDisplayName,a.name,a.abbreviation].filter(Boolean).map(teamKey)})}return out;
}
function teamAliases(x){const s=teamKey(x);if(!s)return[];const aliases=new Set([s]);const map={washingtoncommanders:['washington','was'],greenbaypackers:['greenbay','gb'],tampabaybuccaneers:['tampabay','tb'],newenglandpatriots:['newengland','ne'],newyorkgiants:['newyorkgiants','nyg'],newyorkjets:['newyorkjets','nyj'],losangelesrams:['losangelesrams','la','lar'],losangeleschargers:['losangeleschargers','lac'],lasvegasraiders:['lasvegas','lv'],sanfrancisco49ers:['sanfrancisco','sf'],kansascitychiefs:['kansascity','kc'],neworleanssaints:['neworleans','no']};for(const a of map[s]||[])aliases.add(a);return [...aliases]}
function matchEspnGame(row,games){const hs=teamAliases(row.home_team),as=teamAliases(row.away_team);if(!hs.length||!as.length)return null;return games.find(g=>hs.some(h=>g.home.includes(h))&&as.some(a=>g.away.includes(a)))||null}
function propIso(row){const v=row.snapshot_time??row.last_update??row.updated_at??row.timestamp;if(v==null)return null;const n=Number(v),raw=Number.isFinite(n)?(n<1e12?n*1000:n):v,d=new Date(raw);return Number.isNaN(d.getTime())?null:d.toISOString()}
async function providerJSON(env,path,params={}){
 const u=new URL(`https://parlay-api.com${path}`);for(const [k,v] of Object.entries(params))if(v!==undefined&&v!==null&&String(v)!=='')u.searchParams.set(k,String(v));
 let r;try{r=await fetch(u,{headers:{'X-API-Key':env.PROP_API_KEY,Accept:'application/json'}})}catch(e){return{ok:false,stage:'provider_fetch',status:502,error:`Provider network failure: ${clean(e?.message||e,160)}`}}
 const headers={hasMore:String(r.headers.get('x-result-has-more')||'').toLowerCase()==='true',nextOffset:r.headers.get('x-next-offset'),providerState:clean(r.headers.get('x-provider-state')||'',1800),marketsServed:clean(r.headers.get('x-markets-served')||'',800),marketsUnservable:clean(r.headers.get('x-markets-unservable')||'',800)};
 if(!r.ok){let body=null,providerRequestId=null;try{body=await r.json();providerRequestId=clean(body?.request_id||body?.requestId||'',80)}catch{}return{ok:false,stage:'provider_http',status:r.status,providerRequestId,error:`Provider HTTP ${r.status}`,headers,body}}
 let data;try{data=await r.json()}catch{return{ok:false,stage:'provider_parse',status:r.status,error:'Provider returned invalid JSON',headers}}
 return{ok:true,status:r.status,data,headers}
}
function discoveredMarkets(data){const src=Array.isArray(data)?data:Array.isArray(data?.markets)?data.markets:Array.isArray(data?.results)?data.results:[];return [...new Set(src.map(x=>typeof x==='string'?x:(x?.market_key||x?.key||x?.market)).filter(Boolean).map(String))]}
async function discoverPropCoverage(env,providerSport){
 const [m,c]=await Promise.all([providerJSON(env,`/v1/sports/${providerSport}/props/markets`),providerJSON(env,`/v1/sports/${providerSport}/props/coverage`)]);
 const markets=m.ok?discoveredMarkets(m.data):[];
 return{markets,marketsOk:m.ok,marketsStatus:m.status||null,coverageOk:c.ok,coverageStatus:c.status||null,coverage:c.ok?c.data:null,providerState:m.headers?.providerState||c.headers?.providerState||'',errors:[m,c].filter(x=>!x.ok).map(x=>({stage:x.stage,status:x.status||null,error:x.error}))}
}
async function providerPropRequest(env,providerSport,markets){
 const raw=[],pages=[];let offset=0,guard=0,providerState='';
 while(guard++<12){
  const r=await providerJSON(env,`/v1/sports/${providerSport}/props`,{bookmakers:'draftkings',markets:markets.join(','),maxAgeSec:900,offset});
  if(!r.ok)return r;
  if(!Array.isArray(r.data))return{ok:false,stage:'provider_shape',status:r.status,error:'Provider returned an unexpected response shape',headers:r.headers};
  raw.push(...r.data);providerState=r.headers?.providerState||providerState;pages.push({offset,count:r.data.length,hasMore:!!r.headers?.hasMore,nextOffset:r.headers?.nextOffset||null});
  if(!r.headers?.hasMore)break;
  const next=Number(r.headers.nextOffset);if(!Number.isFinite(next)||next<=offset)return{ok:false,stage:'provider_pagination',status:502,error:'Provider pagination did not advance.',headers:r.headers};offset=next;
 }
 if(guard>12)return{ok:false,stage:'provider_pagination',status:502,error:'Provider pagination exceeded the safety limit.'};
 return{ok:true,raw,pages,providerState}
}
async function parlayFootballProps(reqUrl,env,sport='nfl'){
 if(!env.PROP_API_KEY)return json({ok:false,sport,stage:'binding',error:'PROP_API_KEY secret is not configured in Cloudflare.',props:[]},503);
 const season=reqUrl.searchParams.get('season')||new Date().getFullYear(),week=reqUrl.searchParams.get('week')||'';
 const providerSport=sport==='cfb'?'americanfootball_ncaaf':'americanfootball_nfl',configured=PROP_MARKETS.split(','),discovery=await discoverPropCoverage(env,providerSport);
 // Discovery is advisory: if it succeeds, never ask the paid props endpoint for a market the provider says is absent.
 const markets=discovery.marketsOk?configured.filter(x=>discovery.markets.includes(x)):configured;
 if(discovery.marketsOk&&!markets.length)return json({ok:true,sport,source:'DraftKings via ParlayAPI',fetchedAt:new Date().toISOString(),providerRows:0,matchedProps:0,rejected:{},diagnostics:{stage:'no_supported_markets',providerSport,configuredMarkets:configured,availableMarkets:discovery.markets,discovery},props:[]});
 let attempt=await providerPropRequest(env,providerSport,markets),raw=[],recovery={used:false,successfulMarkets:[],failedMarkets:[]},pages=[];
 if(!attempt.ok&&attempt.stage==='provider_http'&&attempt.status>=500){
  recovery.used=true;
  for(const market of markets){const one=await providerPropRequest(env,providerSport,[market]);if(one.ok){raw.push(...one.raw);pages.push(...(one.pages||[]).map(x=>({...x,market})));recovery.successfulMarkets.push(market)}else recovery.failedMarkets.push({market,stage:one.stage,status:one.status||null,providerRequestId:one.providerRequestId||null})}
  if(!recovery.successfulMarkets.length)return json({ok:false,sport,stage:'provider_http',providerSport,providerStatus:attempt.status,requestedMarkets:markets,recovery,discovery,error:'Prop provider failed for the bundled request and every individual market request.',props:[]},502);
 }else if(!attempt.ok)return json({ok:false,sport,stage:attempt.stage,providerSport,providerStatus:attempt.status||null,providerRequestId:attempt.providerRequestId||null,requestedMarkets:markets,discovery,error:attempt.error,props:[]},502);
 else{raw=attempt.raw;pages=attempt.pages||[]}
 const seen=new Set();raw=raw.filter(x=>{const k=[x.event_id,x.canonical_event_id,x.market_key,x.player,x.player_name,x.line,x.bookmaker,x.period].join('|');if(seen.has(k))return false;seen.add(k);return true});
 let games=[],gameMapError=null;if(week){try{games=await espnGameMap(season,week,sport)}catch(e){gameMapError=clean(e?.message||e,300)}}
 const props=[],marketRows={};for(const x of raw){const k=String(x.market_key||'unknown');marketRows[k]=(marketRows[k]||0)+1}
 const rejected={book:0,period:0,market:0,game:0,playerLine:0,freshness:0,price:0};
 for(const x of raw){
  if(String(x.bookmaker||'').toLowerCase()!=='draftkings'){rejected.book++;continue}
  if(String(x.period||'FULL').toUpperCase()!=='FULL'){rejected.period++;continue}
  const market=PROP_MAP[String(x.market_key||'')];if(!market){rejected.market++;continue}
  const game=games.length?matchEspnGame(x,games):null;if(!game){rejected.game++;continue}
  const player=clean(x.player||x.player_name,100),line=Number(x.line);if(!player||!Number.isFinite(line)){rejected.playerLine++;continue}
  const updatedAt=propIso(x);if(!updatedAt){rejected.freshness++;continue}
  const age=Number(x.age_seconds);if(Number.isFinite(age)&&age>900){rejected.freshness++;continue}
  const base={gameId:game.id,playerId:stablePlayerId(player,x.team||''),player,team:clean(x.team||'',40),market,line,book:'DraftKings',status:'active',updatedAt,providerEventId:clean(x.canonical_event_id||x.event_id,80)};
  let added=0;const over=Number(x.over_price),under=Number(x.under_price);
  if(Number.isFinite(over)){props.push({...base,side:'OVER',price:over});added++}
  if(Number.isFinite(under)){props.push({...base,side:'UNDER',price:under});added++}
  if(!added)rejected.price++;
 }
 const accepted={receiving:props.filter(x=>x.market==='receiving_yards'||x.market==='receptions').length,rushing:props.filter(x=>x.market==='rushing_yards').length,passing:props.filter(x=>x.market==='passing_yards'||x.market==='completions').length};
 const stage=gameMapError?'game_map_degraded':recovery.used?'provider_recovered':raw.length?'healthy':'no_draftkings_rows';
 return json({ok:true,sport,source:'DraftKings via ParlayAPI',fetchedAt:new Date().toISOString(),providerRows:raw.length,matchedProps:props.length,rejected,diagnostics:{stage,gameMapError,providerSport,configuredMarkets:configured,requestedMarkets:markets,availableMarkets:discovery.markets,discovery:{marketsOk:discovery.marketsOk,marketsStatus:discovery.marketsStatus,coverageOk:discovery.coverageOk,coverageStatus:discovery.coverageStatus,errors:discovery.errors},recovery,pages,providerMarketRows:marketRows,acceptedSelections:accepted,providerState:clean(attempt.providerState||discovery.providerState||'',1800)},props});
}

const SGO_MARKET_MAP={passing_yards:'passing_yards',passing_completions:'completions',rushing_yards:'rushing_yards',receiving_yards:'receiving_yards',receiving_receptions:'receptions'};
function sgoPlayerName(odd,event){const id=String(odd?.statEntityID||''),ep=event?.players?.[id]||{};const full=[ep.firstName||ep?.names?.firstName,ep.lastName||ep?.names?.lastName].filter(Boolean).join(' '),candidates=[odd?.statEntity?.name,odd?.statEntity?.displayName,odd?.playerName,odd?.player?.name,ep.name,ep.displayName,ep?.names?.display,full];return clean(candidates.find(Boolean)||'',100)}
function sgoTeamName(side,event){const t=event?.teams?.[side]||event?.[`${side}Team`]||{};return clean(t?.names?.long||t?.names?.medium||t?.names?.short||t?.name||t?.displayName||t?.teamName||(typeof t==='string'?t:''),100)}
async function sportsGameOddsProps(reqUrl,env,sport='nfl'){
 if(!env.SGO_API_KEY)return{ok:false,configured:false,stage:'fallback_not_configured',status:503,error:'SportsGameOdds fallback secret is not configured.',props:[]};
 const league=sport==='cfb'?'NCAAF':'NFL',u=new URL('https://api.sportsgameodds.com/v2/events');
 u.searchParams.set('leagueID',league);u.searchParams.set('oddsAvailable','true');u.searchParams.set('bookmakerID','draftkings');u.searchParams.set('includeOpposingOdds','true');u.searchParams.set('includeAltLines','false');u.searchParams.set('limit',sport==='cfb'?'100':'32');
 let r;try{r=await fetch(u,{headers:{'x-api-key':String(env.SGO_API_KEY).trim(),Accept:'application/json'}})}catch(e){return{ok:false,configured:true,stage:'fallback_fetch',status:502,error:clean(e?.message||e,200),props:[]}}
 if(!r.ok)return{ok:false,configured:true,stage:'fallback_http',status:r.status,error:`SportsGameOdds HTTP ${r.status}`,props:[]};
 let d;try{d=await r.json()}catch{return{ok:false,configured:true,stage:'fallback_parse',status:r.status,error:'SportsGameOdds returned invalid JSON.',props:[]}}
 const events=Array.isArray(d)?d:Array.isArray(d?.data)?d.data:Array.isArray(d?.events)?d.events:[];let games=[],gameMapError=null;const season=reqUrl.searchParams.get('season')||new Date().getFullYear(),week=reqUrl.searchParams.get('week')||'';
 if(week){try{games=await espnGameMap(season,week,sport)}catch(e){gameMapError=clean(e?.message||e,300)}}
 const props=[],rejected={period:0,market:0,game:0,player:0,book:0,price:0};
 for(const event of events){const home=sgoTeamName('home',event),away=sgoTeamName('away',event),game=games.length?matchEspnGame({home_team:home,away_team:away},games):null;if(!game){rejected.game++;continue}
  const odds=event?.odds&&typeof event.odds==='object'?Object.values(event.odds):[];
  for(const odd of odds){if(String(odd?.periodID||'game').toLowerCase()!=='game'){rejected.period++;continue}const market=SGO_MARKET_MAP[String(odd?.statID||'').toLowerCase()];if(!market){rejected.market++;continue}const entity=String(odd?.statEntityID||'');if(!entity||['all','home','away'].includes(entity.toLowerCase())){rejected.player++;continue}const player=sgoPlayerName(odd,event);if(!player){rejected.player++;continue}
   const dk=odd?.byBookmaker?.draftkings||odd?.byBookmaker?.DraftKings;if(!dk||dk.available===false){rejected.book++;continue}const side=String(odd?.sideID||'').toUpperCase();if(!['OVER','UNDER'].includes(side)){rejected.market++;continue}const line=Number(dk.overUnder??dk.spread??odd.bookOverUnder??odd.bookSpread),price=Number(dk.odds??odd.bookOdds),updatedAt=dk.lastUpdatedAt||odd.lastUpdatedAt||null,ts=updatedAt?new Date(updatedAt).getTime():NaN;if(!Number.isFinite(line)||!Number.isFinite(price)){rejected.price++;continue}if(!updatedAt||!Number.isFinite(ts)||Date.now()-ts>15*60*1000||ts>Date.now()+60000){rejected.price++;continue}props.push({gameId:game.id,playerId:entity,player,team:'',market,line,book:'DraftKings',status:'active',updatedAt,providerEventId:clean(event?.eventID||'',80),side,price})
  }
 }
 return{ok:true,configured:true,stage:props.length?'fallback_healthy':'fallback_no_rows',status:200,source:'DraftKings via SportsGameOdds',providerRows:events.length,props,rejected,diagnostics:{stage:props.length?'fallback_healthy':'fallback_no_rows',provider:'SportsGameOdds',league,eventCount:events.length,matchedProps:props.length,gameMapError}};
}
async function resilientFootballProps(reqUrl,env,sport='nfl'){
 const primary=await parlayFootballProps(reqUrl,env,sport),primaryBody=await primary.clone().json().catch(()=>({}));
 if(primary.ok&&Array.isArray(primaryBody.props)&&primaryBody.props.length)return primary;
 const primaryFailed=!primary.ok||['provider_http','provider_fetch','provider_parse','provider_shape','provider_pagination'].includes(primaryBody.stage);
 const primaryEmpty=primary.ok&&Array.isArray(primaryBody.props)&&primaryBody.props.length===0;
 if(primaryFailed||primaryEmpty){const fb=await sportsGameOddsProps(reqUrl,env,sport);if(fb.ok&&fb.props.length)return json({ok:true,sport,source:fb.source,fetchedAt:new Date().toISOString(),providerRows:fb.providerRows,matchedProps:fb.props.length,rejected:fb.rejected,diagnostics:{stage:'fallback_active',activeProvider:'SportsGameOdds',primaryProvider:'ParlayAPI',primary:{ok:primary.ok,stage:primaryBody.stage||primaryBody?.diagnostics?.stage||null,status:primaryBody.providerStatus||primary.status,error:primaryBody.error||null},fallback:fb.diagnostics},props:fb.props});
  if(primaryFailed)return json({...primaryBody,ok:false,sport,diagnostics:{...(primaryBody.diagnostics||{}),stage:primaryBody.stage||'primary_failed',activeProvider:null,primaryProvider:'ParlayAPI',fallbackProvider:'SportsGameOdds',fallback:{configured:fb.configured,stage:fb.stage,status:fb.status||null,error:fb.error||null}}},502);
 }
 return primary;
}
export default{async fetch(req,env){const id=crypto.randomUUID().slice(0,8),url=new URL(req.url);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method==='GET'&&url.pathname==='/binding-check')return json({ok:true,version:VERSION,environment:'production-runtime',bindings:{AI:!!env.AI,PROP_API_KEY:typeof env.PROP_API_KEY==='string'&&env.PROP_API_KEY.length>0,SGO_API_KEY:typeof env.SGO_API_KEY==='string'&&env.SGO_API_KEY.length>0,AI_SHARED_SECRET:typeof env.AI_SHARED_SECRET==='string'&&env.AI_SHARED_SECRET.length>0},note:'Boolean presence only; secret values are never returned.'});
 if(req.method==='GET'&&(url.pathname==='/nfl-props'||url.pathname==='/cfb-props')){const propSport=url.pathname==='/cfb-props'?'cfb':'nfl';try{return await resilientFootballProps(url,env,propSport)}catch(e){return json({ok:false,sport:propSport,stage:'worker_unhandled',error:clean(e?.message||e,500),props:[]},502)}}
 if(env.AI_SHARED_SECRET&&(req.headers.get('X-DCC-Secret')||'')!==env.AI_SHARED_SECRET)return json({error:'Unauthorized',stage:'auth',requestId:id},401);
 if(req.method==='GET'){
  if(url.searchParams.get('diagnostic')==='1'){if(!env.AI)return json({ok:false,version:VERSION,stage:'binding',requestId:id,message:'Workers AI binding AI is missing.'},500);try{const t=Date.now(),r=await env.AI.run(MODEL,{messages:[{role:'user',content:'Reply with exactly OK.'}],max_tokens:8,temperature:0});return json({ok:true,version:VERSION,provider:'Cloudflare Workers AI',model:MODEL,stage:'inference',inferenceMs:Date.now()-t,requestId:id,message:'Zero-cost Workers AI connectivity test passed.',sample:clean(modelText(r),80),responseShape:responseShape(r)})}catch(e){return json({ok:false,version:VERSION,stage:'inference',requestId:id,message:clean(e?.message||e,500),zeroCost:true,paidFallback:false},503)}}
  return json({ok:true,version:VERSION,provider:'Cloudflare Workers AI',model:MODEL,aiBindingConfigured:!!env.AI,contract:'one-row-per-game-v3',zeroCost:true,paidFallback:false});
 }
 if(req.method!=='POST')return json({error:'POST only',stage:'routing',requestId:id},405);
 let b;try{b=JSON.parse(await req.text())}catch{return json({error:'Invalid JSON',stage:'request',requestId:id},400)}
 if(b?.action==='post_probe')return json({ok:true,stage:'post_reached',requestId:id,version:VERSION,message:'Browser POST route reached Worker.'});
 if(!env.AI)return json({error:'Workers AI binding missing',stage:'binding',requestId:id},500);
 const s=b?.snapshot;if(!s?.games?.length)return json({error:'Snapshot is missing games',stage:'request',requestId:id},400);
 if(s.games.length>4)return json({error:'Batch too large',stage:'request',requestId:id,message:'AI stabilization contract accepts at most 4 games per batch.'},413);
 const sport=String(s.sport||'nfl').toLowerCase()==='cfb'?'cfb':'nfl';const compact={sport,season:s.season,week:s.week,games:s.games.map(g=>({id:String(g.id),away:g.away,home:g.home,market:g.market,opening:g.opening,consensus:g.consensus,movement:g.movement||null,teamContext:g.teamContext||null,contextMeta:g.contextMeta||null,quantFair:g.quantFair||null}))};
 const system=`You are a conservative ${sport==='cfb'?'college football':'NFL'} market second-opinion analyst. Use ONLY the supplied snapshot. DraftKings is the only actionable sportsbook. Spreads and totals only.
Never claim or infer injuries, weather, projections, matchup facts, opening-line movement, sources, or prices not explicitly supplied.
You MAY use teamContext when supplied. It contains descriptive results from up to three PRIOR completed regular-season weeks: games, record, average points for/against, average scoring margin, and rest days. Treat it as a small-sample descriptive signal, not a projection or proof of team quality. A supplied quantFair is deterministic context only; challenge it rather than copying it, and never label BET when your own fair line shows zero or negative edge. For college football, describe reasons in plain football terms (recent scoring, scoring margin, rest, or market context) rather than using internal labels such as QuantFair.
You MAY use movement only when it is non-null and derived from prior local DraftKings snapshots. Null movement or null opening means unavailable, not zero.
A null opening value means opening data is unavailable. Current market equal to consensus is not evidence of an edge by itself. A BET should require multiple supplied signals that coherently support the same side; otherwise prefer LEAN or PASS.
PASS freely. If supplied fields do not establish a defensible edge, PASS and state that the supplied market data does not establish an edge.
OUTPUT CONTRACT: Return exactly ONE line for EACH supplied GAME_ID and nothing else. Never return both SPREAD and TOTAL for the same game. Choose the single strongest SPREAD or TOTAL angle, or PASS.
GAME_ID | DECISION | MARKET | SIDE | CONFIDENCE | FAIR_LINE | EDGE | REASON | RISK | EXPLANATION
DECISION: BET, LEAN, PASS. MARKET: SPREAD or TOTAL. SIDE: HOME/AWAY for spread; OVER/UNDER for total. CONFIDENCE: integer 0-100; PASS must be 0.
For an actionable SPREAD, FAIR_LINE is YOUR fair spread for the SELECTED SIDE, using the wager's sign. Example: if DraftKings offers AWAY -10 and you estimate AWAY -12.5, FAIR_LINE=-12.5 and EDGE=2.5. If DraftKings offers HOME +7 and you estimate HOME +4, FAIR_LINE=4 and EDGE=3.
For OVER, EDGE=FAIR_LINE-current total. For UNDER, EDGE=current total-FAIR_LINE. EDGE must be positive and mathematically match FAIR_LINE versus the supplied market. If you cannot support a numeric fair line and positive edge, PASS.
For PASS, MARKET, SIDE, FAIR_LINE, EDGE, REASON, RISK, and EXPLANATION may be N/A; GAME_ID, PASS, and confidence 0 are sufficient.
Keep REASON to at most 12 words, RISK to at most 6 words, and EXPLANATION to at most 12 words. Complete every GAME_ID before adding detail. Do not use the pipe character inside a field.
Do not use JSON, markdown, headings, or commentary.`;
 try{
  const t=Date.now(),r=await env.AI.run(MODEL,{messages:[{role:'system',content:system},{role:'user',content:'Review these games without forcing bets. Complete every GAME_ID.\n'+JSON.stringify(compact)}],temperature:0,max_completion_tokens:720,chat_template_kwargs:{enable_thinking:false}});
  let raw=modelText(r),a=buildAnalysis(raw,s),retryUsed=false,retryShape='';
  const missing=a.bets.filter(x=>x._fallback).map(x=>String(x.gameId));
  if(missing.length){
   retryUsed=true;const retryGames=compact.games.filter(g=>missing.includes(String(g.id))),retrySnapshot={...s,games:s.games.filter(g=>missing.includes(String(g.id)))};
   const retrySystem=system+'\nRECOVERY: Return only the missing GAME_ID rows listed by the user. Be extremely concise. PASS is preferable to unsupported math.';
   const rr=await env.AI.run(MODEL,{messages:[{role:'system',content:retrySystem},{role:'user',content:'Missing rows only:\n'+JSON.stringify({season:compact.season,week:compact.week,games:retryGames})}],temperature:0,max_completion_tokens:360,chat_template_kwargs:{enable_thinking:false}});
   const retryRaw=modelText(rr);retryShape=responseShape(rr);raw=raw+'\n'+retryRaw;a=buildAnalysis(raw,s);
  }
  const inferenceMs=Date.now()-t;
  return json({analysis:a,meta:{requestId:id,stage:'contract_complete',contract:'one-row-per-game-v3',inferenceMs,provider:'Cloudflare Workers AI',model:MODEL,zeroCost:true,paidFallback:false,batchIndex:Number(b.batchIndex)||0,batchCount:Number(b.batchCount)||1,candidateCount:s.games.length,parsedCount:a.bets.filter(x=>!x._fallback).length,retryUsed,retryShape,responseShape:responseShape(r),rawSample:clean(raw,1600)}});
 }catch(e){return json({error:'Workers AI analysis unavailable',stage:'inference',requestId:id,message:clean(e?.message||e,500),zeroCost:true,paidFallback:false},503)}
}};
