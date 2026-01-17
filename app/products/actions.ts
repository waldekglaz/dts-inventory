'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
    revalidatePath(`/products/${productId}`);
}

export async function addProductAccessory(productId: number, accessoryId: number, qty: number) {
    db.prepare(`
    INSERT INTO product_accessories (product_id, accessory_id, quantity_per_product) 
    VALUES (?, ?, ?)
  `).run(productId, accessoryId, qty);
    revalidatePath('/products');
    revalidatePath(`/products/${productId}`);
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
    redirect('/products');
}

export async function deleteRecipeItem(formData: FormData) {
    const id = formData.get('id') as string;
    const recipeItem = db.prepare('SELECT product_id FROM recipes WHERE id = ?').get(id) as { product_id: number };

    db.prepare('DELETE FROM recipes WHERE id = ?').run(id);

    if (recipeItem) {
        revalidatePath(`/products/${recipeItem.product_id}`);
    }
    revalidatePath('/products');
}

export async function deleteProductAccessory(formData: FormData) {
    const id = formData.get('id') as string;
    const item = db.prepare('SELECT product_id FROM product_accessories WHERE id = ?').get(id) as { product_id: number };

    db.prepare('DELETE FROM product_accessories WHERE id = ?').run(id);

    if (item) {
        revalidatePath(`/products/${item.product_id}`);
    }
    revalidatePath('/products');
}
