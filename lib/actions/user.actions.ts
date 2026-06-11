'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils';
import { signInFormSchema, signUpFormSchema, updateProfileSchema } from '../validators';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'threadnova-secret-key-change-in-production';

// Create JWT token
function createToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Get current user from cookie
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, address: true },
    });
    return user ? convertToPlainObject(user) : null;
  } catch {
    return null;
  }
}

// Sign in
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser || !existingUser.password) {
      return { success: false, message: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(user.password, existingUser.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid email or password' };
    }

    const token = createToken(existingUser.id);
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, message: 'Invalid form data' };
    }
    return { success: false, message: 'An error occurred during sign in' };
  }
}

// Sign up
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return { success: false, message: 'User already exists with this email' };
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    return { success: true, message: 'Account created successfully. Please sign in.' };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, message: 'Invalid form data' };
    }
    return { success: false, message: 'An error occurred during sign up' };
  }
}

// Sign out
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

// Update profile
export async function updateProfile(prevState: unknown, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const data = updateProfileSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}
