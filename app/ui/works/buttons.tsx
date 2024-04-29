"use client";

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteWork } from '@/app/lib/works/actions';
import { FormEvent } from 'react';

export function CreateWork() {
  return (
    <Link
      href="/dashboard/work-segments/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Work Segment</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateWork({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/work-segments/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export async function DeleteWork({ id }: { id: string }) {
  const deleteWorkWithId = deleteWork.bind(null, id);

  const onSubmit = () => {
    if (confirm("Are you sure?")) {
      deleteWorkWithId();
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

