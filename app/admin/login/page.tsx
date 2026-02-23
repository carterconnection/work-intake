import { isAdminAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function AdminLoginPage() {
  if (isAdminAuthenticated()) {
    redirect('/admin');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brandBlack px-4">
      <form
        method="post"
        action="/api/admin/login"
        className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-black/50 p-6"
      >
        <h1 className="text-2xl font-semibold text-brandWhite">Admin Login</h1>
        <label className="block space-y-1">
          <span>Password</span>
          <input type="password" name="password" required />
        </label>
        <button type="submit" className="w-full rounded-md bg-brandRed py-2 font-semibold">
          Sign In
        </button>
      </form>
    </main>
  );
}
