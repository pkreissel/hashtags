import Image from 'next/image'
import { get } from '@vercel/edge-config';
import { list } from '@vercel/blob';

export default async function Home() {
  const { blobs } = await list();
  const hashtags_data = await get("hashtags") as string;
  const hashtags: string[] = JSON.parse(hashtags_data)
  const hashtag_summaries = Object.assign({},
    ...await Promise.all(hashtags.map(async (hashtag: string) => {
      const blob = blobs.find(blob => blob.pathname === hashtag)
      if (!blob) return { [hashtag]: "" }
      const res = await fetch(blob.url)
      const data = await res.text()
      return { [hashtag]: data }
    }))
  )
  return (
    <main className="flex min-h-screen p-24">
      <h1>Deutsche Bluesky Hashtags</h1>

      <div>
        {hashtags.map((hashtag: string, i: number) => (
          <p key={i}>
            <a href={`https://bsky.app/search?q=${hashtag}`} target="_blank" className="text-blue-500 hover:text-blue-700" key={hashtag}>#{hashtag}</a>
            <br />
            <p>
              {hashtag_summaries[hashtag]}
            </p>
          </p>
        ))
        }
      </div>
    </main>
  )
}
