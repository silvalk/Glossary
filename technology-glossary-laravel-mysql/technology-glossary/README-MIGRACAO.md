# Technology Glossary · Lar Donato Flores — Migração para Laravel + MySQL

## Execução local nesta pasta

A estrutura Laravel já está incluída em `backend/`. As instruções de
migração abaixo descrevem a montagem original.

Com o MySQL do XAMPP iniciado e o banco `technology_glossary` configurado,
execute em um terminal:

```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8001
```

Em outro terminal, na pasta `technology-glossary`:

```bash
python -m http.server 5500 --bind 127.0.0.1
```

Acesse `http://127.0.0.1:5500`. A API está configurada em
`http://127.0.0.1:8001/api`. Login do admin: `admin` / `admin123`.

## 1. Estrutura original (antes da migração)

```
technology-glossary/
├── index.html   → glossário público
├── admin.html   → login (demo) + CRUD
├── style.css / admin.css   → visual (não tocado)
├── data.js      → termos/categorias fixos + funções de localStorage
├── script.js    → lógica do glossário público
├── admin.js     → lógica da área administrativa
└── assets/laricon.png
```

**Onde tudo estava:**
- Termos: array `INITIAL_TERMS` em `data.js`, copiado para `localStorage`
  (`techGlossaryTerms`) no primeiro acesso.
- Categorias: array fixo `CATEGORIES` em `data.js` (6 categorias:
  programming, web, ai, hardware, security, systems).
- Onde o front-end lia os termos: `loadTerms()` (em `data.js`), chamado no
  topo de `script.js` e `admin.js`.
- Pesquisa: `script.js` → `applyFilters()`, filtrando em memória por
  `t.term.toLowerCase().includes(q)` (só no campo `term`, não na
  explicação).
- Admin adiciona/edita/exclui: `admin.js`, mutando o array `terms` em
  memória e chamando `saveTerms(terms)` (grava tudo de novo no
  `localStorage`).
- Outros usos de `localStorage`: tema claro/escuro (`techGlossaryTheme`) e
  sessão de login do admin, via `sessionStorage`
  (`techGlossaryAdminSession`) — **nenhum dos dois guarda termos**, por
  isso continuam exatamente como estavam.

## 2. O que mudou

```
technology-glossary/
├── index.html / admin.html   → inalterados, exceto 1 linha nova em
│                                admin.html (um <p id="formError">, que
│                                reaproveita o CSS que já existia para o
│                                erro de login — para mostrar erros da API
│                                no formulário de termo)
├── style.css / admin.css     → intocados
├── data.js                   → reescrito: continua com ICONS/iconSVG/
│                                speakTerm/tema, mas troca loadTerms/
│                                saveTerms/nextId (localStorage) por um
│                                cliente da API Laravel
├── script.js                 → loadTerms() síncrono virou um init()
│                                assíncrono que busca categorias e termos
│                                na API; resto do arquivo é igual
├── admin.js                  → mesma ideia: populateCategorySelect(),
│                                renderList() e o CRUD agora chamam a API
│                                em vez de mutar o array em memória
└── backend/                  → NOVO — projeto Laravel (API + MySQL)
    ├── app/Models/{Category,Term}.php
    ├── app/Http/Controllers/Api/{CategoryController,TermController}.php
    ├── app/Http/Requests/StoreTermRequest.php
    ├── app/Http/Resources/{CategoryResource,TermResource}.php
    ├── database/migrations/..._create_categories_table.php
    ├── database/migrations/..._create_terms_table.php
    ├── database/seeders/{CategorySeeder,TermSeeder,DatabaseSeeder}.php
    ├── routes/api.php
    ├── config/cors.php
    └── .env.example
```

### Detalhe importante: o formato dos dados não mudou

A API foi desenhada para devolver **exatamente o mesmo formato** que já
existia nos arrays fixos, então `script.js`/`admin.js` não precisaram
mudar a forma como leem os dados:

- `GET /api/categories` devolve `{ id, label, icon }` — `id` aqui é o
  **slug** (`"programming"`, `"web"`...), igual ao antigo item de
  `CATEGORIES`.
- `GET /api/terms` devolve `{ id, term, category, explanation }` —
  `category` é o slug (string), igual ao antigo item de `INITIAL_TERMS`.

Por isso `getCategory(id)`, `t.category === activeCategory`,
`item.category`, etc. continuam funcionando sem alteração nenhuma — só a
origem dos dados que passou de "array fixo" para "resposta da API".

## 3. Banco de dados

**`categories`**: `id`, `slug` (único, ex. `"programming"`), `label`,
`icon`, timestamps.

**`terms`**: `id`, `term`, `explanation`, `category_id` (FK →
`categories.id`, `onDelete('restrict')`), timestamps.

Relação: `categories` 1:N `terms`.

## 4. Como configurar

### 4.1. Criar o projeto Laravel e copiar os arquivos

```bash
composer create-project laravel/laravel glossario-backend
cd glossario-backend
php artisan install:api   # cria routes/api.php, caso ainda não exista
```

Copie o conteúdo de `backend/` para dentro do `glossario-backend`,
substituindo os arquivos equivalentes (`app/Models`, `app/Http/...`,
`database/migrations`, `database/seeders`, `routes/api.php`,
`config/cors.php`).

### 4.2. Banco MySQL

```sql
CREATE DATABASE technology_glossary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4.3. `.env`

```bash
cp backend/.env.example .env
php artisan key:generate
```

Edite o `.env` e preencha `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` com
os dados reais do seu MySQL (nunca deixe a senha no código-fonte).

### 4.4. Migrations + seed

```bash
php artisan migrate
php artisan db:seed
```

Isso cria as 6 categorias e os 40 termos que já existiam em `data.js`
(`updateOrCreate`, então rodar de novo não duplica nada).

### 4.5. Subir a API

```bash
php artisan serve
```

Sobe em `http://localhost:8000` por padrão. Se usar outra porta/host,
ajuste `API_BASE_URL` no topo de `data.js`.

### 4.6. Abrir o front-end

Continua sendo HTML/CSS/JS estático. Abra com o Live Server do VS Code
(como o `README.md` original já orientava) ou:

```bash
cd technology-glossary
python3 -m http.server 5500
```

Acesse `http://127.0.0.1:5500`. Com a API rodando e o `config/cors.php`
liberando `api/*`, tudo se conecta normalmente.

## 5. Como testar

- **Glossário público** (`index.html`): os termos e as categorias devem
  carregar da API ao abrir a página (peça pra ver a aba Network do
  DevTools: deve aparecer `GET /api/categories` e `GET /api/terms`).
  Pesquise por `java` → deve aparecer "JavaScript". Clique numa
  categoria → filtra igual a antes.
- **Admin** (`admin.html`, login `admin` / `admin123`): "+ Add New Term"
  → salva via `POST /api/terms`; "Edit" → `PUT /api/terms/{id}`;
  "Delete" → `DELETE /api/terms/{id}`. Qualquer erro (ex.: termo
  duplicado) aparece agora no formulário, no lugar onde antes não havia
  nenhuma validação além do `required` do navegador.
- Direto pela API:
  ```bash
  curl http://localhost:8000/api/terms
  curl http://localhost:8000/api/categories
  curl -X POST http://localhost:8000/api/terms \
    -H "Content-Type: application/json" \
    -d '{"term":"Cybersecurity","category":"security","explanation":"..."}'
  ```

## 6. `localStorage`: o que ainda depende dele?

Só o tema claro/escuro (`techGlossaryTheme`) e a sessão de login do admin
(`sessionStorage`, `techGlossaryAdminSession`) — nenhum dos dois é termo
ou categoria. Nenhuma palavra do glossário é mais salva no navegador; o
MySQL é a única fonte de dados.

## 7. Segurança

- A senha do MySQL só fica no `.env` (fora do controle de versão).
- **O login do admin continua sendo só uma checagem no navegador**
  (`admin === "admin" && pass === "admin123"`, guardado em
  `sessionStorage`) — isso nunca protegeu de verdade um backend, e agora
  que existe uma API real, isso significa que **qualquer pessoa pode
  chamar `POST/PUT/DELETE /api/terms` diretamente, sem passar pela tela
  de login**. Não implementei autenticação de verdade agora porque isso
  não foi pedido e seria um sistema grande demais para "só trocar o
  banco" — mas o próximo passo recomendado é:
  1. `php artisan install:api` já deixa o Sanctum pronto para uso.
  2. Criar um usuário admin de verdade na tabela `users` do Laravel e uma
     tela de login que chama `POST /api/login` (Sanctum) em vez de
     comparar strings no navegador.
  3. Proteger as rotas de escrita em `routes/api.php` com
     `->middleware('auth:sanctum')` nos verbos `POST`, `PUT`, `PATCH` e
     `DELETE` de `/terms` (o `GET`, de leitura, pode continuar público).
  4. Guardar o token do Sanctum em `sessionStorage` e enviá-lo no header
     `Authorization: Bearer ...` nas chamadas de `data.js`.
  Enquanto isso não for feito, trate a API como **não seguramente
  protegida** se for publicá-la na internet.

## 8. Arquivos criados vs. modificados

**Criados:** toda a pasta `backend/` (migrations, models, controllers,
requests, resources, rotas, seeders, `cors.php`, `.env.example`), este
`README-MIGRACAO.md`.

**Modificados:** `data.js` (reescrito — mantém ícones/tema/pronúncia,
troca localStorage por cliente de API), `script.js` e `admin.js` (viram
assíncronos onde precisam ler/gravar termos, resto idêntico),
`admin.html` (1 linha nova: `<p id="formError">`).

## 9. Atualização: campo de tradução (translation)

Depois da primeira entrega, foi adicionado um campo novo: a **tradução em
português da palavra** (ex.: "Browser" → "Navegador"), exibida logo
abaixo do termo em inglês nos cards, no modal de detalhes e no
admin — exatamente como pedido.

**Backend:**
- Nova migration `2024_01_01_000003_add_translation_to_terms_table.php`
  adiciona a coluna `translation` (string, 150) em `terms`.
- `Term::$fillable`, `TermResource` e `StoreTermRequest` passaram a
  incluir/validar `translation` (campo obrigatório).
- `TermSeeder` atualizado com a tradução de cada um dos 40 termos.

**Frontend:**
- `data.js`: `createTerm`/`updateTermApi` agora enviam `translation`.
- `script.js`: cada card e o modal mostram `item.translation` logo
  abaixo do termo (nova linha `<p class="term-translation">`).
- `admin.html`/`admin.js`: novo campo "Portuguese Translation" no
  formulário (logo abaixo de "Technology Term"), e a tradução também
  aparece na listagem do admin.
- `style.css`: uma única classe nova, `.term-translation`, reaproveitando
  as cores (`--rose-dark`/`--text-muted`) e fontes já existentes — nada
  no layout geral foi alterado.

Se você já tinha rodado `php artisan migrate` antes dessa atualização,
basta rodar de novo:

```bash
php artisan migrate   # aplica só a migration nova (translation)
php artisan db:seed   # atualiza os termos existentes com a tradução
```

(o `TermSeeder` usa `updateOrCreate`, então isso não duplica nada — só
preenche a tradução dos termos que já existiam).
