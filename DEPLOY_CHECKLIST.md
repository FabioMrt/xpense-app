# ✅ Checklist Rápido de Deploy - Vercel

Use este checklist para garantir que tudo está configurado corretamente antes e depois do deploy.

## 🔴 Antes do Deploy

### Configuração do Código
- [ ] Script `postinstall` adicionado no `package.json`
- [ ] Script `build` atualizado para incluir `prisma generate`
- [ ] Build local funciona sem erros (`npm run build`)
- [ ] Não há erros de lint ou TypeScript
- [ ] Código commitado e pushado para o repositório

### Configuração do MongoDB
- [ ] MongoDB Atlas configurado
- [ ] Network Access permite conexões da Vercel (0.0.0.0/0 ou IPs específicos)
- [ ] Usuário do banco tem permissões adequadas
- [ ] `DATABASE_URL` está correto e testado

### Configuração do Google OAuth
- [ ] Google Cloud Console configurado
- [ ] OAuth 2.0 Client criado
- [ ] `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` anotados
- [ ] URLs de produção serão adicionadas após o primeiro deploy

### Variáveis de Ambiente
- [ ] `DATABASE_URL` - URL do MongoDB Atlas
- [ ] `NEXTAUTH_SECRET` - Secret gerado (use `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Será atualizado após o primeiro deploy
- [ ] `GOOGLE_CLIENT_ID` - Client ID do Google
- [ ] `GOOGLE_CLIENT_SECRET` - Client Secret do Google
- [ ] `NODE_ENV` - `production`

---

## 🟡 Durante o Deploy

### Na Vercel Dashboard
- [ ] Projeto importado do repositório Git
- [ ] Framework detectado como Next.js
- [ ] Build Command: `npm run build` (ou padrão)
- [ ] Output Directory: `.next` (ou padrão)
- [ ] Todas as variáveis de ambiente adicionadas
- [ ] Variáveis marcadas para Production, Preview e Development
- [ ] Deploy iniciado

### Primeiro Deploy
- [ ] Aguardar conclusão do build
- [ ] Verificar se não há erros no build
- [ ] Anotar a URL gerada (ex: `xpense-control.vercel.app`)

---

## 🟢 Após o Deploy

### Atualização de URLs
- [ ] Atualizar `NEXTAUTH_URL` na Vercel com a URL real
- [ ] Adicionar URL no Google OAuth:
  - **Authorized JavaScript origins:** `https://seu-dominio.vercel.app`
  - **Authorized redirect URIs:** `https://seu-dominio.vercel.app/api/auth/callback/google`

### Testes
- [ ] Acessar a URL da aplicação
- [ ] Testar login com Google
- [ ] Verificar se as transações são salvas
- [ ] Testar criação de categorias
- [ ] Verificar se os dados aparecem corretamente
- [ ] Testar dark mode (se aplicável)

### Verificação de Logs
- [ ] Verificar logs na Vercel (Deployments → Functions)
- [ ] Não há erros críticos nos logs
- [ ] API routes estão funcionando

### Performance
- [ ] Página carrega corretamente
- [ ] Não há erros no console do navegador
- [ ] Imagens carregam corretamente
- [ ] Navegação funciona sem problemas

---

## 🔵 Configurações Opcionais

### Domínio Personalizado
- [ ] Domínio adicionado na Vercel
- [ ] DNS configurado corretamente
- [ ] `NEXTAUTH_URL` atualizado com o novo domínio
- [ ] Google OAuth atualizado com o novo domínio

### Analytics e Monitoramento
- [ ] Vercel Analytics habilitado (opcional)
- [ ] Speed Insights habilitado (opcional)

---

## 🆘 Se Algo Der Errado

### Build Falha
1. Verificar logs na Vercel
2. Testar build localmente: `npm run build`
3. Verificar se todas as dependências estão no `package.json`
4. Verificar erros de TypeScript

### Erro de Autenticação
1. Verificar se `NEXTAUTH_SECRET` está configurado
2. Verificar se `NEXTAUTH_URL` está correto
3. Verificar URLs no Google OAuth
4. Verificar logs da API de autenticação

### Erro de Banco de Dados
1. Verificar se `DATABASE_URL` está correto
2. Verificar Network Access no MongoDB Atlas
3. Verificar se o usuário tem permissões
4. Testar conexão localmente

### Erro 500 ou Página em Branco
1. Verificar logs na Vercel
2. Verificar console do navegador
3. Verificar se todas as variáveis de ambiente estão configuradas
4. Verificar se o Prisma Client foi gerado (`postinstall`)

---

## 📝 Notas Importantes

- ⚠️ **NUNCA** commite arquivos `.env` ou `.env.local` com valores reais
- 🔐 Use secrets diferentes para desenvolvimento e produção
- 🔄 Após mudanças no Prisma schema, faça `prisma generate` e novo deploy
- 🌐 URLs do Google OAuth devem ser atualizadas após cada deploy de produção
- 📊 Monitore os logs regularmente para identificar problemas

---

**Boa sorte com o deploy! 🚀**
