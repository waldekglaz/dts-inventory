'use server'

import { setSetting } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateCurrency(formData: FormData) {
    const currency = formData.get('currency') as string;
    if (currency) {
        setSetting('currency', currency);
        revalidatePath('/');
        revalidatePath('/materials');
        revalidatePath('/products');
        revalidatePath('/settings');
        return { success: true };
    }
    return { success: false };
}
