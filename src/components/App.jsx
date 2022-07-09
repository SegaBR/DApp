import CriptDStorage from '../abis/CriptDStorage.json'
import CriptDPermission from '../abis/CriptDPermission.json'
import React, { Component } from 'react';
//import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { HashRouter as Router, Switch, Route} from 'react-router-dom';
import Web3 from 'web3';

import Home from './Home'
import Menu from './Menu'
import Files from './Files'
import PermFiles from './PermFiles'
import Permissions from './Permissions'
import './App.css';

const ipfsClient = require('ipfs-http-client')
//Padrão
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

class App extends Component {

  async componentWillMount() {
    await this.carregarWeb3()
    await this.carregarDadosBlockchain()

  }
  
  componentDidMount(){
    var forge = require('node-forge');
    var eccrypto = require("eccrypto");
    
    if(localStorage.getItem('privateKey')){
      this.setState({
       publicKey:  forge.pki.publicKeyFromPem(localStorage.getItem('publicKey')),
       privateKey:  forge.pki.privateKeyFromPem(localStorage.getItem('privateKey')),
       chavePublica:  forge.pki.publicKeyFromPem(localStorage.getItem('chavePublica')),
       chavePrivada:  forge.pki.privateKeyFromPem(localStorage.getItem('chavePrivada'))
      })
      // this.setState({
      //  publicKey:  localStorage.getItem('publicKey'),
      //  privateKey: localStorage.getItem('privateKey'),
      //  chavePublica:  localStorage.getItem('chavePublica'),
      //  chavePrivada:  localStorage.getItem('chavePrivada')
      // })
    }else{
      this.gerarChavesRSA()
      //this.gerarChavesECC()
    }
  }

  async carregarWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Seu navegador não possui compatibilidade para o Ethereum.'+
      'Recomendamos adicionar o MetaMask ao seu navegador!')
    }
  }

  async carregarDadosBlockchain() {
    const web3 = window.web3

    //Carrega as contas
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    //ID da rede (blockchain)
    const networkId = await web3.eth.net.getId()
    const networkData = CriptDStorage.networks[networkId]
    const networkData2 = CriptDPermission.networks[networkId]

    if(networkData) {
      //Assina o contrato
      const criptdstorage = new web3.eth.Contract(CriptDStorage.abi, networkData.address)
      this.setState({ criptdstorage })

      //Pega os arquivos
      const filesCount = await criptdstorage.methods.fileCount().call()
      this.setState({ filesCount })

      //Carrega e ordena os arquivos pelos mais novos
      for (var i = filesCount; i >= 1; i--) {
        const file = await criptdstorage.methods.files(i).call()
        this.setState({
          files: [...this.state.files, file]
        })
      }
    } else {
      window.alert('O contrato de armazenagem não foi implantado na rede em uso.')
    }

    if(networkData2) {
      //Assina o contrato
      const criptdpermission = new web3.eth.Contract(CriptDPermission.abi, networkData2.address)
      this.setState({ criptdpermission })

      //Pega os arquivos
      const permsCount = await criptdpermission.methods.permCount().call()
      this.setState({ permsCount })

      //Carrega e ordena os arquivos pelos mais novos
      for (var i = permsCount; i >= 1; i--) {
        const perm = await criptdpermission.methods.perms(i).call()
        this.setState({
          perms: [...this.state.perms, perm]
        })
      }
    } else {
      window.alert('O contrato de permissao não foi implantado na rede em uso.')
    }
  }

  atualizarChaves = (chPub, chPri) => {
    ///RSA/////
    var forge = require('node-forge');
    //Armazena provisóriamente no local storage
    localStorage.setItem('privateKey', chPri);
    localStorage.setItem('publicKey',   chPub);
    this.setState({
      chavePrivada: forge.pki.privateKeyFromPem(chPri),
      chavePublica: forge.pki.publicKeyFromPem(chPub)
    })
    window.alert('Chaves Salvas!');
    
    // //////ECC/////
    // var eccrypto = require("eccrypto");
    // //Armazena provisóriamente no local storage
    // localStorage.setItem('privateKey', chPri);
    // localStorage.setItem('publicKey',   chPub);
    // this.setState({
    //   chavePrivada: chPri,
    //   chavePublica: chPub
    // })
  }

  gerarChavesRSA(){
    var forge = require('node-forge');
    var rsa = forge.pki.rsa;

    //Gera as chaves
    var keypair = rsa.generateKeyPair({bits: 3072, e: 0x10001});

    //Armazena provisóriamente no local storage
    localStorage.setItem('privateKey',  forge.pki.privateKeyToPem(keypair.privateKey));
    localStorage.setItem('publicKey',  forge.pki.publicKeyToPem(keypair.publicKey));
    localStorage.setItem('chavePrivada',  forge.pki.privateKeyToPem(keypair.privateKey));
    localStorage.setItem('chavePublica',  forge.pki.publicKeyToPem(keypair.publicKey));
   
    this.setState({
      chavePublica: forge.pki.publicKeyToPem(keypair.publicKey),
      chavePrivada: forge.pki.privateKeyToPem(keypair.privateKey),
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey
    })
  }

  criptografarRSA = hash  => {
    var forge = require('node-forge');

    //console.log('Public: '+ forge.pki.publicKeyToPem(this.state.publicKey));
    //console.log('Private: '+ forge.pki.privateKeyToPem(this.state.privateKey));

    //Criptografa o dado com a chave pública
    var encrypted =  this.state.publicKey.encrypt(hash);
    //console.log('Criptografado: '+encrypted);

    return encrypted;
  }

  descriptografarRSA = criptHash => {
    var forge = require('node-forge');

    //console.log('Private: '+ forge.pki.privateKeyToPem(this.state.privateKey));
    //console.log('Hash: '+criptHash);

    //Descriptografa o dado com a chave privada
    var decrypted = this.state.privateKey.decrypt(criptHash);

    //console.log('Decriptografado: '+decrypted);

    return decrypted;
  }

  gerarChavesECC(){
    var eccrypto = require("eccrypto");

    //Gera chave privada
    var privateKey = eccrypto.generatePrivate();
    //Gera a chave pública apartir da privada
    var publicKey = eccrypto.getPublic(privateKey);

    console.log('Public: '+ publicKey);
    console.log('Private: '+ privateKey);

    //Transforma as chaves para hex 
    var hexPrivateKey = privateKey.toString('hex');
    var hexPublicKey = publicKey.toString('hex')
    console.log('Private: '+hexPrivateKey); 
    console.log('Public: '+hexPublicKey); 

    //Armazena as chaves em hex no local storage
    localStorage.setItem('publicKey', hexPublicKey);
    localStorage.setItem('privateKey', hexPrivateKey);
    localStorage.setItem('chavePrivada', hexPrivateKey);
    localStorage.setItem('chavePublica', hexPublicKey);
    this.setState({
      chavePublica: hexPublicKey,
      chavePrivada:  hexPrivateKey,
      publicKey: hexPublicKey,
      privateKey: hexPrivateKey
    })
  }
  
  criptografarECC = async hash  => {
    var eccrypto = require("eccrypto");

    console.log('Hash: '+hash);
    console.log('Public: '+ this.state.publicKey);

    //Pega a chave publica do State 
    var newPublicKey = Buffer.from(this.state.publicKey, 'hex');
   
    //Encripta o dado com a chave publica
    var encrypted = await eccrypto.encrypt(newPublicKey, Buffer.from(hash));
    
    //Gambiarra tranformando em JSON e hex
    var data = JSON.stringify({
      iv: encrypted.iv.toString('hex'),
      ciphertext: encrypted.ciphertext.toString('hex'),
      mac: encrypted.mac.toString('hex'),
      ephemPublicKey: encrypted.ephemPublicKey.toString('hex')
    });
    console.log("Criptografado: "+data);
    
    //Encode o data para 64
    var forge = require('node-forge');
    var encData = forge.util.encode64(data);
    console.log("Criptografado enc: "+encData);

    return encData;
  }

  descriptografarECC = async criptHash => {
    var eccrypto = require("eccrypto");

    console.log('Hash: '+criptHash);
    console.log('Private: '+ this.state.privateKey);

    //Pega a chave privada do State
    var newPrivateKey = Buffer.from(this.state.privateKey, 'hex');

    //Decode em 64 do criptHash 
    var forge = require('node-forge');
    var newData = forge.util.decode64(criptHash);

    //Parse JSON do newData e destranforma de hex
    let encryptedContent = JSON.parse(newData);
    encryptedContent = {
        iv: Buffer.from(encryptedContent.iv, 'hex'),
        ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
        mac: Buffer.from(encryptedContent.mac, 'hex'),
        ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex')
    }

    //Espera a descriptografia
    var decrypted = await eccrypto.decrypt(newPrivateKey, encryptedContent);
    console.log('Decriptografado: '+decrypted);

    return decrypted;
  }

  criptografarPermECC = async (pubKey, info)  => {
    var eccrypto = require("eccrypto");

    console.log('Info: '+info);
    console.log('Public: '+ pubKey);

    //Pega a chave publica do State 
    var newPublicKey = Buffer.from(pubKey, 'hex');
   
    //Encripta o dado com a chave publica
    var encrypted = await eccrypto.encrypt(newPublicKey, Buffer.from(info));
    
    //Gambiarra tranformando em JSON e hex
    var data = JSON.stringify({
      iv: encrypted.iv.toString('hex'),
      ciphertext: encrypted.ciphertext.toString('hex'),
      mac: encrypted.mac.toString('hex'),
      ephemPublicKey: encrypted.ephemPublicKey.toString('hex')
    });
    console.log("Criptografado: "+data);
    
    //Encode o data para 64
    var forge = require('node-forge');
    var encData = forge.util.encode64(data);
    console.log("Criptografado enc: "+encData);

    return encData;
  }

  //Captura o arquivo do usuário
  capturaArquivo = event => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('Buffer: ', this.state.buffer)
    }
  }
  
  criptografarAES = (data) => {

    var crypto = require('crypto');

    var algorithm = 'aes-256-ctr'; 
    var secretKey = require('crypto').randomBytes(16).toString('hex');
    //var secretKey = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ';
    console.log('SecretKey: '+secretKey);
    this.state.salt = secretKey;

    var iv = crypto.randomBytes(16);

    var cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    var encrypted = Buffer.concat([iv, cipher.update(data), cipher.final()]);

    return encrypted;
  };

  descriptografarAES = (chunk, salt) => {
    var crypto = require('crypto');

    var algorithm = 'aes-256-ctr';

    //RSA//
    var secretKey = this.descriptografarRSA(salt);
    var decipher,
    iv;
    // Get the iv: the first 16 bytes
    iv = chunk.slice(0, 16);

    // Get the rest
    chunk = chunk.slice(16);

    // Create a decipher
    var decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    //var decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    var decrpyted = Buffer.concat([decipher.update(chunk), decipher.final()]);
    return decrpyted;

    // //ECC//
    // this.descriptografarECC(salt).then( resultado => {
    //   console.log("Resultado: "+resultado);
    //   var secretKey = resultado;
    //   var decipher,
    //   iv;
    //   // Get the iv: the first 16 bytes
    //   iv = chunk.slice(0, 16);

    //   // Get the rest
    //   chunk = chunk.slice(16);

    //   // Create a decipher
    //   var decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    //   //var decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    //   var decrpyted = Buffer.concat([decipher.update(chunk), decipher.final()]);
    //   localStorage.setItem('decrypted',  decrpyted);
    //   return decrpyted;
    // });
    // return localStorage.getItem('decrypted');
  };

  //Envia o arquivo
  enviaArquivo = descricao => {
    console.log(`------------------------------------------------------------------`)
    var startSend = performance.now(); 
    console.log(`------------------------------------------------------------------`)

    console.log("Enviando Arquivo para o IPFS...");

    /////AES/////
    var encryptBuffer = this.criptografarAES(this.state.buffer);
    console.log("Encrypt: ",encryptBuffer);

    /////NORMAL/////
    //var encryptBuffer = this.state.buffer;

    //Adiciona o arquivo ao IPFS
    ipfs.add(encryptBuffer, (error, result) => {
      console.log('IPFS resultado', result.size)
      if(error) {
        console.error(error)
        return
      }
      
      //Carregando
      this.setState({ loading: true })

      //Arquivo sem extensão
      if(this.state.type === ''){
        this.setState({type: 'none'})
      }
      
      // //////NORMAL//////

      // //Enviar para o contrato inteligente
      // this.state.criptdstorage.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, descricao).send({ from: this.state.account }).on('transactionHash', (hash) => {
      //   this.setState({
      //    loading: false,
      //    type: null,
      //    name: null
      //  })
      //  window.location.reload()
      // }).on('error', (e) =>{
      //   window.alert('Error')
      //   this.setState({loading: false})
      // })




      /////RSA/////

      //Criptografar o resultado Hash do IPFS
      result[0].hash= this.criptografarRSA(result[0].hash);
      
      //AES
      this.state.salt = this.criptografarRSA(this.state.salt);

      console.log(result[0].hash)
      console.log(this.state.salt)

      //Enviar para o contrato inteligente
      this.state.criptdstorage.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, descricao, this.state.salt).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false,
         type: null,
         name: null
       })
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
        this.setState({loading: false})
      })

      // /////ECC/////

      // // Criptografar o resultado Hash do IPFS
      // this.criptografarECC(result[0].hash).then( resultadoHash => {
      //  console.log("Resultado: "+resultadoHash);

      //  // AES
      //  this.criptografarECC(this.state.salt).then( resultadoSalt => {
      //   //Enviar para o contrato inteligente 
      //   this.state.criptdstorage.methods.uploadFile(resultadoHash, resultadoHash.length, this.state.type, this.state.name, descricao, resultadoSalt).send({ from: this.state.account }).on('transactionHash', (hash) => {
      //     this.setState({
      //     loading: false,
      //     type: null,
      //     name: null
      //     });

      //     console.log(`------------------------------------------------------------------`)
      //     var durationSend = performance.now() - startSend;
      //     localStorage.setItem('durationSend',  durationSend);
      //     console.log(`------------------------------------------------------------------`) 

      //     window.location.reload()

      //   }).on('error', (e) =>{
      //     window.alert('Error')
      //     this.setState({loading: false})
      //   })
      //  });

      // });



    })
  }

  enviaPermissao = (des, tipo, end, ch, hashID, dtPerS, dtPerE) => {

    console.log("Enviando Permissao...");
    
    var tempoIni =  new Date(dtPerS).getTime();
    var tempoFim =  new Date(dtPerE).getTime();
    var sectKey;

    // //////NORMAL//////

    // //Enviar para o contrato inteligente
    // this.state.criptdstorage.methods.uploadFile(end, identificador,  ch, tempoIni, tempoFim).send({ from: this.state.account }).on('transactionHash', (hash) => {
    //   this.setState({
    //    loading: false,
    //    type: null,
    //    name: null
    //  })
    //  window.location.reload()
    // }).on('error', (e) =>{
    //   window.alert('Error')
    //   this.setState({loading: false})
    // })

    ///////////////RSA///////////////////
    var forge = require('node-forge');  

    this.state.files.map((file, key) => {
      if (file.uploader === this.state.account && hashID === this.decripHashLink(file.fileHash)){
            sectKey = this.descriptografarRSA(file.sectKey); 

            ch = forge.pki.publicKeyFromPem(ch);
            sectKey = ch.encrypt(sectKey);
            hashID = ch.encrypt(hashID);
        
            //Enviar para o contrato inteligente
            this.state.criptdpermission.methods.uploadPerm(des, end, tipo, hashID, sectKey, tempoIni, tempoFim).send({ from: this.state.account }).on('transactionHash', (hash) => {
              this.setState({
               loading: false,
               type: null,
               name: null
             })
             window.location.reload()
            }).on('error', (e) =>{
              window.alert('Error')
              this.setState({loading: false})
            })

            return;  
      }
    });

    // /////ECC/////
  
    // this.state.files.map((file, key) => {
    //   if (file.uploader === this.state.account && hashID === this.decripHashLink(file.fileHash)){
    //         //ECC do SALT
    //         this.descriptografarECC(file.sectKey).then( resultadoSectKey => {
    //           console.log("resultadoSectKey: "+resultadoSectKey);
    //           this.criptografarPermECC(ch, resultadoSectKey).then( resultadoSectKey => {
    //             console.log("Cript resultadoSectKey: "+resultadoSectKey);
    //             this.criptografarPermECC(ch, hashID).then( resultadoHashID => {
    //               console.log("Cript resultadoHashID: "+resultadoHashID);
    //               //Enviar para o contrato inteligente
    //               this.state.criptdpermission.methods.uploadPerm(des, end, tipo, resultadoHashID, resultadoSectKey, tempoIni, tempoFim).send({ from: this.state.account }).on('transactionHash', (hash) => {
    //                 this.setState({
    //                 loading: false,
    //                 type: null,
    //                 name: null
    //               })
    //               window.location.reload()
    //               }).on('error', (e) =>{
    //                 window.alert('Error')
    //                 this.setState({loading: false})
    //               })
    //             });
    //           });
    //         });

    //         return;  
    //   }
    // });

  }

  downloadArquivo = (link, type, salt) => {
    try{
      const axios = require('axios');
      const reader = new window.FileReader();
      axios({
        url: link,
        method: 'GET',
        responseType: 'blob'
        }).then((response) => {
            reader.readAsArrayBuffer(response.data);
            reader.onloadend = () => {
              var buff = Buffer(reader.result);
              console.log('Buffer: ', buff)

              //NORMAL//
              //var decryptBuffer = buff;

              //RSA//
              var decryptBuffer = this.descriptografarAES(buff, salt);
              console.log("Decrypt: ",decryptBuffer);
              
              var barra = type.substring(type.indexOf("/")+1, type.lenght );
              console.log(barra);
              if(barra=='x-zip-compressed'){
                const url = window.URL
                .createObjectURL(new Blob([decryptBuffer]));
                
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'download.zip');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }else{
                const url = window.URL
                .createObjectURL(new Blob([decryptBuffer]));
                
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'download.'+barra);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }

              // //ECC//
              // this.descriptografarECC(salt).then( resultado => {
              //   console.log("Resultado: "+resultado);
              //   var crypto = require('crypto');
              //   var algorithm = 'aes-256-ctr';
              //   var secretKey = resultado;
              //   var decipher,
              //   iv;
              //   // Get the iv: the first 16 bytes
              //   iv = buff.slice(0, 16);
          
              //   // Get the rest
              //   buff = buff.slice(16);
          
              //   // Create a decipher
              //   var decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
          
              //   //var decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
              
              //   var decryptBuffer = Buffer.concat([decipher.update(buff), decipher.final()]);
              //   console.log("Decrypt: ",decryptBuffer);
                
              //   var barra = type.substring(type.indexOf("/")+1, type.lenght );
              //   console.log(barra);
              //   if(barra=='x-zip-compressed'){
              //     const url = window.URL
              //     .createObjectURL(new Blob([decryptBuffer]));
                  
              //     const link = document.createElement('a');
              //     link.href = url;
              //     link.setAttribute('download', 'download.zip');
              //     document.body.appendChild(link);
              //     link.click();
              //     document.body.removeChild(link);
              //   }else{
              //     const url = window.URL
              //     .createObjectURL(new Blob([decryptBuffer]));
                  
              //     const link = document.createElement('a');
              //     link.href = url;
              //     link.setAttribute('download', 'download.'+barra);
              //     document.body.appendChild(link);
              //     link.click();
              //     document.body.removeChild(link);
              //   }
              // });
          };
        }).catch(
          function (error) {
            return window.alert('Não foi possivel recuperar o Arquivo.\nVerifique suas chaves. \n'+error);
          }
        );
    }catch (e) {
      return '';
    }
  }

  //Função para descriptografar o Hash Link para o conteúdo no IPFS
  decripHashLink = hash => {
    try{
      // ////Normal////
      //return hash;

      /////RSA/////
      var hashDescrip = this.descriptografarRSA(hash);
      
      return hashDescrip;

      // /////ECC/////
      // console.log("Hash para descriptografar: "+hash);
      // this.descriptografarECC(hash).then( resultado => {
      //   console.log("Resultado: "+resultado);
      //   localStorage.setItem('hash',  resultado);
      //   return resultado;
      // });
      // return localStorage.getItem('hash');


    }
    catch (e) {
        return window.alert('Não foi possivel descriptografar o Hash.\nVerifique suas chaves. \n'+e);
    }
  }

  //Construtor com as informações necessárias do contrato inteligente e da criptografia
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      criptdstorage: null,
      files: [],
      criptdpermission: null,
      perms: [],
      loading: false,
      type: null,
      name: null,
      salt: null,
      publicKey: null,
      privateKey: null,
      chavePublica: null,
      chavePrivada: null
    }

    this.atualizarChaves = this.atualizarChaves.bind(this)
    this.downloadArquivo = this.downloadArquivo.bind(this)
    this.descriptografarAES = this.descriptografarAES.bind(this)
    this.criptografarAES = this.criptografarAES.bind(this)
    this.enviaArquivo = this.enviaArquivo.bind(this)
    this.enviaPermissao = this.enviaPermissao.bind(this)
    this.decripHashLink = this.decripHashLink.bind(this)
    this.capturaArquivo = this.capturaArquivo.bind(this)
    this.criptografarRSA = this.criptografarRSA.bind(this)
    this.descriptografarRSA = this.descriptografarRSA.bind(this)
    this.criptografarECC = this.criptografarECC.bind(this)
    this.descriptografarECC = this.descriptografarECC.bind(this)
    this.criptografarPermECC = this.criptografarPermECC.bind(this)
  }

  render() {
    return (
      <Router>
        <Menu account={this.state.account} />
        <Switch>
            <Route exact path="/" render={() => <Home
                                                  chavePrivada={localStorage.getItem('chavePrivada')} 
                                                  chavePublica={localStorage.getItem('chavePublica')} 
                                                  atualizarChaves={this.atualizarChaves}/>}/>
            <Route exact path="/files" render={() => <Files 
                                                  downloadArquivo={this.downloadArquivo}
                                                  decripHashLink={this.decripHashLink}
                                                  files={this.state.files}
                                                  capturaArquivo={this.capturaArquivo}
                                                  enviaArquivo={this.enviaArquivo}
                                                  account={this.state.account}/>} />
            <Route exact path="/permFiles" render={() => <PermFiles 
                                                  downloadArquivo={this.downloadArquivo}
                                                  decripHashLink={this.decripHashLink}
                                                  files={this.state.files}
                                                  perms={this.state.perms}
                                                  account={this.state.account}/>} />
            <Route exact path="/perms" render={() => <Permissions 
                                                  decripHashLink={this.decripHashLink}
                                                  account={this.state.account}
                                                  perms={this.state.perms}
                                                  enviaPermissao={this.enviaPermissao}/>} />
        </Switch>
      </Router>
    );
  }
}

export default App;