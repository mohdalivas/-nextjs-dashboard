import { unstable_noStore as noStore } from "next/cache";
import { pgp, getPgpClient } from "../db";
import { ReportsTable } from "./definations";

const db = getPgpClient();

const ITEMS_PER_PAGE = 6;

const isDateValid = function (date: any) {
  return date.getTime() === date.getTime();
}

export async function fetchReportsPages(query: string, fromDate: string, toDate: string) {
  noStore();

  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  const arr = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];

  isDateValid(endDate) ? arr.unshift(toDate) : arr.unshift('');
  isDateValid(startDate) ? arr.unshift(fromDate) : arr.unshift('');

  try {
    const result = await db.query(`
      SELECT count(*)
        FROM work_segments ws 
        JOIN cost_segments cs ON ws.project_id = cs.project_id and ws.employee_id = cs.employee_id
        JOIN projects p ON p.id = ws.project_id
        JOIN employees e ON e.id = ws.employee_id
        WHERE
          ${isDateValid(startDate) ? 'ws.start_date >= $1 AND' : ''}
          ${isDateValid(endDate) ? 'ws.end_date <= $2 AND' : ''}
          (p.name ILIKE $3 OR
          e.name ILIKE $4 OR
          ws.start_date::text ILIKE $5 OR
          ws.end_date::text ILIKE $6 OR
          cs.cost_per_hour::text ILIKE $7 OR
          ws.hours_per_day::text ILIKE $8)
      `, arr);

    const totalPages = Math.ceil(Number(result[0].count) / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of reports.');
  }
}

export async function fetchReportsCosts(query: string, fromDate: string, toDate: string) {
  noStore();

  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  const arr = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];

  isDateValid(endDate) ? arr.unshift(toDate) : arr.unshift('');
  isDateValid(startDate) ? arr.unshift(fromDate) : arr.unshift('');

  try {
    const result = await db.query(`
    SELECT ARRAY_TO_STRING(ARRAY(
      SELECT CONCAT( case when cs.cost_currency='USD' then '$' when cs.cost_currency='EUR' then '€' else '₹' end,
      ' ', 
      ROUND(SUM(cs.cost_per_hour / 100 * (1 + ws.end_date - ws.start_date) * (extract(hour from ws.hours_per_day) + extract(minute from ws.hours_per_day) / 60) ), 2 ) )
        FROM work_segments ws 
        JOIN cost_segments cs ON ws.project_id = cs.project_id and ws.employee_id = cs.employee_id
        JOIN projects p ON p.id = ws.project_id
        JOIN employees e ON e.id = ws.employee_id
        WHERE
          ${isDateValid(startDate) ? 'ws.start_date >= $1 AND' : ''}
          ${isDateValid(endDate) ? 'ws.end_date <= $2 AND' : ''}
          (p.name ILIKE $3 OR
          e.name ILIKE $4 OR
          ws.start_date::text ILIKE $5 OR
          ws.end_date::text ILIKE $6 OR
          cs.cost_per_hour::text ILIKE $7 OR
          ws.hours_per_day::text ILIKE $8)
        GROUP BY
          cs.cost_currency
    ), ', ')  
    `, arr);
    // console.log(result[0])

    return result[0].array_to_string;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of reports.');
  }
}

export async function fetchFilteredReports(
  query: string,
  currentPage: number,
  fromDate: string,
  toDate: string
) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  const array = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, ITEMS_PER_PAGE, offset]

  isDateValid(endDate) ? array.unshift(toDate) : array.unshift('');
  isDateValid(startDate) ? array.unshift(fromDate) : array.unshift('');

  // console.log(fromDate, startDate, isDateValid(startDate))
  // console.log(toDate, endDate, isDateValid(endDate))
  try {
    // const query = pgp.as.format();
    // console.log(query);
    const data: ReportsTable[] = await db.query(`
    SELECT p.name as project_name, e.name as employee_name, 
    ws.start_date, ws.end_date, 
    cs.cost_currency, cs.cost_per_hour, ws.hours_per_day, 
    (1 + ws.end_date - ws.start_date) as days, 
    extract(hour from ws.hours_per_day) + extract(minute from ws.hours_per_day) / 60 as hours
    FROM work_segments ws 
    JOIN cost_segments cs ON ws.project_id = cs.project_id and ws.employee_id = cs.employee_id
    JOIN projects p ON p.id = ws.project_id
    JOIN employees e ON e.id = ws.employee_id
    WHERE
      ${isDateValid(startDate) ? 'ws.start_date >= $1 AND' : ''}
      ${isDateValid(endDate) ? 'ws.end_date <= $2 AND' : ''}
      (p.name ILIKE $3 OR
      e.name ILIKE $4 OR
      ws.start_date::text ILIKE $5 OR
      ws.end_date::text ILIKE $6 OR
      cs.cost_per_hour::text ILIKE $7 OR
      ws.hours_per_day::text ILIKE $8) 
    ORDER BY ws.start_date DESC
    LIMIT $9 OFFSET $10 
    `, array);

    const reports = data.map((report) => ({
      ...report,
      cost_per_hour: (report.cost_per_hour / 100).toFixed(2),
      costs: (report.days * report.hours * report.cost_per_hour / 100).toFixed(2),
      cost_currency: report.cost_currency === 'USD' ? '$' : report.cost_currency === 'EUR' ? '€' : '₹' 
    }));

    return reports;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch reports.');
  }
}

