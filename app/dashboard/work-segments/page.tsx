import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { CreateWork } from '@/app/ui/works/buttons';
import { Suspense } from "react";
import WorksTable from '@/app/ui/works/work-table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchWorksPages } from '@/app/lib/works/data';
import Pagination from '@/app/ui/reports/pagination';

export default async function Page({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchWorksPages(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Work Segments</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search Works Segment..." />
                <CreateWork />
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <WorksTable query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-2 flex w-full justify-end px-4">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}