/* ============================================================
   КАЛЬКУЛЯТОР "ПОД КЛЮЧ" (реалистичные цифры для РБ)
============================================================ */
(function() {
  const CONFIG = {
    usdRate: 3.25,
    deliveryUsd: 4500,
    customsPercent: 0,
    recyclingFeeByn: 600,
    commissionUsd: 1000,
    formatMoney: (n) => Number(n).toLocaleString('ru-RU')
  };

  document.addEventListener('DOMContentLoaded', function() {
    const calcBtn = document.getElementById('calcBtn');
    if (!calcBtn) return;

    const modalHTML = `
      <div class="calc-modal-backdrop" id="calcModal">
        <div class="calc-modal">
          <button class="calc-close" id="calcClose">✕</button>
          <h2 class="calc-title">Цена под ключ в Минске</h2>
          <p class="calc-subtitle">Расчёт для физлица, включая доставку и таможню</p>
          
          <div class="calc-steps" id="calcSteps">
            <div class="calc-step">
              <span class="calc-step-name">Стоимость авто в Китае</span>
              <span class="calc-step-value" id="calcCarPrice">—</span>
            </div>
            <div class="calc-step">
              <span class="calc-step-name">Доставка и логистика</span>
              <span class="calc-step-value" id="calcDelivery">—</span>
            </div>
            <div class="calc-step">
              <span class="calc-step-name">Таможенная пошлина</span>
              <span class="calc-step-value" id="calcCustoms">—</span>
            </div>
            <div class="calc-step">
              <span class="calc-step-name">Утильсбор</span>
              <span class="calc-step-value" id="calcRecycling">—</span>
            </div>
            <div class="calc-step">
              <span class="calc-step-name">Комиссия NDSCAR</span>
              <span class="calc-step-value" id="calcCommission">—</span>
            </div>
            <div class="calc-step calc-step-total">
              <span class="calc-step-name">Итого под ключ</span>
              <span class="calc-step-value calc-total" id="calcTotal">—</span>
            </div>
          </div>

          <div class="calc-note">
            ⚡ Расчёт предварительный. Точная цена зависит от курса и текущих ставок. Менеджер подтвердит при заявке.
          </div>

          <button class="btn btn-fire btn-block btn-lg" id="calcOrderBtn" style="margin-top:20px;">
            Забронировать по этой цене
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('calcModal');
    const closeBtn = document.getElementById('calcClose');
    const steps = document.getElementById('calcSteps');

    function closeModal() {
      modal.classList.remove('open');
      document.body.classList.remove('locked');
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    document.getElementById('calcOrderBtn').addEventListener('click', function() {
      closeModal();
      const orderBtn = document.getElementById('btnOrder');
      if (orderBtn) orderBtn.click();
    });

    function calculate(carPriceUsd) {
      const carPriceByn = carPriceUsd * CONFIG.usdRate;
      const deliveryByn = CONFIG.deliveryUsd * CONFIG.usdRate;
      const customsByn = carPriceByn * CONFIG.customsPercent;
      const recyclingByn = CONFIG.recyclingFeeByn;
      const commissionByn = CONFIG.commissionUsd * CONFIG.usdRate;
      
      const totalByn = carPriceByn + deliveryByn + customsByn + recyclingByn + commissionByn;

      return {
        car: carPriceByn,
        delivery: deliveryByn,
        customs: customsByn,
        recycling: recyclingByn,
        commission: commissionByn,
        total: totalByn
      };
    }

    window.openCalculator = function(priceUsd) {
      if (!priceUsd || priceUsd === 0) {
        alert('Цена по запросу. Свяжитесь с менеджером.');
        return;
      }

      const result = calculate(priceUsd);

      document.getElementById('calcCarPrice').textContent = CONFIG.formatMoney(result.car) + ' BYN';
      document.getElementById('calcDelivery').textContent = CONFIG.formatMoney(result.delivery) + ' BYN';
      document.getElementById('calcCustoms').textContent = CONFIG.formatMoney(result.customs) + ' BYN';
      document.getElementById('calcRecycling').textContent = CONFIG.formatMoney(result.recycling) + ' BYN';
      document.getElementById('calcCommission').textContent = CONFIG.formatMoney(result.commission) + ' BYN';
      document.getElementById('calcTotal').textContent = CONFIG.formatMoney(result.total) + ' BYN';

      modal.classList.add('open');
      document.body.classList.add('locked');

      steps.querySelectorAll('.calc-step').forEach((step, i) => {
        step.style.animation = 'none';
        step.offsetHeight;
        step.style.animation = `calcStepIn 0.4s ease ${i * 100}ms both`;
      });
    };
  });
})();