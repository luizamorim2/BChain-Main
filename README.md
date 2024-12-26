# Uma Blockchain Básica

Este projeto é uma implementação de uma blockchain simples, que permite a criação de transações, mineração de blocos, verificação da integridade da cadeia e sincronização entre múltiplos nós.

---

## Pré-Requisitos

Para executar o projeto, é necessário ter o [Node.js](https://nodejs.org/pt/download/package-manager) instalado.

Além disso, o projeto utiliza o MongoDB como banco de dados. Certifique-se de ter acesso a um cluster MongoDB e de configurar corretamente a conexão no código.

---

## Como Rodar o Projeto?

1. Clone este repositório:
   ```bash
   git clone https://github.com/luizamorim2/BChain.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

4. Configure o arquivo config.json corretamente

5. Execute o script utilizando:
   ```bash
   node index.js
   ```

---

## Funcionalidades

- **Criação de Transações:** Permite criar transações entre dois endereços com suporte a taxas.
- **Mineração de Blocos:** Agrupa as transações pendentes em um bloco, que é minerado e adicionado à blockchain.
- **Verificação da Integridade da Blockchain:** Garante que todos os blocos estão devidamente encadeados e não foram alterados.
- **Rastreamento de Saldos:** Mantém o saldo de cada endereço atualizado e verifica a validade das transações com base no saldo disponível.
- **Resolução de Conflitos (Forks):** Quando há diferentes versões da blockchain, o nó adota a cadeia mais longa válida.
- **Propagação de Blocos e Transações:** Simula a troca de informações entre nós conectados na rede.
- **Recompensas e Taxas de Transação:** Mineração de blocos inclui recompensas fixas e taxas acumuladas das transações do bloco.

---

## Explicação das Classes e Funções

### Transaction (classe)
Representa uma transação entre dois endereços.

- **Parâmetros:**
  - `fromAddress`: Endereço do remetente.
  - `toAddress`: Endereço do destinatário.
  - `amount`: Quantidade transferida.
  - `fee`: Taxa da transação.

### Block (classe)
Um bloco da blockchain que contém transações e um hash do bloco anterior.

- **Parâmetros:**
  - `timestamp`: O momento em que o bloco foi criado.
  - `transactions`: As transações dentro do bloco.
  - `previousHash`: O hash do bloco anterior.
  - `nonce`: Número ajustado até o hash atender à dificuldade do bloco.
  - `hash`: Hash único gerado para o bloco.

- **Funções:**
  - `generateHash()`: Gera um hash baseado no conteúdo do bloco.
  - `mineBlock(difficulty)`: Realiza a mineração ajustando o nonce até que o hash atenda à dificuldade especificada.

### Blockchain (classe)
Gerencia toda a cadeia de blocos e a interação com os nós conectados.

- **Funções Principais:**
  - `createGenesisBlock()`: Cria o primeiro bloco da blockchain.
  - `getLatestBlock()`: Retorna o bloco mais recente.
  - `minePendingTransactions(minerAddress)`: Minera um bloco com as transações pendentes e o adiciona à blockchain.
  - `addTransaction(transaction)`: Adiciona uma nova transação à lista de transações pendentes.
  - `isValidChain(chain)`: Verifica se todos os blocos na cadeia são válidos.
  - `updateBalances(transactions)`: Atualiza os saldos dos endereços com base nas transações do bloco.
  - `propagateBlock(block)`: Propaga um novo bloco para outros nós conectados.
  - `propagateTransaction(transaction)`: Propaga uma nova transação para outros nós conectados.
  - `resolveConflicts(newChain)`: Resolve conflitos de cadeia adotando a cadeia mais longa válida.

### Banco de Dados
- **Blocos, Transações e Saldos:**
  - Os dados são armazenados em um banco MongoDB.
  - Modelos são utilizados para persistência de blocos, transações e saldos de endereços.

---

## Contato
**Discord**: *luiz.amorim*  
**Twitter**: *@Amoriim_Luiz*  
**Email**: *rluiz4353@gmail.com*