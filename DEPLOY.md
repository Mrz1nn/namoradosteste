# Como publicar o site na Vercel

Este projeto funciona como **vários sites de casais num único site**:

- Cada casal tem uma URL própria, ex: `sitedonamorado.com/joaoxmaria`
- Você (admin) cria e edita os sites em `/admin` com uma senha mestra
- Os visitantes só visualizam

---

## 1. Criar o projeto na Vercel

1. Suba este projeto para um repositório no GitHub (ou use `vercel` pela CLI).
2. Na [Vercel](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. O framework é detectado como **Vite**. Pode deixar tudo no padrão e clicar em **Deploy**.

---

## 2. Criar o banco de dados (Vercel KV / Upstash)

1. No painel do projeto na Vercel, vá na aba **Storage**.
2. Clique em **Create Database → KV (Upstash Redis)** (plano gratuito serve).
3. Dê um nome e clique em **Create**, depois **Connect** ao seu projeto.

> Isso adiciona automaticamente as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`
> ao projeto. O código já as utiliza.

---

## 3. Criar o armazenamento de fotos (Vercel Blob)

Para que cada casal tenha suas próprias fotos:

1. Ainda na aba **Storage**, clique em **Create Database → Blob**.
2. Dê um nome e clique em **Create**, depois **Connect** ao seu projeto.

> Isso adiciona a variável `BLOB_READ_WRITE_TOKEN` automaticamente. O upload de
> fotos no editor já usa ela.

---

## 4. Definir a senha de administrador

1. No projeto na Vercel: **Settings → Environment Variables**.
2. Adicione:
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** a senha que você quiser (escolha uma forte)
   - Marque os ambientes **Production**, **Preview** e **Development**.
3. Salve.

---

## 5. Republicar

Depois de conectar o banco, o Blob e definir a senha, vá em **Deployments** e
clique em **Redeploy** (ou faça um novo push). Pronto!

---

## 6. Usando o site

- **Criar um site de casal:** acesse `seu-dominio.com/admin`, faça login com a
  `ADMIN_PASSWORD`, digite os dois nomes e clique em **Criar e editar**.
- O endereço é gerado automaticamente no formato `nome1xnome2`
  (sem acentos/espaços). Ex: "João" + "Maria" → `/joaoxmaria`.
- **Editar depois:** no painel `/admin`, clique no lápis ao lado do casal.
- **Compartilhar:** mande para o casal apenas o link `seu-dominio.com/joaoxmaria`.

---

## Sobre as fotos

Cada casal tem suas **próprias fotos**: no editor, use o botão **Enviar foto** em
cada memória. As imagens são redimensionadas/comprimidas no navegador e enviadas
para o **Vercel Blob**. As fotos antigas em `public/images/` servem apenas de
exemplo inicial.

---

## Testar localmente (sem publicar)

```bash
npm install
npm run dev
```

No modo local, o sistema usa um **banco de mentira** no navegador (localStorage),
então você consegue testar todo o fluxo sem a Vercel:

- Acesse `http://localhost:5173/admin`
- A senha de teste local é: **admin**
- Crie um casal, edite e veja o resultado em `http://localhost:5173/nome1xnome2`

> Observação: os dados de teste local ficam só no seu navegador e são separados
> dos dados de produção (Vercel KV). No modo local, as fotos enviadas ficam
> embutidas no próprio registro (data URL), sem usar o Vercel Blob.
