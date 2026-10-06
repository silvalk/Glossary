# Technology Glossary · Lar Donato Flores

Glossário de tecnologia — termos em inglês, explicações em português.
Site estático (HTML, CSS e JavaScript puro), sem build, sem dependências,
sem servidor obrigatório.

## Estrutura do projeto

```
technology-glossary/
├── index.html      → glossário público
├── admin.html      → área administrativa (login + CRUD)
├── style.css        → estilos base (compartilhado pelas duas páginas)
├── admin.css        → estilos exclusivos da área administrativa
├── data.js           → termos iniciais, categorias, ícones e funções de localStorage
├── script.js         → lógica do glossário público
├── admin.js          → lógica da área administrativa
└── assets/
    └── logo.svg      → marca (logo) exibida no cabeçalho, rodapé e tela de login
```

## Trocando a logo

A marca que aparece ao lado de "Lar Donato Flores" no cabeçalho, no
rodapé e na tela de login do admin é uma imagem, não mais desenhada em
CSS. Para usar a logo real:

1. Substitua o arquivo `assets/logo.svg` pela sua imagem (pode ser
   `.svg`, `.png` ou `.jpg`).
2. Se o novo arquivo tiver outro nome ou extensão, atualize o atributo
   `src` nas 4 tags `<img src="assets/logo.svg" ...>`:
   - `index.html` (cabeçalho e rodapé)
   - `admin.html` (tela de login)
   - `script.js` (aparece no estado "nenhum termo encontrado")
3. O contêiner (`.petal-mark`, em `style.css`) é um círculo de 22px que
   recorta a imagem com `object-fit: cover` — uma imagem quadrada ou já
   circular funciona melhor.

## Como rodar no VS Code

1. Extraia o `.zip` e abra a pasta `technology-glossary` no VS Code
   (**File → Open Folder...**).
2. Instale a extensão **Live Server** (de Ritwick Dey), se ainda não tiver —
   procure por "Live Server" na aba de Extensions (`Ctrl+Shift+X` /
   `Cmd+Shift+X`).
3. Clique com o botão direito em `index.html` e escolha
   **"Open with Live Server"**. O navegador abrirá em algo como
   `http://127.0.0.1:5500/index.html`.

   > Alternativa sem extensão: dê duplo clique em `index.html` para abrir
   > direto no navegador (`file://...`). Quase tudo funciona igual — a
   > única diferença é que alguns navegadores são mais restritivos com
   > `file://`, então o Live Server é o caminho mais garantido.

4. Para acessar a área administrativa, clique em **"Admin"** no canto
   superior direito do glossário, ou abra `admin.html` diretamente.

## Login da área administrativa

```
Username: admin
Password: admin123
```

(Autenticação simples feita em JavaScript, apenas para fins de
demonstração — não há backend nem verificação real de segurança.)

## Funcionalidades

- **Busca** — pesquisa os termos em inglês em tempo real.
- **Categorias** — cada termo pertence a uma categoria (Programação,
  Web & Internet, AI & Data, Hardware, Security, Software & Systems),
  com ícone e cor própria. Use as pílulas abaixo da busca para filtrar.
- **Pronúncia** — clique no ícone de alto-falante no card ou no modal
  para ouvir o termo em inglês (usa a Web Speech API do navegador —
  funciona melhor no Chrome e no Edge).
- **Modo escuro** — botão no canto superior direito; a preferência fica
  salva.
- **Admin** — adicionar, editar e excluir termos (com confirmação antes
  de excluir). Tudo é salvo no `localStorage` do navegador, então os
  dados persistem entre sessões, mas ficam apenas naquele navegador/
  computador.

## Observações técnicas

- Os dados ficam em `localStorage`, sob a chave `techGlossaryTerms`.
  Se quiser resetar tudo para os 40 termos originais, abra o Console do
  navegador (F12) e rode:
  ```js
  localStorage.removeItem('techGlossaryTerms');
  location.reload();
  ```
- A pronúncia depende de suporte à `speechSynthesis` no navegador —
  presente em praticamente todos os navegadores modernos, mas a
  qualidade da voz em inglês varia por sistema operacional.
- As fontes (Fraunces, Inter, JetBrains Mono) vêm do Google Fonts via
  `@import` no `style.css`, então é necessário estar conectado à
  internet para carregá-las corretamente (o site funciona offline
  mesmo assim, só usa a fonte padrão do sistema como alternativa).
