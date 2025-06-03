'use client';

import NvidiaForm from './NvidiaForm';

export default function ClientHome() {
    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">NVIDIA NIM Integration</h1>
            <NvidiaForm />
        </main>
    );
}
