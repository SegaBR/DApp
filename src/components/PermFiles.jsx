import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

class PermFiles extends Component {
  
  render() {
    return (
      <div style={{height: '100%',flexWrap: 'wrap', display: 'flex',  justifyContent:'center', alignItems:'center', height: '50vh'}} className="container-fluid mt-5 text-center">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
            <div className="content">
              <p>&nbsp;</p>
              <div className="container card mb-3 mx-auto bg-dark text-white" style={{ maxWidth: '512px' }}>
                <h2><b>Arquivos com permissão:</b></h2>
              </div>
              <p>&nbsp;</p>
              <Table className="border" striped bordered hover variant="dark">
                <thead style={{ 'fontSize': '15px' }}>
                  <tr>
                    <th scope="col" style={{ width: '230px'}}>Descrição</th>
                    <th scope="col" style={{ width: '230px'}}>Tipo</th>
                    <th scope="col" style={{ width: '200px'}}>Data Envio</th>
                    <th scope="col" style={{ width: '320px'}}>Data Inicio Perm</th>
                    <th scope="col" style={{ width: '280px'}}>Data Fim Perm</th>
                    <th scope="col" style={{ width: '120px'}}>Emissor</th>
                    <th scope="col" style={{ width: '120px'}}>Hash</th>
                    <th scope="col" style={{ width: '150px'}}>Baixar</th>
                  </tr>
                </thead>
                { //Map para pegar o arquivo e a chave somente do usuário atual 
                  this.props.perms.map((perm, key) => {
                  if ((perm.permAdress === this.props.account) && (new Date().getTime() >= perm.permTimeStart) && (new Date().getTime() <= perm.permTimeEnd)) return(
                    <thead style={{ 'fontSize': '12px' }} key={key}>
                      <tr>
                        <td>{perm.permDescription}</td>
                        <td>{perm.fileType}</td>
                        <td>{moment.unix(perm.uploadTime).format('DD/MM/YY h:mm')}</td>
                        <td>{moment.unix(perm.permTimeStart/1000).format('DD/MM/YY h:mm')}</td>
                        <td>{moment.unix(perm.permTimeEnd/1000).format('DD/MM/YY h:mm')}</td>
                        <td>
                          <a
                            //Mostar parte do endereço do emissor linkado ao etherscan
                            href={"https://etherscan.io/address/" + perm.uploader}
                            rel="noopener noreferrer"
                            target="_blank">
                            {perm.uploader.substring(0,10)}...
                          </a>
                         </td>
                        <td>
                          <a
                            //Mostar o Hash descriptografado que linka com o IPFS para ter acesso ao arquivo
                            href={"https://ipfs.infura.io/ipfs/" + this.props.decripHashLink(perm.fileHash)}
                            rel="noopener noreferrer"
                            target="_blank">
                            {this.props.decripHashLink(perm.fileHash)}
                          </a>
                        </td>

                        <td>
                          <button className="btn-primary btn-block" onClick= {() => this.props.downloadArquivo("https://ipfs.infura.io/ipfs/" + this.props.decripHashLink(perm.fileHash), perm.fileType, perm.sectKey)}>Download</button>
                        </td>
                      </tr>
                    </thead> 
                  ) 
                })}
              </Table>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default PermFiles;