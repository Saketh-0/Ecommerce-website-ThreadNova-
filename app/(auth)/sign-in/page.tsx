import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import SignInForm from './sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt={`${APP_NAME} logo`}
            width={56}
            height={56}
            priority
          />
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your {APP_NAME} account</p>
        </div>
      </div>
      <SignInForm />
      <div className="mt-6 text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
          Create one
        </Link>
      </div>
    </div>
  );
}
