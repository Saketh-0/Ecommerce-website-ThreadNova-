'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/actions/user.actions';
import { signUpDefaultValues } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const SignUpForm = () => {
  const router = useRouter();
  const [state, action, isPending] = useActionState(signUp, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.success) {
      router.push('/sign-in');
    }
  }, [state.success, router]);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          defaultValue={signUpDefaultValues.name}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
          placeholder="Your name"
        />
      </div>
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
          defaultValue={signUpDefaultValues.email}
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
          autoComplete="new-password"
          defaultValue={signUpDefaultValues.password}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
          placeholder="••••••••"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          defaultValue={signUpDefaultValues.confirmPassword}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
          placeholder="••••••••"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-orange-500/20"
        disabled={isPending}
      >
        {isPending ? 'Creating Account...' : 'Create Account'}
      </Button>
      {state.message && (
        <p className={`text-center text-sm rounded-lg py-2 ${state.success ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
};

export default SignUpForm;
