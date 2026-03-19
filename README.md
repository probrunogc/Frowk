# 🎬 StoryFlow — Grok Imagine Studio

Ferramenta de storyboard para produção audiovisual com IA, otimizada para o **Grok Imagine (Aurora engine)**.

---

## 🚀 Deploy Rápido

### Opção A: Vercel (Recomendado — mais rápido)

1. **Crie uma conta** em [vercel.com](https://vercel.com) (grátis com GitHub)

2. **Suba o projeto para o GitHub:**
   ```bash
   cd storyflow-deploy
   git init
   git add .
   git commit -m "StoryFlow v1"
   ```
   - Vá em [github.com/new](https://github.com/new), crie um repositório chamado `storyflow`
   - Siga as instruções do GitHub para conectar:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/storyflow.git
   git branch -M main
   git push -u origin main
   ```

3. **Conecte na Vercel:**
   - Abra [vercel.com/new](https://vercel.com/new)
   - Clique "Import Git Repository"
   - Selecione o repositório `storyflow`
   - Framework Preset: **Vite** (detecta automático)
   - Clique **Deploy**
   - Em ~60 segundos seu app estará no ar! 🎉

---

### Opção B: Netlify

1. **Suba para o GitHub** (mesmo passo acima)

2. **Conecte na Netlify:**
   - Abra [app.netlify.com](https://app.netlify.com)
   - "Add new site" → "Import an existing project"
   - Selecione GitHub → seu repositório
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Clique **Deploy site**

---

### Opção C: Rodar Local (para testar antes)

```bash
cd storyflow-deploy
npm install
npm run dev
```
Acesse `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
storyflow-deploy/
├── index.html          # HTML base
├── package.json        # Dependências
├── vite.config.js      # Config do Vite
├── vercel.json         # Config Vercel
├── netlify.toml        # Config Netlify
├── public/
│   └── vite.svg        # Favicon
└── src/
    ├── main.jsx        # Entry point
    └── App.jsx         # App completo (tudo aqui)
```

## 🎯 Como Usar

1. **Crie Personagens** → descrições detalhadas geram prompts fixos
2. **Crie Estilos** → defina a estética visual do projeto
3. **Monte Cenas** → cada cena combina personagem + estilo + câmera + ação
4. **Copie os Prompts** → cole direto no Grok Imagine
5. **Exporte** → JSON (reimportável) ou TXT (todos os prompts)

## 💡 Dicas de Consistência no Grok Imagine

- **Nunca mude a descrição do personagem** entre cenas
- Prompts de **50-150 palavras** funcionam melhor
- **Front-load** o sujeito principal (começo do prompt = mais peso)
- Use **image-to-video** quando possível para máxima consistência
- Mesmo **estilo visual** em todas as cenas mantém coerência
