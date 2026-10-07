# Talohama Marques — página profissional

Página pessoal e profissional de Talohama Marques, líder de produtos na plataforma de
cartões do Itaú Unibanco. Marca pessoal para assinatura de e-mail, LinkedIn, conversas de
mentoria e QR Code.

Página pessoal. Não é um canal oficial do Itaú Unibanco e não representa a instituição.

## Stack

HTML5, CSS3 e JavaScript vanilla, sem frameworks e sem etapa de build. CSS em BEM,
mobile-first, com variáveis centralizadas. Estrutura preparada para receber uma API
FastAPI + MySQL.

```
index.html
styles.css
script.js
assets/
  images/    foto e imagem de compartilhamento
  icons/     favicon e, futuramente, o QR Code
```

## Como rodar

Abrir o `index.html` no navegador já funciona. Para servir como em produção:

```bash
npx serve .
# ou
python -m http.server 8000
```

## Onde mexer

| O quê | Onde |
| --- | --- |
| Número do WhatsApp | `script.js`, constante `WHATSAPP_NUMERO`, primeira linha do arquivo |
| Mensagens pré-preenchidas dos CTAs | `script.js`, objeto `WHATSAPP_MENSAGENS` |
| Cores | `styles.css`, bloco `:root` |
| Tipografia | `styles.css`, `--font-serif` e `--font-sans` |
| Textos e trajetória | `index.html`, cada seção comentada |
| Foto | salvar como `assets/images/talohama.jpg` |

## Pendências de conteúdo real

Nada nesta página foi inventado. Os itens abaixo estão aguardando informação verdadeira e
não devem ser preenchidos por suposição.

- [ ] **WhatsApp** — enquanto `WHATSAPP_NUMERO` estiver como `SEU_NUMERO`, os botões avisam
      em vez de abrir um link quebrado. Formato esperado: `5511999999999`.
- [ ] **Foto** — sem o arquivo `assets/images/talohama.jpg`, o bloco de retrato some sozinho.
- [ ] **Terceira certificação** — o LinkedIn indica três; apenas duas estavam visíveis.
- [ ] **Pós em Gestão de Projetos e Graduação em Administração** — faltam instituição e período.
- [ ] **Planos pagos** — a estrutura de oferta (sessão pontual, 90 dias, 180 dias) está pronta
      e comentada em `index.html`, na seção Conversas. Descomentar apenas se houver serviço e
      valores reais.
- [ ] **Domínio e QR Code** — atualizar `canonical` e `og:url` no `index.html` e gerar o QR
      apontando para a URL definitiva.

## Backend (planejado)

O formulário valida no cliente e simula o envio. Os pontos de integração estão comentados
no `script.js`.

```
POST /api/feedbacks
{
  "nome": "",
  "linkedin": "",
  "tipo_interacao": "",
  "nota": 5,
  "depoimento": "",
  "autorizado_publicar": false
}

GET /api/feedbacks/publicados
```

## Deploy

Site estático, sem build. Serve em GitHub Pages, Netlify, Vercel ou Cloudflare Pages.

Para GitHub Pages: em *Settings → Pages*, selecionar a branch `main` e a pasta `/ (root)`.

## Acessibilidade

HTML semântico, labels reais nos campos, foco visível, navegação por teclado (menu fecha com
`Esc`, nota por estrelas responde às setas), `prefers-reduced-motion` respeitado e conteúdo
visível mesmo sem JavaScript.
