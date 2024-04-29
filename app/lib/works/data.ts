import { unstable_noStore } from "next/cache";
import { WorkForm, WorksTableType } from "./definations";
import { getPgpClient } from "../db";
import { unstable_noStore as noStore } from 'next/cache';

const db = getPgpClient();
const ITEMS_PER_PAGE = 6;

export async function fetchWorksPages(query: string) {
    noStore();

    try {
        const count = await db.query(`
      SELECT COUNT(*)
      FROM cost_segments cs 
      JOIN projects p ON cs.project_id = p.id
      JOIN employees e ON cs.employee_id = e.id
      WHERE
        p.name ILIKE $1 OR
        e.name ILIKE $2 OR
        cs.cost_per_hour::text ILIKE $3 OR
        cs.cost_currency ILIKE $4
    `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);

        const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of work-segments.');
    }
}

export async function fetchFilteredWorks(query: string, currentPage: number) {
    unstable_noStore();

    try {
        const data: WorksTableType[] = await db.query(`
          SELECT
            ws.id,
            p.name as project_name,
            e.name as employee_name,
            ws.start_date,
            ws.end_date,
            ws.hours_per_day 
          FROM work_segments ws 
          LEFT JOIN projects p ON p.id = ws.project_id
          LEFT JOIN employees e ON e.id = ws.employee_id
          WHERE
            p.name ILIKE $1 OR
        e.name ILIKE $2 OR
        ws.start_date::text ILIKE $3 OR
        ws.end_date::text ILIKE $4 OR
          ws.hours_per_day::text ILIKE $5
        ORDER BY ws.start_date DESC, ws.end_date DESC, p.name,e.name asc
        `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);

        /* const costs = data.map((cost) => ({
          ...cost,
          total_pending: formatCurrency(cost.total_pending),
          total_paid: formatCurrency(cost.total_paid),
        })); */

        return data;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch work-segments table.');
    }
}

export async function fetchWorkById(id: string) {
    noStore();

    try {
        const data: WorkForm[] = await db.query(`
        SELECT
        ws.id,
        ws.project_id,
        ws.employee_id,
        ws.start_date,
        ws.end_date, 
        ws.hours_per_day  
      FROM work_segments ws
      WHERE ws.id = $1;
      `, [id]);

        const cost = data.map((cost) => ({
            ...cost,
            // Convert amount from cents to dollars
            // start_date: cost.cost_per_hour / 100,
            // end_date: cost.cost_per_hour / 100,
        }));

        return data[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoice.');
    }
}

