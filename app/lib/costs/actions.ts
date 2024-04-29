'use server';

import { z } from 'zod';
import { getPgpClient } from '../db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const db = getPgpClient();

const FormSchema = z.object({
    id: z.string(),
    projectId: z.string({
        invalid_type_error: 'Please select a project.',
    }),
    employeeId: z.string({
        invalid_type_error: 'Please select an employee.',
    }),
    costPerHour: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    costCurrency: z.enum(['INR', 'EUR', 'USD'], {
        invalid_type_error: 'Please select a currency.',
    }),
    date: z.string(),
});

// Use Zod to create the expected types
const CreateCost = FormSchema.omit({ id: true, date: true });
// Use Zod to update the expected types
const UpdateCost = FormSchema.omit({ id: true, date: true });

// This is temporary until @types/react-dom is updated
export type State = {
    errors?: {
        projectId?: string[];
        employeeId?: string[];
        costPerHour?: string[];
        costCurrency?: string[];
        startDate?: string[];
        endDate?: string[];
        HoursPerDay?: string[];
    };
    message?: string | null;
};

export async function createCost(prevState: State, formData: FormData) {
    const validatedFields = CreateCost.safeParse({
        projectId: formData.get('projectId'),
        employeeId: formData.get('employeeId'),
        costPerHour: formData.get('costPerHour'),
        costCurrency: formData.get('costCurrency'),
    })
    // const rawFormData = Object.fromEntries(formData.entries())

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Cost segment.',
        };
    }

    // Prepare data for insertion into the database
    const { projectId, employeeId, costPerHour, costCurrency } = validatedFields.data;
    const amountInCents = costPerHour * 100;
    // const date = new Date().toISOString().split('T')[0];

    try {
        await db.query(`
            INSERT INTO cost_segments (project_id, employee_id, cost_per_hour, cost_currency)
            VALUES ($1, $2, $3, $4)
        `, [projectId, employeeId, amountInCents, costCurrency]);
    } catch (error) {
        console.log(error)
        return {
            message: 'Database Error: Failed to Create Cost segment.',
        };
    }

    revalidatePath('/dashboard/cost-segments');
    redirect('/dashboard/cost-segments');
}

export async function updateCost(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateCost.safeParse({
        projectId: formData.get('projectId'),
        employeeId: formData.get('employeeId'),
        costPerHour: formData.get('costPerHour'),
        costCurrency: formData.get('costCurrency'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Cost segment.',
        };
    }

    const { projectId, employeeId, costPerHour, costCurrency } = validatedFields.data;
    const amountInCents = costPerHour * 100;

    try {
        await db.query(`
            UPDATE cost_segments
            SET project_id = $1, employee_id = $2, cost_per_hour = $3, cost_currency = $4
            WHERE id = $5
        `, [projectId, employeeId, amountInCents, costCurrency, id]);
    } catch (error) {
        console.error(error)
        return { message: 'Database Error: Failed to Update Cost segment.' };
    }

    revalidatePath('/dashboard/cost-segments');
    redirect('/dashboard/cost-segments');
}

export async function deleteCost(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        await db.query(`DELETE FROM cost_segments WHERE id = $1`, [id]);

        revalidatePath('/dashboard/cost-segments');

        return { message: 'Deleted Cost segment.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Cost segment.' };
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
