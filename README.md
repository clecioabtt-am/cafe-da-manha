# Café da Manhã V8

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


## Novo na atualização: painel público de pedidos
- Mostra os pedidos ativos do dia em ordem de chegada.
- Exibe apenas número do pedido, primeiro nome, horário e status.
- Atualiza automaticamente a cada 5 segundos.
- Pedidos concluídos permanecem visíveis por aproximadamente 10 minutos e depois saem da fila pública.
- Quando um cliente finaliza um pedido, o número recém-criado fica destacado no painel público.
- O painel administrativo continua com os dados completos e controle de status.

Não é necessário alterar o schema do D1 para esta atualização se você já executou o `schema.sql` da V8.


## V9 — atualização do banco existente
Antes do primeiro deploy desta versão em um banco já criado, execute **uma única vez** `migration_v9.sql` no console D1 ou rode `npm run db:migrate:v9`. A migração adiciona o número da mesa e a tabela de configurações usada para a logo personalizada.
