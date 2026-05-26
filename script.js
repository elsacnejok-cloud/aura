let cart = [];
let total = 0;
let discountApplied = false;

// Бонусная система
let userBonusPoints = parseInt(localStorage.getItem('aura_bonus_points')) || 0; // Загружаем баллы из памяти
let bonusSpentThisOrder = 0; // Сколько баллов списываем в текущем заказе

// Добавили промокод MELLSTROY в общий список со скидкой 20%
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
  // При открытии корзины обновляем баланс баллов на экране
  if (sidebar && sidebar.classList.contains('active')) {
    updateBonusUI();
  }
}

function addToCart(name, price) {
  cart.push({ name, price });
  // Сбрасываем списание баллов при изменении корзины, чтобы пересчитать честно
  bonusSpentThisOrder = 0; 
  document.getElementById('bonusAppliedMessage').style.display = 'none';
  
  updateCart();
  const sidebar = document.getElementById('cartSidebar');
  if (sidebar) sidebar.classList.add('active');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  bonusSpentThisOrder = 0; // Сбрасываем бонусы
  document.getElementById('bonusAppliedMessage').style.display = 'none';
  updateCart();
}

function updateCart() {
  const countBadge = document.querySelector('.cart-count');
  if (countBadge) countBadge.innerText = cart.length;
  
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');
  const pendingBonusInfo = document.getElementById('pendingBonusInfo');
  
  if (!cartBody || !cartTotal) return;
  
  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="empty-cart-msg">Корзина пока пуста</p>';
    total = 0;
    if (pendingBonusInfo) pendingBonusInfo.innerText = '+0 баллов будет начислено';
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
    
    // Считаем кэшбэк 10% от текущей корзины
    if (pendingBonusInfo) {
      let potentialCashback = Math.floor(total * 0.10);
      pendingBonusInfo.innerText = `+${potentialCashback} баллов будет начислено после заказа`;
    }
  }
  
  // Рассчитываем итоговую цену в корзине с учетом списанных баллов
  let finalCartTotal = total - bonusSpentThisOrder;
  if (finalCartTotal < 0) finalCartTotal = 0;
  cartTotal.innerText = finalCartTotal.toLocaleString();
  
  updateBonusUI();
}

// Функция обновления интерфейса баллов
function updateBonusUI() {
  const balanceEl = document.getElementById('userBonusBalance');
  const spendSection = document.getElementById('spendBonusSection');
  
  if (balanceEl) balanceEl.innerText = userBonusPoints;
  
  // Показываем кнопку «Списать», только если у юзера есть баллы и в корзине что-то лежит
  if (spendSection) {
    if (userBonusPoints > 0 && cart.length > 0 && bonusSpentThisOrder === 0) {
      spendSection.style.display = 'flex';
    } else {
      spendSection.style.display = 'none';
    }
  }
}

// Кнопка списания баллов
function spendBonusPoints() {
  if (userBonusPoints === 0 || total === 0) return;
  
  // Нельзя оплатить баллами больше, чем стоит сам заказ
  if (userBonusPoints >= total) {
    bonusSpentThisOrder = total;
  } else {
    bonusSpentThisOrder = userBonusPoints;
  }
  
  const appliedMsg = document.getElementById('bonusAppliedMessage');
  if (appliedMsg) {
    appliedMsg.style.display = 'block';
    appliedMsg.innerText = `📉 Списано ${bonusSpentThisOrder} баллов в счет оплаты!`;
  }
  
  updateCart();
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
    // Цена в модалке учитывает промокод И списанные бонусы
    let finalModalPrice = total - bonusSpentThisOrder;
    if (finalModalPrice < 0) finalModalPrice = 0;
    
    modalTotal.innerText = finalModalPrice.toLocaleString();
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
    
    // Промокод применяется к цене ПОСЛЕ вычета бонусов
    let basePrice = total - bonusSpentThisOrder;
    if (basePrice < 0) basePrice = 0;
    
    const newTotal = basePrice * (1 - discount);
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
  
  // Проверяем, есть ли в корзине бокс Бурмалда
  const hasBurmalda = cart.some(item => item.name === 'Бокс БУРМАЛДА');
  
  // Начисляем новые баллы за покупку (10% от чистой стоимости товаров)
  let earnedPoints = Math.floor(total * 0.10);
  
  // Вычитаем списанные баллы и добавляем заработанные
  userBonusPoints = userBonusPoints - bonusSpentThisOrder + earnedPoints;
  localStorage.setItem('aura_bonus_points', userBonusPoints); // Сохраняем в память
  
  if (hasBurmalda) {
    alert(`🎉 Заказ на сумму ${finalPrice} ₽ успешно оформлен! БУРМАЛДА АКТИВИРОВАНА! ⚡ Вы получили +${earnedPoints} бьюти-баллов!`);
  } else {
    alert(`Прекрасно! Заказ на сумму ${finalPrice} ₽ успешно принят. На ваш баланс начислено +${earnedPoints} баллов!`);
  }
  
  // Сбрасываем корзину
  cart = [];
  bonusSpentThisOrder = 0;
  document.getElementById('bonusAppliedMessage').style.display = 'none';
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


