import React from 'react';
import './App.css';


class Home extends React.Component{
  render(){
    const { changeRoute } = this.props
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ width: 400, height: 200, padding:20, backgroundColor:'rgba(211, 207, 217, 0.76)', color: 'black', alignContent: "center", alignItems:"center"}}>
            <div>
              <a class="button" style={{width:180}} onClick={() => changeRoute(2)}>New Invoice</a>
            </div>
            <div>
              <a class="button" style={{width:180}} onClick={() => changeRoute(3)}>Invoice For Pay</a>
            </div>
            <div>
              <a class="button" style={{width:180}} onClick={() => changeRoute(5)}>My Deploy Invoices</a>
            </div>
          </div>
        </header>
      </div>
    );
  }

}

export default Home
