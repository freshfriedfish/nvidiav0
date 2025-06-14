'use client';

import { useState } from 'react';

interface NvidiaResponse {
    imageUrl?: string;
    error?: string;
}

export default function NvidiaForm() {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<NvidiaResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        const res = await fetch('/api/nvidia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        setLoading(false);
        setResult(data);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt"
                    className="border px-2 py-1 w-80 rounded"
                />
                <button type="submit" className="ml-2 px-4 py-1 bg-blue-600 text-white rounded">
                    Generate
                </button>
            </form>

            {loading && <p>Loading...</p>}

            {result?.error && (
                <p className="text-red-500">Error: {result.error}</p>
            )}

            {result?.imageUrl && (
                <img
                    src={result.imageUrl}
                    alt="Generated by NVIDIA"
                    className="mt-4 max-w-full border rounded"
                />
            )}
        </div>
    );
}
