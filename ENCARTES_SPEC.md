# Gerador de Encartes — Especificação do Projeto (v1)

## Visão

Aplicação web que permite a donos de mercados de pequeno e médio porte criar
encartes de ofertas profissionais em minutos, sem conhecimento de design.
O usuário cadastra produtos, escolhe um tema, monta o encarte e exporta em
PDF/PNG para impressão ou redes sociais.

## Público-alvo

Donos e funcionários de mercados pequenos/médios no Brasil. Perfil não técnico.
Tudo deve funcionar com poucos cliques e em telas de celular.

---

## Escopo do MVP (Fases 0–4)

Regra de ouro: **o MVP termina quando um usuário consegue criar um encarte
completo e baixar o PDF, com o app deployado e acessível por URL pública.**
Nada além disso entra antes.

### Incluído no MVP
1. CRUD de produtos (nome, preço, unidade, categoria, imagem via URL/upload)
2. Criação de encarte: escolher tema → selecionar produtos → definir período de validade → preview ao vivo
3. 2 temas iniciais: "Ofertas da Semana" (vermelho) e "Hortifruti" (verde)
4. Layout de 1 página com grade de 6–8 produtos
5. Export em PDF e PNG (client-side)
6. Nome do mercado configurável (aparece no rodapé do encarte)
7. Deploy: frontend + backend no Render, banco no MongoDB Atlas (free tier)

### Explicitamente FORA do MVP (fases futuras)
- Remoção de fundo com IA (Fase 5 — usar @imgly/background-removal, roda no navegador, grátis)
- Sugestão de textos com IA / Claude API (Fase 6)
- Temas sazonais extras (Natal, Páscoa, Churrasco...) (Fase 5)
- Encarte de 2 páginas (Fase 5)
- Compartilhamento direto WhatsApp/Instagram (Fase 6)
- Autenticação multiusuário (Fase 7 — MVP é single-tenant)

---

## Stack

| Camada    | Tecnologia | Observações |
|-----------|-----------|-------------|
| Frontend  | React 18 + Vite + Tailwind CSS | SPA |
| Backend   | Node.js + Express | API REST |
| Banco     | MongoDB Atlas (free tier) + Mongoose | |
| Export    | html2canvas + jsPDF (client-side) | O encarte é renderizado como HTML/CSS e capturado |
| Upload de imagem | Multer + Cloudinary (free tier) | Migrado do armazenamento local antes do previsto — o disco do Render é efêmero |
| Deploy    | Render (web service + static site) | |

Justificativa do export client-side: evita Puppeteer no servidor (pesado no
free tier do Render). O encarte é um componente React estilizado em proporção
A4; html2canvas captura em alta resolução (scale: 3) e jsPDF embala em PDF.

---

## Modelo de dados

```js
// Product
{
  name: String,        // "Coca-Cola 2L"
  price: Number,       // 6.99
  unit: String,        // "un" | "kg" | "L" | "pct"
  category: String,    // "bebidas" | "hortifruti" | "padaria" | "acougue" | "mercearia"
  imageUrl: String,
  createdAt: Date
}

// Flyer (Encarte)
{
  title: String,           // "Ofertas da Semana"
  themeId: String,         // "ofertas-semana" | "hortifruti"
  validFrom: Date,
  validUntil: Date,
  storeName: String,
  items: [{
    product: ObjectId (ref Product),
    overridePrice: Number  // opcional: preço promocional só neste encarte
  }],
  createdAt: Date
}
```

Temas são definidos em código no frontend (arquivo `themes.js`), não no banco:
cores, fontes, imagem de fundo do cabeçalho, estilo dos cards de preço.

---

## API REST

```
GET    /api/products          lista (filtro ?category=)
POST   /api/products          cria
PUT    /api/products/:id      atualiza
DELETE /api/products/:id      remove
POST   /api/upload            upload de imagem (retorna URL)

GET    /api/flyers            lista encartes salvos
POST   /api/flyers            cria
GET    /api/flyers/:id        detalhe (popula produtos)
PUT    /api/flyers/:id        atualiza
DELETE /api/flyers/:id        remove
```

---

## Telas (MVP)

1. **Produtos** — tabela/cards com busca e filtro por categoria; modal de criar/editar
2. **Novo Encarte** — wizard em 3 passos: tema → produtos (com preço promocional) → dados (título, validade, nome do mercado)
3. **Preview/Export** — encarte renderizado em proporção A4 + botões "Baixar PDF" e "Baixar PNG"
4. **Meus Encartes** — lista dos encartes salvos, com reabrir/duplicar/excluir

---

## Roadmap por fases

### Fase 0 — Setup (1 sessão)
- Monorepo: `/client` (Vite) e `/server` (Express)
- Conexão MongoDB Atlas, variáveis de ambiente, CORS
- ✅ Critério: `GET /api/health` responde e o React mostra "conectado"

### Fase 1 — CRUD de produtos (1–2 sessões)
- Model, rotas, tela de produtos com criar/editar/excluir, upload de imagem
- ✅ Critério: cadastrar 10 produtos com foto e vê-los listados após reload

### Fase 2 — Montagem do encarte (2–3 sessões)
- Wizard, componente FlyerCanvas (A4) com tema aplicado, preview ao vivo
- ✅ Critério: montar encarte com 6 produtos e ver preview fiel ao tema

### Fase 3 — Export (1 sessão)
- html2canvas + jsPDF, alta resolução, nome de arquivo automático
- ✅ Critério: PDF baixado legível ao imprimir em A4

### Fase 4 — Deploy (1 sessão)
- Render + Atlas, README em inglês com GIF de demo e link ao vivo
- ✅ Critério: URL pública funcionando de ponta a ponta
- 🏁 **MVP completo → já pode entrar no CV**

### Fase 5+ — Diferenciais
Remoção de fundo (@imgly/background-removal), temas sazonais, 2 páginas,
textos com Claude API, compartilhamento social.

---

## Diretrizes de qualidade

- Commits pequenos e frequentes com mensagens convencionais (`feat:`, `fix:`)
- README final em **inglês** (portfólio internacional): demo GIF, live link,
  stack, decisões de arquitetura, roadmap
- Sem marcas reais (Coca-Cola, Heineken) em screenshots públicos — usar
  produtos genéricos
- Interface em português (público brasileiro); código e comentários em inglês
- Mobile-first: donos de mercado usam celular
