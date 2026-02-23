import { SubmissionStatus } from '@prisma/client';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { updateSubmission } from '@/app/actions';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const statuses: SubmissionStatus[] = ['NEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'QUEUED', 'DONE'];

export default async function SubmissionDetailPage({ params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    redirect('/admin/login');
  }

  const submission = await prisma.submission.findUnique({ where: { id: params.id } });
  if (!submission) notFound();

  return (
    <main className="min-h-screen bg-brandBlack px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/admin" className="text-sm text-brandRed hover:underline">
          ← Back to submissions
        </Link>

        <div className="rounded-lg border border-white/10 bg-black/40 p-6">
          <h1 className="text-2xl font-bold">{submission.projectName}</h1>
          <p className="text-sm text-white/70">{submission.clientEmail}</p>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <Info label="Objective" value={submission.objective} />
            <Info label="Desired Launch" value={submission.desiredLaunchDate.toISOString().slice(0, 10)} />
            <Info label="Offer" value={submission.finalOfferName} />
            <Info label="Price" value={submission.finalPrice} />
            <Info label="Payment Structure" value={submission.paymentStructure} />
            <Info label="Deliverables" value={submission.deliverablesIncluded} />
            <Info label="Bonuses" value={submission.bonusesIncluded || '-'} />
            <Info label="Refund Policy" value={submission.refundPolicy} />
            <Info label="Pages Required" value={submission.pagesRequired} />
            <Info label="Other Page" value={submission.otherPageDescription || '-'} />
            <Info label="Final Page Copy" value={submission.finalPageCopy} />
            <Info label="Images Provided" value={submission.imagesProvided ? 'Yes' : 'No'} />
            <Info label="Brand Assets Link" value={submission.brandAssetsLink || '-'} />
            <Info label="Sequence Type" value={submission.sequenceType} />
            <Info label="Number of Messages" value={String(submission.numberOfMessages)} />
            <Info label="Message Copy" value={submission.messageCopy} />
            <Info label="Send Timing" value={submission.sendDatesTiming} />
            <Info label="Payment Processor" value={submission.paymentProcessor} />
            <Info label="Tagging Rules" value={submission.taggingRules} />
            <Info label="Automation Triggers" value={submission.automationTriggers} />
            <Info label="Build Size" value={submission.buildSize} />
            <Info label="User Agent" value={submission.userAgent || '-'} />
            <Info label="IP Address" value={submission.ipAddress || '-'} />
          </dl>
        </div>

        <form action={updateSubmission} className="space-y-4 rounded-lg border border-white/10 bg-black/40 p-6">
          <input type="hidden" name="id" value={submission.id} />
          <label className="block space-y-1">
            <span>Status</span>
            <select name="status" defaultValue={submission.status}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span>Internal Notes</span>
            <textarea name="notesInternal" rows={6} defaultValue={submission.notesInternal ?? ''} />
          </label>
          <button className="rounded-md bg-brandRed px-4 py-2 text-sm font-semibold">Save Updates</button>
        </form>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-white/60">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm">{value}</dd>
    </div>
  );
}
