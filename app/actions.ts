'use server';

import { BuildSize, SubmissionStatus } from '@prisma/client';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { submissionSchema, parsePagesRequired } from '@/lib/form-schema';
import { prisma } from '@/lib/prisma';
import { isRateLimited } from '@/lib/rate-limit';

const EMAIL_COOLDOWN_MS = 1000 * 60 * 10;
const MAX_PAYLOAD_SIZE = 100_000;

function getIpAddress() {
  const headerStore = headers();
  const forwarded = headerStore.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return headerStore.get('x-real-ip') ?? 'unknown';
}

export async function submitIntake(_: unknown, formData: FormData) {
  const totalPayloadLength = Array.from(formData.entries()).reduce((acc, [_, value]) => {
    if (typeof value === 'string') return acc + value.length;
    return acc;
  }, 0);

  if (totalPayloadLength > MAX_PAYLOAD_SIZE) {
    return { ok: false, message: 'Payload is too large.' };
  }

  const website = formData.get('website');
  if (typeof website === 'string' && website.trim().length > 0) {
    return { ok: false, message: 'Submission rejected.' };
  }

  const ipAddress = getIpAddress();
  if (isRateLimited(`submit:${ipAddress}`)) {
    return { ok: false, message: 'Too many submissions. Please wait before trying again.' };
  }

  const parsed = submissionSchema.safeParse({
    website: formData.get('website')?.toString(),
    clientEmail: formData.get('clientEmail')?.toString(),
    projectName: formData.get('projectName')?.toString(),
    objective: formData.get('objective')?.toString(),
    desiredLaunchDate: formData.get('desiredLaunchDate')?.toString(),
    strategicFinalizationConfirmed: formData.get('strategicFinalizationConfirmed') === 'on',
    finalOfferName: formData.get('finalOfferName')?.toString(),
    finalPrice: formData.get('finalPrice')?.toString(),
    paymentStructure: formData.get('paymentStructure')?.toString(),
    deliverablesIncluded: formData.get('deliverablesIncluded')?.toString(),
    bonusesIncluded: formData.get('bonusesIncluded')?.toString() || undefined,
    refundPolicy: formData.get('refundPolicy')?.toString(),
    pagesRequired: parsePagesRequired(formData.getAll('pagesRequired')),
    otherPageDescription: formData.get('otherPageDescription')?.toString() || undefined,
    finalPageCopy: formData.get('finalPageCopy')?.toString(),
    imagesProvided: formData.get('imagesProvided') === 'yes',
    brandAssetsLink: formData.get('brandAssetsLink')?.toString() || undefined,
    sequenceType: formData.get('sequenceType')?.toString(),
    numberOfMessages: Number(formData.get('numberOfMessages')),
    messageCopy: formData.get('messageCopy')?.toString(),
    sendDatesTiming: formData.get('sendDatesTiming')?.toString(),
    paymentProcessor: formData.get('paymentProcessor')?.toString(),
    taggingRules: formData.get('taggingRules')?.toString(),
    automationTriggers: formData.get('automationTriggers')?.toString(),
    buildSize: formData.get('buildSize') === 'MAJOR' ? BuildSize.MAJOR : BuildSize.MINOR,
    changePolicyConfirmed: formData.get('changePolicyConfirmed') === 'on'
  });

  if (!parsed.success) {
    return { ok: false, message: 'Please complete all required fields correctly.' };
  }

  const existing = await prisma.submission.findFirst({
    where: { clientEmail: parsed.data.clientEmail },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  if (existing && Date.now() - existing.createdAt.getTime() < EMAIL_COOLDOWN_MS) {
    return { ok: false, message: 'Please wait before submitting another request with this email.' };
  }

  const headerStore = headers();
  const userAgent = headerStore.get('user-agent') ?? undefined;

  await prisma.submission.create({
    data: {
      clientEmail: parsed.data.clientEmail,
      projectName: parsed.data.projectName,
      objective: parsed.data.objective,
      desiredLaunchDate: parsed.data.desiredLaunchDate,
      strategicFinalizationConfirmed: parsed.data.strategicFinalizationConfirmed,
      finalOfferName: parsed.data.finalOfferName,
      finalPrice: parsed.data.finalPrice,
      paymentStructure: parsed.data.paymentStructure,
      deliverablesIncluded: parsed.data.deliverablesIncluded,
      bonusesIncluded: parsed.data.bonusesIncluded,
      refundPolicy: parsed.data.refundPolicy,
      pagesRequired: JSON.stringify(parsed.data.pagesRequired),
      otherPageDescription: parsed.data.otherPageDescription,
      finalPageCopy: parsed.data.finalPageCopy,
      imagesProvided: parsed.data.imagesProvided,
      brandAssetsLink: parsed.data.brandAssetsLink || null,
      sequenceType: parsed.data.sequenceType,
      numberOfMessages: parsed.data.numberOfMessages,
      messageCopy: parsed.data.messageCopy,
      sendDatesTiming: parsed.data.sendDatesTiming,
      paymentProcessor: parsed.data.paymentProcessor,
      taggingRules: parsed.data.taggingRules,
      automationTriggers: parsed.data.automationTriggers,
      buildSize: parsed.data.buildSize,
      changePolicyConfirmed: parsed.data.changePolicyConfirmed,
      userAgent,
      ipAddress
    }
  });

  return {
    ok: true,
    message:
      'Your request has been received. You will receive scope confirmation and timeline within 2 business days.'
  };
}

export async function updateSubmission(formData: FormData) {
  if (!isAdminAuthenticated()) {
    redirect('/admin/login');
  }

  const id = formData.get('id')?.toString();
  const status = formData.get('status')?.toString() as SubmissionStatus;
  const notesInternal = formData.get('notesInternal')?.toString();

  if (!id) return;

  await prisma.submission.update({
    where: { id },
    data: {
      status,
      notesInternal: notesInternal || null
    }
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/submissions/${id}`);
}
