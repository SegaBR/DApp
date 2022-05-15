import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

class Home extends Component {
  
  render() {
    return (
      <div style={{height: '100%',flexWrap: 'wrap', display: 'flex',  justifyContent:'center', alignItems:'center', height: '50vh'}} className="container-fluid mt-5 text-center">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
            <div className="content">
              <p>&nbsp;</p>
              <div className="container card mb-3 mx-auto bg-dark text-white" style={{ maxWidth: '1024px' }}>
                <h2><b>Chaves:</b></h2>
                <p>Chave Publica: {this.props.chavePublica}</p>
                <p>Chave Privada: {this.props.chavePrivada}</p>
                  <form onSubmit={(event) => {
                    //Formulario para pegar a descrição e o arquivo
                    event.preventDefault()
                    const chavePublica = this.publicKey.value
                    const chavePrivada = this.privateKey.value
                    this.props.atualizarChaves(chavePublica, chavePrivada)
                  }} >
                      <div className="form-group">
                        <br></br>
                          <input
                            id="chavePublica"
                            type="text"
                            ref={(input) => { this.publicKey = input }}
                            className="form-control text-monospace"
                            placeholder="Chave Publica..."
                            required />
                      </div>
                      <br></br>
                      <div className="form-group">
                        <br></br>
                          <input
                            id="chavePrivada"
                            type="text"
                            ref={(input) => { this.privateKey = input }}
                            className="form-control text-monospace"
                            placeholder="Chave Privada..."
                            required />
                      </div>
                    <div>&nbsp;</div>
                    <Button type="submit"><b>Enviar!</b></Button>
                  </form>
                  <br></br>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Home;