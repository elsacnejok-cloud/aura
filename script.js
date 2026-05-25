let cart = [];
let total = 0;
let discountApplied = false; // Флаг: применена ли скидка

// Секретные промокоды бренда
const PROMO_CODES = {
  "AURA10": 0.10, // Скидка 10%
  "BEAUTY20": 0.20 // Скидка 20%
};

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
    cart.forEach((item) => {
      total += item.price;
      const itemEl = document.createElement('div');
      itemEl.classList.add('cart-item');
      itemEl.innerHTML = `<span>${item.name}</span><strong>${item.price} ₽</strong>`;
      cartBody.appendChild(itemEl);
    });
  }
  cartTotal.innerText = total.toLocaleString();
}

function openOrderModal() {
  if (cart.length === 0) return alert('Ваша корзина пуста!');
  toggleCart();
  
  // Сбрасываем промокод при каждом новом открытии анкеты
  discountApplied = false;
  
  const modal = document.getElementById('orderModal');
  const modalTotal = document.getElementById('modalTotalPrice');
  
  if (modal && modalTotal) {
    modalTotal.innerText = total.toLocaleString();
    
    // Динамически добавляем поле промокода в форму, если его там еще нет
    const form = document.getElementById('checkoutForm');
    if (form && !document.getElementById('promoInput')) {
      const promoGroup = document.createElement('div');
      promoGroup.classList.add('form-group');
      promoGroup.innerHTML = `
        <label>Промокод (Попробуй: AURA10)</label>
        <div style="display:flex; gap:10px;">
          <input type="text" id="promoInput" placeholder="Введите код" style="margin-bottom:0; flex-grow:1;">
          <button type="button" onclick="applyPromoCode()" style="background:#333; color:white; border:none; padding:0 15px; border-radius:8px; cursor:pointer;">Применить</button>
        </div>
        <small id="promoMessage" style="display:block; margin-top:5px; font-size:12px; color:#F7A8D2;"></small>
      `;
      // Вставляем перед блоком итоговой суммы
      const summary = form.querySelector('.order-summary-box');
      form.insertBefore(promoGroup, summary);
    } else {
      // Если поле уже есть, просто очищаем его
      document.getElementById('promoInput').value = '';
      document.getElementById('promoMessage').innerText = '';
    }
    
    modal.classList.add('active');
  }
}

// Функция активации промокода
function applyPromoCode() {
  if (discountApplied) {
    document.getElementById('promoMessage').innerText = 'Промокод уже применен!';
    return;
  }
  
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  const messageEl = document.getElementById('promoMessage');
  const modalTotal = document.getElementById('modalTotalPrice');
  
  if (PROMO_CODES[code]) {
    const discount = PROMO_CODES[code];
    const newTotal = total * (1 - discount);
    modalTotal.innerText = Math.round(newTotal).toLocaleString();
    discountApplied = true;
    messageEl.style.color = '#77dd77';
    messageEl.innerText = `Успешно! Скидка ${discount * 100}% активирована.`;
  } else {
    messageEl.style.color = '#ff6961';
    messageEl.innerText = 'Неверный или истекший промокод.';
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.remove('active');
}

function submitOrder(event) {
  event.preventDefault();
  const finalPrice = document.getElementById('modalTotalPrice').innerText;
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
