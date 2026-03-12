import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updateData: any = {};
        if (body.status !== undefined) updateData.status = body.status;
        if (body.isVerified !== undefined) updateData.isVerified = body.isVerified;

        const updatedMechanic = await prisma.mechanic.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updatedMechanic);
    } catch (error) {
        console.error('Failed to update mechanic:', error);
        return NextResponse.json({ error: 'Failed to update mechanic' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.mechanic.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete mechanic:', error);
        return NextResponse.json({ error: 'Failed to delete mechanic' }, { status: 500 });
    }
}
