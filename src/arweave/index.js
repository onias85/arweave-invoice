import Arweave from 'arweave/web'
import { loadWallet } from '../helpers';
import { queryGetPaymentsByAddress, queryGetMainInvoicesByAddress, queryGetRequestInvoicesByAddress, queryGetInvoicesPayments } from './query';

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 80,           
    protocol: 'https',
    timeout: 80000,
    logging: false,
})

const newInvoiceTransaction = async(receiverInvoice, description, value, wallet) => new Promise(async (resolve, reject) => {
    try{
        const data = JSON.stringify({
            value, description
        })
        let transaction = await arweave.createTransaction({ data }, wallet)
        await transaction.addTag('App-name', 'arweave-invoice-request')
        await transaction.addTag('receiver-invoice', receiverInvoice)
        const address = await arweave.wallets.jwkToAddress(wallet)
        const winston =  await arweave.wallets.getBalance(address)
        console.log(typeof winston, winston)
        console.log(typeof transaction.reward, transaction.reward)
        if(parseInt(winston) < parseInt(transaction.reward)) {
            alert('No Ar Balance available for this transaction')
            reject({ msg: 'No Ar Balance available for this transaction' })
        }
        const fee = await arweave.ar.winstonToAr(transaction.reward)
        resolve({ transaction, fee })
    }catch(e){
        console.log(e)
        reject(e)
    }
})

const payInvoiceTransaction = async(invoiceTxHash, invoiceOwner,description,  value, wallet) => new Promise(async (resolve, reject) => {
    try{
        console.log(invoiceTxHash, invoiceOwner,  value, wallet)
        const winValue = await arweave.ar.arToWinston(value)
        let transaction = await arweave.createTransaction({ 
            target: invoiceOwner,
            quantity: winValue
        }, wallet)
        await transaction.addTag('App-name', 'arweave-invoice-pay')
        await transaction.addTag('invoice-id', invoiceTxHash)
        const address = await arweave.wallets.jwkToAddress(wallet)
        const winston =  await arweave.wallets.getBalance(address)
        if(parseInt(winston) < parseInt(transaction.reward)+parseInt(winValue)) {
            alert('No Ar Balance available for this transaction')
            reject({msg:'No Ar Balance available for this transaction'})
        }
        const fee = await arweave.ar.winstonToAr(transaction.reward)
        resolve({ transaction, fee, invoiceTxHash, value, invoiceOwner, description })
    }catch(e){
        console.log(e)
        reject(e)
    }
})

const signDeployTransaction = async(transaction, wallet) => new Promise(async(resolve, reject) => {
    try{
        await arweave.transactions.sign(transaction, wallet)
        const response = await arweave.transactions.post(transaction)
        console.log('TRANSACTION HASH' ,transaction.id)
        resolve({ status: true, transactionHash: transaction.id })
    }catch(e){
        console.log(e)
        reject(e)
    }
})

const loadArweaveAccount = async(wallet) => new Promise(async(resolve, reject) => {
    try{
        const walletString = await loadWallet(wallet)
        const arweaveWallet = JSON.parse(walletString)
        const address = await arweave.wallets.jwkToAddress(arweaveWallet)
        const userRequestPayments = await getRequestInvoicesByAddress(address)
        const userOwnerInvoices = await getMainInvoicesByAddress(address)
        const userPayments = await getPaymentsByAddress(address)
        const winston =  await arweave.wallets.getBalance(address)
        const ar = await arweave.ar.winstonToAr(winston)
        resolve({ wallet: arweaveWallet, address, winston, ar, userRequestPayments, userPayments, userOwnerInvoices  })
    }catch(e){
        console.log(e)
        reject(e)
    }
})

const getPaymentsByAddress = async(arweaveAddress) => new Promise(async(resolve, reject) => {
    try{
        const query = await queryGetPaymentsByAddress(arweaveAddress)
        const hashList = await arweave.arql(query)
        const result = await getResultQueryData(hashList)
        resolve(result)
    }catch(e){
        console.log(e)
        reject(e)
    }
})

const getPaymentsByInvoiceId = async(invoiceId) => new Promise(async(resolve, reject) => {
    try{
        const query = await queryGetInvoicesPayments(invoiceId)
        const hashList = await arweave.arql(query)
        const result = await getResultQueryData(hashList)
        resolve(result)
    }catch(e){
        console.log(e)
        reject(e)
    }
})

const getMainInvoicesByAddress = async(arweaveAddress) => new Promise(async(resolve, reject) => {
    try{
        const query = await queryGetMainInvoicesByAddress(arweaveAddress)
        const hashList = await arweave.arql(query)
        const result = await getResultMainInvoiceQueryData(hashList)
        resolve(result)
    }catch(e){
        console.log(e)
        reject(e)
    }
})

const getRequestInvoicesByAddress = async(arweaveAddress) => new Promise(async(resolve, reject) => {
    try{
        const query = await queryGetRequestInvoicesByAddress(arweaveAddress)
        const hashList = await arweave.arql(query)
        const result = await getResultMainInvoiceQueryData(hashList)
        resolve(result)
    }catch(e){
        console.log(e)
        reject(e)
    }
})

const getResultQueryData = async(resultQueryArrayTxHash) => new Promise(async(resolve, reject) => {
    try{
        let promiseList = []
        resultQueryArrayTxHash.map(txHash => promiseList.push(getTransactionData(txHash)))
        const result = await Promise.all(promiseList)
        resolve(result)
    }catch(e){
        console.log(e)
        reject(e)
    }
})

const getTransactionData = async (transactionHash) => {
    const transaction = await arweave.transactions.get(transactionHash)
    const tags =  await transaction.get('tags')
    const invoiceId = Buffer.from(tags[1].value, 'base64').toString('ascii')
    const invoiceOwner = await arweave.wallets.ownerToAddress(transaction.owner)
    const value = await arweave.ar.winstonToAr(transaction.quantity)
    return { transactionHash, invoiceId, invoiceOwner, valuePay: value }
}

const getResultMainInvoiceQueryData = async(resultQueryArrayTxHash) => new Promise(async(resolve, reject) => {
    try{
        let promiseList = []
        resultQueryArrayTxHash.map(txHash => promiseList.push(getMainInvoiceData(txHash)))
        const result = await Promise.all(promiseList)
        resolve(result)
    }catch(e){
        console.log(e)
        reject(e)
    }
})

const getMainInvoiceData = async (transactionHash) => {
    const transaction = await arweave.transactions.get(transactionHash)
    const response = await transaction.get('data', {decode: true, string: true})
    let tags =  await transaction.get('tags')
    let receiver = Buffer.from(tags[1].value, 'base64').toString('ascii')
    const invoiceOwner = await arweave.wallets.ownerToAddress(transaction.owner)
    const { value, description  } = JSON.parse(response)
    return { value, description, transactionHash, receiver, invoiceOwner }
}



 
export{
    arweave,
    newInvoiceTransaction,
    payInvoiceTransaction,
    signDeployTransaction,
    loadArweaveAccount,
    getResultMainInvoiceQueryData,
    getPaymentsByInvoiceId
}

