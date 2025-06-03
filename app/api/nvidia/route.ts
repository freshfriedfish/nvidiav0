// app/api/nvidia/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const invokeUrl = 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev';

    const headers = {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`, // make sure this is in your .env.local
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const subject = (body.prompt || 'a tree').trim();
    const prompt = `A high-contrast colored silhouette of a ${subject}, with clean lines, no gradients, no shading, and a white background. The subject should be easily recognizable and composed of distinct, solid black shapes with no internal texture or detail. The style should be minimalistic and suitable for vector tracing using Potrace.`;

    const payload = {
        prompt,
        mode: 'base',
        cfg_scale: 3.5,
        width: 1024,
        height: 1024,
        seed: 0,
        steps: 50,
    };


    try {
        const response = await fetch(invokeUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errBody = await response.text();
            return NextResponse.json({ error: errBody }, { status: response.status });
        }

        const data = await response.json();
        const artifact = data.artifacts?.[0];

        if (artifact?.base64) {
            return NextResponse.json({
                imageUrl: `data:image/png;base64,${artifact.base64}`,
            });
        }

        return NextResponse.json({ error: 'No image returned.' }, { status: 500 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
