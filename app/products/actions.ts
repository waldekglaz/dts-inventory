'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string || '0');

    const result = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)').run(name, price);
    const productId = result.lastInsertRowid;

    revalidatePath('/products');
}

export async function addRecipeItem(productId: number, materialId: number, yieldPerUnit: number) {
    db.prepare(`
    INSERT INTO recipes (product_id, material_id, yield_per_unit) 
    VALUES (?, ?, ?)
  `).run(productId, materialId, yieldPerUnit);
    revalidatePath('/products');
}

export async function addProductAccessory(productId: number, accessoryId: number, qty: number) {
    db.prepare(`
    INSERT INTO product_accessories (product_id, accessory_id, quantity_per_product) 
    VALUES (?, ?, ?)
  `).run(productId, accessoryId, qty);
    revalidatePath('/products');
}

export async function deleteProduct(formData: FormData) {
    const id = formData.get('id') as string;

    // Start a transaction to delete product and its related records
    const deleteTx = db.transaction(() => {
        db.prepare('DELETE FROM recipes WHERE product_id = ?').run(id);
        db.prepare('DELETE FROM product_accessories WHERE product_id = ?').run(id);
        db.prepare('DELETE FROM order_items WHERE product_id = ?').run(id);
        db.prepare('DELETE FROM products WHERE id = ?').run(id);
    });

    deleteTx();

    revalidatePath('/products');
}
