"use client";

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCost } from '@/app/lib/costs/actions';
import { FormEvent } from 'react';

export function CreateCost() {
  return (
    <Link
      href="/dashboard/cost-segments/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Cost Segment</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCost({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/cost-segments/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export async function DeleteCost({ id }: { id: string }) {
  const deleteCostWithId = deleteCost.bind(null, id);

  const onSubmit = () => {
    if (confirm("Are you sure?")) {
      deleteCostWithId();
    }
  }

  return (
    <form action={onSubmit}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

