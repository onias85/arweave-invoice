import React from 'react';
import Blockies from 'react-blockies';

const Toolbar = props => {
    const { address, logout, ar} = props
    return(
                <div style={{width: '100%', height: 65, backgroundColor: 'black'}}>
                    <div class="float-left" style={{ margin: 10, marginTop:17, color: 'white', fontWeight:600 }}>Arweave Invoice</div>
                    <div class="float-right" style={{ margin: 10 }}>
                    <div class="dropdown">
                        <Blockies
                            seed={address}
                            size={14}
                            scale={3} 
                        />
                        <div class="dropdown-content">                            
                        <ul>
                        <dt style={{fontSize:10, wordBreak:'break-all'}}>{address}</dt>
                        <dt>{ar} AR</dt>
                        <dt onClick={logout}>Logout</dt>
                        </ul>
                        </div>
                    </div> 
                   
                    </div>
                </div>
    )
}

export default Toolbar