import React from 'react';

class NewInvoice extends React.Component{
    state={
        addressReceiver: '',
        invoiceDescription: '',
        invoiceValue:0,
        txAprove: false
    }
    render(){
        const { prepareNewInvoice, confirmInvoice, newInvoice, changeRoute, cancelInvoice  } = this.props
        const { invoiceValue, invoiceDescription,  addressReceiver } = this.state
        return(
            <div style={{ width: 400, height: 400, backgroundColor:'rgba(211, 207, 217, 0.76)', color: 'black', alignContent: "center", alignItems:"center"}}>
            {(!newInvoice) ? (
                <div>
                 <div onClick={() => changeRoute(1)} class="float-left" style={{ margin: 10 }}>
                 <p style={{fontSize:10}}><i class="arrow left"></i>Back to Home</p>
                 </div>
                 <h6 style={{ paddingTop:15, fontWeight:600 }}>New Invoice Details</h6>
                <form style={{ padding: 10 }}>
                    <fieldset>
                    <label className="view-req-name">Receiver Address</label>
                    <input style={{ fontSize: 12 }} onChange={(e) => this.setState({ addressReceiver: e.target.value})} type="text" placeholder="Arweave Address" id="nameField"/>
                    <label className="view-req-name">Invoice Description(optional)</label>
                    <textarea style={{ fontSize: 12 }} onChange={(e) => this.setState({ invoiceDescription: e.target.value })} placeholder="Pubic Description" id="commentField"></textarea>
                    <label className="view-req-name">Value</label>
                    <input onChange={(e) => this.setState({ invoiceValue:e.target.value})} 
                        style={{ fontSize: 25, textAlign: 'center', border: 'hidden', marginBottom:0, paddingBottom:0, paddingLeft: 25 }} 
                        value={invoiceValue} type="number" placeholder="Arweave Value" id="nameField"/>
                    <label for="nameField">AR</label>

                    <a class="button" onClick={() => prepareNewInvoice(addressReceiver,invoiceDescription, invoiceValue)} href="#">Advance</a>
                    </fieldset>
                </form> 
                </div>
            ) :(
                <form>
                    <h6 style={{ paddingTop:15, fontWeight:600 }}>Confirm New Invoice</h6>
                    <fieldset>
                    <label className="view-req-name">Receiver Address</label>
                    <h6>{addressReceiver}</h6>
                    <label className="view-req-name">Invoice Description</label>
                    <h6>{invoiceDescription}</h6>
                    <label className="view-req-name">Value</label>
                    <h6>{invoiceValue}</h6>
                    <label className="view-req-name">Fee</label>
                    <h6>{newInvoice.fee} AR</h6>
                    <a class="button" onClick={confirmInvoice}>Confirm Invoice</a>
                    <a class="button" onClick={cancelInvoice}>Cancel</a>
                    </fieldset>
                </form> 
            )}
            </div>
        )
    }
}

export default NewInvoice