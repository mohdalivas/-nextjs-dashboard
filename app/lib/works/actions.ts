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
    startDate: z.string().date('Please select a star date.'),
    endDate: z.string().date('Please select an end date.'),
    hoursPerDay: z.string().time('Please select a time.')
});

export type State = {
    errors?: {
        projectId?: string[];
        employeeId?: string[];
        startDate?: string[];
        endDate?: string[];
        hoursPerDay?: string[];
    };
    message?: string | null;
};

// Use Zod to create the expected types
const CreateWork = FormSchema.omit({ id: true });
// Use Zod to update the expected types
const UpdateWork = FormSchema.omit({ id: true });

export async function createWork(prevState: State, formData: FormData) {
    const validatedFields = CreateWork.safeParse({
        projectId: formData.get('projectId'),
        employeeId: formData.get('employeeId'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        hoursPerDay: formData.get('hoursPerDay'),
    })
    // const rawFormData = Object.fromEntries(formData.entries())
    // console.log('rawFormData', rawFormData)

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Work segment.',
        };
    }

    // Prepare data for insertion into the database
    const { projectId, employeeId, startDate, endDate, hoursPerDay } = validatedFields.data;
    // const date = new Date().toISOString().split('T')[0];

    try {
        await db.query(`
            INSERT INTO work_segments (project_id, employee_id, start_date, end_date, hours_per_day)
            VALUES ($1, $2, $3, $4, $5)
        `, [projectId, employeeId, startDate, endDate, hoursPerDay]);
    } catch (error) {
        console.log(error)
        return {
            message: 'Database Error: Failed to Create Work segment.',
        };
    }

    revalidatePath('/dashboard/work-segments');
    redirect('/dashboard/work-segments');
}

export async function updateWork(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateWork.safeParse({
        projectId: formData.get('projectId'),
        employeeId: formData.get('employeeId'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        hoursPerDay: formData.get('hoursPerDay'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Work segment.',
        };
    }

    const { projectId, employeeId, startDate, endDate, hoursPerDay } = validatedFields.data;
    // const amountInCents = costPerHour * 100;

    try {
        await db.query(`
            UPDATE work_segments
            SET project_id = $1, employee_id = $2, start_date = $3, end_date = $4, hours_per_day = $5
            WHERE id = $6
        `, [projectId, employeeId, startDate, endDate, hoursPerDay, id]);
    } catch (error) {
        console.error(error)
        return { message: 'Database Error: Failed to Update Work segment.' };
    }

    revalidatePath('/dashboard/work-segments');
    redirect('/dashboard/work-segments');
}

export async function deleteWork(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        await db.query(`DELETE FROM work_segments WHERE id = $1`, [id]);

        revalidatePath('/dashboard/work-segments');

        return { message: 'Deleted Work segment.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Work segment.' };
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
