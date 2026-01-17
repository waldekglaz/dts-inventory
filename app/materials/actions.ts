'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addMaterial(formData: FormData) {
  const name = formData.get('name') as string;
  const quantity = parseFloat(formData.get('quantity') as string);
  const unit = formData.get('unit') as string;
  const min_level = parseFloat(formData.get('min_level') as string);
  const cost_per_unit = parseFloat(formData.get('cost_per_unit') as string || '0');

  db.prepare(`
    INSERT INTO materials (name, quantity, unit, min_level, cost_per_unit) 
    VALUES (?, ?, ?, ?, ?)
  `).run(name, quantity, unit, min_level, cost_per_unit);

  revalidatePath('/materials');
  revalidatePath('/');
}

export async function updateMaterial(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const quantity = parseFloat(formData.get('quantity') as string);
  const unit = formData.get('unit') as string;
  const min_level = parseFloat(formData.get('min_level') as string);
  const cost_per_unit = parseFloat(formData.get('cost_per_unit') as string || '0');

  db.prepare(`
    UPDATE materials 
    SET name = ?, quantity = ?, unit = ?, min_level = ?, cost_per_unit = ?
    WHERE id = ?
  `).run(name, quantity, unit, min_level, cost_per_unit, id);

  revalidatePath('/materials');
  revalidatePath('/');
}

export async function deleteMaterial(formData: FormData) {
  const id = formData.get('id') as string;

  // Use a transaction to clean up recipes first
  const deleteTx = db.transaction(() => {
    db.prepare('DELETE FROM recipes WHERE material_id = ?').run(id);
    db.prepare('DELETE FROM materials WHERE id = ?').run(id);
  });

  deleteTx();

  revalidatePath('/materials');
  revalidatePath('/');
}
