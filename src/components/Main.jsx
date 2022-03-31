import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

class Main extends Component {
  
  render() {
    return (
      <div style={{height: '100%',flexWrap: 'wrap', display: 'flex',  justifyContent:'center', alignItems:'center', height: '50vh'}} className="container-fluid mt-5 text-center">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
            <div className="content">
              <p>&nbsp;</p>
              <div className="container card mb-3 mx-auto bg-dark text-white" style={{ maxWidth: '512px' }}>
                <h2><b>Envie um Arquivo:</b></h2>
                  <form onSubmit={(event) => {
                    //Formulario para pegar a descrição e o arquivo
                    event.preventDefault()
                    const descricao = this.fileDescription.value
                    this.props.enviaArquivo(descricao)
                  }} >
                      <div className="form-group">
                        <br></br>
                          <input
                            id="descricaoArquivo"
                            type="text"
                            ref={(input) => { this.fileDescription = input }}
                            className="form-control text-monospace"
                            placeholder="Descrição..."
                            required />
                      </div>
                      <br></br>
                    <input type="file" onChange={this.props.capturaArquivo} className="form-control-file text-white text-monospace"/>
                    <div>&nbsp;</div>
                    <Button type="submit"><b>Enviar!</b></Button>
                  </form>
                  <br></br>
              </div>
              <p>&nbsp;</p>
              <Table className="border" striped bordered hover variant="dark">
                <thead style={{ 'fontSize': '15px' }}>
                  <tr>
                    <th scope="col" style={{ width: '200px'}}>Nome</th>
                    <th scope="col" style={{ width: '230px'}}>Descrição</th>
                    <th scope="col" style={{ width: '120px'}}>Tipo</th>
                    <th scope="col" style={{ width: '90px'}}>Tamanho</th>
                    <th scope="col" style={{ width: '120px'}}>Data</th>
                    <th scope="col" style={{ width: '120px'}}>Emissor</th>
                    <th scope="col" style={{ width: '150px'}}>Hash</th>
                  </tr>
                </thead>
                { //Map para pegar o arquivo e a chave somente do usuário atual 
                  this.props.files.map((file, key) => {
                  if (file.uploader === this.props.account) return(
                    <thead style={{ 'fontSize': '12px' }} key={key}>
                      <tr>
                        <td>{file.fileName}</td>
                        <td>{file.fileDescription}</td>
                        <td>{file.fileType}</td>
                        <td>{convertBytes(file.fileSize)}</td>
                        <td>{moment.unix(file.uploadTime).format('DD/MM/YY h:mm:ss')}</td>
                        <td>
                          <a
                            //Mostar parte do endereço do emissor linkado ao etherscan
                            href={"https://etherscan.io/address/" + file.uploader}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.uploader.substring(0,10)}...
                          </a>
                         </td>
                        <td>
                          <a
                            //Mostar o Hash descriptografado que linka com o IPFS para ter acesso ao arquivo
                            href={"https://ipfs.infura.io/ipfs/" + this.props.decripHashLink(file.fileHash)}
                            rel="noopener noreferrer"
                            target="_blank">
                            {this.props.decripHashLink(file.fileHash)}
                          </a>
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

export default Main;