'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addCustomer(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const notes = formData.get('notes') as string;

    if (!name) return { error: 'Customer Name is required' };

    try {
        db.prepare('INSERT INTO customers (name, email, phone, address, notes) VALUES (?, ?, ?, ?, ?)').run(name, email, phone, address, notes);
        revalidatePath('/customers');
        return { success: true };
    } catch (err: any) {
        return { error: 'Failed to add customer: ' + err.message };
    }
}

export async function updateCustomer(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const notes = formData.get('notes') as string;

    try {
        db.prepare('UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, notes = ? WHERE id = ?').run(name, email, phone, address, notes, id);
        revalidatePath('/customers');
        return { success: true };
    } catch (err: any) {
        return { error: 'Failed to update customer: ' + err.message };
    }
}

export async function deleteCustomer(formData: FormData) {
    const id = formData.get('id') as string;
    try {
        db.prepare('DELETE FROM customers WHERE id = ?').run(id);
        revalidatePath('/customers');
        return { success: true };
    } catch (err: any) {
        return { error: 'Failed to delete customer: ' + err.message };
    }
}
