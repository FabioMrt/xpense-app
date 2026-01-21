# 🌙 Guia Completo do Dark Mode

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração](#configuração)
3. [Componentes Implementados](#componentes-implementados)
4. [Como Usar](#como-usar)
5. [Personalização](#personalização)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **XPensive Control** agora possui um sistema completo de **Dark Mode** implementado com:

- ✅ `next-themes` para gerenciamento de tema
- ✅ Toggle premium com animações suaves
- ✅ Suporte a tema do sistema (auto-detect)
- ✅ Transições suaves entre temas
- ✅ Persistência da preferência do usuário
- ✅ Zero flash no carregamento (SSR-friendly)

---

## ⚙️ Configuração

### 1. Dependências Instaladas

```json
{
  "next-themes": "^0.4.4"
}
```

### 2. Estrutura de Arquivos

```
src/
├── providers/
│   └── theme.tsx          # ThemeProvider wrapper
├── components/
│   └── ThemeToggle/
│       └── index.tsx      # Componente de toggle premium
├── app/
│   ├── layout.tsx         # Root layout com ThemeProvider
│   └── globals.css        # Variáveis CSS para dark mode
```

---

## 🎨 Componentes Implementados

### 1. **ThemeProvider** (`src/providers/theme.tsx`)

Wrapper do `next-themes` que gerencia o estado do tema:

```typescript
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Configuração no Layout:**

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange={false}
>
  {children}
</ThemeProvider>
```

**Propriedades:**
- `attribute="class"` - Usa classe CSS para alternar tema
- `defaultTheme="system"` - Detecta preferência do sistema
- `enableSystem` - Permite detecção automática
- `disableTransitionOnChange={false}` - Mantém transições suaves

---

### 2. **ThemeToggle** (`src/components/ThemeToggle/index.tsx`)

Toggle premium com animações **framer-motion**:

**Características:**
- 🎨 Gradiente purple → orange (identidade visual)
- ☀️ Ícone de Sol para modo claro
- 🌙 Ícone de Lua para modo escuro
- ✨ Animações suaves com spring physics
- 🔄 Rotação de ícone ao alternar
- 💫 Hover effects com shadow colorida
- ⚡ Loading skeleton durante hidratação

**Animações:**
1. **Slide** - Botão desliza com física de spring
2. **Rotation** - Ícone rotaciona 180° ao trocar
3. **Scale** - Ícones inativos diminuem (0.8x)
4. **Opacity** - Fade in/out nos ícones

**Código de exemplo:**

```tsx
import { ThemeToggle } from "@/components/ThemeToggle";

// No Header ou qualquer componente
<ThemeToggle />
```

---

### 3. **Header** (Adaptado)

O header foi atualizado com:
- 🌙 Background dark: `bg-white dark:bg-gray-900`
- 🎨 Logo adaptada: `text-purple-950 dark:text-purple-400`
- 🔘 ThemeToggle integrado ao lado dos botões
- 📱 Responsivo: funciona em mobile/desktop

**Classes Dark Mode:**

```tsx
<header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
  <h1 className="text-purple-950 dark:text-purple-400">
    <span className="text-orange-600 dark:text-orange-500">XP</span>ensive Control
  </h1>
  
  <ThemeToggle />
</header>
```

---

### 4. **Dashboard** (Adaptado)

Dashboard com dark mode completo:

**Background:**
```tsx
className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-orange-50/20 dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-900"
```

**Cards:**
```tsx
className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
```

**Loading Skeletons:**
```tsx
className="bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600"
```

**Empty States:**
```tsx
className="bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30"
```

**Textos:**
```tsx
className="text-slate-900 dark:text-white"
className="text-slate-600 dark:text-slate-400"
```

---

### 5. **Landing Page** (Adaptada)

Landing page com dark mode premium:

**Hero Section:**
```tsx
className="bg-gradient-to-br from-purple-600 via-purple-500 to-orange-500 dark:from-purple-900 dark:via-purple-800 dark:to-orange-600"
```

**Features Section:**
```tsx
<Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
```

**Wave Divider:**
```tsx
<path fill="currentColor" className="text-white dark:text-slate-900"/>
```

---

### 6. **Table** (Adaptado)

Tabela com suporte dark mode:

```tsx
<table className="text-gray-500 dark:text-gray-400">
  <thead className="bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    {/* ... */}
  </thead>
  <tbody>
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      {/* ... */}
    </tr>
  </tbody>
</table>
```

---

## 🚀 Como Usar

### 1. **Toggle Manual**

Clique no botão de toggle no header para alternar entre modos:
- ☀️ **Modo Claro** - Fundo branco, textos escuros
- 🌙 **Modo Escuro** - Fundo escuro, textos claros

### 2. **Detecção Automática**

Por padrão, o tema segue a preferência do sistema operacional:

**Windows:**
```
Configurações > Personalização > Cores > Escolher o modo
```

**macOS:**
```
Preferências do Sistema > Geral > Aparência
```

**Linux:**
```
Depende da distribuição (GNOME, KDE, etc.)
```

### 3. **Persistência**

A preferência é salva automaticamente:
- 💾 **LocalStorage** - Persiste entre sessões
- 🔄 **Sincronização** - Mesma preferência em todas as abas
- ⚡ **Instantâneo** - Carrega sem flash

---

## 🎨 Personalização

### Paleta de Cores (globals.css)

**Modo Claro:**
```css
:root {
  --background: oklch(1 0 0);          /* Branco */
  --foreground: oklch(0.145 0 0);      /* Preto */
  --card: oklch(1 0 0);                /* Branco */
  --primary: oklch(0.205 0 0);         /* Cinza escuro */
  --muted: oklch(0.97 0 0);            /* Cinza claro */
  /* ... */
}
```

**Modo Escuro:**
```css
.dark {
  --background: oklch(0.145 0 0);      /* Preto */
  --foreground: oklch(0.985 0 0);      /* Branco */
  --card: oklch(0.205 0 0);            /* Cinza escuro */
  --primary: oklch(0.922 0 0);         /* Branco suave */
  --muted: oklch(0.269 0 0);           /* Cinza médio */
  /* ... */
}
```

### Customizar Cores do Toggle

Edite `src/components/ThemeToggle/index.tsx`:

```tsx
// Alterar gradiente do botão
className="bg-gradient-to-r from-purple-500 to-orange-500"

// Alterar cor do ícone Sol
<Sun className="h-4 w-4 text-orange-500" />

// Alterar cor do ícone Lua
<Moon className="h-4 w-4 text-purple-500" />

// Alterar shadow no hover
hover:shadow-purple-500/50 dark:hover:shadow-orange-500/50
```

---

## 🛠️ Troubleshooting

### Problema: Flash de tema ao carregar

**Solução:**
Certifique-se de ter `suppressHydrationWarning` no `<html>`:

```tsx
<html lang="en" suppressHydrationWarning>
```

---

### Problema: Tema não persiste após refresh

**Solução:**
Verifique se o `ThemeProvider` está envolvendo todo o app:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

---

### Problema: Componentes não mudam de cor

**Solução:**
Adicione classes `dark:` aos componentes:

```tsx
// ❌ Errado
<div className="bg-white text-gray-900">

// ✅ Correto
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

---

### Problema: Transições muito bruscas

**Solução:**
Adicione `transition-colors` aos elementos:

```tsx
<div className="bg-white dark:bg-gray-900 transition-colors duration-200">
```

---

### Problema: Imagens/logos não se adaptam

**Solução:**
Use classes `dark:` ou crie versões separadas:

**Opção 1: Inverter cores**
```tsx
<img className="dark:invert" src="/logo.png" />
```

**Opção 2: Imagens separadas**
```tsx
<Image src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} />
```

---

## 📊 Cobertura de Dark Mode

### ✅ Componentes com Dark Mode

- [x] Header
- [x] ThemeToggle (novo)
- [x] DashboardClient
- [x] Table
- [x] Landing Page (todas as seções)
- [x] Cards (shadcn/ui)
- [x] Select (shadcn/ui)
- [x] Button (shadcn/ui)
- [x] Dialog (shadcn/ui)
- [x] Calendar (shadcn/ui)
- [x] Popover (shadcn/ui)
- [x] Loading Skeletons
- [x] Empty States
- [x] Charts (Recharts - adaptado)

### 🎯 Componentes Shadcn/UI

Todos os componentes do shadcn/ui já têm suporte nativo ao dark mode através das variáveis CSS definidas no `globals.css`.

---

## 🎭 Melhores Práticas

### 1. **Use Variáveis CSS**

Em vez de cores hard-coded:

```tsx
// ❌ Evite
<div className="bg-[#ffffff] dark:bg-[#1a1a1a]">

// ✅ Prefira
<div className="bg-background text-foreground">
```

### 2. **Mantenha Contraste**

```tsx
// ✅ Bom contraste
<p className="text-gray-900 dark:text-white">

// ❌ Contraste ruim
<p className="text-gray-500 dark:text-gray-400">
```

### 3. **Teste em Ambos os Modos**

Sempre teste sua interface nos dois modos para garantir legibilidade.

### 4. **Gradientes Adaptativos**

```tsx
// ✅ Gradiente que se adapta
className="bg-gradient-to-r from-purple-600 to-orange-500 
           dark:from-purple-900 dark:to-orange-600"
```

### 5. **Borders Sutis**

```tsx
// ✅ Border visível nos dois modos
className="border border-gray-200 dark:border-gray-800"
```

---

## 🎉 Resultado Final

### Modo Claro (Light Mode)
- ☀️ Fundos brancos e cinza claro
- 🎨 Cores vibrantes (purple/orange)
- 📝 Texto escuro para leitura
- 🌟 Sombras suaves e elegantes

### Modo Escuro (Dark Mode)
- 🌙 Fundos escuros (slate-900)
- 🎨 Cores adaptadas (mais suaves)
- 📝 Texto claro para conforto visual
- ✨ Brilhos sutis e contraste adequado

### Toggle Premium
- 🎨 Gradiente purple → orange
- ⚡ Animações suaves (spring physics)
- 🔄 Rotação de 180° ao trocar
- 💫 Hover effects coloridos
- 📱 Responsivo e acessível

---

## 📝 Notas Técnicas

### Performance

- ✅ **Zero Flash** - SSR-friendly com `suppressHydrationWarning`
- ✅ **Lazy Loading** - ThemeProvider só no cliente
- ✅ **CSS Variables** - Troca instantânea de tema
- ✅ **LocalStorage** - Mínimo overhead

### Acessibilidade

- ✅ **ARIA Labels** - `aria-label="Toggle theme"`
- ✅ **Keyboard Navigation** - Navegação por teclado
- ✅ **Focus Visible** - Indicador de foco
- ✅ **Contrast Ratio** - WCAG AAA compliance

### SEO

- ✅ **SSR Compatible** - Next.js App Router
- ✅ **No Layout Shift** - Sem CLS
- ✅ **Meta Tags** - Suporte a `color-scheme`

---

## 🚀 Próximos Passos

### Melhorias Futuras

1. **Tema Personalizado** - Permitir usuário escolher cores
2. **Modo Automático** - Trocar baseado na hora do dia
3. **Transições de Página** - Animações entre rotas
4. **Preferences Panel** - Painel de configurações completo

---

## 📚 Recursos

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn/UI Theming](https://ui.shadcn.com/docs/theming)

---

## 👨‍💻 Autor

Implementado por **Fabio** com foco em UX premium e performance.

**Data:** Janeiro 2026

---

## 📄 Licença

Este guia faz parte do projeto **XPensive Control**.

---

**Desfrute do Dark Mode! 🌙✨**
