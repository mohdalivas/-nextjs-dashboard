'use client';

import { ProjectField, EmployeeField } from '@/app/lib/costs/definitions';
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateWork } from '@/app/lib/works/actions';
import { useFormState } from 'react-dom';
import { WorkForm } from '@/app/lib/works/definations';

export default function EditCostForm({
  work,
  projects,
  employees,
}: {
  work: WorkForm;
  projects: ProjectField[];
  employees: EmployeeField[];
}) {
  const initialState = { message: null, errors: {} };
  const updateWorkWithId = updateWork.bind(null, work.id);
  const [state, dispatch] = useFormState(updateWorkWithId, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Project Name */}
        <div className="mb-4">
          <label htmlFor="project" className="mb-2 block text-sm font-medium">
            Choose project
          </label>
          <div className="relative">
            <select
              id="project"
              name="projectId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={work.project_id}
              aria-describedby="project-error"
            >
              <option value="" disabled>
                Select a project
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="project-error" aria-live="polite" aria-atomic="true">
            {state.errors?.projectId &&
              state.errors.projectId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Employee Name */}
        <div className="mb-4">
          <label htmlFor="employee" className="mb-2 block text-sm font-medium">
            Choose employee
          </label>
          <div className="relative">
            <select
              id="employee"
              name="employeeId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={work.employee_id}
              aria-describedby="employee-error"
            >
              <option value="" disabled>
                Select a employee
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="employee-error" aria-live="polite" aria-atomic="true">
            {state.errors?.employeeId &&
              state.errors.employeeId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Start date */}
        <div className="mb-4">
          <label htmlFor="start-date" className="mb-2 block text-sm font-medium">
            Choose a start date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="start-date"
                name="startDate"
                type="date"
                defaultValue={work.start_date.toISOString().split('T')[0]}
                placeholder="Enter start date"
                pattern="dd-mm-yyyy"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="start-date-error"
              />
              <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="start-date-error" aria-live="polite" aria-atomic="true">
            {state.errors?.startDate &&
              state.errors.startDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* End date */}
        <div className="mb-4">
          <label htmlFor="end-date" className="mb-2 block text-sm font-medium">
            Choose a end date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="end-date"
                name="endDate"
                type="date"
                defaultValue={work.end_date.toISOString().split('T')[0]}
                placeholder="Enter start date"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="end-date-error"
              />
              <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="end-date-error" aria-live="polite" aria-atomic="true">
            {state.errors?.endDate &&
              state.errors.endDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Hours per day */}
        <div className="mb-4">
          <label htmlFor="cost-per-hour" className="mb-2 block text-sm font-medium">
            Choose an hours per day
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="hours-per-day"
                name="hoursPerDay"
                type="time"
                step="1"
                defaultValue={work.hours_per_day}
                placeholder="Enter hours per day"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="cost-per-hour-error"
              />
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="hours-per-day-error" aria-live="polite" aria-atomic="true">
            {state.errors?.hoursPerDay &&
              state.errors.hoursPerDay.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message && <p className="mt-2 text-sm text-red-500">
            {state.message}
          </p>}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/cost-segments"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Invoice</Button>
      </div>
    </form>
  );
}
