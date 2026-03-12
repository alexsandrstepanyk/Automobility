// Telegram Bot Інтеграція для сповіщень механікам

export async function sendTelegramNotification(chatId: string, message: string) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!TELEGRAM_BOT_TOKEN) {
        console.warn('⚠️ TELEGRAM_BOT_TOKEN відсутній. Сповіщення не надіслано.');
        return;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            }),
        });

        if (!response.ok) {
            console.error('❌ Помилка надсилання Telegram:', await response.text());
        }
    } catch (error) {
        console.error('❌ Помилка Telegram:', error);
    }
}

export function formatNewOrderMessage(order: any, mechanicName: string) {
    return `
🚗 <b>Нове замовлення!</b>
<b>Механік:</b> ${mechanicName}

<b>Клієнт:</b> ${order.user}
<b>Авто:</b> ${order.car}
<b>Послуги:</b> ${order.services.join(', ')}
<b>Локація:</b> ${order.loc}
<b>Час:</b> ${order.time}

<a href="https://automobility.vercel.app/mechanic">👉 Відкрити панель майстра</a>
    `.trim();
}
