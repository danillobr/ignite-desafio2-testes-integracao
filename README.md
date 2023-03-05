<p align="center">
  <img src=".github/capa-ignite-nodejs.png" alt="Ignite Node.js">
</p>

<br>

<h1 align="center">
  Desafio 2: testes de integração
</h1>

<br>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

## :computer: Descrição:
Neste projeto foram desenvolvidos os testes de integração da FinAPI, uma abstração de uma aplicação financeira.

## :hammer_and_wrench: Funcionalidades:
- Criar um usuário com `name`, `email` e `password`;
- Autenticar um usuário a partir do `email` e `password` por meio de um `token` JWT;
- Listar informações de um usuário usando um `token`;
- Apresentar o saldo da conta de um usuário por meio de um `token`;
- Depositar um determinado valor em uma conta usando um `token`;
- Sacar um determinado valor em uma conta através de um `token`;
- Listar informações de uma determinada operação realizada utilizando um `token`.

## :memo: Execução do projeto:
- Instalação e execução do container do banco de dados:
  > docker-compose up
- Instalação das depêndencias do projeto:
  > yarn
- Execução dos testes:
  > yarn test
