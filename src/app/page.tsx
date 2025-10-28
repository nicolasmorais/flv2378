'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/todos-os-plus');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-2xl font-semibold">Carregando...</div>
    </div>
  );
}
