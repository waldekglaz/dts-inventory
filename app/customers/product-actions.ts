'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleCustomerProduct(customerId: number, productId: number, isLinked: boolean) {
    if (isLinked) {
        // Link product
        db.prepare('INSERT OR IGNORE INTO customer_products (customer_id, product_id) VALUES (?, ?)').run(customerId, productId);
    } else {
        // Unlink product
        db.prepare('DELETE FROM customer_products WHERE customer_id = ? AND product_id = ?').run(customerId, productId);
    }
    revalidatePath('/customers');
    revalidatePath('/orders');
}

export async function getCustomerProducts(customerId: number) {
    const products = db.prepare('SELECT product_id FROM customer_products WHERE customer_id = ?').all(customerId) as { product_id: number }[];
    return products.map(p => p.product_id);
}
