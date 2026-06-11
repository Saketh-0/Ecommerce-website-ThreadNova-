import { Metadata } from 'next';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import ProfileForm from './profile-form';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h1 className="h2-bold mb-6">Profile</h1>
      <ProfileForm user={user} />
    </div>
  );
}
