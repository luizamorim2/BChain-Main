// Simulação de Comunicação e Forks em Blockchain
const crypto = require('crypto');
const mongoose = require('mongoose');

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://luizdb:luizdb@cluster0.dqelm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Schemas e Models
const BlockSchema = new mongoose.Schema({
    timestamp: String,
    transactions: Array,
    previousHash: String,
    hash: String,
    nonce: Number
});

const TransactionSchema = new mongoose.Schema({
    fromAddress: String,
    toAddress: String,
    amount: Number,
    fee: Number
});

const BalanceSchema = new mongoose.Schema({
    address: String,
    balance: Number
});

const BlockModel = mongoose.model('Block', BlockSchema);
const TransactionModel = mongoose.model('Transaction', TransactionSchema);
const BalanceModel = mongoose.model('Balance', BalanceSchema);

class Transaction {
    constructor(fromAddress, toAddress, amount, fee = 0) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.fee = fee;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = new Date(timestamp).toLocaleString();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.generateHash();
    }

    generateHash() {
        return crypto.createHash('sha256')
            .update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
            .digest('hex');
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.generateHash();
        }
        console.log(`Bloco minerado: ${this.hash}`);
    }
}

class Blockchain {
    constructor(difficulty = 2, miningReward = 50) {
        this.chain = [];
        this.pendingTransactions = [];
        this.difficulty = difficulty;
        this.miningReward = miningReward;
        this.peers = []; // Simulação de nós conectados
    }

    async initializeChain() {
        const blocks = await BlockModel.find();
        if (blocks.length > 0) {
            this.chain = blocks;
        } else {
            const genesisBlock = this.createGenesisBlock();
            await this.saveBlock(genesisBlock);
            this.chain.push(genesisBlock);
        }
    }

    createGenesisBlock() {
        return new Block(Date.now(), [], '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    async minePendingTransactions(minerAddress) {
        const totalFees = this.pendingTransactions.reduce((sum, tx) => sum + tx.fee, 0);
        const rewardTx = new Transaction(null, minerAddress, this.miningReward + totalFees);
        this.pendingTransactions.push(rewardTx);

        const newBlock = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);

        await this.saveBlock(newBlock);
        await this.updateBalances(newBlock.transactions);
        this.pendingTransactions = [];

        console.log('Bloco minerado com sucesso! Propagando para outros nós.');
        this.propagateBlock(newBlock);
    }

    async addTransaction(transaction) {
        const balanceRecord = await BalanceModel.findOne({ address: transaction.fromAddress });
        const senderBalance = balanceRecord ? balanceRecord.balance : 0;

        console.log(`Saldo atual do remetente (${transaction.fromAddress}): ${senderBalance}`);
        console.log(`Tentativa de transação: ${transaction.amount + transaction.fee}`);

        if (!await this.isTransactionValid(transaction)) {
            throw new Error('Transação inválida: saldo insuficiente.');
        }

        this.pendingTransactions.push(transaction);
        await this.saveTransaction(transaction);
        console.log('Transação adicionada e propagada para outros nós.');
        this.propagateTransaction(transaction);
    }

    async updateBalances(transactions) {
        for (const tx of transactions) {
            if (tx.fromAddress !== null) {
                await this.updateBalance(tx.fromAddress, -(tx.amount + tx.fee));
            }
            await this.updateBalance(tx.toAddress, tx.amount);
        }
    }

    async updateBalance(address, amount) {
        const balanceRecord = await BalanceModel.findOne({ address });
        if (balanceRecord) {
            balanceRecord.balance += amount;
            await balanceRecord.save();
        } else {
            await new BalanceModel({ address, balance: amount }).save();
        }
    }

    async isTransactionValid(transaction) {
        if (transaction.fromAddress === null) return true; // Mining reward
        const balanceRecord = await BalanceModel.findOne({ address: transaction.fromAddress });
        const senderBalance = balanceRecord ? balanceRecord.balance : 0;
        return senderBalance >= (transaction.amount + transaction.fee);
    }

    async saveBlock(block) {
        const newBlock = new BlockModel(block);
        await newBlock.save();
    }

    async saveTransaction(transaction) {
        const newTransaction = new TransactionModel(transaction);
        await newTransaction.save();
    }

    propagateBlock(block) {
        for (const peer of this.peers) {
            peer.receiveBlock(block);
        }
    }

    propagateTransaction(transaction) {
        for (const peer of this.peers) {
            peer.receiveTransaction(transaction);
        }
    }

    receiveBlock(block) {
        console.log('Bloco recebido de outro nó:', block.hash);
        const newChain = [...this.chain, block];
        this.resolveConflicts(newChain);
    }

    receiveTransaction(transaction) {
        console.log('Transação recebida de outro nó:', transaction);
        this.pendingTransactions.push(transaction);
    }

    async resolveConflicts(newChain) {
        if (newChain.length > this.chain.length && this.isValidChain(newChain)) {
            this.chain = newChain;
            console.log('Conflito resolvido: cadeia substituída.');
        } else {
            console.log('Conflito resolvido: cadeia mantida.');
        }
    }

    isValidChain(chain) {
        for (let i = 1; i < chain.length; i++) {
            const currentBlockData = chain[i];
            const previousBlockData = chain[i - 1];
    
            // Reconstruir os blocos como instâncias da classe Block
            const currentBlock = new Block(
                currentBlockData.timestamp,
                currentBlockData.transactions,
                currentBlockData.previousHash
            );
            currentBlock.nonce = currentBlockData.nonce; // Preserva o nonce do bloco
            currentBlock.hash = currentBlockData.hash; // Preserva o hash original
    
            const previousBlock = new Block(
                previousBlockData.timestamp,
                previousBlockData.transactions,
                previousBlockData.previousHash
            );
            previousBlock.nonce = previousBlockData.nonce;
            previousBlock.hash = previousBlockData.hash;
    
            // Validar o bloco atual
            if (currentBlock.hash !== currentBlock.generateHash()) {
                return false;
            }
    
            // Verificar se os hashes anteriores coincidem
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
    

    addPeer(peer) {
        this.peers.push(peer);
    }
}

// Simulação de uso com dois nós
(async () => {
    const node1 = new Blockchain(3, 100);
    const node2 = new Blockchain(3, 100);

    node1.addPeer(node2);
    node2.addPeer(node1);

    await node1.initializeChain();
    await node2.initializeChain();

    // Inicializar saldo para teste
    await BalanceModel.updateOne(
        { address: "0x0001" },
        { $set: { balance: 100 } },
        { upsert: true }
    );

    console.log('Adicionando transação no nó 1.');
    await node1.addTransaction(new Transaction('0x0001', '0x0002', 50, 2));

    console.log('Minerando no nó 1.');
    await node1.minePendingTransactions('miner1');

    console.log('Estado do nó 2 após propagação:');
    console.log(node2.chain);
})();
