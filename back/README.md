# TaskHubBackend
Backend para a aplicação TaskHub, desenvolvido como atividade para entrevista de emprego.

Autor: Juca Duarte
Email: jucaduarte@msn.com

## Requisitos

- Node.js >= 18
- npm >= 8

## Instalação

1. Clone o repositório:
git clone https://github.com/jucaduarte/TaskHubBackend.git cd TaskHubBackend
 
2. Instale as dependências: 
npm install

## Execução

Para iniciar o seed do banco de dados (opcional):
npm run seed

Para iniciar o servidor em modo produção: 
npm start ou node index.js

O backend será iniciado em `http://localhost:5000`.

## Estrutura do Projeto

- `index.js`: Ponto de entrada da aplicação.
- `routes/`: Rotas da API.
- `controllers/`: Lógica dos endpoints.
- `models/`: Modelos Sequelize.
- `middleware/`: Middlewares de autenticação e tratamento de erros.
- `utils/`: Utilitários auxiliares.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para construção de APIs REST.
- **Sequelize**: ORM para modelagem e manipulação do banco de dados.
- **SQLite**: Banco de dados relacional leve, utilizado localmente.
- **bcryptjs**: Hash e verificação de senhas.
- **jsonwebtoken**: Geração e validação de tokens JWT para autenticação.
- **cors**: Middleware para habilitar CORS.
- **Jest**: Framework de testes automatizados.
- **Supertest**: Testes de integração para endpoints HTTP.

## Testando a API com Postman

1. **Importe a coleção:**
   - Crie uma nova coleção no Postman chamada `TaskHubBackend`.
   - Adicione as requisições conforme as rotas disponíveis no backend (exemplo: `/api/users`, `/api/tasks`, `/api/auth/login`).

2. **Configuração de variáveis:**
   - Configure uma variável de ambiente chamada `base_url` com valor `http://localhost:5000`.

3. **Autenticação:**
   - Após realizar login, salve o token JWT retornado.
   - Nas requisições autenticadas, adicione o header:
     ```
     Authorization: Bearer {{jwt_token}}
     ```
   - Você pode criar uma variável `jwt_token` no ambiente do Postman para facilitar o uso.

4. **Exemplo de requisições:**
   - **Criar usuário:** `POST {{base_url}}/api/users`
   - **Login:** `POST {{base_url}}/api/auth/login`
   - **Listar tarefas:** `GET {{base_url}}/api/tasks` (requer autenticação)

## Testes
Para rodar os testes automatizados, utilize o comando: npm test
IMPORTANTE: 
 1. Certifique-se de que o servidor não está em execução ao rodar os testes, pois eles utilizam um banco de dados separado para evitar conflitos.
 2. Certifque-se de que todas as dependências de desenvolvimento estão instaladas corretamente.
 3. O banco de dados precisa de dados inicializados para alguns testes, então verifique se o script de seed foi executado: npm run seed

## Observações

- O banco de dados utilizado é SQLite, armazenado localmente.
- Para redefinir o banco, exclua o arquivo `.sqlite` gerado e reinicie o servidor.


---