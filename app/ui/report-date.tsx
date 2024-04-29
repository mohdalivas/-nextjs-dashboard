'use client';

import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function ReportDates() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleStartDate = useDebouncedCallback((date: string) => {
        // console.log(`Searching... ${date}`);
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        params.delete('query');

        if (date) {
            params.set('from', date);
        } else {
            params.delete('from');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 600);

    const handleEndDate = useDebouncedCallback((date: string) => {
        // console.log(`Searching... ${date}`);
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        params.delete('query');

        if (date) {
            params.set('to', date);
        } else {
            params.delete('to');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 600);

    return (
        <div className="grid grid-flow-row-dense grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">

            {/* Start date */}
            <div className="mb-4 w-full">
                <label htmlFor="start-date" className="mb-2 block text-sm font-medium">
                    Choose Report start date
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <input
                            id="start-date"
                            name="startDate"
                            type="date"
                            placeholder="Enter Start Date"
                            pattern='mm-dd-yyyy'
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="start-date-error"
                            onChange={(e) => handleStartDate(e.target.value)}
                            defaultValue={searchParams.get('from')?.toString()}
                        />
                        <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>
            </div>

            {/* End date */}
            <div className="mb-4 w-full">
                <label htmlFor="end-date" className="mb-2 block text-sm font-medium">
                    Choose Report end date
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <input
                            id="end-date"
                            name="endDate"
                            type="date"
                            placeholder="Enter End Date"
                            pattern='mm-dd-yyyy'
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="end-date-error"
                            onChange={(e) => handleEndDate(e.target.value)}
                            defaultValue={searchParams.get('to')?.toString()}
                        />
                        <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>
            </div>

        </div>
    );
}
