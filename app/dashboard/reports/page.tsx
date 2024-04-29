import Pagination from '@/app/ui/reports/pagination';
import Search from '@/app/ui/search';
import ReportDates from '@/app/ui/report-date';
import ReportsTable from '@/app/ui/reports/report-table';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchReportsPages, fetchReportsCosts } from '@/app/lib/reports/data';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
    title: 'Reports',
};

export default async function Page({ searchParams }: { searchParams?: { query?: string; page?: string, from?:string, to?:string } }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const fromDate = searchParams?.from || '';
    const toDate = searchParams?.to || '';

    const totalPages = await fetchReportsPages(query, fromDate, toDate);
    const totalCosts = await fetchReportsCosts(query, fromDate, toDate);

    return (
        <div className="w-full">

            <div className="grid grid-flow-row-dense grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
                <div className='py-2'>
                    <h1 className={`${lusitana.className} text-2xl`}>Reports</h1>
                </div>
                <div className='py-2'>
                    <h1>Total Costs: {totalCosts}</h1>
                </div>
            </div>

            <div className="mt-2 flex flex-col items-left justify-between gap-2 md:mt-8">
                <ReportDates />
            </div>

            <div className="flex items-center justify-between gap-2 md:mt-4">
                <Search placeholder="Search Reports Segment ..." />
            </div>

            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <ReportsTable query={query} currentPage={currentPage} fromDate={fromDate} toDate={toDate} />
            </Suspense>
            <div className="mt-2 flex w-full justify-end px-4">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}