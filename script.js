let cart = [];
let total = 0;
let discountApplied = false;

const PROMO_CODES = {
  "AURA10": 0.10,
  "BEAUTY20": 0.20
};

// Функция живых лепестков на фоне
function createPetal() {
  const petal = document.createElement('div');
  petal.classList.add('petal');
  petal.innerText = '🌸';
  petal.style.left = Math.random() * 100 + 'vw';
  petal.style.animationDuration = Math.random() * 3 + 4 + 's';
  petal.style.opacity = Math.random() * 0.5 + 0.3;
  document.body.appendChild(petal);
  setTimeout(() => { petal.remove(); }, 6000);
}
setInterval(createPetal, 4000);

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  if (sidebar) sidebar.classList.toggle('active');
}

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
  const sidebar = document.getElementById('cartSidebar');
  if (sidebar) sidebar.classList.add('active');
}

// Удаление товара из корзины
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const countBadge = document.querySelector('.cart-count');
  if (countBadge) countBadge.innerText = cart.length;
  
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');
  if (!cartBody || !cartTotal) return;
  
  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="empty-cart-msg">Корзина пока пуста</p>';
    total = 0;
  } else {
    cartBody.innerHTML = '';
    total = 0;
    cart.forEach((item, index) => {
      total += item.price;
      const itemEl = document.createElement('div');
      itemEl.classList.add('cart-item');
      itemEl.innerHTML = `
        <div class="cart-item-info">
          <span>${item.name}</span>
          <strong>${item.price} ₽</strong>
        </div>
        <button class="btn-remove-item" onclick="removeFromCart(${index})">&times;</button>
      `;
      cartBody.appendChild(itemEl);
    });
  }
  cartTotal.innerText = total.toLocaleString();
}

function openOrderModal() {
  if (cart.length === 0) return alert('Ваша корзина пуста!');
  toggleCart();
  
  discountApplied = false;
  const pInput = document.getElementById('promoInput');
  const pMsg = document.getElementById('promoMessage');
  if (pInput) pInput.value = '';
  if (pMsg) pMsg.innerText = '';
  
  const modal = document.getElementById('orderModal');
  const modalTotal = document.getElementById('modalTotalPrice');
  if (modal && modalTotal) {
    modalTotal.innerText = total.toLocaleString();
    modal.classList.add('active');
  }
}

function applyPromoCode() {
  const pInput = document.getElementById('promoInput');
  const pMsg = document.getElementById('promoMessage');
  const modalTotal = document.getElementById('modalTotalPrice');
  if (!pInput || !pMsg || !modalTotal) return;

  if (discountApplied) {
    pMsg.style.color = '#ff6961';
    pMsg.innerText = 'Промокод уже применен!';
    return;
  }
  
  const code = pInput.value.trim().toUpperCase();
  if (PROMO_CODES[code]) {
    const discount = PROMO_CODES[code];
    const newTotal = total * (1 - discount);
    modalTotal.innerText = Math.round(newTotal).toLocaleString();
    discountApplied = true;
    pMsg.style.color = '#77dd77';
    pMsg.innerText = `Успешно! Скидка ${discount * 100}% активирована.`;
  } else {
    pMsg.style.color = '#ff6961';
    pMsg.innerText = 'Неверный или истекший промокод.';
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.remove('active');
}

function submitOrder(event) {
  event.preventDefault();
  const modalTotal = document.getElementById('modalTotalPrice');
  const finalPrice = modalTotal ? modalTotal.innerText : total.toLocaleString();
  alert(`Прекрасно! Заказ на сумму ${finalPrice} ₽ успешно принят. Команда бренда AURA уже бережно собирает вашу посылку.`);
  cart = [];
  updateCart();
  closeOrderModal();
}

function filterCategory(category, buttonElement) {
  const cards = document.querySelectorAll('.product-card');
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (buttonElement) buttonElement.classList.add('active');

  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function toggleFaq(element) {
  const answer = element.querySelector('.faq-answer');
  const span = element.querySelector('.faq-question span');
  if (!answer || !span) return;
  if (answer.style.display === 'block') {
    answer.style.display = 'none';
    span.innerText = '+';
  } else {
    answer.style.display = 'block';
    span.innerText = '−';
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form && success) {
    form.style.display = 'none';
    success.style.display = 'block';
  }
}

