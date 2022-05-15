import React, { Component } from 'react';
import Identicon from 'identicon.js';
import health from '../health.png'
import Image from 'react-bootstrap/Image'

const Menu = ({account}) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <div className="navbar-brand col-sm-3 col-md-2 mr-0">
        &nbsp;
          <Image roundedCircle="true" src={health} width="30" height="30" className="align-top"/>
          &nbsp; Saúde
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/">Home &nbsp;|</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/files">Arquivos &nbsp;|</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/permFiles">Arquivos com Permissão &nbsp;|</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/perms">Permissões</a>
                </li>
            </ul>
        </div>
        <ul className="navbar-nav px-3">
          <li>
            <small id="account">
              <a target="_blank"
                  alt=""
                  className="text-white"
                  rel="noopener noreferrer"
                  //Para aparecer a conta como link para o etherscan
                  href={"https://etherscan.io/address/" + account}>
                {account.substring(0,8)}...{account.substring(35,42)}
              </a>
            </small>
            &nbsp;
            { account
              ? <Image fluid="true" className='ml-2' width='30' height='30'
                  //Para fazer o Identicon (avatar) da conta do usuário
                  src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
                />
              : <span></span>
            }
          </li>
        </ul>
      </div>
  </nav>
);

export default Menu;