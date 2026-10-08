'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
}

type Link = {
  id: string
  title: string
  url: string
  position: number
  active: boolean
}

export default function DashboardClient({
  profile,
  links: initialLinks,
}: {
  profile: Profile
  links: Link[]
}) {
  const router = useRouter()
  const supabase = createClient()

  const [links, setLinks] = useState<Link[]>(initialLinks)
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '')
  const [profileMsg, setProfileMsg] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [linkError, setLinkError] = useState('')

  const URL_RE = /^https?:\/\/.+/

  async function saveProfile() {
    setProfileMsg('')
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim().slice(0, 100) || null,
        bio: bio.trim().slice(0, 300) || null,
        avatar_url: avatarUrl.trim().slice(0, 500) || null,
      })
      .eq('id', profile.id)
    setProfileMsg(error ? 'Erro ao salvar.' : 'Perfil salvo!')
    setTimeout(() => setProfileMsg(''), 3000)
  }

  async function addLink(e: React.FormEvent) {
    e.preventDefault()
    setLinkError('')
    const title = newTitle.trim().slice(0, 100)
    const url = newUrl.trim().slice(0, 500)
    if (!title || !url) { setLinkError('Preencha título e URL.'); return }
    if (!URL_RE.test(url)) { setLinkError('URL deve começar com http:// ou https://'); return }

    const position = links.length
    const { data, error } = await supabase
      .from('links')
      .insert({ profile_id: profile.id, title, url, position })
      .select()
      .single()

    if (error || !data) { setLinkError('Erro ao adicionar link.'); return }
    setLinks([...links, data])
    setNewTitle('')
    setNewUrl('')
  }

  async function removeLink(id: string) {
    await supabase.from('links').delete().eq('id', id)
    setLinks(links.filter((l) => l.id !== id))
  }

  async function moveLink(index: number, dir: -1 | 1) {
    const newLinks = [...links]
    const swap = index + dir
    if (swap < 0 || swap >= newLinks.length) return
    ;[newLinks[index], newLinks[swap]] = [newLinks[swap], newLinks[index]]
    const updated = newLinks.map((l, i) => ({ ...l, position: i }))
    setLinks(updated)
    await Promise.all(
      updated.map((l) => supabase.from('links').update({ position: l.position }).eq('id', l.id))
    )
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-indigo-600">LinkBio</h1>
        <div className="flex gap-3 items-center">
          <a
            href={`/${profile.username}`}
            target="_blank"
            className="text-sm text-indigo-600 hover:underline"
          >
            Ver perfil →
          </a>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-gray-700">
            Sair
          </button>
        </div>
      </div>

      {/* Profile section */}
      <section className="bg-gray-50 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Seu perfil</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Nome de exibição</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              rows={2}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Uma frase sobre você"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">URL da foto</label>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              maxLength={500}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
            />
          </div>
          <button
            onClick={saveProfile}
            className="self-start bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Salvar perfil
          </button>
          {profileMsg && (
            <p className={`text-sm ${profileMsg.startsWith('Erro') ? 'text-red-600' : 'text-green-600'}`}>
              {profileMsg}
            </p>
          )}
        </div>
      </section>

      {/* Add link */}
      <section className="bg-gray-50 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Adicionar link</h2>
        <form onSubmit={addLink} className="flex flex-col gap-3">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Título (ex: Meu YouTube)"
          />
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            maxLength={500}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://..."
          />
          {linkError && <p className="text-sm text-red-600">{linkError}</p>}
          <button
            type="submit"
            className="self-start bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Adicionar
          </button>
        </form>
      </section>

      {/* Links list */}
      <section>
        <h2 className="font-semibold text-gray-900 mb-4">Seus links</h2>
        {links.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Nenhum link ainda. Adicione um acima.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {links.map((link, i) => (
              <li
                key={link.id}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveLink(i, -1)}
                    disabled={i === 0}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                    aria-label="Mover para cima"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveLink(i, 1)}
                    disabled={i === links.length - 1}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                    aria-label="Mover para baixo"
                  >
                    ▼
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{link.title}</p>
                  <p className="text-xs text-gray-400 truncate">{link.url}</p>
                </div>
                <button
                  onClick={() => removeLink(link.id)}
                  className="text-red-400 hover:text-red-600 text-sm ml-2"
                  aria-label="Remover link"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
