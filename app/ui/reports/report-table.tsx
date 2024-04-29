import Image from 'next/image';
import InvoiceStatus from '@/app/ui/reports/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredReports } from '@/app/lib/reports/data';
import { ReportsTable } from '@/app/lib/reports/definations';

export default async function InvoicesTable({
  query,
  currentPage,
  fromDate,
  toDate
}: {
  query: string;
  currentPage: number;
  fromDate: string;
  toDate: string;
}) {
  const reports = await fetchFilteredReports(query, currentPage, fromDate, toDate);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">

              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                        Project name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Employee name
                      </th>
                      <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                        From Date to To Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Days
                      </th>
                      <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                        Hours per day
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Cost per hour
                      </th>
                      <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                        Total Costs
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports?.map((report, idx) => (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                          {report.project_name}
                        </th>
                        <td className="px-6 py-4">
                          {report.employee_name}
                        </td>
                        <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                          {report.start_date.toLocaleDateString('en-GB')} - {report.end_date.toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4">
                          {report.days} days
                        </td>
                        <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                          {report.hours_per_day}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {report.cost_currency} {report.cost_per_hour}
                        </td>
                        <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800 text-right">
                          {report.cost_currency} {report.costs}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
