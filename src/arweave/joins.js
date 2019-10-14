import { getPaymentsByInvoiceId } from ".";

const joinUserPayments_RequestInvoices = async(userPayments, requestInvoices) => {
    try{
        let resultArray = []
        for (const request of requestInvoices){
            const filterResult = userPayments.filter(payment => payment.invoiceId === request.transactionHash)
            const y = {
                data: request,
                payments: filterResult
            }
            resultArray.push(y)
        }
        return resultArray
    }catch(e){
        console.log(e)
    }
}

const joinUserInvoices_InvoicePayments = async(userInvoices) => {
    try{
        let resultArray = []
        for (const invoice of userInvoices){
            const payments = await getPaymentsByInvoiceId(invoice.transactionHash)
            const y = {
                data: invoice,
                payments
            }
            resultArray.push(y)
        }
        return resultArray
    }catch(e){
        console.log(e)
    
}
}
export{
    joinUserPayments_RequestInvoices,
    joinUserInvoices_InvoicePayments
}