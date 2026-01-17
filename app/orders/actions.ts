'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createOrder(formData: FormData) {
    const customerName = formData.get('customerName') as string;
    const productId = parseInt(formData.get('productId') as string);
    const quantity = parseInt(formData.get('quantity') as string);

    if (!customerName || !productId || !quantity) return { error: 'Missing fields' };

    // Get requirements
    const recipe = db.prepare('SELECT material_id, yield_per_unit FROM recipes WHERE product_id = ?').all(productId) as any[];
    const prodAccessories = db.prepare('SELECT accessory_id, quantity_per_product FROM product_accessories WHERE product_id = ?').all(productId) as any[];

    if (recipe.length === 0 && prodAccessories.length === 0) {
        return { error: 'Product has no materials or accessories defined' };
    }

    // Pre-check stock levels
    for (const item of recipe) {
        if (item.yield_per_unit <= 0) continue;
        const needed = quantity / item.yield_per_unit;
        const mat = db.prepare('SELECT name, quantity, unit FROM materials WHERE id = ?').get(item.material_id) as any;
        if (!mat || mat.quantity < needed) {
            return { error: `Insufficient material stock: "${mat.name}". Required: ${needed.toFixed(2)}, Available: ${mat.quantity.toFixed(2)}` };
        }
    }

    for (const item of prodAccessories) {
        const needed = quantity * item.quantity_per_product;
        const acc = db.prepare('SELECT name, quantity, unit FROM accessories WHERE id = ?').get(item.accessory_id) as any;
        if (!acc || acc.quantity < needed) {
            return { error: `Insufficient accessory stock: "${acc.name}". Required: ${needed}, Available: ${acc.quantity}` };
        }
    }

    // Use a transaction
    const orderTx = db.transaction(() => {
        const orderResult = db.prepare('INSERT INTO orders (customer_name, status) VALUES (?, ?)').run(customerName, 'completed');
        const orderId = orderResult.lastInsertRowid;
        db.prepare('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)').run(orderId, productId, quantity);

        // Deduct materials
        for (const item of recipe) {
            if (item.yield_per_unit <= 0) continue;
            const totalToDeduct = quantity / item.yield_per_unit;
            db.prepare('UPDATE materials SET quantity = quantity - ? WHERE id = ?').run(totalToDeduct, item.material_id);
        }

        // Deduct accessories
        for (const item of prodAccessories) {
            const totalToDeduct = quantity * item.quantity_per_product;
            db.prepare('UPDATE accessories SET quantity = quantity - ? WHERE id = ?').run(totalToDeduct, item.accessory_id);
        }
    });

    try {
        orderTx();
        revalidatePath('/orders');
        revalidatePath('/materials');
        revalidatePath('/');
        return { success: true };
    } catch (err: any) {
        if (err.message.includes('CHECK constraint failed: quantity >= 0')) {
            return { error: 'Insufficient stock: One or more materials would fall below zero.' };
        }
        return { error: 'System Error: ' + err.message };
    }
}

export async function deleteOrder(formData: FormData) {
    const id = formData.get('id') as string;
    db.prepare('DELETE FROM order_items WHERE order_id = ?').run(id);
    db.prepare('DELETE FROM orders WHERE id = ?').run(id);
    revalidatePath('/orders');
    revalidatePath('/');
}
