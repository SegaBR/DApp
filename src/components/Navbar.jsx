import React, { Component } from 'react';
import Identicon from 'identicon.js';
import health from '../health.png'
import NavbarB from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image'

class Navbar extends Component {

  render() {
    return (
      <NavbarB bg="dark" expand="" className="navbar-dark p-0 text-monospace">
        <div className="navbar-brand col-sm-3 col-md-2 mr-0">
        &nbsp;
          <Image roundedCircle="true" src={health} width="30" height="30" className="align-top"/>
          &nbsp; Saúde
        </div>
        <ul className="navbar-nav px-3">
          <li>
            <small id="account">
              <a target="_blank"
                 alt=""
                 className="text-white"
                 rel="noopener noreferrer"
                 //Para aparecer a conta como link para o etherscan
                 href={"https://etherscan.io/address/" + this.props.account}>
                {this.props.account.substring(0,8)}...{this.props.account.substring(35,42)}
              </a>
            </small>
            &nbsp;
            { this.props.account
              ? <Image fluid="true" className='ml-2' width='30' height='30'
                  //Para fazer o Identicon (avatar) da conta do usuário
                  src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                />
              : <span></span>
            }
          </li>
        </ul>
      </NavbarB>
    );
  }
}

export default Navbar;