
const SUPABASE_URL = 'https://numaxcjgpvqmaxzvyocf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_U3uKkX6IG0qQes6cIR4otQ_dFGH1kIE';

const form = document.getElementById('orderForm');
const formNote = document.getElementById('formNote');

if (form && formNote) {
  form.addEventListener('submit', async (event) => {
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
        ? 'Заявка отправлена! Уведомление пришло в Telegram.'
        : 'Заявка сохранена, но уведомление в Telegram не отправлено.';

    } catch (error) {
      console.error(error);
      formNote.textContent =
        'Не удалось отправить заявку. Попробуйте позже.';
    } finally {
      button.disabled = false;
      button.textContent = 'Отправить заявку ↗';
    }
  });
}
