import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { CostsTableType, FormattedCostsTable } from '@/app/lib/costs/definitions';
import { fetchFilteredCosts } from '@/app/lib/costs/data';
import { UpdateCost, DeleteCost } from '@/app/ui/costs/buttons';
import { FormEvent } from 'react';

export default async function CostsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const costs = await fetchFilteredCosts(query, currentPage);

  return (
    <div className="w-full">
      {/* <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Cost Segments
      </h1>
      <Search placeholder="Search Project Employee costs..." /> */}
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">

              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-3 py-3 bg-gray-50 dark:bg-gray-800">
                        Project Name
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Employee name
                      </th>
                      <th scope="col" className="px-3 py-3 bg-gray-50 dark:bg-gray-800">
                        Cost Per Hour
                      </th>
                      <th scope="col" className="px-3 py-3 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {costs.map((cost) => (
                      <tr key={cost.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                          {cost.project_name}
                        </th>
                        <td className="px-3 py-4">
                        {cost.employee_name}
                        </td>
                        <td className="px-3 py-4 bg-gray-50 dark:bg-gray-800">
                        {cost.cost_currency} {cost.cost_per_hour}
                        </td>
                        <td className="px-3 text-right">
                          <div className="flex justify-center gap-3">
                            <UpdateCost id={cost.id} />
                            <DeleteCost id={cost.id} />
                          </div>
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
