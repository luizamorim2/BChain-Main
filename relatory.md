# Relatório de Implementação: Simulação de Blockchain

## Funcionalidades Implementadas

### 1. Conexão com o Banco de Dados (MongoDB)
- **Objetivo**: Salvar blocos, transações e saldos de forma persistente.
- **Como foi feito**: Utilizamos a biblioteca `mongoose` para conectar ao MongoDB e criamos schemas para os dados.

### 2. Modelos de Dados
- **Objetivo**: Estruturar os dados da blockchain.
- **Como foi feito**: Criamos os seguintes modelos:
  - `Block`: Representa os blocos.
  - `Transaction`: Define as transações.
  - `Balance`: Gerencia os saldos.

### 3. Classe Block
- **Objetivo**: Criar e minerar blocos.
- **Como foi feito**:
  - Hash gerado com SHA-256.
  - Mineração baseada na dificuldade configurada.

### 4. Classe Blockchain
#### 4.1 Inicialização da Cadeia
- **Objetivo**: Configurar a blockchain com o bloco gênesis ou carregar blocos existentes.
- **Como foi feito**: Consultamos o banco de dados e inicializamos a cadeia.

#### 4.2 Mineração de Transações Pendentes
- **Objetivo**: Criar novos blocos com as transações pendentes.
- **Como foi feito**: Um novo bloco é criado, minerado e salvo no banco de dados.

#### 4.3 Validação de Transações
- **Objetivo**: Garantir que o remetente tem saldo suficiente.
- **Como foi feito**: Verificamos o saldo no banco antes de adicionar a transação.

#### 4.4 Atualização de Saldos
- **Objetivo**: Atualizar os saldos após a mineração.
- **Como foi feito**: Incrementamos ou decrementamos os saldos no banco.

#### 4.5 Propagação de Dados
- **Objetivo**: Sincronizar blocos e transações entre os nós.
- **Como foi feito**: Dados são enviados para os nós conectados.

#### 4.6 Resolução de Conflitos
- **Objetivo**: Resolver forks na blockchain.
- **Como foi feito**: A cadeia mais longa e válida é adotada.

### 5. Simulação de Nós
- **Objetivo**: Testar a comunicação entre dois nós.
- **Como foi feito**: Dois nós foram criados e conectados para compartilhar blocos e transações.

### 6. Execução do Sistema
- **Etapas realizadas**:
  1. Inicialização da cadeia.
  2. Adição de transações.
  3. Mineração de blocos.
  4. Propagação entre os nós.
