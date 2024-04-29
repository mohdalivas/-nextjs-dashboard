'use client';

import { CostForm, ProjectField, EmployeeField } from '@/app/lib/costs/definitions';
import {
  CurrencyEuroIcon,
  CurrencyRupeeIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateCost } from '@/app/lib/costs/actions';
import { useFormState } from 'react-dom';

export default function EditCostForm({
  cost,
  projects,
  employees,
}: {
  cost: CostForm;
  projects: ProjectField[];
  employees: EmployeeField[];
}) {
  const initialState = { message: null, errors: {} };
  const updateCostWithId = updateCost.bind(null, cost.id);
  const [state, dispatch] = useFormState(updateCostWithId, initialState);

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
              defaultValue={cost.project_id}
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
              defaultValue={cost.employee_id}
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

        {/* Cost per hour */}
        <div className="mb-4">
          <label htmlFor="cost-per-hour" className="mb-2 block text-sm font-medium">
            Enter cost per hour
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="cost-per-hour"
                name="costPerHour"
                type="number"
                step="0.01"
                defaultValue={cost.cost_per_hour}
                placeholder="Enter USD cost per hour"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="cost-per-hour-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="cost-per-hour-error" aria-live="polite" aria-atomic="true">
            {state.errors?.costPerHour &&
              state.errors.costPerHour.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the cost currency
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="inr"
                  name="costCurrency"
                  type="radio"
                  value="INR"
                  defaultChecked={cost.cost_currency === 'INR'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="cost-currency-error"
                />
                <label
                  htmlFor="inr"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  INR <CurrencyRupeeIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="eur"
                  name="costCurrency"
                  type="radio"
                  value="EUR"
                  defaultChecked={cost.cost_currency === 'EUR'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="cost-currency-error"
                />
                <label
                  htmlFor="eur"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                >
                  EUR <CurrencyEuroIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="usd"
                  name="costCurrency"
                  type="radio"
                  value="USD"
                  defaultChecked={cost.cost_currency === 'USD'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="cost-currency-error"
                />
                <label
                  htmlFor="usd"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                >
                  USD <CurrencyDollarIcon className="h-4 w-4" />
                </label>
              </div>

            </div>
          </div>
          <div id="cost-currency-error" aria-live="polite" aria-atomic="true">
            {state.errors?.costCurrency &&
              state.errors.costCurrency.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

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
