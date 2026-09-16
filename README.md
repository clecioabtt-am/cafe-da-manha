# Café da Manhã V11

## Banco D1
Use exatamente: `cafe-da-manha-db`

## Login administrativo
Usuário: `admin`
Senha: `admin123`

## Publicar
1. Crie o banco D1 `cafe-da-manha-db`.
2. Copie o `database_id`.
3. Substitua `COLE_AQUI_O_DATABASE_ID_DO_D1` em `wrangler.toml`.
4. Execute `schema.sql` no console do D1 ou:
   `npx wrangler d1 execute cafe-da-manha-db --remote --file=./schema.sql`
5. Rode `npm install`
6. Rode `npx wrangler login`
7. Rode `npm run deploy`

A V8 salva os pedidos no D1. Assim, pedidos feitos por clientes em outros celulares aparecem no painel administrativo.


## Novo na V10: gestão completa do cardápio
- Edite, insira ou remova itens no painel administrativo.
- Altere nome, descrição, preço, categoria, ícone e imagem de cada item.
- Crie, edite e remova categorias com imagem própria.
- Logo ampliada e bem visível no cabeçalho e no rodapé.
- Itens removidos são desativados para preservar o histórico dos pedidos.

## Painel público de pedidos
- Mostra os pedidos ativos do dia em ordem de chegada.
- Exibe apenas número do pedido, primeiro nome, horário e status.
- Atualiza automaticamente a cada 5 segundos.
- Pedidos concluídos permanecem visíveis por aproximadamente 10 minutos e depois saem da fila pública.
- Quando um cliente finaliza um pedido, o número recém-criado fica destacado no painel público.
- O painel administrativo continua com os dados completos e controle de status.

Não é necessário alterar o schema do D1 para esta atualização se você já executou o `schema.sql` da V8.


## V9 — atualização do banco existente
Antes do primeiro deploy desta versão em um banco já criado, execute **uma única vez** `migration_v9.sql` no console D1 ou rode `npm run db:migrate:v9`. A migração adiciona o número da mesa e a tabela de configurações usada para a logo personalizada.


## Atualização de banco da V10
Em um banco D1 que já existe, execute uma única vez `npm run db:migrate:v10` antes do deploy. Em uma instalação nova, execute `schema.sql`.

## Novo na V11
- Imagens dos itens ficam proporcionalmente contidas dentro do quadro, sem invadir textos e botões.
- Nova aba **Cores e textos** no painel administrativo.
- Personalização das cores principais, fundo, textos, destaques e botões.
- Edição do título e da frase ao lado da logo, incluindo suas cores.
- Esta atualização não exige nova migração depois da V10.

## Ajuste V11.1
- Toda imagem de item fica centralizada horizontal e verticalmente dentro do quadro.
- Toda imagem de categoria fica centralizada em uma área quadrada própria.
- A proporção original é preservada e nenhuma imagem pode ultrapassar seu quadro.

## Ajuste V11.2
- Todos os pedidos ativos aparecem na página principal, sem filtro incorreto por data UTC.
- Alterações de status no painel são refletidas imediatamente na página principal aberta pelo administrador.
- Outros dispositivos atualizam automaticamente a fila a cada 2 segundos.
- As APIs de pedidos usam cabeçalhos sem cache para sempre retornar o status atual do D1.

## Ajuste V11.3
- A fila pública possui barra de rolagem vertical própria para visualizar todos os pedidos.
- A rolagem funciona no computador e no celular sem aumentar excessivamente a página.

## Ajuste V11.4
- A página principal exibe exclusivamente pedidos com status **Novo**, **Em preparo** e **Pronto**.
- Ao marcar um pedido como **Concluído**, ele sai imediatamente da fila pública, mas permanece no painel e nos relatórios.

## Ajuste V11.5
- Painel administrativo adaptado para uso completo em celulares e tablets.
- Rolagem vertical do painel e rolagem horizontal das tabelas e abas.
- Formulários, listas, botões, relatórios e personalização reorganizados para telas pequenas.
- Área das imagens dos itens com fundo totalmente branco.
