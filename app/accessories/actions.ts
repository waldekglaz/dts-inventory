'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addAccessory(formData: FormData) {
  const name = formData.get('name') as string;
  const quantity = parseFloat(formData.get('quantity') as string);
  const unit = formData.get('unit') as string;
  const min_level = parseFloat(formData.get('min_level') as string);
  const lead_time_days = parseInt(formData.get('lead_time_days') as string || '0');

  db.prepare(`
    INSERT INTO accessories (name, quantity, unit, min_level, lead_time_days) 
    VALUES (?, ?, ?, ?, ?)
  `).run(name, quantity, unit, min_level, lead_time_days);

  revalidatePath('/accessories');
  revalidatePath('/');
}

export async function updateAccessory(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const quantity = parseFloat(formData.get('quantity') as string);
  const unit = formData.get('unit') as string;
  const min_level = parseFloat(formData.get('min_level') as string);
  const lead_time_days = parseInt(formData.get('lead_time_days') as string || '0');

  db.prepare(`
    UPDATE accessories 
    SET name = ?, quantity = ?, unit = ?, min_level = ?, lead_time_days = ?
    WHERE id = ?
  `).run(name, quantity, unit, min_level, lead_time_days, id);

  revalidatePath('/accessories');
  revalidatePath('/');
}

export async function deleteAccessory(formData: FormData) {
  const id = formData.get('id') as string;

  const deleteTx = db.transaction(() => {
    db.prepare('DELETE FROM product_accessories WHERE accessory_id = ?').run(id);
    db.prepare('DELETE FROM accessories WHERE id = ?').run(id);
  });

  deleteTx();

  revalidatePath('/accessories');
  revalidatePath('/');
}
