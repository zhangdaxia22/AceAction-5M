(() => {
  'use strict';
  const gallery = window.ACE_GALLERY || [];
  const $ = s => document.querySelector(s);
  const orbit = $('#orbit');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  let angle = 0.35, tilt = 0.12, spinning = !reduceMotion, dragging = false;
  let lastX = 0, lastY = 0, startX = 0, startY = 0, movement = 0, velocity = 0;
  let width = 0, height = 0, visible = true, lastTime = 0, hovered = false;
  const particles = [];
  const nodes = gallery.map((src, i) => {
    const y = 1 - 2 * (i + 0.5) / gallery.length;
    const radius = Math.sqrt(1 - y * y);
    const theta = i * Math.PI * (3 - Math.sqrt(5));
    const button = document.createElement('div');
    button.className = 'orbit-card';
    button.setAttribute('aria-hidden', 'true');
    const img = document.createElement('img');
    img.src = src; img.alt = ''; img.draggable = false;
    img.decoding = 'async';
    button.append(img); orbit.append(button);
    button.addEventListener('pointerenter', e => { if(e.pointerType !== 'touch') hovered = true; });
    button.addEventListener('pointerleave', () => { hovered = false; });
    return {el: button, x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius};
  });
  const canvas = $('#space'); const ctx = canvas.getContext('2d');
  for(let i=0;i<75;i++) particles.push({x:Math.sin(i*72.21)*0.5+0.5,y:Math.sin(i*91.13+1)*0.5+0.5,r:i%9===0?1.3:.65});
  function resize() {
    const box = orbit.getBoundingClientRect();width=box.width;height=box.height;
    const dpr=Math.min(devicePixelRatio||1,2); canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    drawBackground();render();
  }
  function drawBackground() {
    ctx.clearRect(0,0,width,height);
    for(const p of particles){ctx.beginPath();ctx.arc(p.x*width,p.y*height,p.r,0,TAU);ctx.fillStyle=p.r>1?'#acc99865':'#a3bbbc40';ctx.fill();}
    const rx=Math.min(width*.45,680),ry=Math.min(height*.36,350),cx=width/2,cy=height*.44;
    ctx.strokeStyle='#94c3a60d';ctx.lineWidth=.8;
    for(const rotation of [-.18,.3,-.65]) {ctx.beginPath();ctx.ellipse(cx,cy,rx,ry*.64,rotation,0,TAU);ctx.stroke();}
    ctx.strokeStyle='#8aa99b15';ctx.setLineDash([2,9]);ctx.beginPath();ctx.ellipse(cx,cy,rx*1.05,ry*1.18,0,0,TAU);ctx.stroke();ctx.setLineDash([]);
  }
  function render() {
    const compact=width<760;
    const cardWidth=compact?116:148;
    const rx=compact?width*.70:Math.min(width*.46,740);
    const ry=compact?height*.43:height*.43;
    const cx=width/2,cy=height*.43;
    const cosa=Math.cos(angle),sina=Math.sin(angle),cost=Math.cos(tilt),sint=Math.sin(tilt);
    for(const p of nodes){
      const xx=p.x*cosa+p.z*sina; const zz=-p.x*sina+p.z*cosa;
      const yy=p.y*cost-zz*sint; const z=p.y*sint+zz*cost;
      const perspective=3.7/(3.7-z);
      const x=xx*rx*perspective, y=yy*ry*perspective;
      const scale=(compact?.77:.9)*perspective;
      const center=Math.exp(-((x/(compact?width*.43:width*.28))**4+(y/(height*.21))**4));
      const opacity=Math.max(.08,Math.min(.95,(.5+z*.32)*(1-center*.72)));
      const rotation=xx*-8+Math.sin(p.y*5)*3;
      p.el.style.transform=`translate3d(${cx+x-cardWidth/2}px,${cy+y-cardWidth*.40}px,0) scale(${scale}) rotate(${rotation}deg)`;
      p.el.style.opacity=opacity.toFixed(3);
      p.el.style.zIndex=Math.round((z+1)*50);
    }
  }
  function animate(time) {
    const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;
    if(visible&&!dragging){
      if(spinning&&!hovered&&!orbit.contains(document.activeElement)) angle+=dt*.055;
      if(!hovered&&!orbit.contains(document.activeElement)&&Math.abs(velocity)>.00005){angle+=velocity;velocity*=.94;}
      if(spinning||Math.abs(velocity)>.00005) render();
    }
    requestAnimationFrame(animate);
  }
  orbit.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    if(e.pointerType === 'mouse') e.preventDefault();
    orbit.setPointerCapture(e.pointerId);
    dragging=true;movement=0;velocity=0;lastX=startX=e.clientX;lastY=startY=e.clientY;
    orbit.classList.add('dragging');
  });
  window.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const dx=e.clientX-lastX,dy=e.clientY-lastY;movement=Math.max(movement,Math.hypot(e.clientX-startX,e.clientY-startY));
    if(movement>5){angle+=dx*.005;tilt=Math.max(-.85,Math.min(.85,tilt+dy*.0025));velocity=dx*.0015;render();}
    lastX=e.clientX;lastY=e.clientY;
  });
  function endDrag(){dragging=false;orbit.classList.remove('dragging');}
  window.addEventListener('pointerup',e=>{
    if(!dragging)return;
    if(orbit.hasPointerCapture(e.pointerId)) orbit.releasePointerCapture(e.pointerId);
    endDrag();
  });window.addEventListener('pointercancel',endDrag);
  function updateRotationButton(){
    $('#rotation').setAttribute('aria-pressed',String(spinning));$('#rotation').setAttribute('aria-label',spinning?'Pause automatic rotation':'Start automatic rotation');
    $('#rotation-icon').textContent=spinning?'Ⅱ':'▷';$('#rotation-label').textContent=spinning?'Auto-rotate':'Rotation paused';
  }
  $('#rotation').addEventListener('click',()=>{spinning=!spinning;velocity=0;updateRotationButton();});
  $('#reset').addEventListener('click',()=>{angle=.35;tilt=.12;velocity=0;render();});
  const heroObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});heroObserver.observe(orbit);
  new ResizeObserver(resize).observe(orbit);updateRotationButton();resize();requestAnimationFrame(animate);

})();
