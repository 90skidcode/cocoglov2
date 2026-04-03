// Asset Paths
const IMG_LOGO = "assets/logo.png";
const IMG_HEARTS = "assets/hearts.jpeg";
const IMG_DRAGON = "assets/dragon.jpeg";
const IMG_TURQUOISE = "assets/turquoise.jpeg";

// ─── CURSOR ───
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;

// Reduce motion check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    cursor.style.left=(mx-4)+'px';cursor.style.top=(my-4)+'px';
  });
  (function animRing(){
    rx+=(mx-rx-17)*0.13;ry+=(my-ry-17)*0.13;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();
} else {
  // Hide custom cursor if reduced motion is preferred
  cursor.style.display = 'none';
  ring.style.display = 'none';
  document.body.style.cursor = 'auto';
}

document.querySelectorAll('a,button,.prod-card,.class-card,.fcard,.val-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    if (!prefersReducedMotion) {
      cursor.style.transform='scale(2.5)';
      ring.style.transform='scale(1.5)';
      ring.style.borderColor='var(--green-dark)';
    }
  });
  el.addEventListener('mouseleave',()=>{
    if (!prefersReducedMotion) {
      cursor.style.transform='scale(1)';
      ring.style.transform='scale(1)';
      ring.style.borderColor='var(--gold)';
    }
  });
});

// ─── ROUTER ───
const pages = {
  home: document.getElementById('page-home'),
  shop: document.getElementById('page-shop'),
  about: document.getElementById('page-about'),
  classes: document.getElementById('page-classes'),
  contact: document.getElementById('page-contact'),
};
function navigate(id){
  Object.values(pages).forEach(p=>p.classList.remove('active'));
  if(pages[id]) pages[id].classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  
  // Navbar toggle for sections with dark backgrounds
  const navbarEl = document.getElementById('navbar');
  if(id === 'classes') {
    navbarEl.classList.add('dark-bg');
    const logoImg = document.querySelector('.nav-logo img');
    if(logoImg) logoImg.style.filter = 'brightness(0) invert(1)';
  } else {
    navbarEl.classList.remove('dark-bg');
    const logoImg = document.querySelector('.nav-logo img');
    if(logoImg) logoImg.style.filter = 'none';
  }

  document.querySelectorAll('[data-nav]').forEach(a=>{
    a.classList.toggle('active', a.dataset.nav===id);
  });
  initReveal();
  if(id==='shop') renderShop();
  if(id==='classes') renderClasses();
}

// ─── NAVBAR ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>60));

// ─── MOBILE MENU ───
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
hamburger.addEventListener('click',()=>navMenu.classList.toggle('mobile-open'));
document.querySelectorAll('[data-nav]').forEach(a=>a.addEventListener('click',()=>{
  navMenu.classList.remove('mobile-open');
}));

// ─── SCROLL REVEAL ───
function initReveal(){
  const els = document.querySelectorAll('.reveal:not(.vis)');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); } });
  },{threshold:0.1,rootMargin:'0px 0px -30px 0px'});
  els.forEach(el=>obs.observe(el));
}

// ─── PARALLAX ───
window.addEventListener('scroll',()=>{
  const y = window.scrollY;
  document.querySelectorAll('.hero-orb').forEach((el,i)=>{
    const s=(i+1)*0.04;
    el.style.transform=`translateY(${y*s}px)`;
  });
  const ht = document.querySelector('.hero-text');
  if(ht) ht.style.transform=`translateY(${y*0.1}px)`;
  const hv = document.querySelector('.soap-3d-stage');
  if(hv) hv.style.marginTop=`${y*0.06}px`;
});

// ─── 3D MOUSE TILT ───
const stage = document.getElementById('soapStage');
document.addEventListener('mousemove',e=>{
  if(!stage) return;
  const cx=window.innerWidth/2, cy=window.innerHeight/2;
  const dx=(e.clientX-cx)/cx, dy=(e.clientY-cy)/cy;
  stage.style.transform=`rotateX(${8-dy*9}deg) rotateY(${-14+dx*12}deg)`;
});

// ─── CART ───
let cart = [];
function getImgForProduct(id){
  const map = {1:IMG_TURQUOISE,2:IMG_HEARTS,3:IMG_DRAGON,4:IMG_TURQUOISE,5:IMG_HEARTS,6:IMG_DRAGON};
  return map[id]||IMG_TURQUOISE;
}
function addToCart(id, name, price){
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty++; }
  else { cart.push({id,name,price,qty:1}); }
  updateCartBadge();
  showToast('🛒 Added to cart — '+name);
}
function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  renderCartItems();
  updateCartBadge();
}
function updateCartBadge(){
  const total = cart.reduce((s,i)=>s+i.qty,0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = total;
  badge.style.display = total>0?'flex':'none';
}
function renderCartItems(){
  const el = document.getElementById('cartItems');
  if(cart.length===0){
    el.innerHTML='<div class="cart-empty">Your cart is empty.<br><br>Shop our beautiful soaps ✨</div>';
  } else {
    el.innerHTML = cart.map(i=>`
      <div class="cart-item">
        <img class="cart-item-img" src="${getImgForProduct(i.id)}" alt="${i.name}" loading="lazy">
        <div class="cart-item-info">
          <div class="cart-item-name">${i.name}</div>
          <div class="cart-item-price">₹${i.price} × ${i.qty} = ₹${i.price*i.qty}</div>
          <button class="cart-item-remove" onclick="removeFromCart(${i.id})">Remove</button>
        </div>
      </div>`).join('');
  }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('cartTotal').textContent = '₹'+total;
  document.getElementById('cartTotalRow').style.display = cart.length>0?'flex':'none';
  document.getElementById('cartCheckout').style.display = cart.length>0?'block':'none';
}
function openCart(){
  renderCartItems();
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCart(){
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

// ─── PRODUCTS DATA ───
const PRODUCTS = [
  {id:1,name:'Turquoise Tide',tag:'Ocean Series',badge:'Bestseller',price:420,desc:'Sea minerals & coconut oil with gold mica layers for a luxurious ocean experience.',img:'turquoise'},
  {id:2,name:'Rose Heart',tag:'Love Collection',badge:'',price:380,desc:'Creamy goat milk base with embedded heart designs — perfect for gifting.',img:'hearts'},
  {id:3,name:'Dragon Fruit',tag:'Fruit Series',badge:'New',price:450,desc:'Vibrant two-tone bar with real poppy seeds for gentle exfoliation and a fruity glow.',img:'dragon'},
  {id:4,name:'Gold Luxe Loaf',tag:'Premium Series',badge:'',price:680,desc:'Full loaf with golden mica swirls — a show-stopper centerpiece for any bathroom.',img:'turquoise'},
  {id:5,name:'Petal Bliss',tag:'Botanical',badge:'',price:390,desc:'Rose petals and jasmine fragrance in a silky shea butter base for soft, glowing skin.',img:'hearts'},
  {id:6,name:'Charcoal Detox',tag:'Wellness',badge:'',price:420,desc:'Activated charcoal and tea tree oil draw out impurities and leave skin deeply clean.',img:'dragon'},
];

function renderShop(filter='all'){
  const grid = document.getElementById('shopGrid');
  const filtered = filter==='all'?PRODUCTS:PRODUCTS.filter(p=>p.tag.toLowerCase().includes(filter.toLowerCase()));
  grid.innerHTML = filtered.map(p=>`
    <div class="prod-card reveal">
      <div class="prod-img"><img src="${p.img==='turquoise'?IMG_TURQUOISE:p.img==='hearts'?IMG_HEARTS:IMG_DRAGON}" alt="${p.name}" loading="lazy"></div>
      ${p.badge?`<span class="prod-badge ${p.badge==='New'?'new':''}">${p.badge}</span>`:''}
      <div class="prod-body">
        <p class="prod-tag">${p.tag}</p>
        <h3 class="prod-name">${p.name}</h3>
        <p class="prod-desc">${p.desc}</p>
        <div class="prod-foot">
          <span class="prod-price">₹${p.price}</span>
          <button class="prod-add" onclick="addToCart(${p.id},'${p.name}',${p.price})">Add to Cart</button>
        </div>
      </div>
    </div>`).join('');
  initReveal();
}

// ─── CLASSES DATA ───
const CLASSES = [
  {id:1,name:'Melt & Pour Magic',cat:'beginner',level:'Beginner',duration:'3 hrs',size:'8 ppl',price:1200,color:'#5BBFB5',emoji:'🌿',
   desc:'Perfect introduction to soap making. Learn the basics of melt and pour technique, fragrance blending, and mold filling. Take home 6 beautiful soaps.'},
  {id:2,name:'Cold Process Mastery',cat:'intermediate',level:'Intermediate',duration:'5 hrs',size:'6 ppl',price:2200,color:'#C4973A',emoji:'🧪',
   desc:'Dive deep into saponification science. Create layered, swirled and textured bars using lye-based cold process — the gold standard of soap crafting.'},
  {id:3,name:'Artistic Soap Design',cat:'advanced',level:'Advanced',duration:'6 hrs',size:'5 ppl',price:2800,color:'#1D3A1F',emoji:'🎨',
   desc:'Master swirls, layers, embeds, and mica painting. Create soap bars that are works of art. Explore gradient pours and advanced color techniques.'},
  {id:4,name:'Corporate Wellness',cat:'corporate',level:'Corporate',duration:'3 hrs',size:'20 ppl',price:8500,color:'#C0394B',emoji:'🏢',
   desc:'Unique team-building experience. Customizable themes and branding available. Perfect for company off-sites, client events, and wellness days.'},
  {id:5,name:'Natural Shampoo Bar',cat:'intermediate',level:'Intermediate',duration:'4 hrs',size:'6 ppl',price:1900,color:'#C4973A',emoji:'🌾',
   desc:'Create sulfate-free solid shampoo bars with nourishing botanicals, essential oils, and hair-loving ingredients for every hair type.'},
  {id:6,name:'Kids Soap Safari',cat:'beginner',level:'Beginner',duration:'2 hrs',size:'10 ppl',price:900,color:'#5BBFB5',emoji:'🐾',
   desc:'Fun-filled soap making session designed for children aged 8–14. Safe, non-lye process with vibrant colors, fun molds, and gentle fragrances.'},
];

function renderClasses(filter='all'){
  const grid = document.getElementById('classesGrid');
  const filtered = filter==='all'?CLASSES:CLASSES.filter(c=>c.cat===filter);
  grid.innerHTML = filtered.map(c=>`
    <div class="class-card reveal">
      <div class="class-card-banner" style="background:linear-gradient(135deg,${c.color}22,${c.color}44)">
        <span style="font-size:3.5rem">${c.emoji}</span>
      </div>
      <div class="class-card-body">
        <span class="class-level level-${c.cat==='beginner'?'beg':c.cat==='intermediate'?'int':c.cat==='advanced'?'adv':'corp'}">${c.level}</span>
        <h3 class="class-name">${c.name}</h3>
        <p class="class-desc">${c.desc}</p>
        <div class="class-meta">
          <span class="class-meta-item"><span class="class-meta-icon">⏱</span>${c.duration}</span>
          <span class="class-meta-item"><span class="class-meta-icon">👥</span>Max ${c.size}</span>
        </div>
        <div class="class-card-foot">
          <span class="class-price">₹${c.price.toLocaleString()}</span>
          <button class="book-btn" onclick="openBookingModal(${c.id},'${c.name}',${c.price})">Book Now</button>
        </div>
      </div>
    </div>`).join('');
  initReveal();
}

// ─── BOOKING MODAL ───
function openBookingModal(id,name,price){
  document.getElementById('modalClassName').textContent=name;
  document.getElementById('modalClassPrice').textContent='₹'+price.toLocaleString();
  document.getElementById('bookingModal').classList.add('open');
  document.getElementById('bookingSuccess').style.display='none';
  document.getElementById('bookingFormEl').style.display='block';
}
function closeBookingModal(){
  document.getElementById('bookingModal').classList.remove('open');
}
if(document.getElementById('bookingFormEl')) {
  document.getElementById('bookingFormEl').addEventListener('submit',e=>{
    e.preventDefault();
    document.getElementById('bookingFormEl').style.display='none';
    document.getElementById('bookingSuccess').style.display='block';
  });
}

// ─── CONTACT FORM ───
if(document.getElementById('contactFormEl')) {
  document.getElementById('contactFormEl').addEventListener('submit',e=>{
    e.preventDefault();
    document.getElementById('contactFormEl').style.display='none';
    document.getElementById('contactSuccess').style.display='block';
  });
}

// ─── SHOP FILTERS ───
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderShop(btn.dataset.filter);
  });
});

// ─── CLASS CATEGORY FILTERS ───
document.querySelectorAll('.cat-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderClasses(btn.dataset.cat);
  });
});

// ─── TOAST ───
function showToast(msg){
  const t=document.getElementById('toast');
  t.innerHTML=`<span class="toast-icon">✓</span>${msg}`;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// ─── INJECT LOGO IMAGES ───
document.querySelectorAll('[data-logo]').forEach(img=>img.src=IMG_LOGO);

// ─── INIT ───
navigate('home');
setTimeout(initReveal,200);

// Inject real uploaded images
const heroImg1 = document.getElementById('heroImg1');
if(heroImg1) heroImg1.src = IMG_TURQUOISE;
const heroImg2 = document.getElementById('heroImg2');
if(heroImg2) heroImg2.src = IMG_HEARTS;
const heroImg3 = document.getElementById('heroImg3');
if(heroImg3) heroImg3.src = IMG_DRAGON;

const hp1 = document.getElementById('hp1');
if(hp1) hp1.src = IMG_TURQUOISE;
const hp2 = document.getElementById('hp2');
if(hp2) hp2.src = IMG_HEARTS;
const hp3 = document.getElementById('hp3');
if(hp3) hp3.src = IMG_DRAGON;

const aboutImg1 = document.getElementById('aboutImg1');
if(aboutImg1) aboutImg1.src = IMG_TURQUOISE;
const aboutImg2 = document.getElementById('aboutImg2');
if(aboutImg2) aboutImg2.src = IMG_DRAGON;

// Inject footers
const footerTemplate = document.getElementById('_footerTemplate');
if(footerTemplate) {
  const footerHTML = footerTemplate.innerHTML;
  ['homeFooter','shopFooter','aboutFooter','classesFooter','contactFooter'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.innerHTML = footerHTML;
  });
}

// ─── BACK TO TOP ───
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});
if(backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
