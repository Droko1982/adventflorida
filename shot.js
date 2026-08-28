const puppeteer=require("C:/Users/asus/node_modules/puppeteer-core");
const OUT="C:/Users/asus/AppData/Local/Temp/claude/fontcheck/";
const html=(fam,txt,label)=>`<div style="font:400 20.16px/1.38 'Cormorant Garamond',Georgia,serif;font-style:italic;padding:14px 18px;border-left:4px solid #B8763E;background:#fff;color:#12212B;max-width:340px">${txt}</div><div style="font:600 11px system-ui;padding:4px 18px 16px;color:#666">${label}</div>`;
(async()=>{
 const b=await puppeteer.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:"new",args:["--no-sandbox"]});
 const p=await b.newPage();
 await p.setViewport({width:400,height:900,deviceScaleFactor:3});
 const EN="&ldquo;Come to me, all you who are weary and burdened, and I will give you rest.&rdquo;";
 const RU="&laquo;Придите ко Мне, все труждающиеся и обременённые, и Я успокою вас&raquo;";
 await p.setContent(`
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet">
  <body style="margin:0;background:#FBF9F4">
  ${html(1,EN,"1. CURSIVA REAL (hoy) — latin")}
  ${html(1,RU,"2. CURSIVA REAL (hoy) — cirilico")}
  <div id="fake"></div>`);
 await p.evaluate(()=>document.fonts.ready);
 await new Promise(r=>setTimeout(r,1500));
 // ahora la version SIN italic: cargamos solo el eje normal en una segunda pagina
 const p2=await b.newPage(); await p2.setViewport({width:400,height:900,deviceScaleFactor:3});
 await p2.setContent(`
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
  <body style="margin:0;background:#FBF9F4">
  ${html(1,EN,"3. SU ARREGLO: oblicua sintetica — latin")}
  ${html(1,RU,"4. SU ARREGLO: oblicua sintetica — cirilico")}`);
 await p2.evaluate(()=>document.fonts.ready);
 await new Promise(r=>setTimeout(r,1500));
 await p.screenshot({path:OUT+"real.png",clip:{x:0,y:0,width:400,height:260}});
 await p2.screenshot({path:OUT+"faux.png",clip:{x:0,y:0,width:400,height:260}});
 // medir anchura de la misma frase en ambas: cambio de metrica = reflow
 const w1=await p.evaluate(()=>{const d=document.querySelector("div");const s=document.createElement("span");s.style.cssText="font:italic 400 20.16px 'Cormorant Garamond',Georgia,serif;white-space:nowrap";s.textContent="Come to me, all you who are weary";document.body.appendChild(s);return s.getBoundingClientRect().width;});
 const w2=await p2.evaluate(()=>{const s=document.createElement("span");s.style.cssText="font:italic 400 20.16px 'Cormorant Garamond',Georgia,serif;white-space:nowrap";s.textContent="Come to me, all you who are weary";document.body.appendChild(s);return s.getBoundingClientRect().width;});
 console.log("ancho misma frase  cursiva REAL:",w1.toFixed(1),"px   oblicua SINTETICA:",w2.toFixed(1),"px   diferencia:",(100*(w2-w1)/w1).toFixed(1),"%");
 await b.close();
})();
