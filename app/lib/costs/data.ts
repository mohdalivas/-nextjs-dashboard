import { getPgpClient } from '../db';
import {
  CostField,
  CostsTableType,
  CostForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  ProjectField,
  EmployeeField,
} from './definitions';
import { formatCurrency } from '../utils';
import { unstable_noStore as noStore } from 'next/cache';

const db = getPgpClient();

const ITEMS_PER_PAGE = 6;

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await db.query(`SELECT * FROM work_segments`);

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch work_segments data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();

  try {
    const data: LatestInvoiceRaw[] = await db.query(`
      SELECT 0 as amount, e.name, '' as image_url, '' as email, ws.id
      FROM work_segments as ws
      JOIN employees as e ON ws.employee_id = e.id
      ORDER BY ws.start_date DESC
      LIMIT 5`);

    const latestInvoices = data.map((project) => ({
      ...project,
      amount: formatCurrency(project.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest projects.');
  }
}

export async function fetchCardData() {
  noStore();

  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const projectCountPromise = db.query(`SELECT COUNT(*) FROM projects`);
    const employeeCountPromise = db.query(`SELECT COUNT(*) FROM employees`);
    const totalDaysPromise = db.query(`SELECT SUM(1 + WS.END_DATE - WS.START_DATE) FROM WORK_SEGMENTS WS`);
    const totalCostPerHoursPromise = db.query(`SELECT ARRAY_TO_STRING(
      ARRAY(
        SELECT CONCAT( case when cs.cost_currency='USD' then '$' when cs.cost_currency='EUR' then '€' else '₹' end, 
            ' ', SUM(COST_PER_HOUR) ) AS SUM
            FROM COST_SEGMENTS CS 
            GROUP BY  COST_CURRENCY	
      ), ', ') AS SUM `);
    const totalHoursPerDayPromise = db.query(`SELECT SUM(HOURS_PER_DAY) AS HOURS_PER_DAY FROM COST_SEGMENTS CS`);
    const totalCostsPromise = db.query(`SELECT ARRAY_TO_STRING(
      ARRAY(
        SELECT 
          CONCAT( case when cs.cost_currency='USD' then '$' when cs.cost_currency='EUR' then '€' else '₹' end, 
          ' ', 
          ROUND(SUM(cs.cost_per_hour / 100 * (1 + ws.end_date - ws.start_date) * (extract(hour from ws.hours_per_day) + extract(minute FROM ws.hours_per_day) / 60) ), 2 ) )
          FROM work_segments ws 
          JOIN cost_segments cs ON ws.project_id = cs.project_id and ws.employee_id = cs.employee_id
          JOIN projects p ON p.id = ws.project_id
          JOIN employees e ON e.id = ws.employee_id
          GROUP BY cs.cost_currency
        ), ', ')  AS SUM`);
    /* const totalPromise = db.query(`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM projects`); */

    const data = await Promise.all([
      projectCountPromise,
      employeeCountPromise,
      totalDaysPromise,
      totalCostPerHoursPromise,
      totalHoursPerDayPromise,
      totalCostsPromise
    ]);

    const numberOfProjects = Number(data[0][0].count ?? '0');
    const numberOfEmployees = Number(data[1][0].count ?? '0');
    const totalNumberOfDays = Number(data[2][0].sum ?? '0');
    const totalCostPerHours = data[3][0];
    const totalHoursPerDays = Number(data[4][0].hours_per_day ?? '0');
    const totalCosts = data[5][0]; //formatCurrency(data[2][0].pending ?? '0');

    return {
      data,
      numberOfProjects,
      numberOfEmployees,
      totalNumberOfDays,
      totalCostPerHours,
      totalHoursPerDays,
      totalCosts
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchCostsPages(query: string) {
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
    throw new Error('Failed to fetch total number of cost-segments.');
  }
}

export async function fetchCostById(id: string) {
  noStore();

  try {
    const data: CostForm[] = await db.query(`
    SELECT
      cs.id,
      cs.project_id,
      cs.employee_id,
      cs.cost_per_hour,
      cs.cost_currency
    FROM cost_segments cs
    WHERE cs.id = $1;
    `, [id]);

    const cost = data.map((cost) => ({
      ...cost,
      // Convert amount from cents to dollars
      cost_per_hour: parseFloat((cost.cost_per_hour / 100).toFixed(2)),
    }));

    return cost[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project.');
  }
}

export async function fetchCosts() {
  try {
    const data: CostField[] = await db.query(`
    SELECT
      cs.id,
      p.name as project_name,
      e.name as employee_name,
      cs.cost_per_hour,
      cs.cost_currency 
    FROM cost_segments cs
    LEFT JOIN projects p ON p.id = cs.project_id
    LEFT JOIN employees e ON e.id = cs.employee_id
    ORDER BY p.name, e.name asc
    `);

     const costs = data.map((cost) => ({
      ...cost,
      // Convert amount from cents to dollars
      cost_per_hour: (cost.cost_per_hour / 100).toFixed(2),
    }));
    
    return costs;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all Project Employee costs.');
  }
}

export async function fetchProjects() {
  try {
    const data = await db.query(`
    SELECT p.id, p.name
    FROM projects p 
    ORDER BY p.name asc
    `);

    const projects = data;
    return projects;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all Projects.');
  }
}

export async function fetchEmployees() {
  try {
    const data = await db.query(`
    SELECT e.id, e.name
    FROM employees e 
    ORDER BY e.name asc
    `);

    const employees = data;
    return employees;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all Employees.');
  }
}

export async function fetchFilteredCosts(query: string, currentPage: number) {
  noStore();

  try {
    const data: CostsTableType[] = await db.query(`
		SELECT
		  cs.id,
		  p.name as project_name,
		  e.name as employee_name,
		  cs.cost_per_hour,
		  cs.cost_currency 
		FROM cost_segments cs
		LEFT JOIN projects p ON p.id = cs.project_id
		LEFT JOIN employees e ON e.id = cs.employee_id
		WHERE
		  p.name ILIKE $1 OR
      e.name ILIKE $2 OR
      cs.cost_per_hour::text ILIKE $3 OR
      cs.cost_currency ILIKE $4
		ORDER BY cs.modified DESC, p.name,e.name asc
	  `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);

    const costs = data.map((cost) => ({
      ...cost,
      cost_per_hour: (cost.cost_per_hour / 100).toFixed(2),
    }));

    return costs;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch cost-segments table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return user[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
