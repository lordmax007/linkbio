import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const username = params.username.toLowerCase().trim()
  const supabase = createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, bio, avatar_url')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: links } = await supabase
    .from('links')
    .select('id, title, url')
    .eq('profile_id', profile.id)
    .eq('active', true)
    .order('position')

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-start pt-16 px-4 pb-16">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Avatar */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name ?? profile.username}
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-3xl shadow-md">
            👤
          </div>
        )}

        {/* Name & bio */}
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          {profile.display_name ?? `@${profile.username}`}
        </h1>
        {profile.display_name && (
          <p className="text-sm text-gray-400">@{profile.username}</p>
        )}
        {profile.bio && (
          <p className="mt-2 text-sm text-gray-600 text-center max-w-xs">{profile.bio}</p>
        )}

        {/* Links */}
        <div className="mt-8 w-full flex flex-col gap-3">
          {links && links.length > 0 ? (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold text-gray-800 shadow-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
              >
                {link.title}
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center mt-4">Nenhum link ainda.</p>
          )}
        </div>

        <p className="mt-12 text-xs text-gray-300">
          Criado com{' '}
          <a href="/" className="hover:text-indigo-400 transition-colors">
            LinkBio
          </a>
        </p>
      </div>
    </main>
  )
}
