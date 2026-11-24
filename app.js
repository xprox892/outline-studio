
const SUPABASE_URL = 'https://numaxcjgpvqmaxzvyocf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_U3uKkX6IG0qQes6cIR4otQ_dFGH1kIE';

const modal = document.getElementById('orderModal');
const form = document.getElementById('orderForm');
const formNote = document.getElementById('formNote');

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('[data-open-order]').forEach(button => {
  button.addEventListener('click', openModal);
});

document.getElementById('closeModal')?.addEventListener('click', closeModal);

modal?.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});

if (form && formNote) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    const data = new FormData(form);

    const order = {
      establishment_name: data.get('venue').trim(),
      service_type: data.get('service').trim(),
      customer_name: data.get('name').trim(),
      contact: data.get('contact').trim(),
      comment: data.get('comment').trim()
    };

    button.disabled = true;
    button.textContent = 'Отправляем...';
    formNote.textContent = 'Отправляем заявку...';

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/submit-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY
          },
          body: JSON.stringify(order)
        }
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Ошибка отправки');
      }

      form.reset();
      formNote.textContent = result.telegramSent
        ? 'Заявка отправлена! Проверь Telegram.'
        : 'Заявка сохранена, но Telegram не отправил уведомление.';

    } catch (error) {
      console.error(error);
      formNote.textContent = 'Ошибка отправки. Попробуйте позже.';
    } finally {
      button.disabled = false;
      button.textContent = 'Отправить заявку ↗';
    }
  });
}

