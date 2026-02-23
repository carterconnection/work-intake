import { SubmissionStatus } from '@prisma/client';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function toCsvValue(value: string | number | null) {
  const raw = value === null ? '' : String(value);
  return `"${raw.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const status = searchParams.get('status') as SubmissionStatus | null;

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
      ...(status && status !== 'ALL' ? { status } : {})
    },
    orderBy: { createdAt: 'desc' }
  });

  const columns = [
    'id','createdAt','clientName','clientEmail','projectName','objective','desiredLaunchDate','strategicFinalizationConfirmed',
    'finalOfferName','finalPrice','paymentStructure','deliverablesIncluded','bonusesIncluded','refundPolicy','pagesRequired',
    'otherPageDescription','finalPageCopy','imagesProvided','brandAssetsLink','sequenceType','numberOfMessages','messageCopy',
    'sendDatesTiming','paymentProcessor','taggingRules','automationTriggers','buildSize','changePolicyConfirmed','userAgent',
    'ipAddress','status','notesInternal'
  ] as const;

  const rows = submissions.map((item) =>
    columns.map((column) => {
      const value = item[column];
      if (value instanceof Date) return toCsvValue(value.toISOString());
      if (typeof value === 'boolean') return toCsvValue(value ? 'true' : 'false');
      return toCsvValue(value as string | number | null);
    }).join(',')
  );

  const csv = [columns.join(','), ...rows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="submissions.csv"'
    }
  });
}
