import type { Metadata } from 'next';
import AdminPortal from './AdminPortal';

export const metadata: Metadata = {
  title: 'Sierra Estates 3.0 · Intelligence OS · Admin',
};

export default function AdminPage() {
  return <AdminPortal />;
}
