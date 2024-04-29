import Image from 'next/image';
import { UpdateWork, DeleteWork } from '@/app/ui/works/buttons';
import { fetchFilteredWorks } from '@/app/lib/works/data';
import { formatDateToLocal } from '@/app/lib/utils';

export default async function WorksTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const works = await fetchFilteredWorks(query, currentPage);

  return (
    <div className="w-full">
      {/* <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Work Segments
      </h1>
      <Search placeholder="Search Project Employee works..." /> */}
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">

              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-3 py-3 bg-gray-50 dark:bg-gray-800">
                        Project name
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Employee name
                      </th>
                      <th scope="col" className="px-3 py-3 bg-gray-50 dark:bg-gray-800">
                        Start date
                      </th>
                      <th scope="col" className="px-3 py-3">
                        End date
                      </th>
                      <th scope="col" className="px-3 py-3 bg-gray-50 dark:bg-gray-800">
                        Hours per day
                      </th>
                      <th scope="col" className="px-3 py-3 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {works.map((work) => (
                      <tr key={work.id} className="border-b border-gray-200 dark:border-gray-700">
                        <th scope="row" className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                          {work.project_name}
                        </th>
                        <td className="px-3 py-4">
                          {work.employee_name}
                        </td>
                        <td className="px-3 py-4 bg-gray-50 dark:bg-gray-800">
                          {work.start_date.toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-3 py-4">
                          {work.end_date.toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-3 py-4 bg-gray-50 dark:bg-gray-800">
                          {work.hours_per_day}
                        </td>
                        <td className="px-3">
                          <div className="flex justify-center gap-3">
                            <UpdateWork id={work.id} />
                            <DeleteWork id={work.id} />
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
