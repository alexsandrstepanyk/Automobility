import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Because params are not easily extracted without matching file path dynamic segments, wait:
        // This file is in /api/orders/[id]/route.ts!
        const { id } = await params;
        const body = await req.json();

        // Allow updating status, mechanic Id, or photo uploads
        const updateData: any = {};
        if (body.status) updateData.status = body.status;
        if (body.mechanicId !== undefined) updateData.mechanicId = body.mechanicId;
        if (body.beforePhoto) updateData.beforePhoto = body.beforePhoto;
        if (body.afterPhoto) updateData.afterPhoto = body.afterPhoto;

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: updateData,
            include: { mechanic: true }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Failed to update order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.order.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete order:', error);
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}
