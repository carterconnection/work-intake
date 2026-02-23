import { IntakeForm } from '@/components/intake-form';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brandBlack px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6 rounded-xl border border-white/10 bg-black/40 p-6 shadow-2xl shadow-black/50 md:p-8">
        <h1 className="text-2xl font-bold text-brandWhite md:text-3xl">
          Implementation Build Request – Carter Connection
        </h1>
        <p className="text-sm text-white/70">
          Submit complete and final project details so implementation can begin with a clear scope and timeline.
        </p>
        <IntakeForm />
      </div>
    </main>
  );
}
