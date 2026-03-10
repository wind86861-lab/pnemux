const https = require('https');

const sendTelegramMessage = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const body = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${token}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        res.on('data', () => { });
        res.on('end', resolve);
      }
    );
    req.on('error', (err) => {
      console.error('Telegram notification error:', err.message);
      resolve();
    });
    req.write(body);
    req.end();
  });
};

const formatRequestMessage = (request) => {
  const typeLabels = {
    consultation: '📋 Konsultatsiya',
    'custom-order': '🛒 Maxsus buyurtma',
    calculator: '🔢 Kalkulyator',
    contact: '📞 Bog\'lanish',
  };

  const lines = [
    `🔔 <b>Yangi so'rov!</b>`,
    ``,
    `📌 Turi: <b>${typeLabels[request.type] || request.type}</b>`,
    `👤 Ism: <b>${request.name || '—'}</b>`,
    `📞 Telefon: <b>${request.phone}</b>`,
  ];

  if (request.productModel) lines.push(`📦 Mahsulot: <b>${request.productModel}</b>`);
  if (request.productQuantity) lines.push(`🔢 Miqdor: <b>${request.productQuantity}</b>`);
  if (request.comment) lines.push(`💬 Izoh: <b>${request.comment}</b>`);
  if (request.page) lines.push(`🌐 Sahifa: <b>${request.page}</b>`);
  if (request.image) lines.push(`🖼 Rasm: <a href="${request.image}">Ko'rish</a>`);

  lines.push(``, `🕐 Vaqt: <b>${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}</b>`);

  return lines.join('\n');
};

const formatOrderMessage = (order) => {
  const statusLabels = {
    new: '🆕 Новый',
    processing: '⚙️ В обработке',
    completed: '✅ Выполнен',
    cancelled: '❌ Отменён',
  };

  const lines = [
    `🛒 <b>Новый заказ!</b>`,
    ``,
    `👤 Имя: <b>${order.customerName || '—'}</b>`,
    `📞 Телефон: <b>${order.customerPhone}</b>`,
    `📦 Статус: <b>${statusLabels[order.status] || order.status}</b>`,
    ``,
    `🧾 <b>Товары:</b>`,
  ];

  (order.items || []).forEach((item, i) => {
    lines.push(`  ${i + 1}. ${item.name} × ${item.quantity} = <b>${(item.price * item.quantity).toLocaleString()} so'm</b>`);
  });

  lines.push(``);
  lines.push(`💰 Итого: <b>${order.totalPrice.toLocaleString()} so'm</b>`);
  if (order.comment) lines.push(`💬 Комментарий: <b>${order.comment}</b>`);
  lines.push(``, `🕐 Время: <b>${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}</b>`);

  return lines.join('\n');
};

module.exports = { sendTelegramMessage, formatRequestMessage, formatOrderMessage };
