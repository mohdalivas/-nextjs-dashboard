import EditCostForm from '@/app/ui/costs/edit-form';
import Breadcrumbs from '@/app/ui/costs/breadcrumbs';
import { fetchCostById, fetchProjects, fetchEmployees } from '@/app/lib/costs/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [cost, projects, employees] = await Promise.all([
        fetchCostById(id),
        fetchProjects(),
        fetchEmployees(),
    ]);

    if (!cost) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Cost segments', href: '/dashboard/cost-segments' },
                    {
                        label: 'Edit Cost segment',
                        href: `/dashboard/cost-segments/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditCostForm cost={cost} projects={projects} employees={employees} />
        </main>
    );
}