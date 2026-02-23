import { BuildSize } from '@prisma/client';
import { z } from 'zod';

const MAX_TEXT_LENGTH = 5000;
const allowedPages = [
  'Landing Page',
  'Checkout Page',
  'Upsell Page',
  'Downsell Page',
  'Thank You Page',
  'Webinar Registration Page',
  'Other'
] as const;

export const submissionSchema = z.object({
  clientEmail: z.string().email(),
  projectName: z.string().min(1),
  objective: z.string().min(1).max(MAX_TEXT_LENGTH),
  desiredLaunchDate: z.coerce.date(),
  strategicFinalizationConfirmed: z.literal(true),
  finalOfferName: z.string().min(1),
  finalPrice: z.string().min(1),
  paymentStructure: z.string().min(1),
  deliverablesIncluded: z.string().min(1),
  bonusesIncluded: z.string().optional(),
  refundPolicy: z.string().min(1),
  pagesRequired: z.array(z.enum(allowedPages)).min(1),
  otherPageDescription: z.string().optional(),
  finalPageCopy: z.string().min(1),
  imagesProvided: z.boolean(),
  brandAssetsLink: z.string().url().optional().or(z.literal('')),
  sequenceType: z.enum(['Email Only', 'SMS Only', 'Email + SMS']),
  numberOfMessages: z.number().int().min(1),
  messageCopy: z.string().min(1),
  sendDatesTiming: z.string().min(1),
  paymentProcessor: z.string().min(1),
  taggingRules: z.string().min(1),
  automationTriggers: z.string().min(1),
  buildSize: z.nativeEnum(BuildSize),
  changePolicyConfirmed: z.literal(true),
  website: z.string().optional()
});

export function parsePagesRequired(values: FormDataEntryValue[]) {
  return values.filter((value): value is string => typeof value === 'string');
}
