import CreateWorkForm from '@/app/ui/works/create-form';
import Breadcrumbs from '@/app/ui/costs/breadcrumbs';
import { fetchProjects, fetchEmployees } from '@/app/lib/costs/data';
 
export default async function Page() {
  const projects = await fetchProjects();
  const employees = await fetchEmployees();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Work Segments', href: '/dashboard/work-segments' },
          {
            label: 'Create Work Segment',
            href: '/dashboard/cost-segments/create',
            active: true,
          },
        ]}
      />
      <CreateWorkForm projects={projects} employees={employees}/>
    </main>
  );
}