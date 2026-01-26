# 🚀 Guia de Deploy - Vercel

Este documento contém todas as informações necessárias para fazer o deploy da aplicação **Xpense Control** na Vercel.

---

## 📋 Pré-requisitos

- [ ] Conta na [Vercel](https://vercel.com) criada
- [ ] Repositório Git (GitHub, GitLab ou Bitbucket) com o código
- [ ] MongoDB Atlas configurado e funcionando
- [ ] Google OAuth configurado (Client ID e Secret)

---

## 🔧 Configuração do Prisma para Produção

### 1. Adicionar Script de Build do Prisma

O Prisma precisa gerar o cliente durante o build. Adicione o script `postinstall` no `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

**Nota:** O script `postinstall` garante que o Prisma Client seja gerado automaticamente após a instalação das dependências na Vercel.

---

## 🌐 Variáveis de Ambiente na Vercel

Configure as seguintes variáveis de ambiente no painel da Vercel:

### Acesse: **Settings → Environment Variables**

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `DATABASE_URL` | `mongodb+srv://...` | URL de conexão do MongoDB Atlas |
| `NEXTAUTH_SECRET` | `seu-secret-aqui` | Secret para criptografia do NextAuth (use um valor aleatório forte) |
| `NEXTAUTH_URL` | `https://seu-dominio.vercel.app` | URL da aplicação em produção |
| `GOOGLE_CLIENT_ID` | `seu-client-id` | Client ID do Google OAuth |
| `GOOGLE_CLIENT_SECRET` | `seu-client-secret` | Client Secret do Google OAuth |
| `NODE_ENV` | `production` | Ambiente de produção |

### 🔐 Gerando um NEXTAUTH_SECRET Seguro

Execute no terminal para gerar um secret seguro:

```bash
openssl rand -base64 32
```

Ou use um gerador online: https://generate-secret.vercel.app/32

**⚠️ IMPORTANTE:** 
- Use valores diferentes para `NEXTAUTH_SECRET` em desenvolvimento e produção
- Nunca commite o `.env` com valores reais no Git
- Atualize `NEXTAUTH_URL` após o primeiro deploy para usar o domínio real

---

## 📝 Passos do Deploy

### Opção 1: Deploy via Dashboard da Vercel (Recomendado)

1. **Acesse [vercel.com](https://vercel.com)** e faça login

2. **Clique em "Add New Project"**

3. **Importe seu repositório Git**
   - Conecte sua conta GitHub/GitLab/Bitbucket
   - Selecione o repositório `xpense-control`

4. **Configure o projeto:**
   - **Framework Preset:** Next.js (deve detectar automaticamente)
   - **Root Directory:** `./` (raiz do projeto)
   - **Build Command:** `npm run build` (ou deixe em branco para usar o padrão)
   - **Output Directory:** `.next` (padrão do Next.js)
   - **Install Command:** `npm install`

5. **Adicione as variáveis de ambiente:**
   - Clique em "Environment Variables"
   - Adicione todas as variáveis listadas acima
   - Marque para aplicar em **Production**, **Preview** e **Development**

6. **Clique em "Deploy"**

### Opção 2: Deploy via CLI da Vercel

1. **Instale a CLI da Vercel:**
   ```bash
   npm i -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Execute o deploy:**
   ```bash
   vercel
   ```
   
   Siga as instruções interativas:
   - Link to existing project? **N** (primeira vez)
   - Project name: `xpense-control`
   - Directory: `./`
   - Override settings? **N**

4. **Adicione as variáveis de ambiente:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add NODE_ENV
   ```

5. **Faça o deploy de produção:**
   ```bash
   vercel --prod
   ```

---

## 🔄 Configuração do Google OAuth

Após o deploy, você precisará atualizar as URLs autorizadas no Google Cloud Console:

1. **Acesse [Google Cloud Console](https://console.cloud.google.com)**

2. **Vá em APIs & Services → Credentials**

3. **Edite seu OAuth 2.0 Client ID**

4. **Adicione nas "Authorized JavaScript origins":**
   ```
   https://seu-dominio.vercel.app
   ```

5. **Adicione nas "Authorized redirect URIs":**
   ```
   https://seu-dominio.vercel.app/api/auth/callback/google
   ```

6. **Salve as alterações**

---

## ✅ Checklist Pré-Deploy

Antes de fazer o deploy, verifique:

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] `NEXTAUTH_URL` aponta para o domínio correto (atualize após o primeiro deploy)
- [ ] MongoDB Atlas está acessível (verifique IP whitelist)
- [ ] Google OAuth está configurado com as URLs de produção
- [ ] Build local funciona sem erros (`npm run build`)
- [ ] Não há erros de lint (`npm run lint` se disponível)
- [ ] Arquivos sensíveis estão no `.gitignore`
- [ ] Prisma schema está correto

---

## 🐛 Troubleshooting

### Erro: "Prisma Client not generated"

**Solução:** Adicione o script `postinstall` no `package.json`:
```json
"postinstall": "prisma generate"
```

### Erro: "NEXTAUTH_SECRET is missing"

**Solução:** 
- Verifique se a variável `NEXTAUTH_SECRET` está configurada na Vercel
- Certifique-se de que está marcada para o ambiente correto (Production)

### Erro: "Database connection failed"

**Solução:**
- Verifique se o `DATABASE_URL` está correto
- No MongoDB Atlas, adicione `0.0.0.0/0` no Network Access (ou o IP da Vercel)
- Verifique se o usuário do banco tem as permissões corretas

### Erro: "OAuth callback error"

**Solução:**
- Verifique se `NEXTAUTH_URL` está correto
- Confirme que as URLs no Google OAuth incluem o domínio da Vercel
- Verifique se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos

### Build falha com erro de tipo

**Solução:**
- Execute `npm run build` localmente para identificar erros
- Verifique se todas as dependências estão instaladas
- Certifique-se de que o TypeScript está configurado corretamente

### Erro: "Module not found"

**Solução:**
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para garantir que tudo está correto
- Verifique se não há imports de arquivos que não existem

---

## 📊 Monitoramento e Logs

### Visualizar Logs na Vercel

1. Acesse o projeto no dashboard da Vercel
2. Vá em **Deployments**
3. Clique no deployment desejado
4. Acesse a aba **Functions** para ver logs das API routes
5. Use **Runtime Logs** para ver logs em tempo real

### Verificar Status da Aplicação

- **Dashboard:** Status do deployment, domínio, variáveis de ambiente
- **Analytics:** Métricas de performance (se habilitado)
- **Speed Insights:** Análise de performance (se habilitado)

---

## 🔄 Atualizações e Re-deploy

### Deploy Automático

A Vercel faz deploy automático quando você faz push para:
- **main/master branch** → Deploy em produção
- **Outras branches** → Deploy de preview

### Deploy Manual

1. No dashboard da Vercel, vá em **Deployments**
2. Clique nos três pontos do deployment desejado
3. Selecione **Redeploy**

### Rollback

1. No dashboard, vá em **Deployments**
2. Encontre o deployment anterior que funcionava
3. Clique nos três pontos
4. Selecione **Promote to Production**

---

## 🌍 Domínio Personalizado (Opcional)

1. No dashboard da Vercel, vá em **Settings → Domains**
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruções
4. Atualize `NEXTAUTH_URL` com o novo domínio
5. Atualize as URLs no Google OAuth

---

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/configuration/options)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs na Vercel
2. Teste localmente com `npm run build`
3. Consulte a documentação oficial
4. Verifique o status da Vercel: https://www.vercel-status.com

---

**Última atualização:** Janeiro 2026
