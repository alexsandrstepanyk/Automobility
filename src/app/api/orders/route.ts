import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendTelegramNotification, formatNewOrderMessage } from '@/lib/telegramNotifier';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { mechanic: true }
        });

        // Initialize with default demo data if the db is empty (for demo purposes)
        if (orders.length === 0) {
            console.log('Database empty, seeding init data...');
            const seedOrders = [
                { id: '1', clientName: 'Олександр В.', carModel: 'Audi Q7', services: JSON.stringify(['Заміна масла']), status: 'pending', time: '14:00', location: 'Хрещатик, 1', price: '1500₴' },
                { id: '2', clientName: 'Марія К.', carModel: 'BMW X5', services: JSON.stringify(['Заміна коліс', 'Хімчистка']), status: 'approved', time: '16:30', location: 'пр. Перемоги, 45', price: '3300₴' },
                { id: '3', clientName: 'Ігор П.', carModel: 'Tesla Model 3', services: JSON.stringify(['Заміна тормозів']), status: 'pending', time: '10:00', location: 'вул. Соборна, 12', price: '4500₴' },
                { id: '4', clientName: 'Олена Д.', carModel: 'Mercedes GLC', services: JSON.stringify(['Хімчистка']), status: 'approved', time: '11:00', location: 'вул. Васильківська, 34', price: '2500₴' },
                { id: '5', clientName: 'Максим Т.', carModel: 'Toyota RAV4', services: JSON.stringify(['Діагностика на виїзді']), status: 'pending', time: '09:30', location: 'Броварський пр-т, 12', price: '1000₴' },
                { id: '6', clientName: 'Юлія С.', carModel: 'Porsche Macan', services: JSON.stringify(['Заміна коліс']), status: 'working', time: '08:00', location: 'Печерськ, 5', price: '800₴' },
            ];

            await Promise.all(seedOrders.map(o => prisma.order.create({ data: o })));

            const seededOrders = await prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                include: { mechanic: true }
            });
            return NextResponse.json(seededOrders);
        }

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientName, carModel, services, time, location, price, city, dist, clientPhone, adLink } = body;

        const newOrder = await prisma.order.create({
            data: {
                clientName,
                carModel,
                clientPhone,
                adLink,
                services: JSON.stringify(services),
                time,
                location,
                price,
                city,
                dist,
                status: 'pending'
            }
        });

        // Try to trigger Telegram notification. This might fail if bot token isn't correct, so we catch it.
        try {
            const message = formatNewOrderMessage({
                user: clientName,
                car: carModel,
                services: services,
                loc: location,
                time: time
            }, "Не призначено");
            await sendTelegramNotification("123456789", message); // Placeholder generic group ID or admin ID
        } catch (tgError) {
            console.error('Telegram Error (can be ignored if not configured):', tgError);
        }

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Failed to create order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
