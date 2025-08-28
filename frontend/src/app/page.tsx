'use client';
import { permanentRedirect } from 'next/navigation';

export default function DashboardPage() {
  permanentRedirect('/dashboard'); // sends 308 Permanent Redirect
}