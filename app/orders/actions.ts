'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createOrder(formData: FormData) {
    const customerId = formData.get('customerId') as string;
    const productId = parseInt(formData.get('productId') as string);
    const quantity = parseInt(formData.get('quantity') as string);

    // Dates
    const orderDate = formData.get('orderDate') as string;
    const startDate = formData.get('startDate') as string;
    const completionDate = formData.get('completionDate') as string;

    if (!customerId || !productId || !quantity) return { error: 'Missing required fields' };

    // Get customer name for cache/display if needed (though we rely on ID now)
    const customer = db.prepare('SELECT name FROM customers WHERE id = ?').get(customerId) as { name: string };
    const customerName = customer ? customer.name : 'Unknown';

    // Get requirements
    const recipe = db.prepare('SELECT material_id, yield_per_unit FROM recipes WHERE product_id = ?').all(productId) as any[];
    const prodAccessories = db.prepare('SELECT accessory_id, quantity_per_product FROM product_accessories WHERE product_id = ?').all(productId) as any[];

    if (recipe.length === 0 && prodAccessories.length === 0) {
        return { error: 'Product has no materials or accessories defined' };
    }

    const missingReport: any[] = [];

    // Check material stock
    for (const item of recipe) {
        if (item.yield_per_unit <= 0) continue;
        const needed = quantity / item.yield_per_unit;
        const mat = db.prepare('SELECT name, quantity, unit FROM materials WHERE id = ?').get(item.material_id) as any;

        if (!mat || mat.quantity < needed) {
            missingReport.push({
                type: 'Material',
                name: mat ? mat.name : 'Unknown Material',
                required: needed,
                available: mat ? mat.quantity : 0,
                missing: needed - (mat ? mat.quantity : 0),
                unit: mat ? mat.unit : 'units'
            });
        }
    }

    // Check accessory stock
    for (const item of prodAccessories) {
        const needed = quantity * item.quantity_per_product;
        const acc = db.prepare('SELECT name, quantity, unit FROM accessories WHERE id = ?').get(item.accessory_id) as any;

        if (!acc || acc.quantity < needed) {
            missingReport.push({
                type: 'Accessory',
                name: acc ? acc.name : 'Unknown Accessory',
                required: needed,
                available: acc ? acc.quantity : 0,
                missing: needed - (acc ? acc.quantity : 0),
                unit: acc ? acc.unit : 'pcs'
            });
        }
    }

    if (missingReport.length > 0) {
        return { report: missingReport };
    }

    // Use a transaction
    const orderTx = db.transaction(() => {
        const orderResult = db.prepare(`
            INSERT INTO orders (customer_id, customer_name, status, order_date, start_date, completion_date) 
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(customerId, customerName, 'completed', orderDate, startDate, completionDate);

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
        revalidatePath('/accessories');
        revalidatePath('/');
        return { success: true };
    } catch (err: any) {
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
