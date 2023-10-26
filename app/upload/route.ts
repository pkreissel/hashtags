import { put } from '@vercel/blob';

export const runtime = 'edge';

export async function PUT(request: Request) {
    // JSON body
    const body = await request.json();
    // File from body
    const text = body.text;
    const key = body.key;
    const blob = await put(key, text, { access: 'public' });

    return Response.json(blob);
}