# Cardápio Premium — atualização

## Publicar no seu Cloudflare

1. Faça uma cópia do projeto atual no GitHub antes de substituir os arquivos.
2. Substitua os arquivos do repositório pelos arquivos desta pasta, incluindo `public/assets/premium.css`, `public/_headers`, `public/sw.js` e `public/manifest.webmanifest`.
3. Preserve o seu `wrangler.toml` caso já tenha configurações diferentes. O vínculo D1 deste pacote foi mantido igual ao projeto enviado.
4. Publique pelo fluxo de deploy que você já utiliza no Cloudflare. Para deploy manual, execute `npm ci` e `npm run deploy`.
5. Abra o site com internet, aguarde a atualização do PWA e feche/reabra o aplicativo instalado. Se o navegador mantiver o visual antigo, atualize a página.

**Não execute `schema.sql`, comandos de criação/recriação do banco ou as migrações para esta atualização visual.** Não há alteração de tabelas nesta versão. Os dados existentes continuam no mesmo D1 quando o vínculo é preservado.

## O que mudou

- Apresentação premium com tons de café, tipografia editorial e destaque automático de um produto real do cardápio, incluindo foto quando cadastrada.
- Busca por nome/descrição, com acentos opcionais, combinada com categorias.
- Barra de pedido acessível no celular/tablet, quantidades com áreas de toque de 44 px, seleção destacada e navegação direta ao resumo.
- Carrinho preservado neste navegador, sem guardar credenciais administrativas; quantidades limitadas a 99 e itens removidos reconciliados ao carregar o cardápio.
- Envio com estado de carregamento e bloqueio de cliques simultâneos. Pedido só enviado após carregar o cardápio e com conexão.
- Tela administrativa com acabamento atualizado, formulários legíveis, abas com rolagem e tabelas com rolagem dentro do painel.
- Textos técnicos e credenciais de demonstração retirados da apresentação pública. O acesso existente foi preservado.
- Manifesto com identidade estável, ícones, atalhos e modo standalone. Cache renovado, incluindo o novo CSS.
- Após um primeiro acesso conectado, cardápio e aparência podem ser consultados sem internet. Envio, status de pedidos e administração exigem conexão. Pedidos não são enviados automaticamente depois.

## Personalizar para cada empreendedor

Na área administrativa, configure nome, slogan, logo, cores, categorias, produtos, preços e fotos. O produto em destaque vem do próprio cardápio. As mensagens da página continuam voltadas a café da manhã; adapte-as no HTML para outro segmento. O nome e os ícones de instalação do aplicativo estão em `public/manifest.webmanifest` e `public/icons/` e podem ser personalizados por estabelecimento.

O projeto original usa credenciais administrativas padrão no `wrangler.toml`. Antes de entregar a um cliente, configure `ADMIN_USER` e `ADMIN_PASSWORD` adequados no seu Cloudflare, preferencialmente como secrets, e remova os valores padrões do arquivo quando os secrets estiverem configurados. Esta atualização mantém a compatibilidade com o acesso atual.

## Validação e limites

Sintaxe do JavaScript, estrutura do HTML, manifesto, arquivos de cache e simulações de busca/carrinho/envio verificadas. Não foi realizado um deploy na conta Cloudflare nem uma compra/pedido no banco de produção. A confirmação visual em diferentes aparelhos e a instalação real do PWA devem ser feitas depois do deploy; não há garantia de funcionamento em 100% dos dispositivos.
