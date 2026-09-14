const PRODUCTS = [
  { id:'nutmeg',  name:'Nutmeg',   emoji:'🐿️', price:34.99, badge:'Best Seller', desc:'Eastern gray. Extremely opinionated. Will judge your snacks.' },
  { id:'biscuit', name:'Biscuit',  emoji:'🐿️', price:39.99, badge:'Premium',     desc:'Eastern gray. Tiny paws, huge personality, absolutely no respect for personal space.' },
  { id:'acorn',   name:'Sir Acorn',emoji:'🐿️', price:24.99, badge:'Budget Pick', desc:'Slightly used. Missing one whisker. Big personality.' },
  { id:'pip',     name:'Pip',      emoji:'🐿️', price:34.99, badge:'New',         desc:'Baby! So small! Definitely not a huge 20-year commitment!' },
  { id:'waffles', name:'Waffles',  emoji:'🐿️', price:39.99, badge:'Deluxe',      desc:'Flying squirrel. No, not a sugar glider.' },
  { id:'chonk',   name:'Big Chonk',emoji:'🐿️', price:44.99, badge:'Limited',     desc:'Absolute unit. Ships in a reinforced box. Good luck.' },
  { id:'frampton',name:'Frampton', emoji:'🐿️', price:39.99, badge:'Pre-Order',   desc:'Coming soon with his well-loved Frammock. Pre-chewed for maximum comfort.', action:'Pre-Order' },
  { id:'grumbles',name:'Grumbles', emoji:'🐿️', price:9.99,  badge:'On Sale',     desc:'Deeply discounted because he growls and bites 24/7. All sales final.' },
  { id:'joyce',   name:'Joyce',    emoji:'🐿️',price:49.99,badge:'Pre-Order',     desc:'You must be able to keep up with her large appetite. Warning: baby animals within slapping distance will be slapped. Delivery time pending because she was already released and we have to locate her.', action:'Pre-Order' },
  { id:'mystery', name:'Mystery Squirrel',emoji:'🎁',price:29.99,badge:'Surprise',desc:"You won't know what you're getting. Could be sweet. Could be chaos. Probably both.", action:'Add Mystery Box' },
  { id:'eggs',    name:'Squirrel Eggs',emoji:'🥚',price:19.99,badge:'Dozen',      desc:'One dozen free-range squirrel eggs. Colors and eventual personalities may vary.', units:12, discountable:false },
  { id:'slow-incubator',name:'Slow Incubator',emoji:'⏳',price:29.99,badge:'Budget',desc:'Hatches your squirrel eggs eventually. Affordable, patient and in absolutely no hurry.', units:0, discountable:false },
  { id:'microwave-incubator',name:'Microwave Incubator',emoji:'⚡',price:79.99,badge:'Fastest',desc:'For premium rapid hatching. Microwave-fast, not an actual microwave. Please do not improvise.', units:0, discountable:false },
];

const CART_KEY = 'sq_cart';
let cart = loadCart();

const grid       = document.getElementById('productGrid');
const drawer     = document.getElementById('drawer');
const backdrop   = document.getElementById('backdrop');
const cartBtn    = document.getElementById('cartBtn');
const cartCount  = document.getElementById('cartCount');
const cartItems  = document.getElementById('cartItems');
const cartTotal  = document.getElementById('cartTotal');
const discountRow = document.getElementById('discountRow');
const discountAmount = document.getElementById('discountAmount');
const checkout   = document.getElementById('checkoutBtn');
const fly        = document.getElementById('fly');

function loadCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}
function saveCart(){
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
}
const money = n => '$' + n.toFixed(2);

function renderProducts(){
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <div class="card-img">${p.emoji}</div>
      <div class="card-body">
        <span class="badge">${p.badge}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          <button class="add-btn" data-id="${p.id}">${p.action || 'Add to Cart'}</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCart(){
  const ids = Object.keys(cart);
  const count = ids.reduce((s,id) => s + cart[id], 0);
  cartCount.textContent = count;
  checkout.disabled = count === 0;

  if (!ids.length){
    cartItems.innerHTML = `<div class="empty-cart"><span>🌰</span><p>Your cart is empty.<br>Go pick out a squirrel!</p></div>`;
    discountRow.hidden = true;
    cartTotal.textContent = money(0);
    return;
  }

  const unitCount = ids.reduce((sum, id) => {
    const p = PRODUCTS.find(x => x.id === id);
    return sum + cart[id] * (p.units ?? 1);
  }, 0);

  let subtotal = 0;
  let discountableSubtotal = 0;
  cartItems.innerHTML = ids.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    const qty = cart[id];
    const lineTotal = p.price * qty;
    subtotal += lineTotal;
    if (p.discountable !== false) discountableSubtotal += lineTotal;
    return `
      <div class="line">
        <div class="line-img">${p.emoji}</div>
        <div class="line-info">
          <h4>${p.name}</h4>
          <small>${money(p.price)} each</small>
          <div class="qty">
            <button data-dec="${id}" aria-label="Decrease">−</button>
            <span>${qty}</span>
            <button data-inc="${id}" aria-label="Increase">+</button>
          </div>
        </div>
        <div class="line-price">${money(lineTotal)}</div>
      </div>`;
  }).join('');

  const discount = unitCount > 1 ? discountableSubtotal * 0.01 : 0;
  discountRow.hidden = discount === 0;
  discountAmount.textContent = '-' + money(discount);
  cartTotal.textContent = money(subtotal - discount);
}

function flyToCart(btn, emoji){
  const start = btn.getBoundingClientRect();
  const end   = cartBtn.getBoundingClientRect();

  fly.textContent = emoji;
  fly.style.transition = 'none';
  fly.style.left = start.left + start.width/2 - 20 + 'px';
  fly.style.top  = start.top  + start.height/2 - 20 + 'px';
  fly.style.transform = 'scale(1) rotate(0deg)';
  fly.classList.add('go');

  requestAnimationFrame(() => requestAnimationFrame(() => {
    fly.style.transition = 'left .85s cubic-bezier(.5,-0.4,.5,1), top .85s cubic-bezier(.5,-0.4,.5,1), transform .85s ease-in, opacity .2s ease .7s';
    fly.style.left = end.left + end.width/2 - 16 + 'px';
    fly.style.top  = end.top  + end.height/2 - 16 + 'px';
    fly.style.transform = 'scale(.3) rotate(540deg)';
    fly.style.opacity = '0';
  }));

  setTimeout(() => {
    fly.classList.remove('go');
    fly.style.opacity = '';
    cartBtn.classList.add('bump');
    acornBurst(end.left + end.width/2, end.top + end.height/2);
    setTimeout(() => cartBtn.classList.remove('bump'), 460);
  }, 860);
}

function acornBurst(x, y){
  const bits = ['🌰','🍂','🌰','✨','🍁','🌰'];
  bits.forEach((b, i) => {
    const el = document.createElement('div');
    el.className = 'pop';
    el.textContent = b;
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    const ang = (Math.PI * 2 * i) / bits.length + Math.random();
    const dist = 50 + Math.random() * 45;
    el.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    el.style.setProperty('--dy', (Math.sin(ang) * dist - 25) + 'px');
    el.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 950);
  });
}

function addToCart(id, btn){
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();

  const p = PRODUCTS.find(x => x.id === id);
  flyToCart(btn, p.emoji);

  const original = btn.textContent;
  btn.textContent = 'Added! ✓';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = original; btn.classList.remove('added'); }, 1100);
}

function openDrawer(){ drawer.classList.add('open'); backdrop.classList.add('open'); }
function closeDrawer(){ drawer.classList.remove('open'); backdrop.classList.remove('open'); }

grid.addEventListener('click', e => {
  const btn = e.target.closest('.add-btn');
  if (btn) addToCart(btn.dataset.id, btn);
});

cartItems.addEventListener('click', e => {
  const inc = e.target.dataset.inc;
  const dec = e.target.dataset.dec;
  if (inc){ cart[inc]++; }
  else if (dec){ cart[dec]--; if (cart[dec] <= 0) delete cart[dec]; }
  else return;
  saveCart();
  renderCart();
});

cartBtn.addEventListener('click', openDrawer);
document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
backdrop.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

checkout.addEventListener('click', () => {
  checkout.textContent = 'Processing…';
  checkout.disabled = true;
  setTimeout(() => { window.location.href = 'checkout.html'; }, 900);
});

renderProducts();
renderCart();
