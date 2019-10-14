import React from 'react';
import Blockies from 'react-blockies';

const ConfirmPayInvoice = props => {
    const { confirmPayment, invoiceData, cancelPay } = props
    const { invoiceTxHash, invoiceOwner, value, fee, description } =  invoiceData
    return(
            <div>
                <div style={{ backgroundColor: 'rgba(52, 52, 113, 0.39)', padding: 10}}>
                    <p style={{ fontSize:22 }}>Invoice Payment</p>
                    <label style={{fontSize:12, margin:0}}>Invoice send from</label>
                    <Blockies
                            seed={invoiceOwner}
                            size={14}
                            scale={3} 
                        />
                    <h6 className="hash-text" style={{fontSize:12}}>{invoiceOwner}</h6>
                </div>
                <label className="form-name"  style={{marginTop: 5}}>Invoice ID</label>
                <a href={`https://viewblock.io/arweave/tx/${invoiceTxHash}`} target="_blank">
                    <h6 className="hash-text">{invoiceTxHash}</h6>
                </a>
                <label className="form-name"  style={{marginTop: 15}}>Description</label>
                <h6 className="hash-text">{description}</h6>

                <label className="form-name" style={{marginTop: 15}}>Amount</label>
                <h6 className="value-view">{value} AR</h6>
                <label className="form-name">Transaction Fee</label>
                <h6 className="hash-text">{fee}</h6>
                <a class="button" style={{margin:10}} onClick={() => confirmPayment(invoiceData.transaction)}>Confirm Payment</a>
                <a class="button" style={{margin:10}} onClick={cancelPay}>Cancel</a>
            </div> 
    )
}

export default ConfirmPayInvoice