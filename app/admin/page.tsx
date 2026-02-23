import { SubmissionStatus } from '@prisma/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Props = {
  searchParams: {
    q?: string;
    status?: SubmissionStatus | 'ALL';
  };
};

const statusOptions: Array<SubmissionStatus | 'ALL'> = [
  'ALL',
  'NEW',
  'IN_REVIEW',
  'APPROVED',
  'REJECTED',
  'QUEUED',
  'DONE'
];

export default async function AdminDashboard({ searchParams }: Props) {
  if (!isAdminAuthenticated()) {
    redirect('/admin/login');
  }

  const q = searchParams.q?.trim() ?? '';
  const status = searchParams.status ?? 'ALL';

  const submissions = await prisma.submission.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { projectName: { contains: q } },
              { clientEmail: { contains: q } }
            ]
          }
        : {}),
      ...(status !== 'ALL' ? { status } : {})
    },
    orderBy: { createdAt: 'desc' },
    take: 200
  });

  const exportParams = new URLSearchParams();
  if (q) exportParams.set('q', q);
  if (status !== 'ALL') exportParams.set('status', status);

  return (
    <main className="min-h-screen bg-brandBlack px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <a
              href={`/api/admin/export?${exportParams.toString()}`}
              className="rounded-md border border-brandRed px-4 py-2 text-sm font-medium"
            >
              Export CSV
            </a>
            <form method="post" action="/api/admin/logout">
              <button className="rounded-md bg-brandRed px-4 py-2 text-sm font-semibold">Sign Out</button>
            </form>
          </div>
        </div>

        <form className="grid gap-3 rounded-lg border border-white/10 bg-black/40 p-4 md:grid-cols-[1fr_200px_auto]">
          <input name="q" placeholder="Search by project name or client email" defaultValue={q} />
          <select name="status" defaultValue={status}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button className="rounded-md bg-brandRed px-4 py-2 text-sm font-semibold">Apply</button>
        </form>

        <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/30">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-white/70">
              <tr>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3">{submission.createdAt.toISOString().slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <Link className="text-brandRed hover:underline" href={`/admin/submissions/${submission.id}`}>
                      {submission.projectName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{submission.clientEmail}</td>
                  <td className="px-4 py-3">{submission.status}</td>
                </tr>
              ))}
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-white/60">
                    No submissions found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
