import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/costs/data';

const iconMap = {
  projects: BriefcaseIcon,
  employees: UserGroupIcon,
  days: CalendarDaysIcon,
  hours: ClockIcon,
  costs: CurrencyDollarIcon,
};

export default async function CardWrapper() {
  const { 
    numberOfProjects,
    numberOfEmployees,
    totalNumberOfDays,
    totalCostPerHours,
    totalHoursPerDays,
    totalCosts
  } = await fetchCardData();

  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}
      {/* <pre>{JSON.stringify(data,null,1)}</pre> */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Number Of Projects" value={numberOfProjects} type="projects" />
        <Card title="Number Of Employees" value={numberOfEmployees} type="employees" />
        <Card title="Total Number Of Days" value={totalNumberOfDays} type="days" />
        <Card title="Total Hours Per Days" value={totalHoursPerDays} type="hours" />
      </div>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        <Card title="Total Cost Per Hours" value={totalCostPerHours.sum} type="costs" />
        <Card title="Total Overall Costs" value={totalCosts.sum} type="costs" />
      </div>
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'projects' | 'employees' | 'days' | 'hours' | 'costs';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
