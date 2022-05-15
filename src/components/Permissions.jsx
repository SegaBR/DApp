import React, { Component } from 'react';
import moment from 'moment'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

class Permissions extends Component {
  
  render() {
    return (
      <div style={{height: '100%',flexWrap: 'wrap', display: 'flex',  justifyContent:'center', alignItems:'center', height: '50vh'}} className="container-fluid mt-5 text-center">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
            <div className="content">
              <p>&nbsp;</p>
              <div className="container card mb-3 mx-auto bg-dark text-white" style={{ maxWidth: '512px' }}>
                <h2><b>Dar permissão:</b></h2>
                  <form onSubmit={(event) => {
                    //Formulario para pegar a descrição e o arquivo
                    event.preventDefault()
                    const end = this.endereco.value
                    const ch = this.chave.value
                    const hsID = this.hashID.value
                    const dtPerStart = this.dataPermStart.value + ' ' + this.horaPermStart.value;
                    const dtPerEnd = this.dataPermEnd.value + ' ' + this.horaPermEnd.value;
                    this.props.enviaPermissao(end, ch, hsID, dtPerStart, dtPerEnd)
                  }} >
                      <div className="form-group">
                        <br></br>
                          <input
                            id="enderecoPerm"
                            type="text"
                            ref={(input) => { this.endereco = input }}
                            className="form-control text-monospace"
                            placeholder="Endereço..."
                            required />
                      </div>
                      <div className="form-group">
                        <br></br>
                          <input
                            id="chavePub"
                            type="text"
                            ref={(input) => { this.chave = input }}
                            className="form-control text-monospace"
                            placeholder="Chave..."
                            required />
                      </div>
                      <div className="form-group">
                        <br></br>
                          <input
                            id="hashid"
                            type="text"
                            ref={(input) => { this.hashID = input }}
                            className="form-control text-monospace"
                            placeholder="Hash do Arquivo..."
                            required />
                      </div>
                      <p>&nbsp;</p>
                      <p>Data Inicio Permissão:</p>
                      <div className="form-group">
                        <br></br>
                          <input
                            id="datapermS"
                            type="date"
                            ref={(input) => { this.dataPermStart = input; }}
                            className="form-control text-monospace"
                            placeholder="Dia da validade da permissão..."
                            required />
                      </div>
                      <div className="form-group">
                        <br></br>
                          <input
                            id="horapermS"
                            type="time"
                            ref={(input) => { this.horaPermStart = input; }}
                            className="form-control text-monospace"
                            placeholder="Hora da validade da permissão..."
                            required />
                      </div>
                      <p>&nbsp;</p>
                      <p>Data Fim Permissão:</p>
                      <div className="form-group">
                        <br></br>
                          <input
                            id="datapermE"
                            type="date"
                            ref={(input) => { this.dataPermEnd = input; }}
                            className="form-control text-monospace"
                            placeholder="Dia da validade da permissão..."
                            required />
                      </div>
                      <div className="form-group">
                        <br></br>
                          <input
                            id="horapermE"
                            type="time"
                            ref={(input) => { this.horaPermEnd = input; }}
                            className="form-control text-monospace"
                            placeholder="Hora da validade da permissão..."
                            required />
                      </div>
                      <br></br>
                    <Button type="submit"><b>Enviar!</b></Button>
                  </form>
                  <br></br>
              </div>
              <p>&nbsp;</p>
              <Table className="border" striped bordered hover variant="dark">
                <thead style={{ 'fontSize': '15px' }}>
                  <tr>
                    <th scope="col" style={{ width: '230px'}}>Adress</th>
                    <th scope="col" style={{ width: '120px'}}>FileID</th>
                    <th scope="col" style={{ width: '120px'}}>Data Envio</th>
                    <th scope="col" style={{ width: '120px'}}>Data Inicio Perm</th>
                    <th scope="col" style={{ width: '120px'}}>Data Fim Perm</th>
                  </tr>
                </thead>
                { //Map para pegar o arquivo e a chave somente do usuário atual 
                  this.props.perms.map((perm, key) => {
                  if (perm.uploader === this.props.account) return(
                    <thead style={{ 'fontSize': '12px' }} key={key}>
                      <tr>
                        <td>{perm.permAdress}</td>
                        <td>{perm.fileId}</td>
                        <td>{moment.unix(perm.uploadTime).format('DD/MM/YY h:mm')}</td>
                        <td>{moment.unix(perm.permTimeStart/1000).format('DD/MM/YY h:mm')}</td>
                        <td>{moment.unix(perm.permTimeEnd/1000).format('DD/MM/YY h:mm')}</td>
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

export default Permissions;