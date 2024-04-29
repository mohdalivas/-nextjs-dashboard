import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { CreateCost } from '@/app/ui/costs/buttons';
import { Suspense } from "react";
import CostsTable from '@/app/ui/costs/cost-table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchCostsPages } from '@/app/lib/costs/data';
import Pagination from '@/app/ui/reports/pagination';

export default async function Page({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchCostsPages(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Cost Segments</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search Costs Segment ..." />
                <CreateCost />
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <CostsTable query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-2 flex w-full justify-end px-4">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}