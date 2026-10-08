import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <span className="text-xl font-bold text-indigo-600">LinkBio</span>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Criar conta
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          Todos os seus links em{' '}
          <span className="text-indigo-600">um só lugar</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-lg">
          Crie sua página personalizada e compartilhe tudo com um único link. Simples, rápido e gratuito.
        </p>
        <Link
          href="/register"
          className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Crie seu link grátis
        </Link>

        {/* Features */}
        <div className="mt-16 grid sm:grid-cols-3 gap-8 max-w-3xl w-full text-left">
          {[
            {
              icon: '🔗',
              title: 'Links ilimitados',
              desc: 'Adicione quantos links quiser, sem restrições.',
            },
            {
              icon: '🎨',
              title: 'Perfil personalizado',
              desc: 'Foto, nome e bio do jeito que você quiser.',
            },
            {
              icon: '📱',
              title: 'Mobile first',
              desc: 'Funciona perfeitamente em qualquer dispositivo.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-6">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Sample profile preview */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 max-w-xs w-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-indigo-200 flex items-center justify-center text-2xl mb-3">
              👤
            </div>
            <p className="font-bold text-gray-900">@joaosilva</p>
            <p className="text-sm text-gray-500 mt-1">Criador de conteúdo 🚀</p>
            <div className="mt-4 w-full flex flex-col gap-2">
              {['YouTube', 'Instagram', 'Newsletter'].map((l) => (
                <div
                  key={l}
                  className="w-full text-center bg-white border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700"
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-gray-400 border-t">
        © {new Date().getFullYear()} LinkBio. Feito com 💜
      </footer>
    </main>
  )
}
