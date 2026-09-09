/* ===========================================================
   每日生活 Daily Life · 全功能逻辑（Web PWA 实现）
   =========================================================== */
(function(){
'use strict';

/* ---------------- 常量 ---------------- */
const KEY='dailylife_v2';
const CATS=[
  {key:'diet',  name:'饮食', icon:'diet'},
  {key:'drink', name:'饮料', icon:'drink'},
  {key:'sport', name:'运动', icon:'sport'},
  {key:'mood',  name:'心情', icon:'mood'},
  {key:'consume',name:'消费',icon:'consume'},
  {key:'finance',name:'理财',icon:'finance'},
  {key:'sleep', name:'睡眠', icon:'sleep'},
  {key:'album', name:'相册', icon:'album'},
];
// 分类专属浅色底色（用于首页侧边栏/卡片图标气泡）
const CAT_BG={
  diet:{bg:'#FFF3E0',bubble:'#FFE0B2'},
  drink:{bg:'#FCE4EC',bubble:'#F8BBD0'},
  sport:{bg:'#E3F2FD',bubble:'#BBDEFB'},
  mood:{bg:'#FFFDE7',bubble:'#FFF59D'},
  consume:{bg:'#F3E5F5',bubble:'#E1BEE7'},
  finance:{bg:'#E8F5E9',bubble:'#C8E6C9'},
  sleep:{bg:'#E8EAF6',bubble:'#C5CAE9'},
  album:{bg:'#E0F2F1',bubble:'#B2DFDB'},
};
const RECORD_CATS=['diet','drink','sport','mood','consume','finance','sleep'];
/* 统计页顶部分类（用户要求的五项） */
const STATS_CATS=[['diet','饮食','🍚'],['drink','饮料','🥤'],['sport','运动','🏃'],['mood','心情','🥰'],['consume','消费','🛍️']];
const PALETTE=['#2E7D32','#66BB6A','#FF7043','#FFB300','#42A5F5','#AB47BC','#EC407A','#26A69A','#8D6E63','#9CCC65'];
const GREET=['今天也要好好生活呀～','记录生活，收集小确幸 ☘','新的一天，元气满满！','慢慢来，比较快 🌿','今天的你也很棒哦','把平凡的日子过成诗'];
const WEATHERS=['sun','cloud','rain','snow','wind','fog'];
const WEATHER_NAME={sun:'晴',cloud:'多云',rain:'雨',snow:'雪',wind:'风',fog:'雾'};

const FOOD_EMOJI=[
 {e:'🍚',n:'米饭'},{e:'🍜',n:'面条'},{e:'🍞',n:'面包'},{e:'🥗',n:'沙拉'},{e:'🍗',n:'鸡腿'},
 {e:'🥩',n:'牛排'},{e:'🍣',n:'寿司'},{e:'🍔',n:'汉堡'},{e:'🍕',n:'披萨'},{e:'🥟',n:'饺子'},
 {e:'🍱',n:'便当'},{e:'🥪',n:'三明治'},{e:'🍳',n:'煎蛋'},{e:'🥦',n:'蔬菜'},{e:'🍅',n:'番茄'},
 {e:'🥕',n:'胡萝卜'},{e:'🍎',n:'苹果'},{e:'🍌',n:'香蕉'},{e:'🍊',n:'橘子'},{e:'🍓',n:'草莓'},
 {e:'🍰',n:'蛋糕'},{e:'🍩',n:'甜甜圈'},{e:'🍦',n:'冰淇淋'},{e:'🍫',n:'巧克力'},{e:'🥤',n:'饮品'},
 {e:'☕',n:'咖啡'},{e:'🍵',n:'茶'},{e:'🥣',n:'粥'},{e:'🧇',n:'华夫饼'},{e:'🫕',n:'火锅'},
 {e:'🍇',n:'葡萄'},{e:'🍉',n:'西瓜'},{e:'🥐',n:'可颂'},{e:'🧁',n:'纸杯蛋糕'},{e:'🍡',n:'团子'},
];
const DRINK_TYPES=[{k:'milktea',n:'奶茶',i:'milktea'},{k:'coffee',n:'咖啡',i:'coffee'},{k:'teafruit',n:'果茶',i:'teafruit'},{k:'soda',n:'气泡水',i:'soda'},{k:'other',n:'其他',i:'cOther'}];
const SWEET=['无糖','半糖','正常甜','超甜'];
const SPORT_TYPES=[{k:'ride',n:'骑行',i:'ride',fields:['distance','duration']},{k:'climb',n:'爬山',i:'climb',fields:['climb','duration']},{k:'run',n:'跑步',i:'run',fields:['distance','pace']},{k:'swim',n:'游泳',i:'swim',fields:['duration','distance']},{k:'other',n:'其他',i:'dumbbell',fields:['duration']}];
const MOODS=[{k:'happy',n:'开心',e:'😊',v:5},{k:'calm',n:'平静',e:'😌',v:4},{k:'normal',n:'一般',e:'😐',v:3},{k:'sad',n:'难过',e:'😢',v:2},{k:'angry',n:'生气',e:'😠',v:1}];
const MOOD_TAGS=['工作','学习','家庭','感情','健康','其他'];
const CONSUME_TYPES=[{k:'food',n:'餐饮',i:'cFood'},{k:'trans',n:'交通',i:'cTrans'},{k:'shop',n:'购物',i:'cShop'},{k:'fun',n:'娱乐',i:'cFun'},{k:'home',n:'居住',i:'cHome'},{k:'medical',n:'医疗',i:'cMedical'},{k:'other',n:'其他',i:'cOther'}];
const FIN_CATS=[{k:'salary',n:'工资',i:'salary'},{k:'parttime',n:'兼职',i:'parttime'},{k:'invest',n:'理财收益',i:'invest'},{k:'redpkt',n:'红包',i:'redpkt'},{k:'daily',n:'日常消费',i:'cFood'},{k:'big',n:'大件支出',i:'bigbuy'},{k:'other',n:'其他',i:'cOther'}];
const MEALS=[{k:'breakfast',n:'早餐',i:'breakfast'},{k:'lunch',n:'午餐',i:'lunch'},{k:'dinner',n:'晚餐',i:'dinner'},{k:'supper',n:'加餐',i:'supper'}];

/* ---------------- 状态 ---------------- */
let state=null;
let formImages=[];      // 当前表单临时图片
let formCat=null;       // 当前表单分类（决定是否抠图）
let formDate=todayStr();// 当前表单日期（默认今天）
let curDetail=null;     // 当前详情分类
let curMeal='all';
/* 饮食/饮料日历模式状态 */
let dcalYear=new Date().getFullYear(),dcalMonth=new Date().getMonth(),dSel=null;
/* 详情页统一刷新（按分类路由到 列表 / 日历 / 相册） */
function refreshDetail(){
  if(curDetail==null||$('#detail-view').classList.contains('hidden'))return;
  if(curDetail==='album')renderAlbum();
  else if(isCalCat(curDetail))renderCatCalendar();
  else renderDetailList();
}
/* 饮食/饮料/运动/心情使用日历模式 */
function isCalCat(c){return c==='diet'||c==='drink'||c==='sport'||c==='mood';}
let curStatsRange='week';
let curStatsCat='diet';   // 统计页当前分类
let curYear=new Date().getFullYear();
let budgetWarned=false;

/* ---------------- 工具 ---------------- */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
function esc(s){return (s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function todayStr(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function nowHM(){const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
function weekday(d){const w=['周日','周一','周二','周三','周四','周五','周六'];return w[new Date(d).getDay()];}
function daysAgo(n){const d=new Date();d.setDate(d.getDate()-n);return d;}
function fmtMD(s){const[a,b,c]=s.split('-');return (b[0]==='0'?b[1]:b)+'/'+c;}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.add('hidden'),1800);}
function getIcon(name){return window.ICON(name);}
function findArr(cat,id){return state.records[cat].find(r=>r.id===id);}

/* ---------------- 存储（双保险，修复"主屏幕/PWA 打开后数据不保存、重开丢失"） ----------------
   策略：
   1) localStorage 为主存储（同步、快），负责启动首读；
   2) 每次保存同时镜像写入 IndexedDB（容量更大、更不易被浏览器清理）：
      localStorage 丢失/损坏/被禁用（无痕、隐私模式等）时，启动自动从 IDB 恢复；
   3) 多窗口 / 浏览器+PWA 双开时，通过 storage 事件 + 回到前台重读，同步最新数据，防止旧实例整包覆盖新记录；
   4) 切后台 / 关闭页面 / App 被系统回收前兜底保存一次，防止"最后一条记录"丢失；
   5) 存储完全不可用时，显示常驻红色提示条，不再静默丢数据。
-------------------------------------------------------------------------- */
let _db=null,_lsDead=false,_idbTimer=null,_idbJson=null,_rendering=false;
function idbOpen(){return new Promise(res=>{try{if(!window.indexedDB)return res(null);const rq=indexedDB.open('dailylife_kv',1);rq.onupgradeneeded=()=>{try{rq.result.createObjectStore('kv');}catch(e){}};rq.onsuccess=()=>res(rq.result);rq.onerror=()=>res(null);}catch(e){res(null);}});}
function idbSet(val){return new Promise(res=>{idbOpen().then(db=>{if(!db)return res(false);try{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(val,KEY);tx.oncomplete=()=>res(true);tx.onerror=()=>res(false);}catch(e){res(false);}}).catch(()=>res(false));});}
function idbGet(){return new Promise(res=>{idbOpen().then(db=>{if(!db)return res(null);try{const rq=db.transaction('kv').objectStore('kv').get(KEY);rq.onsuccess=()=>res(rq.result||null);rq.onerror=()=>res(null);}catch(e){res(null);}}).catch(()=>res(null));});}
function validState(d){return !!(d&&d.records&&d.profile&&d.settings);}
/* 常驻红色提示条：存储不可用/受限时提醒用户，而不是静默丢数据 */
function storageBanner(msg){
  try{
    let b=document.getElementById('sb-banner');
    if(!b){
      b=document.createElement('div');b.id='sb-banner';
      b.style.cssText='position:fixed;left:10px;right:10px;bottom:88px;z-index:99999;background:#B71C1C;color:#fff;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.5;box-shadow:0 4px 14px rgba(0,0,0,.25);display:flex;align-items:center;gap:10px;';
      b.innerHTML='<span style="flex:1"></span><span id="sb-x" style="flex:none;cursor:pointer;font-size:18px;padding:0 4px">✕</span>';
      document.body.appendChild(b);
      b.querySelector('#sb-x').onclick=()=>{_sbClosed=true;b.remove();lsSet('sb_closed','1');};
    }
    b.querySelector('span').textContent=msg;
  }catch(e){}
}
function hideStorageBanner(){const b=document.getElementById('sb-banner');if(b)b.remove();}
/* ---------------- 存储环境自检（小码盒等本地预览 App / 无痕模式等受限环境） ----------------
   这类环境打开页面时往往禁用 localStorage / IndexedDB（或每次启动即清空）。
   我们在启动时主动探测两个通道是否真的可写，结果实时显示在「设置 → 数据保存」，
   完全不可用时首页弹常驻红条给操作指引——而不是等用户记录半天才发现没存上。 */
let _lsOK=false,_idbOK=false,_probeDone=false,_sbClosed=false;
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function probeLSOk(){
  if(/\bnoStore=1\b/.test(location.search))return false; /* 诊断：模拟 localStorage 被禁（如小码盒/无痕） */
  try{const k='__dl_probe__';localStorage.setItem(k,'1');
    const ok=localStorage.getItem(k)==='1';localStorage.removeItem(k);return ok;}
  catch(e){return false;}
}
async function probeIDBOk(){
  if(/\bnoStore=1\b/.test(location.search))return false; /* 诊断：模拟 IndexedDB 被禁 */
  return idbOpen().then(db=>{
    if(!db)return false;
    return new Promise(res=>{
      try{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put('1','__dl_probe__');
        tx.oncomplete=()=>res(true);tx.onerror=()=>res(false);}catch(e){res(false);}
    });
  }).catch(()=>false);
}
/* 完全无法保存时的提示文案（按环境区分，让用户知道该怎么办） */
function storageHint(){
  if(location.protocol==='file:'||location.protocol==='about:'||/^(file|about|data|blob):/.test(location.protocol))
    return '⚠️ 当前是「本地文件预览」模式（小码盒等预览工具），此环境通常不允许长期保存数据，关闭后再打开记录会丢失！请改用浏览器打开部署后的 HTTPS 网址使用；临时记录请用「设置 → 数据备份」导出 JSON 保管。';
  return '⚠️ 当前浏览器禁止本地存储（无痕/隐私模式或站点权限受限），新增记录将无法保存！请退出无痕模式，或在浏览器设置中允许本站使用存储。';
}
/* 启动自检：探测 localStorage / IndexedDB 是否真的可写，不可用则明确告知（不再静默丢数据） */
function startStorageProbe(){
  _lsOK=probeLSOk();
  probeIDBOk().then(ok=>{
    _idbOK=ok;_probeDone=true;
    if(!_lsOK&&!_idbOK)storageBanner(storageHint());
    else hideStorageBanner();
    refreshStorageStatus();
  });
}
/* 设置页「数据保存」行的实时状态 */
function storageStatusText(){
  if(!_probeDone)return{t:'检测中…',c:'#8D6E63'};
  if(_lsOK&&_idbOK)return{t:'正常 · 双重备份',c:'#2E7D32'};
  if(_idbOK)return{t:'备用存储模式（仍可保存）',c:'#E65100'};
  if(_lsOK)return{t:'正常',c:'#2E7D32'};
  return{t:'✗ 本环境无法保存',c:'#C62828'};
}
function refreshStorageStatus(){
  const el=document.getElementById('s-storage-val');
  if(!el)return;
  const st=storageStatusText();el.textContent=st.t;el.style.color=st.c;
}
/* 读取 localStorage（校验结构；数据损坏时先把坏文件备份为 *_bad_时间戳，避免直接覆盖） */
function load(){
  try{
    const raw=localStorage.getItem(KEY);
    if(raw){
      const d=JSON.parse(raw);
      if(validState(d)){state=d;return true;}
      try{localStorage.setItem(KEY+'_bad_'+Date.now(),raw);}catch(e){}
    }
  }catch(e){}
  return false;
}
/* localStorage 缺失/损坏时，从 IndexedDB 备份取回状态对象（返回对象或 null，由调用方决定是否采用） */
async function loadBackup(){
  try{
    const raw=await idbGet();
    if(raw){const d=JSON.parse(raw);if(validState(d))return d;}
  }catch(e){}
  return null;
}
/* 统一保存：localStorage（主） + IndexedDB（镜像兜底） */
function save(){
  if(!state)return;
  state._sv=Date.now();
  let json;
  try{json=JSON.stringify(state);}catch(e){return;}
  let lsFail=false;
  if(!_lsDead){
    try{localStorage.setItem(KEY,json);}catch(e){_lsDead=true;lsFail=true;}
  }else lsFail=true;
  if(lsFail){
    /* localStorage 不可用/超限：立即改存 IndexedDB，并给出醒目标识 */
    idbSet(json).then(ok=>{
      if(!ok){storageBanner(storageHint());}
      else if(!_sbClosed&&!_probeDone){storageBanner('⚠️ 浏览器存储受限，已自动改用备用存储保存，功能正常。建议到「设置 → 数据备份」导出 JSON，防止意外丢失。');}
      else if(!_sbClosed&&!_lsOK&&_idbOK){storageBanner('⚠️ 浏览器禁用了常规存储，已改用备用存储（IndexedDB）保存，关闭后再打开仍会自动恢复。');}
    });
  }else{
    /* 正常路径：IndexedDB 镜像作防丢兜底（防抖合并，避免连续保存时重复写库） */
    _idbJson=json;clearTimeout(_idbTimer);
    _idbTimer=setTimeout(()=>{const j=_idbJson;_idbJson=null;idbSet(j);},300);
    hideStorageBanner();
  }
}
/* 多窗口同步：别的窗口/PWA 实例刚保存了新数据时，立即接管最新状态并刷新界面 */
function applyRemoteState(d){
  if(!d||!validState(d))return;
  const remote=d._sv||0,local=state?(state._sv||0):0;
  if(remote<local)return; /* 不回退到更旧的数据 */
  state=d;
  try{
    if(!$('#view-home').classList.contains('hidden'))renderHome();
    if(!$('#view-profile').classList.contains('hidden'))renderProfile();
    if(!$('#view-stats').classList.contains('hidden'))renderStats();
    if(!$('#detail-view').classList.contains('hidden'))refreshDetail();
    if(!$('#pyq-view').classList.contains('hidden'))renderPyqList();
  }catch(e){}
}
function storageSyncEvt(e){
  if(e.key!==KEY||!e.newValue)return;
  try{const d=JSON.parse(e.newValue);if(validState(d))applyRemoteState(d);}catch(err){}
}
/* 回到前台时重读一次：若其它实例更新过数据则同步，防止旧内存状态覆盖新记录 */
function resyncFromLS(){
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw)return;
    const d=JSON.parse(raw);
    if(validState(d)&&(d._sv||0)>(state?(state._sv||0):0))applyRemoteState(d);
  }catch(e){}
}

/* ---------------- 演示数据 ---------------- */
function demoData(){
  /* 全新空白状态（导入备份时的兜底基底）：无任何预置记录，由用户自己添加 */
  return {profile:{avatar:null,nickname:'小绿',signature:'记录每一个平凡又闪光的日子 🌿'},
    settings:{budgetMonthly:2000,threshold:80,theme:'green'},weather:'sun',moments:[],
    records:{diet:[],drink:[],sport:[],mood:[],consume:[],finance:[],sleep:[],album:[]}};
}
/* 首次安装（本地无任何数据）时出现一次的示例数据：每条都打 _demo 标记，
   设置页提供「清空演示数据」按钮；一旦用户产生真实记录，任何逻辑都不会覆盖/重置用户数据 */
function firstRunData(){
  const s=demoData();
  s.demo=true;
  const D0=todayStr(),D1=todayStr(daysAgo(1)),D2=todayStr(daysAgo(2));
  s.records.diet=[{id:'demo-diet1',date:D0,time:'08:00',meal:'breakfast',name:'牛奶燕麦粥',icon:'🥣',place:'',note:'',images:[],_demo:true},
    {id:'demo-diet2',date:D1,time:'12:10',meal:'lunch',name:'番茄鸡蛋面',icon:'🍜',place:'',note:'',images:[],_demo:true}];
  s.records.drink=[{id:'demo-drink1',date:D0,time:'10:30',type:'other',typeName:'饮料',brand:'',sweet:1,price:16,time:'10:30',images:[],_demo:true}];
  s.records.sport=[{id:'demo-sport1',date:D1,time:'19:00',type:'run',typeName:'跑步',distance:3,pace:'',duration:25,calories:210,mood:'happy',images:[],_demo:true}];
  s.records.mood=[{id:'demo-mood1',date:D0,time:'21:00',mood:'happy',moodName:'开心',tags:['生活'],desc:'今天也是元气满满的一天～',images:[],_demo:true}];
  s.records.consume=[{id:'demo-cons1',date:D2,time:'12:20',type:'food',typeName:'餐饮',amount:26,merchant:'楼下面馆',impulse:false,note:'',image:null,images:[],_demo:true}];
  return s;
}
/* 是否仍有演示数据（决定设置页是否显示「清空演示数据」） */
function hasDemo(){
  return !!state.demo||RECORD_CATS.concat(['album']).some(c=>(state.records[c]||[]).some(r=>r._demo));
}
/* 清空演示数据：只删除带 _demo 标记的记录，绝不碰用户自己新增的数据 */
function clearDemo(){
  RECORD_CATS.concat(['album']).forEach(c=>{state.records[c]=(state.records[c]||[]).filter(r=>!r._demo);});
  state.demo=false;
  /* 顺带移除已无内容的朋友圈动态日期，避免残留空动态 */
  if(Array.isArray(state.moments))state.moments=state.moments.filter(m=>buildPyqCaption(m.date)||dayImagesOf(m.date).length);
  save();renderSettings();
  if(!$('#view-home').classList.contains('hidden'))renderHome();
  if(!$('#view-profile').classList.contains('hidden'))renderProfile();
  if(!$('#view-stats').classList.contains('hidden'))renderStats();
  toast('演示数据已清空，开始记录你的生活吧 🌿');
}

/* ---------------- 图片压缩（兼容拍照/相册，解码失败时回退原图） ---------------- */
function compressImage(file){
  return new Promise((res,rej)=>{
    if(!file)return rej();
    const reader=new FileReader();
    reader.onload=()=>{
      const raw=reader.result;
      const img=new Image();
      img.onload=()=>{
        try{
          let {width:w,height:h}=img;const max=1280;if(w>max||h>max){const r=max/Math.max(w,h);w=Math.round(w*r);h=Math.round(h*r);}
          const cv=document.createElement('canvas');cv.width=w;cv.height=h;
          cv.getContext('2d').drawImage(img,0,0,w,h);
          let q=0.82,out=cv.toDataURL('image/jpeg',q);
          while(out.length>1.4e6&&q>0.4){q-=0.1;out=cv.toDataURL('image/jpeg',q);}
          res(out);
        }catch(err){res(raw);/* 部分手机 canvas 不支持该格式，直接用原图 */}
      };
      img.onerror=()=>res(raw);/* HEIC 等格式解码失败时回退原图，保证照片一定显示 */
      img.src=raw;
    };
    reader.onerror=rej;reader.readAsDataURL(file);
  });
}

/* ---------------- 照片抠图贴纸：抠出主体 + 白描边 ---------------- */
const isCut=s=>typeof s==='string'&&s.startsWith('data:image/png'); // 抠图结果是透明PNG
function loadImgEl(dataUrl){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=dataUrl;});}

/* 第1层：边缘泛洪抠图（纯色/简单背景，瞬间完成） */
function floodCutout(dataUrl){
  return new Promise((res,rej)=>{
    const im=new Image();
    im.onload=()=>{
      try{
        const S=256,sc=Math.min(1,S/Math.max(im.width,im.height));
        const w=Math.max(2,Math.round(im.width*sc)),h=Math.max(2,Math.round(im.height*sc));
        const cv=document.createElement('canvas');cv.width=w;cv.height=h;
        const ctx=cv.getContext('2d',{willReadFrequently:true});
        ctx.drawImage(im,0,0,w,h);
        const px=ctx.getImageData(0,0,w,h).data;
        /* 1) 采样四边像素，背景不够纯色则放弃 */
        let sr=0,sg=0,sb=0,n=0;const sums=[];
        const border=(x,y)=>{const i=(y*w+x)*4;sr+=px[i];sg+=px[i+1];sb+=px[i+2];sums.push(px[i]+px[i+1]+px[i+2]);n++;};
        for(let x=0;x<w;x++){border(x,0);border(x,h-1);}
        for(let y=0;y<h;y++){border(0,y);border(w-1,y);}
        const mean=sums.reduce((a,b)=>a+b,0)/n;
        const sd=Math.sqrt(sums.reduce((a,b)=>a+(b-mean)*(b-mean),0)/n);
        if(sd>62)return rej('bg-busy');
        const mr=sr/n,mg=sg/n,mb=sb/n;
        /* 2) 从四边种子泛洪：与背景均值相近 或 与邻域相近都算背景 */
        const bg=new Uint8Array(w*h),q=[];
        const dMean=i=>Math.abs(px[i*4]-mr)+Math.abs(px[i*4+1]-mg)+Math.abs(px[i*4+2]-mb);
        const dPix=(a,b)=>Math.abs(px[a*4]-px[b*4])+Math.abs(px[a*4+1]-px[b*4+1])+Math.abs(px[a*4+2]-px[b*4+2]);
        const seed=(x,y)=>{const i=y*w+x;if(!bg[i]&&dMean(i)<150){bg[i]=1;q.push(i);}};
        for(let x=0;x<w;x++){seed(x,0);seed(x,h-1);}
        for(let y=0;y<h;y++){seed(0,y);seed(w-1,y);}
        while(q.length){
          const i=q.pop(),x=i%w,y=(i/w)|0;
          const go=(nx,ny)=>{if(nx<0||ny<0||nx>=w||ny>=h)return;const j=ny*w+nx;if(bg[j])return;
            if(dMean(j)<150||dPix(i,j)<72){bg[j]=1;q.push(j);}};
          go(x+1,y);go(x-1,y);go(x,y+1);go(x,y-1);
        }
        /* 3) 主体占比检查（太小/太大说明抠坏了） */
        let sub=0;for(let i=0;i<w*h;i++)if(!bg[i])sub++;
        const frac=sub/(w*h);
        if(frac<0.06||frac>0.92)return rej('bad-frac');
        /* 4) 蒙版轻模糊，让边缘柔和 */
        let m=new Float32Array(w*h);
        for(let i=0;i<w*h;i++)m[i]=bg[i]?0:255;
        for(let p=0;p<2;p++){
          const t=new Float32Array(w*h);
          for(let y=0;y<h;y++)for(let x=0;x<w;x++){
            let a=0,c=0;
            for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
              const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;a+=m[ny*w+nx];c++;}
            t[y*w+x]=a/c;
          }
          m=t;
        }
        const acv=document.createElement('canvas');acv.width=w;acv.height=h;
        const actx=acv.getContext('2d');
        const id=actx.createImageData(w,h);
        for(let i=0;i<w*h;i++){const v=Math.round(m[i]);id.data[i*4+3]=v;} /* 蒙版值写入alpha通道 */
        actx.putImageData(id,0,0);
        res({im,alphaCv:acv});
      }catch(err){rej(err);}
    };
    im.onerror=()=>rej('img');im.src=dataUrl;
  });
}

/* 第2层：浏览器端 AI 抠图（复杂背景自动尝试，模型走国内镜像，仅首次下载） */
let _aiModel=null,_aiProc=null,_aiFail=false;
async function aiCutout(dataUrl){
  if(_aiFail)return null;
  try{
    const T=await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
    T.env.remoteHost='https://hf-mirror.com';
    T.env.remotePathTemplate='{model}/resolve/main/';
    if(!_aiModel){
      toast('首次AI抠图需下载模型，约1分钟…');
      _aiModel=await T.AutoModel.from_pretrained('briaai/RMBG-1.4',{config:{model_type:'image'},quantized:true});
      _aiProc=await T.AutoProcessor.from_pretrained('briaai/RMBG-1.4',{config:{
        do_normalize:true,do_pad:false,do_rescale:true,do_resize:true,
        image_mean:[0.5,0.5,0.5],feature_extractor_type:'ImageFeatureExtractor',
        image_std:[1,1,1],resample:2,rescale_factor:0.00392156862745098,
        size:{width:1024,height:1024}}});
    }
    toast('AI抠图中…');
    const image=await T.RawImage.fromURL(dataUrl);
    const {pixel_values}=await _aiProc(image);
    const {output}=await _aiModel({input:pixel_values});
    const mask=await T.RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width,image.height);
    const mw=mask.width,mh=mask.height,ch=mask.channels||1;
    const acv=document.createElement('canvas');acv.width=mw;acv.height=mh;
    const actx=acv.getContext('2d');
    const id=actx.createImageData(mw,mh);
    let fg=0;
    for(let i=0;i<mw*mh;i++){const v=mask.data[i*ch];id.data[i*4+3]=v;if(v>128)fg++;} /* 蒙版值写入alpha通道 */
    actx.putImageData(id,0,0);
    const fr=fg/(mw*mh);
    if(fr<0.04||fr>0.97)return null;
    return {im:await loadImgEl(dataUrl),alphaCv:acv};
  }catch(e){_aiFail=true;return null;}
}

/* 合成：主体 + 白描边贴纸 */
function renderSticker(im,alphaCv,maxS){
  const sc=Math.min(1,maxS/Math.max(im.width,im.height));
  const W=Math.max(2,Math.round(im.width*sc)),H=Math.max(2,Math.round(im.height*sc));
  const cut=document.createElement('canvas');cut.width=W;cut.height=H;
  const cctx=cut.getContext('2d');
  cctx.drawImage(im,0,0,W,H);
  cctx.globalCompositeOperation='destination-in';
  cctx.drawImage(alphaCv,0,0,W,H);
  const out=document.createElement('canvas');out.width=W;out.height=H;
  const octx=out.getContext('2d');
  const sil=document.createElement('canvas');sil.width=W;sil.height=H;
  const sctx=sil.getContext('2d');
  sctx.drawImage(cut,0,0);
  sctx.globalCompositeOperation='source-in';
  sctx.fillStyle='#fff';sctx.fillRect(0,0,W,H);
  const R=Math.max(4,Math.round(Math.min(W,H)*0.03)),steps=16;
  for(let k=0;k<steps;k++){const a=k/steps*2*Math.PI;octx.drawImage(sil,Math.cos(a)*R,Math.sin(a)*R);}
  octx.drawImage(sil,0,0);
  octx.globalCompositeOperation='source-over';
  octx.drawImage(cut,0,0);
  return out.toDataURL('image/png');
}
function composeSticker(im,alphaCv){
  let s=380;
  for(;;){const png=renderSticker(im,alphaCv,s);
    if(png.length<=5.5e5||s<=240)return png;s-=60;}
}
/* 总入口：先快速抠，失败再AI抠，都失败返回 null（保留原图圆形白边） */
async function cutoutImage(dataUrl){
  try{const f=await floodCutout(dataUrl);return await composeSticker(f.im,f.alphaCv);}catch(e){}
  try{
    const a=await Promise.race([aiCutout(dataUrl),
      new Promise((_,rj)=>setTimeout(()=>rj('timeout'),120000))]);
    if(a)return await composeSticker(a.im,a.alphaCv);
  }catch(e){_aiFail=true;}
  return null;
}

/* ---------------- 图表（Canvas） ---------------- */
function setupCanvas(cv,h){const dpr=window.devicePixelRatio||1;const w=cv.clientWidth||cv.parentElement.clientWidth||300;cv.width=w*dpr;cv.height=h*dpr;cv.style.height=h+'px';const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);return{ctx,w,h};}
function drawDonut(cv,data){
  const{ctx,w,h}=setupCanvas(cv,170);const cx=w/2,cy=h/2,R=Math.min(w,h)/2-10,r=R*0.58;
  const total=data.reduce((a,b)=>a+b.value,0);
  if(total<=0){ctx.strokeStyle='#DDEBDD';ctx.lineWidth=14;ctx.beginPath();ctx.arc(cx,cy,(R+r)/2,0,7);ctx.stroke();
    ctx.fillStyle='#9BB39B';ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText('暂无数据',cx,cy+4);return;}
  let a=-Math.PI/2;data.forEach(d=>{const ang=d.value/total*Math.PI*2;ctx.beginPath();ctx.fillStyle=d.color;ctx.strokeStyle=d.color;ctx.lineWidth=R-r;ctx.arc(cx,cy,(R+r)/2,a,a+ang);ctx.stroke();a+=ang;});
  ctx.fillStyle='#2E7D32';ctx.font='bold 20px sans-serif';ctx.textAlign='center';ctx.fillText(total,cx,cy-2);
  ctx.fillStyle='#6E806E';ctx.font='11px sans-serif';ctx.fillText('总记录',cx,cy+15);
}
function drawBar(cv,labels,values,colors){
  const{ctx,w,h}=setupCanvas(cv,180);const pad=24,max=Math.max(1,...values);const bw=(w-pad*2)/labels.length*0.6;const gap=(w-pad*2)/labels.length;
  const base=h-22;
  labels.forEach((lb,i)=>{const x=pad+gap*i+(gap-bw)/2;const bh=values[i]/max*(base-10);
    ctx.fillStyle=colors[i%colors.length]||'#66BB6A';ctx.beginPath();
    ctx.roundRect?ctx.roundRect(x,base-bh,bw,bh,5):ctx.rect(x,base-bh,bw,bh);ctx.fill();
    ctx.fillStyle='#6E806E';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(lb,x+bw/2,h-8);
    if(values[i]>0){ctx.fillStyle='#2C3A2C';ctx.font='bold 10px sans-serif';ctx.fillText(values[i],x+bw/2,base-bh-3);}});
}
function drawLine(cv,labels,values,color){
  const{ctx,w,h}=setupCanvas(cv,180);const pad=24;const max=Math.max(1,...values,1);const gap=(w-pad*2)/(labels.length-1||1);const base=h-22;
  ctx.strokeStyle=color||'#2E7D32';ctx.lineWidth=2.5;ctx.beginPath();
  const pts=values.map((v,i)=>[pad+gap*i,base-(v/max)*(base-14)]);
  pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
  pts.forEach((p,i)=>{ctx.fillStyle=values[i]>0?'#fff':'#ccc';ctx.beginPath();ctx.arc(p[0],p[1],3.5,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#6E806E';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(labels[i],p[0],h-8);});
}
function drawHBar(cv,items){
  const{ctx,w,h}=setupCanvas(cv,items.length*30+10);const max=Math.max(1,...items.map(i=>i.value));
  items.forEach((it,i)=>{const y=8+i*30;const bw=(w-90)*it.value/max;
    ctx.fillStyle='#E8F5E9';ctx.beginPath();ctx.roundRect?ctx.roundRect(80,y,w-90,18,9):ctx.rect(80,y,w-90,18);ctx.fill();
    ctx.fillStyle=it.color||'#2E7D32';ctx.beginPath();ctx.roundRect?ctx.roundRect(80,y,Math.max(bw,2),18,9):ctx.rect(80,y,Math.max(bw,2),18);ctx.fill();
    ctx.fillStyle='#2C3A2C';ctx.font='bold 12px sans-serif';ctx.textAlign='right';ctx.fillText(it.label,74,y+13);
    ctx.fillStyle='#2E7D32';ctx.textAlign='left';ctx.fillText(it.value,80+Math.max(bw,2)+6,y+13);});
}

/* ===========================================================
   渲染：导航 & 顶栏
   =========================================================== */
function renderNavIcons(){
  $('#nav-ico-home').innerHTML=getIcon('home');
  $('#nav-ico-profile').innerHTML=getIcon('profile');
  $('#nav-ico-stats').innerHTML=getIcon('stats');
  $('#nav-ico-settings').innerHTML=getIcon('settings');
  $('#btn-cal').innerHTML=getIcon('calendar');
  $('#btn-setting-quick').innerHTML=getIcon('settings');
}
function showTab(page){
  $$('.view').forEach(v=>v.classList.add('hidden'));
  $('#view-'+page).classList.remove('hidden');
  $$('.tab').forEach(t=>t.classList.toggle('active',t.dataset.page===page));
  const titles={home:'每日生活',profile:'我的主页',stats:'统计分析',settings:'设置'};
  $('#tb-title').textContent=titles[page];
  if(page==='home')renderHome();
  if(page==='profile')renderProfile();
  if(page==='stats')renderStats();
  if(page==='settings')renderSettings();
  window.scrollTo(0,0);
}
function openDetail(cat){
  curDetail=cat;curMeal='all';
  const info=CATS.find(c=>c.key===cat)||{name:'',icon:'',key:cat};
  const bg=CAT_BG[cat];
  $('#detail-icon').innerHTML=getIcon(info.icon);
  $('#detail-icon').style.background=bg?bg.bubble:'var(--accent-bg)';
  $('#detail-title').textContent=info.name+'记录';
  $('#detail-add').innerHTML=getIcon('plus');
  $('#detail-add').onclick=()=>openForm(cat,null,isCalCat(cat)?(dSel||todayStr()):null);
  if(cat==='album'){renderAlbum();}
  else if(isCalCat(cat)){dSel=null;dcalYear=new Date().getFullYear();dcalMonth=new Date().getMonth();renderCatCalendar();}
  else{renderDetailList();}
  $('#detail-view').classList.remove('hidden');
  $('#detail-body').scrollTop=0;
}
function closeDetail(){$('#detail-view').classList.add('hidden');curDetail=null;if(!$('#view-home').classList.contains('hidden'))renderHome();}

/* ===========================================================
   首页
   =========================================================== */
function renderHome(){
  const today=todayStr();
  const doneCount=RECORD_CATS.filter(c=>state.records[c].some(r=>r.date===today)).length;
  // 侧栏顶部个人资料卡
  const p=state.profile;
  const avatarHTML=p.avatar?`<img src="${p.avatar}" alt="头像">`:'<span>🐱</span>';
  const profileCard=`<div class="side-profile" id="side-profile">
    <div class="sp-avatar">${avatarHTML}</div>
    <div class="sp-name">${esc(p.nickname||'小窝')}</div>
    ${p.signature?`<div class="sp-sign">${esc(p.signature)}</div>`:''}
  </div>`;
  // 侧栏
  const side=CATS.map(c=>{
    const n=c.key==='album'?allImages().length:state.records[c.key].filter(r=>r.date===today).length;
    const bg=CAT_BG[c.key];
    return `<div class="side-cat" data-cat="${c.key}" style="background:${bg.bg}">
      <div class="sc-ico" style="background:${bg.bubble}">${getIcon(c.icon)}</div>
      <div class="sc-tx">${c.name}</div>${n>0?`<div class="sc-badge">${n}</div>`:''}</div>`;
  }).join('');
  // 天气
  const w=state.weather;
  // 网格卡片
  const grid=RECORD_CATS.map(c=>{
    const recs=state.records[c];const cnt=recs.filter(r=>r.date===today).length;const done=cnt>0;
    const meta=catMeta(c,cnt,today);const bg=CAT_BG[c];
    return `<div class="gc ${done?'done':''}" data-cat="${c}" style="border-color:${done?bg.bubble:'transparent'}">
      <div class="gc-ico" style="background:${bg.bubble}">${getIcon(c)}</div>
      <div class="gc-tx">${CATS.find(x=>x.key===c).name}</div>
      <div class="gc-sub">${done?'今日已记录':'待记录'}</div>
      <div class="gc-num">${meta}</div></div>`;
  }).join('');
  $('#view-home').innerHTML=`
    <div class="home-wrap fade-in">
      <div class="home-side">${profileCard}${side}</div>
      <div class="home-main">
        <div class="today-head">
          <div class="th-date">${today} · ${weekday(today)}</div>
          <div class="th-big">${GREET[new Date().getHours()%GREET.length]}
            <span class="th-weather" id="weather-pick" title="点击切换天气">${getIcon(w)}<span style="font-size:12px;margin-left:3px;color:var(--soft)">${WEATHER_NAME[w]}</span></span></div>
          <div class="th-greet">用记录，把每一天都过得清晰又可爱 🌿</div>
        </div>
        <div class="progress-card">
          <div class="pc-top"><span>今日打卡进度</span><b>${doneCount} / ${RECORD_CATS.length}</b></div>
          <div class="bar"><i style="width:${doneCount/RECORD_CATS.length*100}%"></i></div>
        </div>
        <div class="section-title"><span class="st-ico">${getIcon('star')}</span>今日记录概览</div>
        <div class="grid-cards">${grid}</div>
      </div>
    </div>`;
  $$('#view-home .side-cat').forEach(el=>el.onclick=()=>openDetail(el.dataset.cat));
  $$('#view-home .gc').forEach(el=>el.onclick=()=>openDetail(el.dataset.cat));
  $('#weather-pick').onclick=cycleWeather;
  const sp=$('#side-profile');if(sp){sp.onclick=()=>showTab('profile');}
}
function catMeta(c,cnt,today){
  if(cnt===0)return '0 条';
  const recs=state.records[c].filter(r=>r.date===today);
  if(c==='diet')return recs.map(r=>r.meal==='breakfast'?'早':r.meal==='lunch'?'午':r.meal==='dinner'?'晚':'加').join(' ');
  if(c==='drink')return '¥'+recs.reduce((a,r)=>a+(+r.price||0),0);
  if(c==='consume')return '¥'+recs.reduce((a,r)=>a+(+r.amount||0),0);
  if(c==='finance')return recs.length+' 笔';
  if(c==='sport')return recs.length+' 次';
  if(c==='mood')return recs[0].moodName;
  if(c==='sleep')return recs[0].duration+'h';
  return cnt+' 条';
}
function cycleWeather(){$('#weather-pick').classList.add('rot');const i=WEATHERS.indexOf(state.weather);state.weather=WEATHERS[(i+1)%WEATHERS.length];save();renderHome();}

/* ===========================================================
   详情列表
   =========================================================== */
function renderDetailList(){
  const c=curDetail;if(c==='album')return renderAlbum();
  let recs=state.records[c].slice().sort((a,b)=>(a.date+b.time)<(b.date+b.time)?1:-1);
  if(c==='diet'&&curMeal!=='all')recs=recs.filter(r=>r.meal===curMeal);
  // 早午晚 seg
  let seg='';
  if(c==='diet'){seg=`<div class="seg">${[{k:'all',n:'全部',i:'diet'},...MEALS].map(m=>`<button class="${curMeal===m.k?'active':''}" data-meal="${m.k}">${getIcon(m.i)}<span>${m.n}</span></button>`).join('')}</div>`;}
  if(recs.length===0){$('#detail-body').innerHTML=seg+`<div class="empty"><span class="em-ico">${getIcon(c)}</span>还没有${CATS.find(x=>x.key===c).name}记录～<br>点右上角 + 添加第一条吧</div>`;}
  else{
    const groups={};recs.forEach(r=>{(groups[r.date]=groups[r.date]||[]).push(r);});
    let html=seg;
    Object.keys(groups).sort((a,b)=>b.localeCompare(a)).forEach(d=>{
      html+=`<div class="date-group">${d} · ${weekday(d)}</div>`;
      html+=groups[d].map(r=>recItemHTML(c,r)).join('');
    });
    $('#detail-body').innerHTML=html;
  }
  $$('#detail-body .seg button').forEach(b=>b.onclick=()=>{curMeal=b.dataset.meal;renderDetailList();});
  $$('#detail-body .rec-item').forEach(el=>{
    el.querySelector('[data-act="edit"]').onclick=()=>openForm(c,el.dataset.id);
    el.querySelector('[data-act="del"]').onclick=()=>delRec(c,el.dataset.id);
    el.querySelectorAll('.thumb-row img').forEach(im=>im.onclick=()=>previewImg(im.src));
  });
}
function recItemHTML(c,r){
  let ico='📝',title='',sub=[],thumbs='';
  if(c==='diet'){ico=r.icon||'🍚';title=r.name;sub=[MEALS.find(m=>m.k===r.meal).n,r.place].filter(Boolean);}
  if(c==='drink'){ico=getIcon((DRINK_TYPES.find(t=>t.k===r.type)||{}).i);title=r.brand||r.typeName||'饮料';sub=[SWEET[r.sweet],'¥'+(+r.price||0)];}
  if(c==='sport'){ico=getIcon((SPORT_TYPES.find(t=>t.k===r.type)||{}).i);title=r.typeName;sub=[r.duration+'分钟',r.distance?r.distance+'km':'',r.climb?r.climb+'m爬升':'',r.pace?r.pace+'配速':''].filter(Boolean);}
  if(c==='mood'){ico=MOODS.find(m=>m.k===r.mood).e;title=r.moodName;sub=r.tags||[];if(r.desc)sub.push(r.desc.slice(0,16));}
  if(c==='consume'){ico=getIcon((CONSUME_TYPES.find(t=>t.k===r.type)||{}).i);title=(r.merchant||'')+' · '+r.typeName;sub=['¥'+(+r.amount||0),r.impulse?{cls:'warn',t:'冲动消费'}:null].filter(Boolean).map(x=>typeof x==='string'?x:`<span class="tag ${x.cls}">${x.t}</span>`);}
  if(c==='finance'){ico=r.flow==='income'?getIcon('invest'):getIcon('cOther');title=(r.flow==='income'?'收入':'支出')+' · '+r.catName;sub=['¥'+(+r.amount||0)];}
  if(c==='sleep'){ico=getIcon('sleep');title='睡眠 '+r.duration+'h · '+r.quality+'★';sub=[r.sleepTime+'→'+r.wakeTime,r.nap?'午睡'+r.napDuration+'h':null].filter(Boolean);}
  if(c==='album'){ico='📸';title=r.note||'照片';sub=[r.date];}
  const imgs=(r.images||[]).concat(c==='consume'&&r.image?[r.image]:c==='sleep'&&r.image?[r.image]:c==='finance'&&r.image?[r.image]:[]).filter(Boolean);
  if(imgs.length)thumbs=`<div class="thumb-row">${imgs.slice(0,4).map(s=>`<img class="doodle ${isCut(s)?'ct':''}" src="${s}" alt="">`).join('')}</div>`;
  return `<div class="rec-item" data-id="${r.id}" data-cat="${c}">
    <div class="ri-ico">${typeof ico==='string'&&ico.startsWith('<')?ico:esc(ico)}</div>
    <div class="ri-main"><div class="ri-title">${esc(title)}</div><div class="ri-sub">${sub.map(s=>`<span>${s}</span>`).join('')}</div>${thumbs}</div>
    <div class="ri-acts"><button data-act="edit" title="编辑" aria-label="编辑">✏️</button><button class="del" data-act="del" title="删除" aria-label="删除">🗑️</button></div></div>`;
}

/* ===========================================================
   饮食 / 饮料 · 日历模式（点日期添加照片，照片白描边圆形贴纸）
   =========================================================== */
function catDayPhotos(c,d){
  const ps=[];
  state.records[c].filter(r=>r.date===d).forEach(r=>{
    (r.images||[]).forEach(s=>ps.push(s));
    if(r.image&&!ps.includes(r.image))ps.push(r.image);
  });
  return ps;
}
function catDayEmoji(c,r){
  if(c==='diet')return r.icon||'🍚';
  if(c==='drink'){const t=DRINK_TYPES.find(t=>t.k===r.type);return t?getIcon(t.i):'🥤';}
  if(c==='sport'){const t=SPORT_TYPES.find(t=>t.k===r.type);return t?getIcon(t.i):'🏃';}
  if(c==='mood'){const m=MOODS.find(m=>m.k===r.mood);return m?m.e:'😊';}
  return '📝';
}
function renderCatCalendar(){
  const c=curDetail;
  $('#detail-add').onclick=()=>openForm(c,null,dSel||todayStr());
  const ymd=dcalYear+'-'+String(dcalMonth+1).padStart(2,'0');
  const days=new Date(dcalYear,dcalMonth+1,0).getDate();
  const head=['日','一','二','三','四','五','六'].map(d=>`<div class="dcal-dow">${d}</div>`).join('');
  let cells='';
  for(let i=1;i<=days;i++){
    const d=ymd+'-'+String(i).padStart(2,'0');
    const recs=state.records[c].filter(r=>r.date===d);
    const ph=catDayPhotos(c,d);
    let content='<div class="dcal-add">＋</div>';
    if(ph.length){
      content=`<div class="dcal-phs">${ph.slice(0,3).map(s=>`<span class="dcal-ph ${isCut(s)?'ct':''}"><img src="${s}" alt=""></span>`).join('')}${ph.length>3?`<i class="dcal-more">+${ph.length-3}</i>`:''}</div>`;
    }else if(recs.length){
      content=`<div class="dcal-ico">${catDayEmoji(c,recs[0])}</div>`;
    }
    cells+=`<div class="dcal-cell ${d===todayStr()?'today':''} ${d===dSel?'sel':''}" data-d="${d}"><div class="dcal-day">${i}</div>${content}</div>`;
  }
  const firstDow=new Date(dcalYear,dcalMonth,1).getDay();
  let pre='';for(let i=0;i<firstDow;i++)pre+=`<div class="dcal-cell muted"></div>`;
  $('#detail-body').innerHTML=`
    <div class="dcal-bar">
      <button class="icon-btn" id="dcal-prev" aria-label="上月">${getIcon('back')}</button>
      <div class="dcal-month">${dcalYear}年${dcalMonth+1}月</div>
      <button class="icon-btn" id="dcal-next" aria-label="下月">${getIcon('arrow')}</button>
      <button class="dcal-today-btn" id="dcal-today">今天</button>
    </div>
    <div class="dcal-card"><div class="dcal-grid">${head}${pre}${cells}</div></div>
    <div id="dcal-panel"></div>`;
  $('#dcal-prev').onclick=()=>{dcalMonth--;if(dcalMonth<0){dcalMonth=11;dcalYear--;}dSel=null;renderCatCalendar();};
  $('#dcal-next').onclick=()=>{dcalMonth++;if(dcalMonth>11){dcalMonth=0;dcalYear++;}dSel=null;renderCatCalendar();};
  $('#dcal-today').onclick=()=>{dcalYear=new Date().getFullYear();dcalMonth=new Date().getMonth();dSel=todayStr();renderCatCalendar();};
  $$('#detail-body .dcal-cell[data-d]').forEach(el=>el.onclick=()=>{dSel=el.dataset.d;renderCatCalendar();showCatDay(dSel);});
  if(dSel&&dSel.startsWith(ymd))showCatDay(dSel);
}
function showCatDay(d){
  const c=curDetail;
  const recs=state.records[c].filter(r=>r.date===d).sort((a,b)=>(a.time||'')<(b.time||'')?-1:1);
  const cname=CATS.find(x=>x.key===c).name;
  let html=`<div class="dcal-panel-hd"><b>${d} · ${weekday(d)}</b><button class="dcal-addbtn" id="dcal-add">＋ 添加${cname} / 照片</button></div>`;
  if(!recs.length)html+=`<div class="empty" style="padding:22px 10px">这一天还没有${cname}记录<br>点上方绿色按钮上传照片吧 📷</div>`;
  else html+=recs.map(r=>recItemHTML(c,r)).join('');
  $('#dcal-panel').innerHTML=html;
  $('#dcal-add').onclick=()=>openForm(c,null,d);
  $$('#dcal-panel .rec-item').forEach(el=>{
    el.querySelector('[data-act="edit"]').onclick=()=>openForm(c,el.dataset.id);
    el.querySelector('[data-act="del"]').onclick=()=>delRec(c,el.dataset.id);
    el.querySelectorAll('.thumb-row img').forEach(im=>im.onclick=()=>previewImg(im.src));
  });
}

/* ===========================================================
   表单
   =========================================================== */
function openForm(cat,id,date){
  const rec=id?findArr(cat,id):null;
  formCat=cat;
  formImages=rec?((rec.images&&rec.images.length)?rec.images.slice():(rec.image?[rec.image]:[])):[];
  formDate=rec?rec.date:(date||todayStr());
  let html='',title='';
  if(cat==='diet'){title='饮食记录';html=dietForm(rec);}
  if(cat==='drink'){title='饮料记录';html=drinkForm(rec);}
  if(cat==='sport'){title='运动记录';html=sportForm(rec);}
  if(cat==='mood'){title='心情记录';html=moodForm(rec);}
  if(cat==='consume'){title='消费记录';html=consumeForm(rec);}
  if(cat==='finance'){title='理财记录';html=financeForm(rec);}
  if(cat==='sleep'){title='睡眠记录';html=sleepForm(rec);}
  if(cat==='album'){title='相册照片';html=albumForm(rec);}
  openModal(title,`<form class="form" id="f-form" onsubmit="return false">${html}</form>`,
    `<button class="btn-ghost" id="m-cancel">取消</button><button class="btn-primary" id="m-save">${id?'保存修改':'保存记录'}</button>`);
  bindFormCommon();
  if(cat==='diet')bindDiet(rec);
  if(cat==='drink')bindDrink(rec);
  if(cat==='sport')bindSport(rec);
  if(cat==='mood')bindMood(rec);
  if(cat==='consume')bindConsume(rec,id);
  if(cat==='finance')bindFinance(rec);
  if(cat==='sleep')bindSleep(rec);
  if(cat==='album')bindAlbum();
  $('#m-cancel').onclick=closeModal;
  $('#m-save').onclick=()=>saveForm(cat,id);
}
function imgGridHTML(){return `<div class="img-grid" id="f-imgs">${formImages.map((s,i)=>`<div class="img-cell ${isCut(s)?'ct':''}"><img src="${s}"><button class="x" data-i="${i}">×</button></div>`).join('')}<button type="button" class="img-add" id="f-img-add"><span class="img-add-ico">📷</span><span class="img-add-tx">拍照/相册</span></button></div>`;}
/* 全局常驻文件框：所有文件选择共用（图片/头像/导入备份），避免"首次操作新建的 file input 失效、第二次才成功"的手机端问题 */
let _pickCb=null,_pickRawCb=null;
function initGlobalFile(){
  const fi=document.createElement('input');
  fi.type='file';fi.id='g-file';fi.accept='image/*';
  fi.style.cssText='position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;';
  document.body.appendChild(fi);
  fi.addEventListener('change',async ()=>{
    const f=fi.files&&fi.files[0];fi.value='';
    const rc=_pickRawCb;_pickRawCb=null;
    const cb=_pickCb;_pickCb=null;
    if(!f)return;
    if(rc){ /* 文本/JSON 文件（导入备份用） */
      const rd=new FileReader();
      rd.onload=()=>rc(rd.result);
      rd.onerror=()=>toast('文件读取失败');
      rd.readAsText(f);return;
    }
    if(!cb)return;
    try{const d=await compressImage(f);await Promise.resolve(cb(d));}
    catch(err){toast('图片读取失败');}
  });
}
function pickImage(cb){const fi=$('#g-file');if(!fi)return;fi.accept='image/*';_pickCb=cb;fi.value='';fi.click();}
function pickJson(cb){const fi=$('#g-file');if(!fi)return;fi.accept='.json,application/json';_pickRawCb=cb;fi.value='';fi.click();}
function bindFormCommon(){
  const add=$('#f-img-add');if(add){
    add.onclick=()=>pickImage(async d=>{
      if(formImages.length>=3){toast('最多上传 3 张');return;}
      /* 手机端优先：先立刻显示照片，再后台抠图，完成后原位替换成贴纸 */
      const idx=formImages.push(d)-1;
      $('#f-imgs').outerHTML=imgGridHTML();bindFormCommon();
      if(formCat==='diet'||formCat==='drink'||formCat==='sport'){
        try{
          const st=await cutoutImage(d);
          if(st&&formImages[idx]===d){formImages[idx]=st;$('#f-imgs').outerHTML=imgGridHTML();bindFormCommon();}
        }catch(err){}
      }
    });
    $$('#f-imgs .x').forEach(b=>b.onclick=()=>{formImages.splice(+b.dataset.i,1);$('#f-imgs').outerHTML=imgGridHTML();bindFormCommon();});}
}
/* 饮食 */
function dietForm(rec){
  const em=FOOD_EMOJI;
  return `<div class="field"><label>食物照片（最多 3 张）</label>${imgGridHTML()}</div>
  <div class="field"><label>餐别</label><div class="icon-picker" id="f-meal">${MEALS.map(m=>`<div class="icon-opt ${!rec||rec.meal===m.k?'sel':''}" data-v="${m.k}">${getIcon(m.i)}</div>`).join('')}</div></div>
  <div class="field"><label>食物名称</label><input class="input" id="f-name" value="${esc(rec?rec.name:'')}" placeholder="如：番茄牛腩饭"></div>
  <div class="field"><label>食物图标（可搜索）</label><input class="emoji-search" id="f-emoji-search" placeholder="搜索：米饭 / 咖啡 ..."><div class="icon-picker" id="f-emoji">${em.map(e=>`<div class="icon-opt ${rec&&rec.icon===e.e?'sel':''}" data-e="${e.e}" data-n="${e.n}" title="${e.n}">${e.e}</div>`).join('')}</div></div>
  <div class="field"><label>餐厅 / 地点</label><input class="input" id="f-place" value="${esc(rec?rec.place:'')}" placeholder="如：公司食堂"></div>
  <div class="field"><label>备注 <span class="hint">可选</span></label><textarea class="input" id="f-note" placeholder="今天的味道...">${esc(rec?rec.note:'')}</textarea></div>`;
}
function bindDiet(rec){
  $('#f-meal').onclick=e=>{const o=e.target.closest('.icon-opt');if(!o)return;[...$('#f-meal').children].forEach(c=>c.classList.remove('sel'));o.classList.add('sel');};
  $('#f-emoji-search').oninput=e=>{const q=e.target.value.trim();$$('#f-emoji .icon-opt').forEach(o=>{o.style.display=(o.dataset.n.includes(q)||o.dataset.e.includes(q))?'':'none';});};
  $('#f-emoji').onclick=e=>{const o=e.target.closest('.icon-opt');if(!o)return;[...$('#f-emoji').children].forEach(c=>c.classList.remove('sel'));o.classList.add('sel');};
}
/* 饮料 */
function drinkForm(rec){
  return `<div class="field"><label>饮料照片（最多 3 张）</label>${imgGridHTML()}</div>
  <div class="field"><label>甜度</label><div class="slider-row"><input type="range" id="f-sweet" min="0" max="3" value="${rec?rec.sweet:1}"><span class="slider-val" id="f-sweet-v">${SWEET[rec?rec.sweet:1]}</span></div></div>
  <div class="field"><label>价格（元）</label><input class="input" id="f-price" type="number" inputmode="decimal" value="${rec?rec.price:''}" placeholder="0"></div>`;
}
function bindDrink(){$('#f-sweet').oninput=e=>$('#f-sweet-v').textContent=SWEET[+e.target.value];}
/* 运动 */
function sportForm(rec){
  const sp=SPORT_TYPES.find(t=>t.k===(rec?rec.type:'ride'));
  const fld=sp.fields;
  return `<div class="field"><label>运动类型</label><div class="icon-picker" id="f-type">${SPORT_TYPES.map(t=>`<div class="icon-opt ${!rec||rec.type===t.k?'sel':''}" data-v="${t.k}">${getIcon(t.i)}</div>`).join('')}</div></div>
  <div id="f-dyn">${sportDyn(fld,rec)}</div>
  <div class="field"><label>卡路里消耗（千卡）<span class="hint">自动估算，可改</span></label><input class="input" id="f-cal" type="number" value="${rec?rec.calories:''}" placeholder="如：250"></div>
  <div class="field"><label>心情状态</label><div class="icon-picker" id="f-mood">${MOODS.map(m=>`<div class="icon-opt ${rec&&rec.mood===m.k?'sel':''}" data-v="${m.k}">${m.e}</div>`).join('')}</div></div>
  <div class="field"><label>图片（最多 3 张）</label>${imgGridHTML()}</div>`;
}
function sportDyn(fld,rec){
  const m={distance:'里程(km)',climb:'爬升(m)',duration:'时长(分钟)',pace:'配速(min/km)'};
  return fld.map(f=>`<div class="field"><label>${m[f]}</label><input class="input" id="f-${f}" type="number" inputmode="decimal" value="${rec?rec[f]:''}" placeholder="0"></div>`).join('')+(!fld.includes('duration')?`<div class="field"><label>时长(分钟)</label><input class="input" id="f-duration" type="number" value="${rec?rec.duration:''}" placeholder="0"></div>`:'');
}
function bindSport(rec){
  pick('#f-type');pick('#f-mood');
  $('#f-type').onclick=e=>{if(e.target.closest('.icon-opt')){const k=e.target.closest('.icon-opt').dataset.v;const sp=SPORT_TYPES.find(t=>t.k===k);$('#f-dyn').innerHTML=sportDyn(sp.fields,rec);}};
}
/* 心情 */
function moodForm(rec){
  return `<div class="field"><label>心情</label><div class="icon-picker" id="f-mood" style="gap:10px">${MOODS.map(m=>`<div class="icon-opt ${!rec||rec.mood===m.k?'sel':''}" data-v="${m.k}" style="width:52px;height:52px;font-size:28px">${m.e}</div>`).join('')}</div></div>
  <div class="field"><label>关键词标签（可多选）</label><div class="icon-picker" id="f-tags">${MOOD_TAGS.map(t=>`<div class="icon-opt ${rec&&rec.tags&&rec.tags.includes(t)?'sel':''}" data-t="${t}" style="width:auto;padding:0 12px;font-size:13px">${t}</div>`).join('')}</div></div>
  <div class="field"><label>文字描述</label><textarea class="input" id="f-desc" placeholder="今天发生了什么...">${esc(rec?rec.desc:'')}</textarea></div>
  <div class="field"><label>相关图片（最多 3 张，可选）</label>${imgGridHTML()}</div>`;
}
function bindMood(){$('#f-tags').onclick=e=>{const o=e.target.closest('.icon-opt');if(o)o.classList.toggle('sel');};}
/* 消费 */
function consumeForm(rec){
  return `<div class="field"><label>消费类型</label><div class="icon-picker" id="f-type">${CONSUME_TYPES.map(t=>`<div class="icon-opt ${!rec||rec.type===t.k?'sel':''}" data-v="${t.k}" data-n="${t.n}">${getIcon(t.i)}</div>`).join('')}</div></div>
  <div class="field"><label>金额（元）<span class="hint">必填</span></label><input class="input" id="f-amount" type="number" inputmode="decimal" value="${rec?rec.amount:''}" placeholder="0"></div>
  <div class="field"><label>商家名称</label><input class="input" id="f-merchant" value="${esc(rec?rec.merchant:'')}" placeholder="如：盒马"></div>
  <div class="field"><label>必要 / 冲动</label><div class="toggle2" id="f-imp"><button class="${!rec||!rec.impulse?'on-need':''}" data-v="need">必要消费</button><button class="${rec&&rec.impulse?'on-imp':''}" data-v="impulse">冲动消费</button></div></div>
  <div class="field"><label>备注 <span class="hint">可选</span></label><textarea class="input" id="f-note" placeholder="买给自己的小礼物 🎁">${esc(rec?rec.note:'')}</textarea></div>
  <div class="field"><label>小票 / 发票图片</label>${imgGridHTML()}</div>`;
}
function bindConsume(rec,id){
  pick('#f-type');
  $('#f-imp').onclick=e=>{const b=e.target.closest('button');if(!b)return;[...$('#f-imp').children].forEach(x=>x.classList.remove('on-need','on-imp'));b.classList.add(b.dataset.v==='impulse'?'on-imp':'on-need');};
}
/* 理财 */
function financeForm(rec){
  return `<div class="field"><label>收支类型</label><div class="toggle2" id="f-flow"><button class="${!rec||rec.flow==='income'?'on-need':''}" data-v="income">⬆ 收入</button><button class="${rec&&rec.flow==='expense'?'on-imp':''}" data-v="expense">⬇ 支出</button></div></div>
  <div class="field"><label>分类</label><div class="icon-picker" id="f-cat">${FIN_CATS.map(c=>`<div class="icon-opt ${!rec||rec.category===c.k?'sel':''}" data-v="${c.k}" data-n="${c.n}">${getIcon(c.i)}</div>`).join('')}</div></div>
  <div class="field"><label>金额（元）<span class="hint">必填</span></label><input class="input" id="f-amount" type="number" inputmode="decimal" value="${rec?rec.amount:''}" placeholder="0"></div>
  <div class="field"><label>日期</label><input class="input" id="f-date" type="date" value="${rec?rec.date:todayStr()}"></div>
  <div class="field"><label>备注 <span class="hint">可选</span></label><textarea class="input" id="f-note" placeholder="备注">${esc(rec?rec.note:'')}</textarea></div>
  <div class="field"><label>凭证图片 <span class="hint">可选</span></label>${imgGridHTML()}</div>`;
}
function bindFinance(){pick('#f-cat');$('#f-flow').onclick=e=>{const b=e.target.closest('button');if(!b)return;[...$('#f-flow').children].forEach(x=>x.classList.remove('on-need','on-imp'));b.classList.add(b.dataset.v==='expense'?'on-imp':'on-need');};}
/* 睡眠 */
function sleepForm(rec){
  const q=rec?rec.quality:4;
  return `<div class="field"><label>睡眠质量</label><div class="stars" id="f-stars">${[1,2,3,4,5].map(i=>`<span class="${i<=q?'on':''}" data-v="${i}">${getIcon('star')}</span>`).join('')}</div></div>
  <div class="row2"><div class="field"><label>入睡时间</label><input class="input" id="f-sleep" type="time" value="${rec?rec.sleepTime:'23:00'}"></div>
  <div class="field"><label>起床时间</label><input class="input" id="f-wake" type="time" value="${rec?rec.wakeTime:'07:00'}"></div></div>
  <div class="field"><label>睡眠时长</label><input class="input" id="f-dur" value="${rec?rec.duration:''}" placeholder="自动计算" readonly></div>
  <div class="field"><label>是否午睡</label><div class="toggle2" id="f-nap"><button class="${!rec||!rec.nap?'on-need':''}" data-v="no">否</button><button class="${rec&&rec.nap?'on-imp':''}" data-v="yes">是</button></div></div>
  <div class="field" id="f-napd-wrap" style="${rec&&rec.nap?'':'display:none'}"><label>午睡时长（小时）</label><input class="input" id="f-napd" type="number" step="0.5" value="${rec&&rec.nap?rec.napDuration:1}"></div>
  <div class="field"><label>备注 <span class="hint">可选</span></label><textarea class="input" id="f-note" placeholder="今天睡得很好 💤">${esc(rec?rec.note:'')}</textarea></div>
  <div class="field"><label>睡眠截图 <span class="hint">可选</span></label>${imgGridHTML()}</div>`;
}
function bindSleep(){
  $('#f-stars').onclick=e=>{const s=e.target.closest('span');if(!s)return;const v=+s.dataset.v;[...$('#f-stars').children].forEach((x,i)=>x.classList.toggle('on',i<v));};
  const calc=()=>{const a=$('#f-sleep').value,b=$('#f-wake').value;if(a&&b){let[ah,am]=a.split(':').map(Number),[bh,bm]=b.split(':').map(Number);let mins=(bh*60+bm)-(ah*60+am);if(mins<0)mins+=24*60;$('#f-dur').value=(mins/60).toFixed(1);}};
  $('#f-sleep').onchange=calc;$('#f-wake').onchange=calc;calc();
  $('#f-nap').onclick=e=>{const b=e.target.closest('button');if(!b)return;[...$('#f-nap').children].forEach(x=>x.classList.remove('on-need','on-imp'));b.classList.add(b.dataset.v==='yes'?'on-imp':'on-need');$('#f-napd-wrap').style.display=b.dataset.v==='yes'?'':'none';};
}
function albumForm(rec){
  return `<div class="field"><label>照片（最多 3 张）</label>${imgGridHTML()}</div>
  <div class="field"><label>备注 <span class="hint">可选</span></label><textarea class="input" id="f-note" placeholder="写下这张照片的故事...">${esc(rec?rec.note:'')}</textarea></div>`;
}
function bindAlbum(){}
function pick(sel){const el=$(sel);el.onclick=e=>{const o=e.target.closest('.icon-opt');if(!o)return;[...el.children].forEach(c=>c.classList.remove('sel'));o.classList.add('sel');};}
function val(id){const el=$('#'+id);return el?el.value.trim():'';}

function saveForm(cat,id){
  const date=formDate;const time=nowHM();
  let rec={id:id||uid(),date,time};
  if(cat==='diet'){rec.meal=sel('#f-meal');rec.name=val('f-name');if(!rec.name){toast('请填写食物名称');return;}
    rec.icon=(sel('#f-emoji')||'🍚');rec.place=val('f-place');rec.time=time;rec.note=val('f-note');rec.images=formImages.slice();}
  if(cat==='drink'){rec.type='other';rec.typeName='饮料';rec.brand='';rec.sweet=+$('#f-sweet').value;rec.price=+val('f-price')||0;rec.time=time;rec.images=formImages.slice();}
  if(cat==='sport'){rec.type=sel('#f-type');rec.typeName=SPORT_TYPES.find(t=>t.k===rec.type).n;
    ['distance','climb','pace','duration'].forEach(f=>{rec[f]=$('#f-'+f)?(+val('f-'+f)||''):(rec[f]||'');});
    rec.calories=+$('#f-cal').value||0;rec.mood=sel('#f-mood')||'happy';rec.images=formImages.slice();}
  if(cat==='mood'){rec.mood=sel('#f-mood');if(!rec.mood){toast('请选择心情');return;}rec.moodName=MOODS.find(m=>m.k===rec.mood).n;rec.tags=$$('#f-tags .icon-opt.sel').map(o=>o.dataset.t);rec.desc=val('f-desc');rec.images=formImages.slice();}
  if(cat==='consume'){rec.type=sel('#f-type');rec.typeName=CONSUME_TYPES.find(t=>t.k===rec.type).n;rec.amount=+val('f-amount');if(!rec.amount){toast('请填写金额');return;}
    rec.merchant=val('f-merchant');rec.impulse=$('#f-imp .on-imp')?true:false;rec.note=val('f-note');rec.image=formImages[0]||null;rec.images=formImages.slice();
    // 同步到理财支出
    syncFinance(rec,id);}
  if(cat==='finance'){rec.flow=$('#f-flow .on-imp')?'expense':'income';rec.category=sel('#f-cat');rec.catName=FIN_CATS.find(c=>c.k===rec.category).n;rec.amount=+val('f-amount');if(!rec.amount){toast('请填写金额');return;}rec.date=val('f-date')||date;rec.note=val('f-note');rec.image=formImages[0]||null;rec.images=formImages.slice();rec.ref=null;}
  if(cat==='sleep'){rec.quality=+$('#f-stars .on:last-child')?.dataset.v||[...$$('#f-stars .on')].length;rec.sleepTime=val('f-sleep');rec.wakeTime=val('f-wake');rec.duration=val('f-dur');rec.nap=$('#f-nap .on-imp')?true:false;rec.napDuration=rec.nap?+val('f-napd')||0:0;rec.note=val('f-note');rec.image=formImages[0]||null;rec.images=formImages.slice();}
  if(cat==='album'){rec.note=val('f-note');rec.images=formImages.slice();if(!rec.images.length){toast('请至少选择一张照片');return;}}
  const arr=state.records[cat];const idx=arr.findIndex(r=>r.id===rec.id);
  if(idx>=0)arr[idx]=rec;else arr.push(rec);
  save();closeModal();
  if(curDetail===cat&&!$('#detail-view').classList.contains('hidden'))refreshDetail();
  if(!$('#view-home').classList.contains('hidden'))renderHome();
  if(!$('#view-profile').classList.contains('hidden'))renderProfile();
  if(!$('#view-stats').classList.contains('hidden'))renderStats();
  toast(id?'已修改':'已保存 ✅');
  checkBudget();
}
function sel(sel){const o=$(sel+' .icon-opt.sel');return o?o.dataset.v||o.dataset.e:null;}
function syncFinance(rec,id){
  // 删除旧关联
  if(id){const old=findArr('consume',id);}
  state.records.finance=state.records.finance.filter(f=>f.ref!==(id||'__new__'));
  const fin={id:uid(),date:rec.date,flow:'expense',amount:rec.amount,category:'daily',catName:'日常消费',note:'来自消费记录',image:rec.image,ref:rec.id};
  state.records.finance.push(fin);
}
function delRec(cat,id){
  openConfirm('确定删除这条记录吗？',()=>{
    if(cat==='consume'){state.records.finance=state.records.finance.filter(f=>f.ref!==id);}
    state.records[cat]=state.records[cat].filter(r=>r.id!==id);
    save();if(curDetail===cat)refreshDetail();if(!$('#view-home').classList.contains('hidden'))renderHome();
    if(!$('#view-profile').classList.contains('hidden'))renderProfile();toast('已删除');
  });
}

/* ===========================================================
   相册
   =========================================================== */
function allImages(){const out=[];RECORD_CATS.forEach(c=>{state.records[c].forEach(r=>{(r.images||[]).concat(c==='consume'&&r.image?[r.image]:c==='sleep'&&r.image?[r.image]:c==='finance'&&r.image?[r.image]:[]).filter(Boolean).forEach(s=>out.push({src:s,date:r.date,cat:c}));});});(state.records.album||[]).forEach(r=>{(r.images||[]).filter(Boolean).forEach(s=>out.push({src:s,date:r.date,cat:'album'}));});return out;}
function renderAlbum(){
  $('#detail-title').textContent='相册 · 回忆';$('#detail-add').style.visibility='visible';
  $('#detail-add').onclick=()=>openForm('album',null);
  const imgs=allImages();
  if(imgs.length===0){$('#detail-body').innerHTML=`<div class="empty"><span class="em-ico">📸</span>还没有照片，去记录里上传吧～</div>`;return;}
  const groups={};imgs.forEach(i=>{(groups[i.date]=groups[i.date]||[]).push(i);});
  let html='';
  Object.keys(groups).sort((a,b)=>b.localeCompare(a)).forEach(d=>{
    html+=`<div class="date-group">${d} · ${weekday(d)}（${groups[d].length}张）</div><div class="thumb-row" style="gap:6px">${groups[d].map(g=>`<img src="${g.src}" style="width:80px;height:80px" onclick="window.__prev('${g.src}')">`).join('')}</div>`;
  });
  $('#detail-body').innerHTML=html;
  window.__prev=previewImg;
}

/* ===========================================================
   个人页
   =========================================================== */
function renderProfile(){
  const p=state.profile;const today=todayStr();
  const done=RECORD_CATS.filter(c=>state.records[c].some(r=>r.date===today)).length;
  // 本周记录天数
  const weekDays=new Set();for(let i=0;i<7;i++){const d=todayStr(daysAgo(i));RECORD_CATS.forEach(c=>{if(state.records[c].some(r=>r.date===d))weekDays.add(d);});}
  // 周汇总
  const wk=last7();
  const wcons=state.records.consume.filter(r=>wk.includes(r.date));
  const wsport=state.records.sport.filter(r=>wk.includes(r.date));
  const wmood=state.records.mood.filter(r=>wk.includes(r.date));
  const wsleep=state.records.sleep.filter(r=>wk.includes(r.date));
  const sumCards=[
    {c:'diet',n:'饮食',i:'diet',rows:`${state.records.diet.filter(r=>wk.includes(r.date)).length} 餐`},
    {c:'drink',n:'饮料',i:'drink',rows:`${state.records.drink.filter(r=>wk.includes(r.date)).length} 杯`},
    {c:'sport',n:'运动',i:'sport',rows:`${wsport.length} 次 · ${wsport.reduce((a,r)=>a+(+r.distance||0),0).toFixed(1)}km`},
    {c:'mood',n:'心情',i:'mood',rows:wmood.length?wmood[wmood.length-1].moodName:'—'},
    {c:'consume',n:'消费',i:'consume',rows:`¥${wcons.reduce((a,r)=>a+(+r.amount||0),0)}`},
    {c:'sleep',n:'睡眠',i:'sleep',rows:wsleep.length?(wsleep.reduce((a,r)=>a+(+r.duration||0),0)/wsleep.length).toFixed(1)+'h':'—'},
  ];
  const av=p.avatar?`<img src="${p.avatar}" alt="">`:getIcon('profile');
  $('#view-profile').innerHTML=`
    <div class="profile-head fade-in">
      <div class="avatar" id="p-avatar">${av}</div>
      <div class="p-name" id="p-name">${esc(p.nickname)} <span class="pen">${getIcon('edit')}</span></div>
      <div class="p-sign" id="p-sign">${esc(p.signature||'点击添加个性签名')}</div>
    </div>
    <div class="section-title"><span class="st-ico">${getIcon('star')}</span>打卡概况</div>
    <div class="stat3">
      <div class="s3"><b>${done}/${RECORD_CATS.length}</b><span>今日打卡</span></div>
      <div class="s3"><b>${weekDays.size}</b><span>本周记录天数</span></div>
      <div class="s3"><b>${allImages().length}</b><span>相册照片</span></div>
    </div>
    <div class="pyq-entry" id="pyq-entry">
      <div class="pe-ico">${getIcon('moments')}</div>
      <div class="pe-mid">
        <div class="pe-t1">朋友圈 <span class="pe-tag">🌙 每日凌晨更新</span></div>
        <div class="pe-t2">${momentsLatestDesc()}</div>
      </div>
      <span class="pe-arrow">${getIcon('arrow')}</span>
    </div>
    <div class="section-title"><span class="st-ico">${getIcon('stats')}</span>本周记录汇总</div>
    <div class="week-sum">${sumCards.map(s=>`<div class="ws-card"><div class="ws-t">${getIcon(s.i)} ${s.n}</div><div class="ws-row"><span>${s.rows}</span></div></div>`).join('')}</div>`;
  $('#p-avatar').onclick=changeAvatar;
  $('#p-name').onclick=editName;
  $('#p-sign').onclick=editSign;
  $('#pyq-entry').onclick=openPyq;
}
function changeAvatar(){
  pickImage(async d=>{state.profile.avatar=d;save();renderProfile();toast('头像已更新');});
}
function editName(){
  openModal('修改昵称',`<div class="field"><input class="input" id="f-v" value="${esc(state.profile.nickname)}" placeholder="昵称"></div>`,`<button class="btn-ghost" id="m-cancel">取消</button><button class="btn-primary" id="m-ok">保存</button>`);
  $('#m-cancel').onclick=closeModal;$('#m-ok').onclick=()=>{const v=val('f-v');if(v){state.profile.nickname=v;save();renderProfile();closeModal();toast('已保存');}};
}
function editSign(){
  openModal('个性签名',`<div class="field"><textarea class="input" id="f-v" placeholder="一句话介绍自己">${esc(state.profile.signature||'')}</textarea></div>`,`<button class="btn-ghost" id="m-cancel">取消</button><button class="btn-primary" id="m-ok">保存</button>`);
  $('#m-cancel').onclick=closeModal;$('#m-ok').onclick=()=>{state.profile.signature=val('f-v');save();renderProfile();closeModal();toast('已保存');};
}

/* ===========================================================
   统计
   =========================================================== */
function last7(){const a=[];for(let i=6;i>=0;i--)a.push(todayStr(daysAgo(i)));return a;}
function lastN(n){const a=[];for(let i=n-1;i>=0;i--)a.push(todayStr(daysAgo(i)));return a;}
function renderStats(){
  const catBar=`<div class="cat-tabs">${STATS_CATS.map(c=>`<button class="cat-tab${curStatsCat===c[0]?' active':''}" data-c="${c[0]}"><span>${c[2]}</span>${c[1]}</button>`).join('')}</div>`;
  const ctl=`<div class="seg-ctl"><button class="${curStatsRange==='week'?'active':''}" data-r="week">周</button><button class="${curStatsRange==='month'?'active':''}" data-r="month">月</button><button class="${curStatsRange==='year'?'active':''}" data-r="year">年</button></div>`;
  $('#view-stats').innerHTML=`<div class="fade-in">${catBar}${ctl}${statsCatBody()}</div>`;
  $$('#view-stats .cat-tab').forEach(b=>b.onclick=()=>{curStatsCat=b.dataset.c;renderStats();});
  $$('#view-stats .seg-ctl button').forEach(b=>b.onclick=()=>{curStatsRange=b.dataset.r;renderStats();});
  // 绘制图表
  drawStatsCharts();
  // 饮料照片墙：后台把旧照片补抠成贴纸（成功一张刷新一次）
  if(curStatsCat==='drink')retroCutPhotos();
}
/* 按分类+范围统计（diet/drink/sport/mood/consume × 周/月/年） */
function statsCatBody(){
  const y=curYear;
  let dates=null;
  if(curStatsRange==='week')dates=last7();
  if(curStatsRange==='month'){const yy=new Date().getFullYear(),mm=new Date().getMonth();const dd=new Date(yy,mm+1,0).getDate();dates=[];for(let i=1;i<=dd;i++)dates.push(yy+'-'+String(mm+1).padStart(2,'0')+'-'+String(i).padStart(2,'0'));}
  const inR=r=>dates?dates.includes(r.date):r.date.startsWith(y+'-');
  const lb=curStatsRange==='week'?'本周':curStatsRange==='month'?'本月':y+'年';
  const PA=i=>PALETTE[i%PALETTE.length];
  const recs=state.records[curStatsCat].filter(inR);
  let body='';
  if(curStatsCat==='diet'){
    const byMeal=MEALS.map((m,i)=>({label:m.n,value:recs.filter(r=>r.meal===m.k).length,color:PA(i)}));
    window.__catDonut=byMeal;
    body=`<div class="kpi-row"><div class="kpi"><b>${recs.length}</b><span>${lb}饮食记录</span></div><div class="kpi"><b>${new Set(recs.map(r=>r.date)).size}</b><span>记录天数</span></div></div>
    <div class="chart-card"><h4>三餐分布</h4><canvas id="c-cat"></canvas><div class="legend">${byMeal.map(c=>`<span><i style="background:${c.color}"></i>${c.label} ${c.value}</span>`).join('')}</div></div>`;
  }
  if(curStatsCat==='drink'){
    const total=recs.reduce((a,r)=>a+(+r.price||0),0);
    const bySweet=SWEET.map((s,i)=>({label:s,value:recs.filter(r=>+r.sweet===i).length,color:PA(i)}));
    window.__catDonut=bySweet;
    const ph=[];recs.forEach(r=>((r.images&&r.images.length)?r.images:(r.image?[r.image]:[])).forEach(s=>ph.push(s)));
    const wall=ph.length?`<div class="fall-wall">${ph.map((s,i)=>`<img class="fall-photo${isCut(s)?' ct':' doodle'}" src="${s}" style="animation-delay:${(Math.min(i,24)*0.12).toFixed(2)}s" onclick="window.__prev('${s}')">`).join('')}</div>`:`<div class="empty">${lb}还没有上传饮料照片 📷</div>`;
    body=`<div class="kpi-row"><div class="kpi"><b>${recs.length}</b><span>${lb}喝了几杯</span></div><div class="kpi"><b>¥${total}</b><span>${lb}饮料花费</span></div><div class="kpi"><b>${recs.length?'¥'+(total/recs.length).toFixed(1):'—'}</b><span>平均每杯</span></div></div>
    <div class="chart-card"><h4>${lb}饮料照片墙 📸</h4>${wall}</div>
    <div class="chart-card"><h4>甜度偏好</h4><canvas id="c-cat"></canvas><div class="legend">${bySweet.map(c=>`<span><i style="background:${c.color}"></i>${c.label} ${c.value}</span>`).join('')}</div></div>`;
  }
  if(curStatsCat==='sport'){
    const rideKm=recs.filter(r=>r.type==='ride').reduce((a,r)=>a+(+r.distance||0),0);
    const runKm=recs.filter(r=>r.type==='run').reduce((a,r)=>a+(+r.distance||0),0);
    const swimM=recs.filter(r=>r.type==='swim').reduce((a,r)=>a+(+r.distance||0),0);
    const byType=SPORT_TYPES.map((t,i)=>({label:t.n,value:recs.filter(r=>r.type===t.k).length,color:PA(i)}));
    window.__catDonut=byType;
    body=`<div class="kpi-row"><div class="kpi"><b>${recs.length}次</b><span>${lb}运动次数</span></div><div class="kpi"><b>${(rideKm+runKm+swimM/1000).toFixed(1)}km</b><span>${lb}总里程</span></div></div>
    <div class="kpi-row"><div class="kpi"><b>${rideKm.toFixed(1)}km</b><span>🚴 骑行</span></div><div class="kpi"><b>${runKm.toFixed(1)}km</b><span>🏃 跑步</span></div><div class="kpi"><b>${swimM.toFixed(0)}m</b><span>🏊 游泳</span></div></div>
    <div class="chart-card"><h4>运动类型分布</h4><canvas id="c-cat"></canvas><div class="legend">${byType.map(c=>`<span><i style="background:${c.color}"></i>${c.label} ${c.value}</span>`).join('')}</div></div>`;
  }
  if(curStatsCat==='mood'){
    const allMood=MOODS.map((m,i)=>({label:m.n,value:recs.filter(r=>r.mood===m.k).length,color:PA(i)}));
    const byMood=allMood.filter(z=>z.value>0);
    window.__catDonut=allMood;
    body=`<div class="kpi-row"><div class="kpi"><b>${recs.length}</b><span>${lb}心情记录</span></div><div class="kpi"><b>${new Set(recs.map(r=>r.date)).size}</b><span>记录天数</span></div></div>
    <div class="chart-card"><h4>心情分布</h4><canvas id="c-cat"></canvas><div class="legend">${byMood.map(c=>`<span><i style="background:${c.color}"></i>${c.label} ${c.value}</span>`).join('')}</div></div>`;
  }
  if(curStatsCat==='consume'){
    const total=recs.reduce((a,r)=>a+(+r.amount||0),0);
    const imp=recs.filter(r=>r.impulse).length;
    const allType=CONSUME_TYPES.map((t,i)=>({label:t.n,value:recs.filter(r=>r.type===t.k).reduce((a,r)=>a+(+r.amount||0),0),color:PA(i)}));
    const byType=allType.filter(x=>x.value>0);
    window.__catDonut=allType;
    body=`<div class="kpi-row"><div class="kpi"><b>¥${total}</b><span>${lb}总消费</span></div><div class="kpi"><b style="color:var(--warn)">${imp}次</b><span>冲动消费</span></div></div>
    <div class="chart-card"><h4>消费类型占比</h4><canvas id="c-cat"></canvas><div class="legend">${byType.map(c=>`<span><i style="background:${c.color}"></i>${c.label} ¥${c.value}</span>`).join('')}</div></div>`;
  }
  window.__prev=previewImg;
  return body||'<div class="empty">暂无数据</div>';
}
/* 旧照片后台补抠图：饮料照片墙要求统一为「抠主体+白描边」贴纸；非贴纸照片逐张尝试抠图并原位升级 */
const _retroCutTried=new Set();
let _retroCutRunning=false;
async function retroCutPhotos(){
  if(_retroCutRunning)return;_retroCutRunning=true;
  try{
    const arr=state.records.drink||[];
    for(const r of arr){
      const imgs=(r.images&&r.images.length)?r.images:(r.image?[r.image]:[]);
      for(let i=0;i<imgs.length;i++){
        const s=imgs[i];
        if(typeof s!=='string'||!s.startsWith('data:image/')||isCut(s)||_retroCutTried.has(s))continue;
        _retroCutTried.add(s);
        try{
          const st=await cutoutImage(s);
          if(st&&imgs[i]===s){imgs[i]=st;if(r.images)r.images=imgs;else r.image=imgs[0];save();
            if(curStatsCat==='drink'&&!$('#view-stats').classList.contains('hidden'))renderStats();}
        }catch(e){}
      }
    }
  }finally{_retroCutRunning=false;}
}
function statsWeek(){
  const wk=last7();
  // 分类占比 donut
  const cnt=RECORD_CATS.map(c=>({label:CATS.find(x=>x.key===c).name,value:state.records[c].filter(r=>wk.includes(r.date)).length,color:PALETTE[RECORD_CATS.indexOf(c)]}));
  // 每日条数 bar
  const daily=wk.map(d=>RECORD_CATS.reduce((a,c)=>a+state.records[c].filter(r=>r.date===d).length,0));
  // 心情折线
  const moodVals=wk.map(d=>{const m=state.records.mood.filter(r=>r.date===d);return m.length?MOODS.find(x=>x.k===m[m.length-1].mood).v:0;});
  // 运动
  const sp=state.records.sport.filter(r=>wk.includes(r.date));
  const rideKm=sp.filter(r=>r.type==='ride').reduce((a,r)=>a+(+r.distance||0),0);
  const runKm=sp.filter(r=>r.type==='run').reduce((a,r)=>a+(+r.distance||0),0);
  const swimM=sp.filter(r=>r.type==='swim').reduce((a,r)=>a+(+r.distance||0),0);
  // 消费
  const cons=state.records.consume.filter(r=>wk.includes(r.date));
  const consTotal=cons.reduce((a,r)=>a+(+r.amount||0),0);const impulse=cons.filter(r=>r.impulse).length;
  // 睡眠
  const sl=state.records.sleep.filter(r=>wk.includes(r.date));
  const slAvg=sl.length?(sl.reduce((a,r)=>a+(+r.duration||0),0)/sl.length):0;
  const slQ=wk.map(d=>{const s=state.records.sleep.filter(r=>r.date===d);return s.length?(s.reduce((a,r)=>a+r.quality,0)/s.length):0;});
  // 理财
  const fin=state.records.finance.filter(r=>wk.includes(r.date));
  const inc=fin.filter(r=>r.flow==='income').reduce((a,r)=>a+(+r.amount||0),0);
  const exp=fin.filter(r=>r.flow==='expense').reduce((a,r)=>a+(+r.amount||0),0);
  return `
   <div class="chart-card"><h4>各分类记录次数占比</h4><canvas id="c-donut"></canvas><div class="legend">${cnt.map(c=>`<span><i style="background:${c.color}"></i>${c.label} ${c.value}</span>`).join('')}</div></div>
   <div class="chart-card"><h4>每日记录条数</h4><canvas id="c-bar"></canvas></div>
   <div class="chart-card"><h4>心情走势（7天）</h4><canvas id="c-mood"></canvas></div>
   <div class="kpi-row">
     <div class="kpi"><b>${rideKm.toFixed(1)}km</b><span>🚴 骑行总里程</span></div>
     <div class="kpi"><b>${runKm.toFixed(1)}km</b><span>🏃 跑步总里程</span></div>
     <div class="kpi"><b>${swimM.toFixed(0)}m</b><span>🏊 游泳距离</span></div>
     <div class="kpi"><b>${sp.length}次</b><span>运动总次数</span></div>
   </div>
   <div class="kpi-row">
     <div class="kpi"><b>¥${consTotal}</b><span>本周总消费</span></div>
     <div class="kpi"><b style="color:var(--warn)">${impulse}次</b><span>冲动消费</span></div>
   </div>
   <div class="chart-card"><h4>睡眠质量趋势</h4><canvas id="c-sleep"></canvas></div>
   <div class="kpi-row">
     <div class="kpi"><b>${slAvg.toFixed(1)}h</b><span>平均睡眠时长</span></div>
     <div class="kpi"><b>¥${inc-exp}</b><span>本周结余</span></div>
   </div>`;
}
function statsMonth(){
  const y=new Date().getFullYear(),m=new Date().getMonth();const days=new Date(y,m+1,0).getDate();
  const dates=[];for(let i=1;i<=days;i++)dates.push(y+'-'+String(m+1).padStart(2,'0')+'-'+String(i).padStart(2,'0'));
  const dens=dates.map(d=>RECORD_CATS.reduce((a,c)=>a+state.records[c].filter(r=>r.date===d).length,0));
  // 消费饼
  const cons=state.records.consume.filter(r=>dates.includes(r.date));
  const byType=CONSUME_TYPES.map(t=>({label:t.n,value:cons.filter(r=>r.type===t.k).reduce((a,r)=>a+(+r.amount||0),0),color:PALETTE[CONSUME_TYPES.indexOf(t)]})).filter(x=>x.value>0);
  const consTotal=cons.reduce((a,r)=>a+(+r.amount||0),0);
  // 饮食分布 by meal
  const diet=state.records.diet.filter(r=>dates.includes(r.date));
  const byMeal=MEALS.map(me=>({label:me.n,value:diet.filter(r=>r.meal===me.k).length,color:PALETTE[MEALS.indexOf(me)]}));
  // 心情饼
  const mood=state.records.mood.filter(r=>dates.includes(r.date));
  const byMood=MOODS.map(x=>({label:x.n,value:mood.filter(r=>r.mood===x.k).length,color:PALETTE[MOODS.indexOf(x)]})).filter(z=>z.value>0);
  // 睡眠折线
  const slVals=dates.map(d=>{const s=state.records.sleep.filter(r=>r.date===d);return s.length?(s.reduce((a,r)=>a+(+r.duration||0),0)/s.length):0;});
  // 理财月报
  const fin=state.records.finance.filter(r=>dates.includes(r.date));
  const inc=fin.filter(r=>r.flow==='income').reduce((a,r)=>a+(+r.amount||0),0);
  const exp=fin.filter(r=>r.flow==='expense').reduce((a,r)=>a+(+r.amount||0),0);
  const budget=state.settings.budgetMonthly;const rate=budget?Math.round(exp/budget*100):0;
  return `
   <div class="chart-card"><h4>记录密度日历（颜色越深记录越多）</h4><div class="heatmap">${heatCells(dates,dens)}</div></div>
   <div class="chart-card"><h4>消费类型占比（月总 ¥${consTotal}）</h4><canvas id="c-cons"></canvas><div class="legend">${byType.map(c=>`<span><i style="background:${c.color}"></i>${c.label} ¥${c.value}</span>`).join('')}</div></div>
   <div class="chart-card"><h4>三餐分布</h4><canvas id="c-meal"></canvas></div>
   <div class="chart-card"><h4>心情分布</h4><canvas id="c-moodp"></canvas><div class="legend">${byMood.map(c=>`<span><i style="background:${c.color}"></i>${c.label} ${c.value}</span>`).join('')}</div></div>
   <div class="chart-card"><h4>睡眠时长趋势</h4><canvas id="c-sleep"></canvas></div>
   <div class="chart-card"><h4>理财月报</h4>
     <div class="kpi-row"><div class="kpi"><b>¥${inc}</b><span>月收入</span></div><div class="kpi"><b>¥${exp}</b><span>月支出</span></div></div>
     <div class="kpi" style="margin-top:10px"><b style="color:${rate>state.settings.threshold?'var(--warn)':'var(--accent)'}">${rate}%</b><span>预算执行率（月预算 ¥${budget}）</span></div>
   </div>`;
}
function statsYear(){
  const y=curYear;const months=[];for(let i=1;i<=12;i++)months.push(y+'-'+String(i).padStart(2,'0'));
  // 月消费趋势
  const consTrend=months.map(m=>state.records.consume.filter(r=>r.date.startsWith(m)).reduce((a,r)=>a+(+r.amount||0),0));
  // 心情分布
  const mood=state.records.mood.filter(r=>r.date.startsWith(y+'-'));
  const byMood=MOODS.map(x=>({label:x.n,value:mood.filter(r=>r.mood===x.k).length,color:PALETTE[MOODS.indexOf(x)]})).filter(z=>z.value>0);
  // 各项年度汇总
  const totalDays=new Set();RECORD_CATS.forEach(c=>state.records[c].filter(r=>r.date.startsWith(y+'-')).forEach(r=>totalDays.add(r.date)));
  const totCons=state.records.consume.filter(r=>r.date.startsWith(y+'-')).reduce((a,r)=>a+(+r.amount||0),0);
  const fin=state.records.finance.filter(r=>r.date.startsWith(y+'-'));
  const inc=fin.filter(r=>r.flow==='income').reduce((a,r)=>a+(+r.amount||0),0);
  const exp=fin.filter(r=>r.flow==='expense').reduce((a,r)=>a+(+r.amount||0),0);
  const rideKm=state.records.sport.filter(r=>r.date.startsWith(y+'-')&&r.type==='ride').reduce((a,r)=>a+(+r.distance||0),0);
  const runKm=state.records.sport.filter(r=>r.date.startsWith(y+'-')&&r.type==='run').reduce((a,r)=>a+(+r.distance||0),0);
  // 相册时间轴
  const imgs=allImages().filter(i=>i.date.startsWith(y+'-'));
  const groups={};imgs.forEach(i=>{(groups[i.date]=groups[i.date]||[]).push(i);});
  let album='';Object.keys(groups).sort((a,b)=>b.localeCompare(a)).slice(0,40).forEach(d=>{album+=`<div class="date-group">${d}</div><div class="thumb-row">${groups[d].map(g=>`<img src="${g.src}" style="width:64px;height:64px" onclick="window.__prev('${g.src}')">`).join('')}</div>`;});
  window.__prev=previewImg;
  return `
   <div class="section-title"><span class="st-ico">${getIcon('star')}</span>${y} 年度回忆</div>
   <div class="kpi-row">
     <div class="kpi"><b>${totalDays.size}</b><span>记录总天数</span></div>
     <div class="kpi"><b>¥${totCons}</b><span>年度总消费</span></div>
     <div class="kpi"><b>¥${inc-exp}</b><span>年度结余</span></div>
     <div class="kpi"><b>${(rideKm+runKm).toFixed(0)}km</b><span>累计运动里程</span></div>
   </div>
   <div class="chart-card"><h4>月度消费趋势（${y}）</h4><canvas id="c-cons-trend"></canvas></div>
   <div class="chart-card"><h4>年度心情分布</h4><canvas id="c-moodp"></canvas><div class="legend">${byMood.map(c=>`<span><i style="background:${c.color}"></i>${c.label} ${c.value}</span>`).join('')}</div></div>
   <div class="chart-card"><h4>年度报告（图文）</h4>
     <p style="font-size:13px;line-height:1.7;color:var(--text)">这一年你一共记录了 <b>${totalDays.size}</b> 天，留下 <b>${imgs.length}</b> 张照片 📸。<br>
     消费 ¥${totCons}，其中骑行 ${rideKm.toFixed(0)}km、跑步 ${runKm.toFixed(0)}km，运动从未缺席。<br>
     收入 ¥${inc}，支出 ¥${exp}，结余 ¥${inc-exp}。继续把生活过成喜欢的样子吧 🌿</p>
     <button class="btn-ghost" id="y-pdf">导出年度报告（打印 / 存为 PDF）</button>
   </div>
   <div class="chart-card"><h4>年度相册时间轴</h4>${album||'<div class="empty">今年还没有照片</div>'}</div>`;
}
function heatCells(dates,dens){
  const max=Math.max(1,...dens);
  const dow=['日','一','二','三','四','五','六'];
  let head=dow.map(d=>`<div class="cal-dow">${d}</div>`).join('');
  const firstDow=new Date(dates[0]).getDay();
  let cells='';for(let i=0;i<firstDow;i++)cells+=`<div class="heat-cell muted"></div>`;
  dates.forEach((d,i)=>{const lv=Math.ceil(dens[i]/max*5);cells+=`<div class="heat-cell lvl${lv}" title="${d}:${dens[i]}条">${+d.slice(-2)}</div>`;});
  return head+cells;
}
function drawStatsCharts(){
  const q=s=>$('#'+s);
  if(q('c-donut'))drawDonut(q('c-donut'),JSON.parse(JSON.stringify(parseDonutData('week'))));
  if(q('c-bar'))drawBar(q('c-bar'),last7().map(d=>d.slice(5)),barData(),PALETTE);
  if(q('c-mood'))drawLine(q('c-mood'),last7().map(d=>d.slice(5)),moodData(),'#2E7D32');
  if(q('c-sleep'))drawLine(q('c-sleep'),sleepLabels(),sleepData(),'#42A5F5');
  if(q('c-cons'))drawDonut(q('c-cons'),consPie());
  if(q('c-meal'))drawBar(q('c-meal'),MEALS.map(m=>m.n),mealData(),PALETTE);
  if(q('c-moodp'))drawDonut(q('c-moodp'),curStatsRange==='month'?monthMoodPie():moodPie());
  if(q('c-cons-trend')){const y=curYear;const months=[];for(let i=1;i<=12;i++)months.push(i+'月');drawLine(q('c-cons-trend'),months,monthConsTrend(),'#FF7043');}
  if(q('c-cat'))drawDonut(q('c-cat'),window.__catDonut||[]);
  const pdf=$('#y-pdf');if(pdf)pdf.onclick=()=>{toast('正在打开打印...');setTimeout(()=>window.print(),300);};
}
function parseDonutData(){const wk=last7();return RECORD_CATS.map(c=>({label:CATS.find(x=>x.key===c).name,value:state.records[c].filter(r=>wk.includes(r.date)).length,color:PALETTE[RECORD_CATS.indexOf(c)]}));}
function barData(){const wk=last7();return wk.map(d=>RECORD_CATS.reduce((a,c)=>a+state.records[c].filter(r=>r.date===d).length,0));}
function moodData(){const wk=last7();return wk.map(d=>{const m=state.records.mood.filter(r=>r.date===d);return m.length?MOODS.find(x=>x.k===m[m.length-1].mood).v:0;});}
function sleepLabels(){const wk=last7();return wk.map(d=>d.slice(5));}
function sleepData(){const wk=last7();return wk.map(d=>{const s=state.records.sleep.filter(r=>r.date===d);return s.length?(s.reduce((a,r)=>a+r.quality,0)/s.length):0;});}
function consPie(){const y=new Date().getFullYear(),m=new Date().getMonth();const ds=[];const days=new Date(y,m+1,0).getDate();for(let i=1;i<=days;i++)ds.push(y+'-'+String(m+1).padStart(2,'0')+'-'+String(i).padStart(2,'0'));const cons=state.records.consume.filter(r=>ds.includes(r.date));return CONSUME_TYPES.map(t=>({label:t.n,value:cons.filter(r=>r.type===t.k).reduce((a,r)=>a+(+r.amount||0),0),color:PALETTE[CONSUME_TYPES.indexOf(t)]})).filter(x=>x.value>0);}
function mealData(){const y=new Date().getFullYear(),m=new Date().getMonth();const ds=[];const days=new Date(y,m+1,0).getDate();for(let i=1;i<=days;i++)ds.push(y+'-'+String(m+1).padStart(2,'0')+'-'+String(i).padStart(2,'0'));const diet=state.records.diet.filter(r=>ds.includes(r.date));return MEALS.map(me=>diet.filter(r=>r.meal===me.k).length);}
function moodPie(){const y=curYear;const mood=state.records.mood.filter(r=>r.date.startsWith(y+'-'));return MOODS.map(x=>({label:x.n,value:mood.filter(r=>r.mood===x.k).length,color:PALETTE[MOODS.indexOf(x)]})).filter(z=>z.value>0);}
function monthMoodPie(){const y=new Date().getFullYear(),m=new Date().getMonth();const pre=y+'-'+String(m+1).padStart(2,'0');const mood=state.records.mood.filter(r=>r.date.startsWith(pre));return MOODS.map(x=>({label:x.n,value:mood.filter(r=>r.mood===x.k).length,color:PALETTE[MOODS.indexOf(x)]})).filter(z=>z.value>0);}
function monthConsTrend(){const y=curYear;const months=[];for(let i=1;i<=12;i++){const m=y+'-'+String(i).padStart(2,'0');months.push(state.records.consume.filter(r=>r.date.startsWith(m)).reduce((a,r)=>a+(+r.amount||0),0));}return months;}

/* ===========================================================
   设置
   =========================================================== */
function renderSettings(){
  const s=state.settings;const p=state.profile;
  $('#view-settings').innerHTML=`
    <div class="set-list fade-in">
      <div class="set-row" id="s-avatar"><span class="sr-ico">${getIcon('profile')}</span><span class="sr-tx">头像</span><span class="sr-val">${p.avatar?'已设置':'默认'}</span><span class="sr-arrow">${getIcon('arrow')}</span></div>
      <div class="set-row" id="s-name"><span class="sr-ico">${getIcon('edit')}</span><span class="sr-tx">昵称</span><span class="sr-val">${esc(p.nickname)}</span><span class="sr-arrow">${getIcon('arrow')}</span></div>
      <div class="set-row" id="s-theme"><span class="sr-ico">${getIcon('palette')}</span><span class="sr-tx">主题色</span><span class="sr-val">清新绿（全设备统一）</span></div>
      <div class="set-row" id="s-budget"><span class="sr-ico">${getIcon('finance')}</span><span class="sr-tx">月预算设置</span><span class="sr-val">¥${s.budgetMonthly}</span><span class="sr-arrow">${getIcon('arrow')}</span></div>
      <div class="set-row" id="s-thr"><span class="sr-ico">${getIcon('star')}</span><span class="sr-tx">预算提醒阈值</span><span class="sr-val">${s.threshold}%</span><span class="sr-arrow">${getIcon('arrow')}</span></div>
    </div>
    <div class="set-list">
      <div class="set-row" id="s-storage" style="cursor:default"><span class="sr-ico">💾</span><span class="sr-tx">数据保存</span><span class="sr-val" id="s-storage-val" style="color:#2E7D32">正常 · 双重备份</span></div>
      ${hasDemo()?`<div class="set-row" id="s-demo"><span class="sr-ico">🧹</span><span class="sr-tx">清空演示数据</span><span class="sr-val">首次安装示例</span><span class="sr-arrow">${getIcon('arrow')}</span></div>`:''}
      <div class="set-row" id="s-export"><span class="sr-ico">${getIcon('download')}</span><span class="sr-tx">数据备份（导出）</span><span class="sr-arrow">${getIcon('arrow')}</span></div>
      <div class="set-row" id="s-import"><span class="sr-ico">${getIcon('restore')}</span><span class="sr-tx">数据导入（恢复）</span><span class="sr-arrow">${getIcon('arrow')}</span></div>
      <div class="set-row" id="s-clear"><span class="sr-ico">${getIcon('trash')}</span><span class="sr-tx" style="color:var(--warn)">清空所有数据</span><span class="sr-arrow">${getIcon('arrow')}</span></div>
    </div>
    <div class="set-list">
      ${(!window.matchMedia('(display-mode: standalone)').matches&&!window.navigator.standalone)?`<div class="set-row" id="s-install"><span class="sr-ico">📥</span><span class="sr-tx">安装应用（桌面/主屏幕）</span><span class="sr-val">离线可用</span><span class="sr-arrow">${getIcon('arrow')}</span></div>`:''}
      <div class="set-row" id="s-about"><span class="sr-ico">${getIcon('info')}</span><span class="sr-tx">关于 日常记录</span><span class="sr-val">v1.8</span><span class="sr-arrow">${getIcon('arrow')}</span></div>
    </div>`;
  $('#s-avatar').onclick=changeAvatar;
  refreshStorageStatus(); /* 若启动自检已完成，立即显示真实存储状态 */
  $('#s-name').onclick=editName;
  $('#s-theme').onclick=()=>toast('背景色已全设备统一为清新绿 🌿');
  $('#s-budget').onclick=()=>promptNum('月预算上限（元）',s.budgetMonthly,v=>{state.settings.budgetMonthly=+v||0;save();renderSettings();});
  $('#s-thr').onclick=()=>promptNum('预算提醒阈值（%）',s.threshold,v=>{state.settings.threshold=Math.max(1,Math.min(100,+v||80));save();renderSettings();});
  if($('#s-demo'))$('#s-demo').onclick=()=>openConfirm('只清空首次安装自带的演示数据，你自己记录的数据不受影响。确定清空？',clearDemo);
  if($('#s-install'))$('#s-install').onclick=async()=>{
    if(deferredPrompt){deferredPrompt.prompt();const c=await deferredPrompt.userChoice;deferredPrompt=null;if(c&&c.outcome==='accepted')renderSettings();return;}
    if(isIOS())toast('点浏览器底部「分享」→ 选「添加到主屏幕」');
    else toast('请使用浏览器菜单里的「安装应用 / 添加到桌面」');
  };
  $('#s-export').onclick=exportData;
  $('#s-import').onclick=importData;
  $('#s-clear').onclick=()=>openConfirm('确定清空全部数据？此操作不可恢复',()=>{RECORD_CATS.forEach(c=>state.records[c]=[]);save();toast('已清空全部数据');if(!$('#view-home').classList.contains('hidden'))renderHome();if(!$('#view-profile').classList.contains('hidden'))renderProfile();if(!$('#view-stats').classList.contains('hidden'))renderStats();});
  $('#s-about').onclick=()=>{openModal('关于 每日生活',`<div style="text-align:center;padding:10px"><div style="font-size:40px">🌿</div><p style="font-weight:800;font-size:17px;color:var(--accent)">每日生活 Daily Life</p><p style="color:var(--soft);font-size:13px">一款治愈系日常记录 App<br>记录饮食·饮料·运动·心情·消费·理财·睡眠<br>数据完全保存在本地，不上传服务器<br>版本 v1.8 · Web PWA</p></div>`,`<button class="btn-primary" id="m-ok">知道了</button>`);$('#m-ok').onclick=closeModal;};
}
function applyTheme(){document.body.classList.toggle('theme-green',state.settings.theme==='green');}
function promptNum(title,def,cb){openModal(title,`<div class="field"><input class="input" id="f-v" type="number" value="${def}" placeholder="数字"></div>`,`<button class="btn-ghost" id="m-cancel">取消</button><button class="btn-primary" id="m-ok">确定</button>`);$('#m-cancel').onclick=closeModal;$('#m-ok').onclick=()=>{cb(val('f-v'));closeModal();};}
function checkBudget(){
  if(budgetWarned)return;const s=state.settings;if(!s.budgetMonthly)return;
  const y=new Date().getFullYear(),m=new Date().getMonth();const pre=y+'-'+String(m+1).padStart(2,'0');
  const exp=state.records.finance.filter(r=>r.flow==='expense'&&r.date.startsWith(pre)).reduce((a,r)=>a+(+r.amount||0),0);
  if(exp>=s.budgetMonthly*s.threshold/100){budgetWarned=true;openModal('预算提醒 💡',`<div class="confirm-box"><p>本月已支出 ¥${exp}，<br>已达预算的 ${Math.round(exp/s.budgetMonthly*100)}%（阈值 ${s.threshold}%）。<br>注意理性消费哦～</p></div>`,`<button class="btn-primary" id="m-ok">我知道了</button>`);$('#m-ok').onclick=closeModal;}
}
function exportData(){
  openModal('数据备份',`<div class="confirm-box" style="text-align:left">
    <p>选择导出方式：</p>
    <button class="btn-ghost" id="ex-json" style="margin-bottom:8px">📦 导出 JSON（完整备份，含图片）</button>
    <button class="btn-ghost" id="ex-csv">📊 导出 CSV（文字+数字，图片以链接占位）</button>
    </div>`,`<button class="btn-ghost" id="m-cancel">取消</button>`);
  $('#m-cancel').onclick=closeModal;
  $('#ex-json').onclick=()=>{const blob=new Blob([JSON.stringify(state)],{type:'application/json'});downloadBlob(blob,'每日生活-备份-'+todayStr()+'.json');closeModal();toast('已导出 JSON');};
  $('#ex-csv').onclick=()=>{downloadBlob(new Blob([buildCSV()],{type:'text/csv;charset=utf-8'}),'每日生活-数据-'+todayStr()+'.csv');closeModal();toast('已导出 CSV');};
}
function buildCSV(){
  const lines=['分类,日期,时间,主信息,次信息,金额,图片数'];
  const push=(cat,r,main,sub,amt)=>{lines.push([cat,r.date,r.time||'',main,sub||'',amt||'',(r.images?r.images.length:0)+(r.image?1:0)].map(x=>`"${String(x).replace(/"/g,'""')}"`).join(','));};
  state.records.diet.forEach(r=>push('饮食',r,r.name,(MEALS.find(m=>m.k===r.meal).n)+' '+(r.place||'')));
  state.records.drink.forEach(r=>push('饮料',r,r.brand||r.typeName||'饮料',SWEET[r.sweet],r.price));
  state.records.sport.forEach(r=>push('运动',r,r.typeName,r.duration+'分钟',r.calories));
  state.records.mood.forEach(r=>push('心情',r,r.moodName,(r.tags||[]).join('/')+' '+(r.desc||'')));
  state.records.consume.forEach(r=>push('消费',r,r.merchant+'·'+r.typeName, r.impulse?'冲动':'必要',r.amount));
  state.records.finance.forEach(r=>push('理财',r,(r.flow==='income'?'收入':'支出')+'·'+r.catName,'',r.amount));
  state.records.sleep.forEach(r=>push('睡眠',r,r.duration+'h '+r.quality+'★',r.sleepTime+'→'+r.wakeTime));
  return '﻿'+lines.join('\n');
}
function importData(){
  pickJson(txt=>{
    try{
      const d=JSON.parse(txt);
      if(d&&d.records){
        /* 与默认结构合并，防止旧备份缺少新字段导致下次启动被判定为损坏数据 */
        const b=demoData();
        state={...b,...d,records:Object.assign({},b.records,d.records)};
        save();applyTheme();toast('导入成功');showTab('home');
      }else toast('文件格式不正确');
    }catch(err){toast('解析失败');}
  });
}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

/* ===========================================================
   弹窗 / 日历 / 预览
   =========================================================== */
function openModal(title,body,foot){
  $('#modal-title').textContent=title;$('#modal-body').innerHTML=body;
  $('#modal-foot').innerHTML=foot||'';$('#modal-mask').classList.remove('hidden');
}
function closeModal(){$('#modal-mask').classList.add('hidden');}
function openConfirm(msg,ok){
  openModal('提示',`<div class="confirm-box"><p>${msg}</p></div>`,`<button class="btn-ghost" id="cf-no">取消</button><button class="btn-primary" id="cf-ok">确定</button>`);
  $('#cf-no').onclick=closeModal;$('#cf-ok').onclick=()=>{closeModal();ok();};
}
function previewImg(src){$('#imgprev').src=src;$('#imgprev-mask').classList.remove('hidden');}
let calYear=new Date().getFullYear(),calMonth=new Date().getMonth();
function firstImageOfDay(d){
  for(const c of RECORD_CATS.concat(['album'])){
    const arr=c==='album'?allImages():state.records[c].filter(r=>r.date===d);
    for(const r of arr){
      const imgs=(r.images||[]).concat(r.image?[r.image]:[]).filter(Boolean);
      if(imgs.length)return {src:imgs[0],cat:c};
    }
  }
  return null;
}
function dayRepresentative(d){
  const img=firstImageOfDay(d);
  if(img)return {type:'img',src:img.src,cat:img.cat};
  for(const c of RECORD_CATS){
    if(state.records[c].some(r=>r.date===d))return {type:'icon',cat:c};
  }
  return null;
}
function openCalendar(){
  calYear=new Date().getFullYear();calMonth=new Date().getMonth();
  renderCalendar();
  $('#cal-mask').classList.remove('hidden');
}
function renderCalendar(){
  $('#cal-month').textContent=calYear+'年'+(calMonth+1)+'月';
  const days=new Date(calYear,calMonth+1,0).getDate();
  const dates=[];for(let i=1;i<=days;i++)dates.push(calYear+'-'+String(calMonth+1).padStart(2,'0')+'-'+String(i).padStart(2,'0'));
  const cells=dates.map(d=>{
    const rep=dayRepresentative(d);const isT=d===todayStr();
    let content='';
    if(rep){
      if(rep.type==='img')content=`<div class="cal-img"><img class="doodle" src="${rep.src}" alt=""></div>`;
      else content=`<div class="cal-ico">${getIcon(CATS.find(c=>c.key===rep.cat).icon)}</div>`;
    }else content=`<div class="cal-ico" style="opacity:.25">${getIcon('calendar')}</div>`;
    return `<div class="cal-cell ${isT?'today':''}" data-d="${d}"><div class="cal-day">${+d.slice(-2)}</div>${content}</div>`;
  }).join('');
  const firstDow=new Date(dates[0]).getDay();const head=['日','一','二','三','四','五','六'].map(d=>`<div class="cal-dow">${d}</div>`).join('');
  let pre='';for(let i=0;i<firstDow;i++)pre+=`<div class="cal-cell muted"></div>`;
  // 补齐末尾使总行数为 6（视觉整齐）
  const totalCells=firstDow+dates.length;let post='';const rem=42-totalCells;if(rem>0)for(let i=0;i<rem;i++)post+=`<div class="cal-cell muted"></div>`;
  $('#cal-body').innerHTML=`<div class="cal-grid">${head}${pre}${cells}${post}</div><div id="cal-detail"></div>`;
  $$('#cal-body .cal-cell[data-d]').forEach(el=>el.onclick=()=>showCalDay(el.dataset.d));
  $('#cal-prev').onclick=()=>{calMonth--;if(calMonth<0){calMonth=11;calYear--;}renderCalendar();};
  $('#cal-next').onclick=()=>{calMonth++;if(calMonth>11){calMonth=0;calYear++;}renderCalendar();};
}
function showCalDay(d){
  let html=`<div class="cal-list-day">${d} · ${weekday(d)}</div>`;
  // 分类快捷添加条
  html+=`<div class="add-cats">${RECORD_CATS.concat(['album']).map(c=>{
    const cat=CATS.find(x=>x.key===c);return `<button class="ac-btn" data-cat="${c}" data-date="${d}"><span>${getIcon(cat?cat.icon:'album')}</span>${cat?cat.name:'相册'}</button>`;
  }).join('')}</div>`;
  let any=false;
  RECORD_CATS.concat(['album']).forEach(c=>{
    const rs=c==='album'?state.records.album?state.records.album.filter(r=>r.date===d):[]:state.records[c].filter(r=>r.date===d);
    if(rs.length){any=true;html+=`<div class="date-group">${CATS.find(x=>x.key===c).name}</div>`+rs.map(r=>recItemHTML(c,r)).join('');}
  });
  if(!any)html+=`<div class="empty">这一天还没有记录，点击上方分类图标添加吧～</div>`;
  $('#cal-detail').innerHTML=html;
  $$('#cal-detail .ac-btn').forEach(b=>b.onclick=()=>{openFormForDate(b.dataset.cat,b.dataset.date);});
  $$('#cal-detail .rec-item').forEach(el=>{el.querySelector('[data-act="edit"]').onclick=()=>{closeCalendar();openForm(el.dataset.cat,el.dataset.id);};el.querySelectorAll('.thumb-row img').forEach(im=>im.onclick=()=>previewImg(im.src));});
}
function openFormForDate(cat,date){
  closeCalendar();
  openForm(cat,null,date);
}
function closeCalendar(){$('#cal-mask').classList.add('hidden');}

/* ===========================================================
   朋友圈 · 每日凌晨 00:00 自动汇总前一天（流水账 + 图片）
   =========================================================== */
const PYQ_EMOJI={
  diet:{breakfast:'🍳',lunch:'🍱',dinner:'🍲',supper:'🍡'},
  drink:{milktea:'🍵',coffee:'☕',teafruit:'🍹',soda:'🥤',other:'🥤'},
  sport:{ride:'🚴',climb:'🧗',run:'🏃',swim:'🏊',other:'🏋️'},
};
function pyqDateCN(ds){const[y,m,d]=ds.split('-');return y+'年'+(+m)+'月'+(+d)+'日';}
function truncTxt(s,n){s=String(s==null?'':s).replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n)+'…':s;}
/* 该日期出现的所有分类记录日期 */
function allContentDates(){
  const s=new Set();
  RECORD_CATS.concat(['album']).forEach(c=>{(state.records[c]||[]).forEach(r=>{if(r.date)s.add(r.date);});});
  return [...s];
}
/* 某天上传的全部图片（汇总所有分类，含相册） */
function dayImagesOf(ds){
  const out=[];
  RECORD_CATS.concat(['album']).forEach(c=>{
    (state.records[c]||[]).filter(r=>r.date===ds).forEach(r=>{
      (r.images||[]).concat(r.image?[r.image]:[]).filter(Boolean).forEach(src=>out.push(src));
    });
  });
  return out;
}
/* 生成某天的「流水账」文案：某年某月某日吃了什么做了什么 */
function buildPyqCaption(ds){
  const items=[];const mealKey={breakfast:0,lunch:1,dinner:2,supper:3};
  (state.records.diet||[]).filter(r=>r.date===ds).forEach(r=>{
    const mn=MEALS.find(m=>m.k===r.meal)||{n:''};
    const em=PYQ_EMOJI.diet[r.meal]||(r.icon&&!String(r.icon).startsWith('<')?r.icon:'🍚');
    const extra=r.note?(' · '+truncTxt(r.note,24)):'';
    items.push({t:r.time||'12:00',od:mealKey[r.meal]!=null?mealKey[r.meal]:4,line:`${em} ${mn.n?mn.n+'：':''}${r.name||''}${r.place?('（'+r.place+'）'):''}${extra}`});
  });
  (state.records.drink||[]).filter(r=>r.date===ds).forEach(r=>{
    const em=PYQ_EMOJI.drink[r.type]||'🥤';const tag=[];
    if(SWEET[r.sweet]!=null)tag.push(SWEET[r.sweet]);
    if(r.price!=null&&r.price!=='')tag.push('¥'+r.price);
    items.push({t:r.time||'15:00',od:10,line:`${em} 喝了一杯 ${r.brand||''}${r.typeName?('·'+r.typeName):''}${tag.length?('（'+tag.join('，')+'）'):''}`});
  });
  (state.records.sport||[]).filter(r=>r.date===ds).forEach(r=>{
    const em=PYQ_EMOJI.sport[r.type]||'🏃';
    const bits=[r.duration?r.duration+'分钟':'',r.distance?r.distance+'km':'',r.climb?('爬升'+r.climb+'m'):'',r.pace?('配速'+r.pace):''].filter(Boolean);
    const cal=r.calories?('，消耗'+r.calories+'千卡'):'';
    items.push({t:r.time||'19:00',od:20,line:`${em} 去${r.typeName||'运动'}了${bits.length?('：'+bits.join('·')):''}${cal}`});
  });
  (state.records.mood||[]).filter(r=>r.date===ds).forEach(r=>{
    const m=MOODS.find(x=>x.k===r.mood)||{};
    const tag=(r.tags&&r.tags.length)?('（'+r.tags.join('、')+'）'):'';
    items.push({t:r.time||'20:00',od:30,line:`${m.e||'😊'} 今天心情${m.n||'不错'}${tag}${r.desc?('：'+truncTxt(r.desc,34)):''}`});
  });
  (state.records.finance||[]).filter(r=>r.date===ds&&!r.ref).forEach(r=>{
    if(r.flow==='expense')items.push({t:r.time||'12:00',od:41,line:`📉 手动记账支出 ¥${+r.amount||0}（${r.catName||'支出'}）${r.note?('：'+truncTxt(r.note,20)):''}`});
    else items.push({t:r.time||'09:00',od:35,line:`💰 进账 ¥${+r.amount||0}（${r.catName||'收入'}）${r.note?('：'+truncTxt(r.note,20)):''}`});
  });
  (state.records.consume||[]).filter(r=>r.date===ds).forEach(r=>{
    const extra=r.note?('：'+truncTxt(r.note,20)):'';
    items.push({t:r.time||'12:00',od:40,line:`💸 在${r.merchant||'某处'}${r.typeName||'消费'}花了 ¥${+r.amount||0}${r.impulse?'（冲动消费）':''}${extra}`});
  });
  (state.records.sleep||[]).filter(r=>r.date===ds).forEach(r=>{
    const nap=r.nap?('，午睡'+r.napDuration+'h'):'';
    items.push({t:'23:59',od:50,line:`😴 睡了 ${r.duration||'?'} 小时（${r.sleepTime||'--:--'}→${r.wakeTime||'--:--'}${nap}）`});
  });
  const imgs=dayImagesOf(ds);
  items.sort((a,b)=>a.t.localeCompare(b.t)||a.od-b.od);
  const body=items.map(i=>i.line).filter(Boolean).join('\n');
  const head=pyqDateCN(ds)+' · '+weekday(ds);
  if(!body&&imgs.length)return head+'\n📸 上传了 '+imgs.length+' 张照片，定格这一天的时光';
  return body?head+'\n'+body:'';
}
/* 自动发布：为所有已结束（昨天及更早）且有内容的日期生成朋友圈 */
function ensurePyq(){
  if(!state.moments||!Array.isArray(state.moments))state.moments=[];
  const done=new Set(state.moments.map(m=>m.date));
  const today=todayStr();let added=0;
  allContentDates().filter(d=>d<today&&!done.has(d)).sort().forEach(d=>{
    if(buildPyqCaption(d)||dayImagesOf(d).length){state.moments.push({date:d,at:Date.now()});added++;}
  });
  if(added)save();
  return added;
}
function momentsLatestDesc(){
  ensurePyq();
  const ms=state.moments;
  if(!ms.length)return '每天凌晨 00:00 自动汇总前一天的记录与照片';
  const latest=ms.map(m=>m.date).sort().pop();
  return '已发布 '+ms.length+' 条 · 最近：'+pyqDateCN(latest);
}
/* 打开朋友圈 */
function openPyq(){
  ensurePyq();
  $('#pyq-back').innerHTML=getIcon('back');
  const p=state.profile;
  $('#pyq-cover-name').textContent=p.nickname||'小窝';
  $('#pyq-cover-avatar').innerHTML=p.avatar?`<img src="${p.avatar}" alt="">`:'<span>🐱</span>';
  renderPyqList();
  $('#pyq-view').classList.remove('hidden');
  $('#pyq-scroll').scrollTop=0;
}
function closePyq(){$('#pyq-view').classList.add('hidden');}
function pyqMetaLine(d){
  const diff=Math.round((Date.parse(todayStr())-Date.parse(d))/864e5);
  const[y,m,dd]=d.split('-');
  if(diff===1)return '昨天 00:00';
  if(diff===0)return '今天 00:00';
  if(+y===new Date().getFullYear())return (+m)+'月'+(+dd)+'日 00:00';
  return pyqDateCN(d)+' 00:00';
}
function pyqImgsHTML(imgs){
  if(!imgs.length)return '';
  const list=imgs.slice(0,9);
  if(list.length===1)return `<div class="pyq-imgs single">${list.map(s=>`<img class="${isCut(s)?'ct':''}" src="${s}" alt="" loading="lazy">`).join('')}</div>`;
  return `<div class="pyq-imgs">${list.map(s=>`<img class="${isCut(s)?'ct':''}" src="${s}" alt="" loading="lazy">`).join('')}</div>`;
}
function renderPyqList(){
  ensurePyq();
  const p=state.profile;
  const ms=state.moments.slice().sort((a,b)=>b.date.localeCompare(a.date));
  const body=$('#pyq-body');const tip=$('#pyq-tip');
  if(!ms.length){
    tip.classList.remove('hidden');
    body.innerHTML=`<div class="pyq-empty"><div class="pqe-ico">📮</div><p>朋友圈还没有动态</p><p class="pqe-sub">每天凌晨 00:00，把前一天的吃喝、心情、消费与照片<br>自动整理成一条「某年某月某日 · 流水账」发布在这里</p></div>`;
    return;
  }
  tip.classList.add('hidden');
  const av=p.avatar?`<img src="${p.avatar}" alt="">`:'<span>🐱</span>';
  body.innerHTML=ms.map(m=>{
    const cap=buildPyqCaption(m.date);
    const imgs=dayImagesOf(m.date);
    return `<article class="pyq-item">
      <div class="pi-avatar">${av}</div>
      <div class="pi-main">
        <div class="pi-name">${esc(p.nickname||'小窝')}</div>
        ${cap?`<div class="pi-text">${esc(cap)}</div>`:''}
        ${pyqImgsHTML(imgs)}
        <div class="pi-meta"><span>${pyqMetaLine(m.date)}</span><i class="pi-sp"></i><span>来自每日自动汇总</span></div>
      </div>
    </article>`;
  }).join('');
  $$('#pyq-body .pyq-imgs img').forEach(im=>im.onclick=()=>previewImg(im.src));
}
/* 凌晨定时：00:00:05 后自动把刚结束的一天发布到朋友圈 */
function schedulePyq(){
  clearTimeout(schedulePyq._t);
  const now=new Date();
  const nx=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,1,0);
  schedulePyq._t=setTimeout(()=>{
    if(ensurePyq()){
      toast('朋友圈已更新 🌙');
      if(!$('#view-profile').classList.contains('hidden'))renderProfile();
      if(!$('#pyq-view').classList.contains('hidden'))renderPyqList();
    }
    schedulePyq();
  },Math.max(3000,nx.getTime()-now.getTime()+800));
}

/* ===========================================================
   PWA：安装 & Service Worker
   =========================================================== */
let deferredPrompt=null;
function initPWA(){
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#install-banner').classList.remove('hidden');});
  window.addEventListener('appinstalled',()=>{$('#install-banner').classList.add('hidden');});
  $('#ib-install').onclick=async()=>{
    if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#install-banner').classList.add('hidden');return;}
    /* iOS Safari 不支持自动弹窗：引导手动添加到主屏幕 */
    if(isIOS()){
      $('#install-banner').classList.add('hidden');
      toast('点浏览器底部「分享」→ 选「添加到主屏幕」');
    }
  };
  $('#ib-close').onclick=()=>{$('#install-banner').classList.add('hidden');try{localStorage.setItem('ib_closed','1');}catch(e){}};
  /* iOS：启动 2.5 秒后仍未出现安装事件，就显示手动引导横幅 */
  setTimeout(()=>{
    if(!deferredPrompt&&!window.matchMedia('(display-mode: standalone)').matches
      &&!window.navigator.standalone&&isIOS()&&!lsGet('ib_closed'))$('#install-banner').classList.remove('hidden');
  },2500);
  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./service-worker.js?v=18',{updateViaCache:'none'}).then(reg=>{
        // 页面加载时主动检查 SW 更新（updateViaCache:none 保证 sw.js 本身不走 HTTP 缓存）
        reg.update().catch(()=>{});
        setInterval(()=>reg.update().catch(()=>{}),15*60*1000);
        // 发现新版本 SW 接管控制后，自动刷新一次以摆脱旧缓存
        let refreshing=false;
        navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!refreshing){refreshing=true;location.reload();}});
      }).catch(()=>{});
    });
  }
}
function isIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent);}

/* ===========================================================
   初始化
   =========================================================== */
function init(){
  initGlobalFile();   // 全局常驻文件框最先就位：图片上传共用（头像/表单），修复手机端首次上传失败
  startStorageProbe();// 环境自检：探测 localStorage/IndexedDB 是否可写，受限环境立即红条告知
  renderNavIcons();
  // 空白图标按钮补上图标（返回 / 关闭 / 日历翻月）
  $('#detail-back').innerHTML=getIcon('back');
  $('#modal-close').innerHTML=getIcon('close');
  $('#cal-close').innerHTML=getIcon('close');
  $('#cal-prev').innerHTML=getIcon('back');
  $('#cal-next').innerHTML=getIcon('arrow');
  /* 数据启动（双保险，秒开优先）：
     1) localStorage 有数据 → 同步立即采用；
     2) localStorage 缺失/损坏（如系统/PWA 清掉了本地存储）→ 先以全新空数据立即渲染，
        随后后台从 IndexedDB 自动找回历史备份并刷新界面，不阻塞、不丢数据；
     3) 所有操作经 save() 双写 localStorage + IndexedDB。 */
  const rerenderVisible=()=>{
    try{
      if(!$('#view-home').classList.contains('hidden'))renderHome();
      if(!$('#view-profile').classList.contains('hidden'))renderProfile();
      if(!$('#view-stats').classList.contains('hidden'))renderStats();
      if(!$('#detail-view').classList.contains('hidden'))refreshDetail();
      if(!$('#pyq-view').classList.contains('hidden'))renderPyqList();
    }catch(e){}
  };
  const adopt=(s)=>{
    state=s;
    applyTheme();
    // 兼容旧版数据结构（相册/朋友圈字段补齐）
    RECORD_CATS.concat(['album']).forEach(c=>{if(!state.records[c])state.records[c]=[];});
    if(!state.moments)state.moments=[];
    save(); // 落盘一次：保证 _sv 时间戳 + IndexedDB 镜像就位（新用户则建立初始存储）
    // 事件绑定
    $$('.tab').forEach(t=>t.onclick=()=>showTab(t.dataset.page));
    $('#detail-back').onclick=closeDetail;
    $('#btn-cal').onclick=openCalendar;
    $('#btn-setting-quick').onclick=()=>showTab('settings');
    $('#modal-close').onclick=closeModal;
    $('#cal-close').onclick=closeCalendar;
    $('#modal-mask').onclick=e=>{if(e.target.id==='modal-mask')closeModal();};
    $('#cal-mask').onclick=e=>{if(e.target.id==='cal-mask')closeCalendar();};
    $('#imgprev-mask').onclick=()=>$('#imgprev-mask').classList.add('hidden');
    $('#pyq-back').onclick=closePyq;
    // 多窗口 / PWA 与浏览器双开时同步最新数据；关闭或切后台前兜底保存
    window.addEventListener('storage',storageSyncEvt);
    window.addEventListener('pagehide',()=>save());
    // 朋友圈：启动即补齐历史动态，并安排每日凌晨自动更新
    ensurePyq();
    schedulePyq();
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){save();return;} /* 进后台先落盘，防最后一条记录丢失 */
      resyncFromLS();                     /* 回前台：若其它实例更新过，先同步再刷新朋友圈 */
      if(ensurePyq()){
        toast('朋友圈已更新 🌙');
        if(!$('#view-profile').classList.contains('hidden'))renderProfile();
        if(!$('#pyq-view').classList.contains('hidden'))renderPyqList();
      }
    });
    // 首次进入检查预算（演示数据可能已超）
    setTimeout(checkBudget,500);
    showTab('home');
    // 支持深链：#profile 直达个人主页、#pyq 直达朋友圈
    const hh=(location.hash||'').replace('#','');
    if(hh==='pyq')setTimeout(openPyq,150);
    else if(hh==='profile')setTimeout(()=>showTab('profile'),150);
    else if(hh.startsWith('stats')){const c=hh.split('-')[1];setTimeout(()=>{if(c&&STATS_CATS.some(s=>s[0]===c))curStatsCat=c;showTab('stats');},150);}
    else if(hh.startsWith('d-')){setTimeout(()=>{const[cat,ds]=hh.slice(2).split('@');openDetail(cat);if(ds){dSel=ds;renderCatCalendar();}},150);}
    initPWA();
  };
  if(load()&&validState(state)){adopt(state);return;}
  const fresh=firstRunData();
  const freshRecs=JSON.stringify(fresh.records);
  adopt(fresh); /* 秒开：空数据立即渲染 */
  /* 后台自动找回：localStorage 被清空时从 IndexedDB 恢复历史数据 */
  loadBackup().then(b=>{
    if(!b||!validState(b))return;
    if(state!==fresh)return;                                   /* 已切走 */
    if(JSON.stringify(state.records)!==freshRecs)return; /* 用户已开始记录，绝不覆盖用户数据 */
    state=b;
    RECORD_CATS.concat(['album']).forEach(c=>{if(!state.records[c])state.records[c]=[];});
    if(!state.moments)state.moments=[];
    save();
    rerenderVisible();
    toast('已从自动备份恢复历史记录 🌿');
  });
}
window.previewImg=previewImg;
window.closeModal=closeModal;
window.cutoutImage=cutoutImage;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
