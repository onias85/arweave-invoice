import React from 'react';
import './App.css';
import Login from './Login';
import { loadArweaveAccount, newInvoiceTransaction, signDeployTransaction, payInvoiceTransaction } from './arweave';
import Home from './Home';
import Toolbar from './components/Toolbar';
import NewInvoice from './components/NewInvoice';
import ViewDeployInvoices from './components/ViewDeployInvoices';
import ViewRequestPayments from './components/ViewRequestPayments';
import ConfirmPayInvoice from './components/ConfirmPayInvoice';
import { joinUserPayments_RequestInvoices, joinUserInvoices_InvoicePayments } from './arweave/joins';

class UserMain extends React.Component{
    state = {
        // User Data
        wallet: false,
        address: false,
        ar: false,
        winston: false,
        appState: 0,
        //User Store Data
        userRequestPayments: [],
        userPayments: [],
        userOwnerInvoices: [],
        invoicesForPay: [],
        myInvoices:[],

        // Transaction Data
        newInvoice: false,
        payInvoice: false,
        //Hash Confirmed New Transaction
        deployTransaction: false

    }

    cancelNewInvoice = () => this.setState({ newInvoice: false })

    toggleLoader = () => {
        var modal = document.getElementById("loaderModal")
        if((!modal.style.display) || modal.style.display === "none"){
            modal.style.display = "block";
        }else{
            modal.style.display = "none";
        }
    }

    toggleTxConfirm = () => {
        var modal = document.getElementById("txConfirmModal")
        if((!modal.style.display) || modal.style.display === "none"){
            modal.style.display = "block";
        }else{
            modal.style.display = "none";
            this.setState({ deployTransaction: false })
        }
    }

    toggleConfirmPay = () => {
        var modal = document.getElementById("txConfirmPay")
        if((!modal.style.display) || modal.style.display === "none"){
            modal.style.display = "block";
        }else{
            modal.style.display = "none";
        }
    }



    setAccount = async (uploadFile) => {
        this.toggleLoader()
        try{
            const { wallet, address, ar, winston, userRequestPayments, userPayments, userOwnerInvoices } = await loadArweaveAccount(uploadFile)
            const invoicesForPay = await joinUserPayments_RequestInvoices(userPayments, userRequestPayments)
            const myInvoices = await joinUserInvoices_InvoicePayments(userOwnerInvoices)
            console.log(invoicesForPay, myInvoices)
            this.setState({ appState: 1, wallet, address, ar, winston, myInvoices, invoicesForPay, userRequestPayments, userPayments, userOwnerInvoices })
            this.toggleLoader()
        }catch(e){
            this.toggleLoader()
            alert('Invalid File')
        }
    }

    prepareNewInvoice = async(addressInvoiceReceiver, descriptionInvoice, invoiceValue) => {
        this.toggleLoader()
        try{
            const { wallet } = this.state
            const newInvoice = await newInvoiceTransaction(addressInvoiceReceiver, descriptionInvoice, invoiceValue, wallet)
            this.setState({ newInvoice })
            this.toggleLoader()
        }catch(e){
            this.toggleLoader()
        }
    }

    preparePayInvoice = async(invoiceTxHash, invoiceOwner, description,  value) => {
        this.toggleLoader()
        try{
            const { wallet } = this.state
            const payInvoice = await payInvoiceTransaction(invoiceTxHash, invoiceOwner,description, value, wallet)

            this.setState({ payInvoice })
            this.toggleLoader()
            this.toggleConfirmPay()
        }catch(e){
            console.log(e)
            this.toggleLoader()
        }
    }


    deployTransaction = async() => {
        this.toggleLoader()
        var modal = document.getElementById("txConfirmPay")
        if((!modal.style.display) || modal.style.display === "none"){
        }else{
            modal.style.display = "none";
        }
        const { payInvoice, newInvoice, wallet } = this.state
        try{
            const { transaction } = payInvoice || newInvoice
            const response = await signDeployTransaction(transaction, wallet)
            this.setState({ deployTxHash: response.transactionHash, payInvoice:false, newInvoice: false })
            this.toggleLoader()
            this.toggleTxConfirm()
        }catch(e){
            this.toggleLoader()
        }
    }



    logout = () => this.setState({ appState: 0, wallet: null, address: null, ar: null, winston: null})

    changeRoute = (number) => this.setState({ appState: number })

    render(){
        const { appState, address, ar, newInvoice, deployTxHash, invoicesForPay, userOwnerInvoices, myInvoices, payInvoice } = this.state
        return (
        <div className="App">
            {appState !== 0 &&(
                <Toolbar address={address} ar={ar} logout={this.logout} />
            )}
            <header className="App-header">
            {appState === 0 && <Login loadArweaveAccount={this.setAccount} />}
            {appState === 1 && <Home changeRoute={this.changeRoute} accountAddress={address} accountBalance={ar} />}
            {appState === 2 && 
                <NewInvoice
                    prepareNewInvoice={this.prepareNewInvoice} 
                    confirmInvoice={this.deployTransaction}
                    cancelInvoice={this.cancelNewInvoice}
                    newInvoice={newInvoice}
                    changeRoute={this.changeRoute}
                /> 
            }
            {appState === 3 && <ViewRequestPayments invoiceData={invoicesForPay} payInvoice={this.preparePayInvoice} changeRoute={this.changeRoute}/>}
            {appState === 5 && <ViewDeployInvoices invoiceData={myInvoices} changeRoute={this.changeRoute}/>}



            <div id="loaderModal" className="modal">
                <div className="modal-content" style={{color:'black'}}>
                <div className="loader"></div> 
                </div>
            </div>

            <div id="txConfirmModal" className="modal">
                <div className="modal-content-confirm-tx" style={{color:'black'}}>
                <p style={{ fontSize:15 }}>Transaction Deploy</p>
                <p style={{ wordBreak:'break-all', fontSize:12 }}>{deployTxHash}</p>
                <a class="button" onClick={this.toggleTxConfirm} href="#">OK</a>
                </div>
            </div>

            <div id="txConfirmPay" className="modal">
                <div className="modal-content-confirm-pay" style={{color:'black'}}>
                <ConfirmPayInvoice invoiceData={payInvoice} confirmPayment={this.deployTransaction} cancelPay={this.toggleConfirmPay} />
                </div>
            </div>

            </header>
        </div>
        );
    }

}

export default UserMain
