import EditWorkForm from '@/app/ui/works/edit-form';
import Breadcrumbs from '@/app/ui/works/breadcrumbs';
import { fetchProjects, fetchEmployees } from '@/app/lib/costs/data';
import { fetchWorkById } from '@/app/lib/works/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [work, projects, employees] = await Promise.all([
        fetchWorkById(id),
        fetchProjects(),
        fetchEmployees(),
    ]);

    if (!work) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Work segments', href: '/dashboard/cost-segments' },
                    {
                        label: 'Edit Work segment',
                        href: `/dashboard/work-segments/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditWorkForm work={work} projects={projects} employees={employees} />
        </main>
    );
}