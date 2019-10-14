import React from 'react'
import Blockies from 'react-blockies';

const ViewRequestPayments = props => {
    const { invoiceData, changeRoute, payInvoice } = props
    return(
        <div style={{ width: 400, minHeight: 400, backgroundColor:'rgba(211, 207, 217, 0.48)', color: 'black', alignContent: "center", alignItems:"center"}}>
        <div onClick={() => changeRoute(1)} class="float-left" style={{ margin: 10 }}>
        <p style={{fontSize:10}}><i class="arrow left"></i>Back to Home</p>
        </div>
        <h4 style={{ marginTop: 20, marginBottom: 0, color: 'black'}}>Invoice for Me</h4>
                {invoiceData.map((invoice) => (
                    <div style={{ backgroundColor: 'rgba(215, 215, 215, 0.8)', margin:10}}>
                        <p className="view-req-name">Send From</p>
                        <Blockies
                            seed={invoice.data.invoiceOwner}
                            size={14}
                            scale={3} 
                        />

                        <p className="view-req-name">Invoice ID</p>
                        <a href={`https://viewblock.io/arweave/tx/${invoice.data.transactionHash}`} target="_blank">
                            <p style={{ fontSize: 12 }}>{invoice.data.transactionHash}</p>
                        </a>
                        <p className="view-req-name">Description</p>
                        <p style={{ fontSize: 14 }}>{invoice.data.description}</p>

                        <p className="view-req-name">Amount</p>
                        <p style={{ fontSize: 14 }}>{invoice.data.value} AR</p>
                        
                        {(invoice.payments.length === 0) ? (
                            <a class="button" onClick={() => payInvoice(invoice.data.transactionHash, invoice.data.invoiceOwner,invoice.data.description,invoice.data.value)} >View Details</a>
                        ) : (
                            <div style={{backgroundColor:'rgba(140, 136, 166, 0.26)'}}>
                                <p style={{fontSize:12, padding:5}}>Payment:</p>
                                {invoice.payments.map(payment => (
                                    <div style={{padding:10}}>
                                        <a href={`https://viewblock.io/arweave/tx/${payment.transactionHash}`} target="_blank">
                                        <p style={{fontSize:12}}>{payment.transactionHash}</p>
                                        </a>
                                        <p style={{ fontSize: 14, color:'black'}}>{payment.valuePay} AR</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
        </div>
    )
}

export default ViewRequestPayments