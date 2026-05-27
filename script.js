let cart = [];
let total = 0;
let discountApplied = false;

// Добавили промокод MELLSTROY в общий список со скидкой 20% (0.20)
const PROMO_CODES = {
  "AURA10": 0.10,
  "BEAUTY20": 0.20,
  "MELLSTROY": 0.20
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
  
  // Если модальное окно открыто в момент удаления, обновляем цену и там
  const modal = document.getElementById('orderModal');
  if (modal && modal.classList.contains('active')) {
    const modalTotal = document.getElementById('modalTotalPrice');
    if (modalTotal) modalTotal.innerText = total.toLocaleString();
    
    // Сбрасываем промокод, так как сумма изменилась
    discountApplied = false;
    const pMsg = document.getElementById('promoMessage');
    const pInput = document.getElementById('promoInput');
    if (pMsg) pMsg.innerText = '';
    if (pInput) pInput.value = '';
  }
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
    // Если корзина опустела, закрываем модалку оформления заказа
    closeOrderModal();
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
  
  // Закрываем шторку корзины перед открытием модалки
  const sidebar = document.getElementById('cartSidebar');
  if (sidebar) sidebar.classList.remove('active');
  
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
    
    if (code === 'MELLSTROY') {
      pMsg.style.color = '#77dd77';
      pMsg.innerText = '🔥 Коллаба с Мелстроем! Скидка 20% успешно применилась!';
    } else {
      pMsg.style.color = '#77dd77';
      pMsg.innerText = `Успешно! Скидка ${discount * 100}% активирована.`;
    }
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
  
  const hasBurmalda = cart.some(item => item.name === 'Бокс БУРМАЛДА');
  
  if (hasBurmalda) {
    alert(`🎉 Заказ на сумму ${finalPrice} ₽ успешно оформлен! БУРМАЛДА АКТИВИРОВАНА! ⚡ Мелстрой гордится вами.`);
  } else {
    alert(`Прекрасно! Заказ на сумму ${finalPrice} ₽ успешно принят. Команда бренда AURA уже бережно собирает вашу посылку.`);
  }
  
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
    form.reset(); // Сбрасываем введенные данные из полей
    form.style.display = 'none';
    success.style.display = 'block';
  }
}
// ПЛАВНЫЙ КРУГОВОРОТ ОТЗЫВОВ (ПРОЯВЛЕНИЕ)
let currentPairIndex = 0;

function rotateReviews() {
  const allCards = document.querySelectorAll('.slide-pair');
  if (allCards.length === 0) return;

  // 1. Скрываем текущую пару (делаем прозрачной)
  allCards[currentPairIndex * 2].style.opacity = '0';
  allCards[currentPairIndex * 2 + 1].style.opacity = '0';

  setTimeout(() => {
    // Полностью убираем их из видимости после исчезновения
    allCards[currentPairIndex * 2].style.display = 'none';
    allCards[currentPairIndex * 2 + 1].style.display = 'none';

    // 2. Переключаемся на следующую пару
    currentPairIndex = (currentPairIndex + 1) >= (allCards.length / 2) ? 0 : currentPairIndex + 1;

    // 3. Включаем отображение новой пары
    const isMobile = window.innerWidth <= 768;
    // На мобилках ставим блок (в одну колонку), на ПК — оставляем твой стандартный стиль
    allCards[currentPairIndex * 2].style.display = 'block'; 
    allCards[currentPairIndex * 2 + 1].style.display = 'block';

    // 4. Плавно проявляем их (эффект Fade-in)
    setTimeout(() => {
      allCards[currentPairIndex * 2].style.opacity = '1';
      allCards[currentPairIndex * 2 + 1].style.opacity = '1';
    }, 50);

  }, 600); // Время совпадает с transition в HTML (0.6s)
}

// Запускаем смену отзывов каждые 5 секунд
setInterval(rotateReviews, 5000);



