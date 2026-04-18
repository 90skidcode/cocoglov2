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
  about: document.getElementById('page-about'),
  classes: document.getElementById('page-classes'),
  contact: document.getElementById('page-contact'),
};
function navigate(id){
  Object.values(pages).forEach(p=>{
    if(p) p.classList.remove('active');
  });
  if(pages[id]) pages[id].classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  
  // Navbar toggle for sections with dark backgrounds
  const navbarEl = document.getElementById('navbar');
  if(id === 'classes') {
    navbarEl.classList.add('dark-bg');
  } else {
    navbarEl.classList.remove('dark-bg');
  }

  document.querySelectorAll('[data-nav]').forEach(a=>{
    a.classList.toggle('active', a.dataset.nav===id);
  });
  initReveal();
  if(id==='classes') renderClasses();
}

// ─── WHATSAPP CONTACT ───
function contactWA(type, extra = '') {
  const phone = '919789560316';
  const messages = {
    'nav': "Hi COCOGLO! I'm interested in booking a soap-making class. Could you share the available schedule?",
    'hero': "Hi! I saw your soap-making workshops on the home page and would like to learn more.",
    'about': "Hello! I'm interested in joining a COCOGLO workshop after reading your story. How can I register?",
    'secure': "Hi COCOGLO! I want to secure my place in your next natural skincare workshop.",
    'class': `Hi! I'd like to book the "${extra}" workshop. Is there an upcoming slot for this?`
  };
  const text = messages[type] || messages['nav'];
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
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
{id:6,slug:'in-person-basic-soap-making.html',name:'In-Person Basic Soap Making Workshop',cat:'beginner',level:'Beginner',duration:'1 day',size:'5 ppl',price:2000,color:'#5BBFB5',emoji:'🌿',img:'assets/Class2.png',
   format:'In-Person',
   desc:'A fun, beginner-friendly 1-day workshop where you get hands-on experience with natural ingredients. Create your own handmade soaps using your choice of colours and scents — and take home 6 bars plus your mould!',
   whatYoullLearn:[
     'Basics of soap making and ingredients',
     'Understanding oils, fragrances and additives',
     'Safe handling of materials',
     'Basic design and finishing techniques',
     'Moulding and finishing your soaps',
     'Choosing colours and scents',
   ],
   whoItsFor:'Perfect for complete beginners looking to start their soap-making journey. No prior experience needed — just bring your creativity!',
   includes:[
     'All equipment and materials provided at the studio',
     '6 handmade soap bars and a mould to take home',
     'Digital PDF guide with beginner-friendly instructions',
     'Community access and post-workshop support',
   ],
   faqs:[
     {q:'Do I need any experience?', a:'No experience at all! This is specifically designed for complete beginners.'},
     {q:'What should I bring?', a:'Just yourself! All materials, equipment, and protective gear are fully provided.'},
     {q:'Can I take my soaps home the same day?', a:'Yes! Your 6 soap bars will be ready to take home at the end of the session along with your mould.'},
     {q:'When are the timings?', a:'Timings are customisable. Reach out via WhatsApp and we will schedule a session that suits you.'},
   ],
  },
{id:5,slug:'in-person-advanced-soap-making.html',name:'In-Person Advanced Soap Making Workshop',cat:'advanced',level:'Advanced',duration:'2 days',size:'5 ppl',price:4500,color:'#5BBFB5',emoji:'🧪',img:'assets/soap2.png',
   format:'In-Person',
   desc:'Take your soap-making to the next level. Master saponification, lye calculations, oil blending, superfatting, and advanced design techniques in this immersive 2-day hands-on workshop in Komarapalayam.',
   whatYoullLearn:[
     'Saponification — how oils and lye form soap',
     'Calculating correct lye amounts accurately',
     'Choosing and balancing oils for skin benefits',
     'Superfatting, water discounting and trace control',
     'Use of specialty additives (clays, charcoal, milk)',
     'Testing pH, hardness, lather and longevity',
     'Curing, storage and shelf-life optimisation',
     'Creating and customising your own soap batch',
   ],
   whoItsFor:'Designed for those who want to go beyond the basics. A basic understanding of soap making is recommended.',
   includes:[
     'All equipment and materials provided at the studio',
     'Your own batch of handmade soaps',
     'Detailed digital PDF guide with advanced notes and calculations',
     'Community access and post-workshop support',
   ],
   faqs:[
     {q:'Is this for beginners?', a:'This is an advanced workshop. A basic understanding of cold process is recommended. Consider our Cold Process Basics class first if you are new.'},
     {q:'What do I need to bring?', a:'Just yourself! All materials, equipment, and protective gear are provided.'},
     {q:'When are the dates?', a:'Dates are customisable. Reach out via WhatsApp and we will schedule a session that works for you.'},
     {q:'How is my spot confirmed?', a:'Only upon completion of online payment. Limited to 5 participants per session.'},
   ],
  },
{id:4,slug:'in-person-artisan-soap-designing.html',name:'In-Person Artisan Soap Designing',cat:'advanced',level:'Advanced',duration:'9 & 10 May',size:'5 ppl',price:3500,color:'#C0394B',emoji:'✨',img:'assets/class4a.png',
   format:'In-Person',
   desc:'Come empty-handed and immerse yourself in the art of cold process soap making. Play with colours and scents of your choice, create your own fully custom soap design, and walk away with 10 stunning handmade soap bars that are entirely yours.',
   whatYoullLearn:[
     'Advanced pigment and colorant techniques in cold process',
     'Multiple swirl, layer, and embed design methods',
     'Custom fragrance blending and scent anchoring',
     'Creating signature textured and decorated tops',
     'Cutting and finishing for a professional presentation',
     'Building your own artisan recipe from scratch',
   ],
   whoItsFor:'For soap makers with some cold process experience who want to level up and create visually stunning, fully personalised bars. All materials are provided — you focus entirely on creativity.',
   includes:[
     'All materials, pigments, and fragrances provided',
     '10 stunning handcrafted soap bars to take home',
     'Advanced recipe and design guide PDF',
     'Digital certificate of completion',
     'Post-class WhatsApp support',
   ],
   faqs:[
     {q:'Do I need prior soap-making experience?', a:'A basic understanding of cold process is required. We recommend completing the Cold Process Basics class first if you are new.'},
     {q:'Can I pick my own colours and scents?', a:'Yes — on the day you\'ll choose from our curated palette of micas and fragrances to create a completely personal bar.'},
     {q:'Where is the class held?', a:'In Bhavani, Tamil Nadu. Full address and directions are shared upon booking confirmation.'},
     {q:'How many soaps will I take home?', a:'You\'ll take home 10 beautiful bars that you designed and made yourself over the two days.'},
   ],
  }

];

function renderClasses(filter='all'){
  const grid = document.getElementById('classesGrid');
  const filtered = filter==='all'?CLASSES:CLASSES.filter(c=>c.cat===filter);
  grid.innerHTML = filtered.map(c=>`
    <div class="class-card reveal">
      <div class="class-card-banner" onclick="navigateToClass(${c.id})" style="cursor:pointer;">
        <img src="${c.img}" alt="${c.name}" class="class-card-img" loading="lazy">
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
          <div style="display:flex;gap:0.5rem;">
            <button class="book-btn book-btn-outline" onclick="navigateToClass(${c.id})">Details →</button>
            <button class="book-btn" onclick="contactWA('class', '${c.name}')">Book Now</button>
          </div>
        </div>
      </div>
    </div>`).join('');
  initReveal();
}

// ─── CLASS DETAIL ───
function navigateToClass(id) {
  const cls = CLASSES.find(c => c.id === id);
  if (!cls || !cls.slug) return;
  window.location.href = cls.slug;
}

function toggleFAQ(el) {
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.cd-faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
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
// Support ?page=X links from standalone class detail pages
const _initPageParam = new URLSearchParams(window.location.search).get('page');
navigate((_initPageParam && pages[_initPageParam]) ? _initPageParam : 'home');
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


