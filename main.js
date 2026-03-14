

(function(){

/* CURSOR */
var C=document.getElementById('CUR'),F=document.getElementById('CUF');
var mx=0,my=0,fx=0,fy=0;
document.addEventListener('mousemove',function(e){
  mx=e.clientX; my=e.clientY;
  C.style.left=mx+'px'; C.style.top=my+'px';
});
function tick(){fx+=(mx-fx)*.1;fy+=(my-fy)*.1;F.style.left=fx+'px';F.style.top=fy+'px';requestAnimationFrame(tick);}
tick();
if('ontouchstart' in window){C.style.display='none';F.style.display='none';document.body.style.cursor='auto';}

/* NAV */
var NAV=document.getElementById('NAV'),NL=document.getElementById('NL'),HB=document.getElementById('HB');
var nas=document.querySelectorAll('.na'), sects=document.querySelectorAll('section[id]');
window.addEventListener('scroll',function(){
  NAV.classList.toggle('stuck',window.scrollY>60);
  var cur='';
  sects.forEach(function(s){if(window.scrollY>=s.offsetTop-140)cur=s.id;});
  nas.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur);});
},{passive:true});
HB.addEventListener('click',function(){
  var o=NL.classList.toggle('open');
  var sp=HB.querySelectorAll('span');
  sp[0].style.transform=o?'rotate(45deg) translate(5px,5px)':'';
  sp[1].style.opacity=o?'0':'';
  sp[2].style.transform=o?'rotate(-45deg) translate(5px,-5px)':'';
});
nas.forEach(function(a){a.addEventListener('click',function(){NL.classList.remove('open');HB.querySelectorAll('span').forEach(function(s){s.style.transform=s.style.opacity='';});});});

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var h=a.getAttribute('href');if(h==='#')return;
    var t=document.querySelector(h);if(!t)return;
    e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-78,behavior:'smooth'});
  });
});

/* PARTICLES - REDUCED DENSITY */
var canvas=document.getElementById('PC'),ctx=canvas.getContext('2d');
var pts=[];var animId=0;
function rsz(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
rsz();window.addEventListener('resize',function(){rsz();build();},{passive:true});

function rnd(a,b){return a+Math.random()*(b-a);}

function Pt(){this.init(true);}
Pt.prototype.init=function(spread){
  this.x=rnd(0,canvas.width);this.y=spread?rnd(0,canvas.height):canvas.height+5;
  this.vx=rnd(-0.3,0.3); // Slower movement
  this.vy=rnd(-0.3,0.3);
  this.sz=rnd(1,2.5); // Smaller particles
  this.ba=rnd(0.15,0.45); // Lower opacity
  this.a=this.ba;
  this.t=rnd(0,6.28);
  this.col='56,189,248';
};
Pt.prototype.step=function(){
  this.x+=this.vx;this.y+=this.vy;this.t+=0.018;
  this.a=this.ba+Math.sin(this.t)*0.12;
  if(this.x<-10||this.x>canvas.width+10||this.y<-10||this.y>canvas.height+10)this.init(false);
};
Pt.prototype.draw=function(){
  ctx.beginPath();ctx.arc(this.x,this.y,this.sz,0,6.28);
  ctx.fillStyle='rgba('+this.col+','+Math.max(0,this.a)+')';ctx.fill();
};

function build(){
  var pc=Math.min(Math.floor(canvas.width*canvas.height/18000),80); // Reduced particle count
  pts=[];for(var i=0;i<pc;i++)pts.push(new Pt());
}
function lines(){
  var md=150;
  for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){
    var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<md){ctx.strokeStyle='rgba(56,189,248,'+(1-d/md)*0.1+')';ctx.lineWidth=0.4;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
  }
}
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(var i=0;i<pts.length;i++){pts[i].step();pts[i].draw();}
  lines();
  animId=requestAnimationFrame(loop);
}
build();loop();
document.addEventListener('visibilitychange',function(){if(document.hidden)cancelAnimationFrame(animId);else loop();});

/* TYPING */
var phrases=['Laravel Developer','CodeIgniter Expert','Backend Architect','API Engineer','SaaS Builder','AI Integrator'];
var tel=document.getElementById('TT'),pi=0,ci=0,del=false;
function type(){
  var p=phrases[pi];
  tel.textContent=del?p.substring(0,ci-1):p.substring(0,ci+1);
  del?ci--:ci++;
  var d=del?55:90;
  if(!del&&ci===p.length){d=1900;del=true;}
  else if(del&&ci===0){del=false;pi=(pi+1)%phrases.length;d=280;}
  setTimeout(type,d);
}
type();

/* REVEAL */
var rvs=document.querySelectorAll('.rv');
function reveal(){
  var wh=window.innerHeight;
  rvs.forEach(function(el){
    if(el.classList.contains('vis'))return;
    if(el.getBoundingClientRect().top<wh-50){el.classList.add('vis');}
  });
}
window.addEventListener('scroll',reveal,{passive:true});
reveal();
setTimeout(reveal,50);
setTimeout(reveal,200);
setTimeout(reveal,500);

/* TILT */
document.querySelectorAll('.pc').forEach(function(card){
  card.addEventListener('mousemove',function(e){
    var r=card.getBoundingClientRect();
    card.style.transform='perspective(800px) rotateX('+(((r.top+r.height/2)-e.clientY)/(r.height/2)*4)+'deg) rotateY('+((e.clientX-(r.left+r.width/2))/(r.width/2)*4)+'deg) translateY(-5px)';
  });
  card.addEventListener('mouseleave',function(){
    card.style.transition='transform .5s ease';card.style.transform='';
    setTimeout(function(){card.style.transition='';},500);
  });
});

/* FORM - Vercel backend version */
document.getElementById('CF').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const btn = e.target.querySelector('button');
  const originalContent = btn.innerHTML;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  btn.innerHTML = 'Sending...';
  btn.disabled = true;

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const data = await response.json();

    if (response.ok) {
      e.target.reset();
      document.getElementById('FSC').classList.add('show');
      setTimeout(() => {
        document.getElementById('FSC').classList.remove('show');
      }, 4000);
    } else {
      alert(data.error || 'Failed to send message. Please try again.');
    }
  } catch (error) {
    alert('Network error. Please check your connection and try again.');
    console.error('Error:', error);
  } finally {
    btn.innerHTML = originalContent;
    btn.disabled = false;
  }
});

})();
