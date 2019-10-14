const queryGetPaymentsByAddress = (address) => { 
    const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'from',
            expr2: address
        },
        expr2: {
            op: 'equals',
            expr1: 'App-name',
            expr2: 'arweave-invoice-pay'
        }    
    }
    return query 
}


const queryGetMainInvoicesByAddress = (address) => { 
    const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'from',
            expr2: address
        },
        expr2: {
            op: 'equals',
            expr1: 'App-name',
            expr2: 'arweave-invoice-request'
        }     
    }
    return query
}

const queryGetRequestInvoicesByAddress = (address) => { 
    const query =  {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'App-name',
            expr2: 'arweave-invoice-request'
        },
        expr2: {
            op: 'equals',
            expr1: 'receiver-invoice',
            expr2: address
        }     
    }
    return query
}

const queryGetInvoicesPayments = (idInvoice) => { 
    const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'invoice-id',
            expr2: idInvoice
        },
        expr2: {
            op: 'equals',
            expr1: 'App-name',
            expr2: 'arweave-invoice-pay'
        }         
    }
    return query
}

export{
    queryGetPaymentsByAddress,
    queryGetMainInvoicesByAddress,
    queryGetRequestInvoicesByAddress,
    queryGetInvoicesPayments
}