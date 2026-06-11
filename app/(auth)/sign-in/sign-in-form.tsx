'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { signInDefaultValues } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const SignInForm = () => {
  const router = useRouter();
  const [state, action, isPending] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.success) {
      router.push('/');
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={signInDefaultValues.email}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          defaultValue={signInDefaultValues.password}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
          placeholder="••••••••"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-orange-500/20"
        disabled={isPending}
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </Button>
      {state.message && !state.success && (
        <p className="text-center text-sm text-red-400 bg-red-400/10 rounded-lg py-2">
          {state.message}
        </p>
      )}
    </form>
  );
};

export default SignInForm;
