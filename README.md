# LinkBio

Link-in-bio SaaS minimalista. Next.js 14 + Supabase + Tailwind.

## Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.local.example .env.local
```
Edite `.env.local` com suas credenciais do Supabase (Projeto → Settings → API).

### 3. Criar tabelas no Supabase
Vá em **SQL Editor** no painel do Supabase e cole o conteúdo de `supabase/schema.sql`.

### 4. Rodar localmente
```bash
npm run dev
```
Acesse http://localhost:3000

## Deploy (Vercel)

```bash
npx vercel
```
Adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` nas variáveis de ambiente do projeto na Vercel.

## Estrutura

```
app/
  page.tsx            Landing page
  login/              Login
  register/           Cadastro
  dashboard/          Painel do usuário (protegido)
  [username]/         Perfil público
lib/supabase/
  client.ts           Cliente browser
  server.ts           Cliente server-side
middleware.ts         Proteção da rota /dashboard
supabase/schema.sql   SQL das tabelas + RLS
```
