import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const mechanics = await prisma.mechanic.findMany();

        // Initialize with default demo data if the db is empty (for demo purposes)
        if (mechanics.length === 0) {
            console.log('Mechanic database empty, seeding init data...');
            const seedMechanics = [
                { id: 'm1', name: 'Віталій С.', status: 'busy', phone: '+380991112233' },
                { id: 'm2', name: 'Денис Р.', status: 'available', phone: '+380992223344' },
                { id: 'm3', name: 'Артем О.', status: 'available', phone: '+380993334455' },
                { id: 'm4', name: 'Василь Г.', status: 'busy', phone: '+380994445566' },
                { id: 'm5', name: 'Максим О.', status: 'available', phone: '+380995556677' },
            ];

            await Promise.all(seedMechanics.map(m => prisma.mechanic.create({ data: m })));

            const seededMechanics = await prisma.mechanic.findMany();
            return NextResponse.json(seededMechanics);
        }

        return NextResponse.json(mechanics);
    } catch (error) {
        console.error('Failed to fetch mechanics:', error);
        return NextResponse.json({ error: 'Failed to fetch mechanics' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, specialty, experience } = body;

        const newMechanic = await prisma.mechanic.create({
            data: {
                name,
                phone,
                specialty,
                experience,
                status: 'available',
                isVerified: false
            }
        });

        return NextResponse.json(newMechanic, { status: 201 });
    } catch (error) {
        console.error('Failed to create mechanic:', error);
        return NextResponse.json({ error: 'Failed to create mechanic' }, { status: 500 });
    }
}
