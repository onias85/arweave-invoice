import React from 'react';
import './App.css';

class Login extends React.Component{

  render(){
    const { loadArweaveAccount } = this.props
    return (
      <div className="App">
        <header className="App-header">
            <h3>Arweave Invoice</h3>
            <h6>Send and Request Payments via Arweave</h6>
            <a class="button" onClick={() => document.getElementById('walletUpload').click()}>Upload Arweave Wallet</a>
            
            <input 
                type="file" 
                onChange={ e => loadArweaveAccount(e.target.files[0])} 
                id="walletUpload" 
                style={{ display: "none" }}
            />
        </header>
      </div>
    );
  }

}

export default Login
