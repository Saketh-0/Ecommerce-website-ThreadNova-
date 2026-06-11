'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

const ProfileForm = ({ user }: { user: { name: string; email: string; role: string } }) => {
  const [state, action, isPending] = useActionState(updateProfile, {
    success: false,
    message: '',
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">Role: {user.role}</p>
          </div>
        </div>
        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              <User className="inline h-4 w-4 mr-1" /> Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            disabled={isPending}
          >
            {isPending ? 'Updating...' : 'Update Profile'}
          </Button>
          {state.message && (
            <p className={`text-sm rounded-lg py-2 px-3 ${state.success ? 'text-green-600 bg-green-50 dark:bg-green-950/20' : 'text-red-500 bg-red-50 dark:bg-red-950/20'}`}>
              {state.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
