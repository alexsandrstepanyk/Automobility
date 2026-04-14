import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');

    try {
        const db = prisma as any;
        if (brand) {
            // Fetch models for a specific brand
            const models = await db.carCatalog.findMany({
                where: {
                    brand: { equals: brand }
                },
                select: {
                    model: true
                },
                distinct: ['model'],
                orderBy: {
                    model: 'asc'
                }
            });
            return NextResponse.json(models.map((m: { model: string }) => m.model));
        } else if (search) {
            // Search for brands matching the query
            const brands = await db.carCatalog.findMany({
                where: {
                    brand: { contains: search }
                },
                select: {
                    brand: true
                },
                distinct: ['brand'],
                orderBy: {
                    brand: 'asc'
                },
                take: 10
            });
            return NextResponse.json(brands.map((b: { brand: string }) => b.brand));
        } else {
            // Fetch all unique brands
            const brands = await db.carCatalog.findMany({
                select: {
                    brand: true
                },
                distinct: ['brand'],
                orderBy: {
                    brand: 'asc'
                }
            });
            return NextResponse.json(brands.map((b: { brand: string }) => b.brand));
        }
    } catch (error) {
        console.error('Failed to fetch car catalog:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
