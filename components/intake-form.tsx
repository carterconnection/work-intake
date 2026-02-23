'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitIntake } from '@/app/actions';
import { useMemo } from 'react';

type FormState = { ok: boolean; message: string };

const initialState: FormState = { ok: false, message: '' };
const pageOptions = [
  'Landing Page',
  'Checkout Page',
  'Upsell Page',
  'Downsell Page',
  'Thank You Page',
  'Webinar Registration Page',
  'Other'
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-md bg-brandRed px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
    >
      {pending ? 'Submitting...' : 'Submit Request'}
    </button>
  );
}

export function IntakeForm() {
  const [state, formAction] = useFormState(submitIntake as never, initialState);
  const success = useMemo(() => state.ok && state.message, [state]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-brandRed">SECTION 1 – Project Overview</h2>
        <label className="block space-y-1">
          <span>Client Email</span>
          <input type="email" name="clientEmail" required />
        </label>
        <label className="block space-y-1">
          <span>Project Name</span>
          <input type="text" name="projectName" required />
        </label>
        <label className="block space-y-1">
          <span>Objective</span>
          <textarea name="objective" required maxLength={5000} rows={5} />
        </label>
        <label className="block space-y-1">
          <span>Desired Launch Date</span>
          <input type="date" name="desiredLaunchDate" required />
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-brandRed">SECTION 2 – Strategic Confirmation</h2>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="strategicFinalizationConfirmed" required className="mt-1 h-4 w-4" />
          <span>
            I confirm all strategic decisions and offer details are finalized and will not change during this
            build cycle.
          </span>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-brandRed">SECTION 3 – Offer Details</h2>
        <label className="block space-y-1"><span>Final Offer Name</span><input type="text" name="finalOfferName" required /></label>
        <label className="block space-y-1"><span>Final Price</span><input type="text" name="finalPrice" required /></label>
        <label className="block space-y-1"><span>Payment Structure</span><input type="text" name="paymentStructure" required /></label>
        <label className="block space-y-1"><span>Deliverables Included</span><textarea name="deliverablesIncluded" required rows={4} /></label>
        <label className="block space-y-1"><span>Bonuses Included</span><textarea name="bonusesIncluded" rows={3} /></label>
        <label className="block space-y-1"><span>Refund Policy</span><textarea name="refundPolicy" required rows={3} /></label>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-brandRed">SECTION 4 – Funnel Requirements</h2>
        <fieldset className="space-y-2">
          <legend className="mb-1">Pages Required</legend>
          {pageOptions.map((page) => (
            <label key={page} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="pagesRequired" value={page} className="h-4 w-4" />
              <span>{page}</span>
            </label>
          ))}
        </fieldset>
        <label className="block space-y-1"><span>Other Page Description</span><textarea name="otherPageDescription" rows={3} /></label>
        <label className="block space-y-1"><span>Final Page Copy</span><textarea name="finalPageCopy" required rows={4} /></label>
        <fieldset className="space-y-2">
          <legend>Images / Logos Provided?</legend>
          <label className="mr-4 inline-flex items-center gap-2"><input type="radio" name="imagesProvided" value="yes" required className="h-4 w-4" />Yes</label>
          <label className="inline-flex items-center gap-2"><input type="radio" name="imagesProvided" value="no" required className="h-4 w-4" />No</label>
        </fieldset>
        <label className="block space-y-1"><span>Brand Assets Link</span><input type="url" name="brandAssetsLink" /></label>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-brandRed">SECTION 5 – Email & SMS Sequences</h2>
        <fieldset className="space-y-2">
          <legend>Sequence Type</legend>
          {['Email Only', 'SMS Only', 'Email + SMS'].map((value) => (
            <label key={value} className="mr-4 inline-flex items-center gap-2">
              <input type="radio" name="sequenceType" value={value} required className="h-4 w-4" />
              {value}
            </label>
          ))}
        </fieldset>
        <label className="block space-y-1"><span>Number of Messages</span><input type="number" name="numberOfMessages" min={1} required /></label>
        <label className="block space-y-1"><span>Copy for All Messages</span><textarea name="messageCopy" required rows={4} /></label>
        <label className="block space-y-1"><span>Send Dates / Timing</span><textarea name="sendDatesTiming" required rows={3} /></label>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-brandRed">SECTION 6 – Integrations & Rules</h2>
        <label className="block space-y-1"><span>Payment Processor</span><input type="text" name="paymentProcessor" required /></label>
        <label className="block space-y-1"><span>Tagging Rules</span><textarea name="taggingRules" required rows={3} /></label>
        <label className="block space-y-1"><span>Automation Triggers</span><textarea name="automationTriggers" required rows={3} /></label>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brandRed">SECTION 7 – Build Size</h2>
        <fieldset className="space-y-2">
          <legend>Build Size</legend>
          <label className="mr-4 inline-flex items-center gap-2"><input type="radio" name="buildSize" value="MAJOR" required className="h-4 w-4" />Major Build</label>
          <label className="inline-flex items-center gap-2"><input type="radio" name="buildSize" value="MINOR" required className="h-4 w-4" />Minor Adjustment</label>
        </fieldset>
        <p className="text-sm text-white/70">
          Monthly build capacity is limited. Requests beyond current capacity will be scheduled for the next
          month.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-brandRed">SECTION 8 – Change Policy Confirmation</h2>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="changePolicyConfirmed" required className="mt-1 h-4 w-4" />
          <span>
            I understand that structural changes after build begins may reset delivery timeline and require
            additional credits.
          </span>
        </label>
      </section>

      <SubmitButton />

      {state.message ? (
        <p className={`rounded-md border p-3 text-sm ${success ? 'border-green-500/50 text-green-300' : 'border-brandRed/50 text-red-300'}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
