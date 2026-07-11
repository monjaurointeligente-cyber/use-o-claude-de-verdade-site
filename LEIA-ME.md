# Use o Claude de Verdade — Site + Área de Membros

Este pacote contém o site de vendas e a área de membros (dashboard de aulas) do curso, prontos para publicar. Siga os passos abaixo na ordem.

## 1. Criar o banco de dados (Supabase)

1. Crie a conta/projeto novo em https://supabase.com (você já decidiu criar uma conta separada, já que a atual bateu o limite de 2 projetos grátis).
2. No painel do projeto, vá em **SQL Editor** → **New query**.
3. Abra o arquivo `schema.sql` (está na pasta principal, ao lado desta pasta `site`), copie todo o conteúdo e cole no SQL Editor. Clique em **Run**.
   - Isso cria as tabelas `trilhas`, `aulas` (já com as 24 aulas e todo o conteúdo), `progresso`, `acessos`, as políticas de segurança (RLS) e o gatilho que libera o acesso do aluno automaticamente após o cadastro.
4. Vá em **Settings → API**. Copie:
   - **Project URL**
   - **anon / publishable key**
5. Abra `public/app/config.js` nesta pasta e cole os dois valores nos lugares indicados (`COLE_AQUI_A_PROJECT_URL` e `COLE_AQUI_A_ANON_PUBLISHABLE_KEY`).

## 2. Publicar no Netlify

1. Suba esta pasta `site` inteira para um repositório no GitHub (ou arraste a pasta direto no Netlify, em **Add new site → Deploy manually**, se preferir sem GitHub).
2. Em https://netlify.com, clique **Add new site → Import an existing project** e conecte o repositório.
   - **Build command**: deixe em branco (não há build).
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`
   (essas configurações já estão no arquivo `netlify.toml`, o Netlify deve detectar sozinho.)
3. Depois do primeiro deploy, vá em **Site settings → Environment variables** e crie 3 variáveis:
   - `KIWIFY_WEBHOOK_TOKEN` → invente uma senha/token difícil de adivinhar (ex: `kwf_9f8a2b...`)
   - `SUPABASE_URL` → a mesma Project URL do passo 1
   - `SUPABASE_SERVICE_ROLE_KEY` → em Settings → API Keys do Supabase, a chave **service_role/secret** (NUNCA coloque essa no config.js do site — só aqui, no Netlify).
4. Faça um novo deploy (Netlify → Deploys → Trigger deploy) para essas variáveis entrarem em vigor.

## 3. Ligar o webhook da Kiwify

1. No painel da Kiwify, cadastre a URL do webhook:
   `https://SEU-SITE.netlify.app/.netlify/functions/kiwify-webhook?token=SEU_TOKEN` (o mesmo token do passo 2).
2. Configure para disparar em eventos de compra aprovada, reembolso e chargeback.
3. Faça uma compra de teste (ou peça um evento de teste da Kiwify) e confira em Supabase → Table Editor → `acessos` se a linha foi criada/atualizada.
4. Se a Kiwify mudar o formato do payload no futuro, o arquivo `netlify/functions/kiwify-webhook.js` tem comentários explicando quais campos ele tenta ler — é só ajustar.

## 4. Testar o fluxo completo

1. Acesse `https://SEU-SITE.netlify.app` — deve abrir a página de vendas.
2. Simule uma compra (ou insira manualmente uma linha em `acessos` com seu e-mail e `status = 'ativo'`).
3. Vá em `/entrar` (ou `/app/login.html`), crie a conta com o mesmo e-mail.
4. Deve cair direto no dashboard (`/curso`) com as 5 trilhas e 24 aulas liberadas.

## 5. Domínio próprio (opcional)

No Netlify: **Domain settings → Add a domain**. Se o domínio for do Registro.br, aponte os nameservers para o Netlify (ou crie os registros DNS indicados por ele) — mesmo processo já usado nas outras integrações deste projeto.

## Estrutura de arquivos

```
site/
├── netlify.toml                       configuração do Netlify
├── package.json                       dependência (@supabase/supabase-js) da function
├── netlify/functions/
│   └── kiwify-webhook.js              recebe a confirmação de compra da Kiwify
└── public/
    ├── index.html                     página de vendas
    ├── css/style.css                  estilo (site + área de membros)
    └── app/
        ├── config.js                  suas chaves do Supabase (preencher)
        ├── supabase-client.js         conexão com o Supabase
        ├── login.html                 cadastro/login do aluno
        ├── dashboard.html             painel com as trilhas e aulas
        └── aula.html                  conteúdo de cada aula
```

## Preço e link de checkout

Em `public/index.html`, o preço e o botão de compra estão marcados como "Em breve" / link `#`. Assim que definir o preço final e gerar o link de checkout na Kiwify, procure por esses trechos no arquivo e substitua.
