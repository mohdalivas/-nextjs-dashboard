import CreateCostForm from '@/app/ui/costs/create-form';
import Breadcrumbs from '@/app/ui/costs/breadcrumbs';
import { fetchProjects, fetchEmployees } from '@/app/lib/costs/data';
 
export default async function Page() {
  const projects = await fetchProjects();
  const employees = await fetchEmployees();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Cost Segments', href: '/dashboard/cost-segments' },
          {
            label: 'Create Cost Segment',
            href: '/dashboard/cost-segments/create',
            active: true,
          },
        ]}
      />
      <CreateCostForm projects={projects} employees={employees}/>
    </main>
  );
}