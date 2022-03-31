import CriptDStorage from '../abis/CriptDStorage.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
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
       privateKey:  forge.pki.privateKeyFromPem(localStorage.getItem('privateKey'))
      })
      // this.setState({
      //  publicKey:  localStorage.getItem('publicKey'),
      //  privateKey: localStorage.getItem('privateKey')
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
      window.alert('Seu navegador não possui compatibilidade para o Ethereum. Recomendamos adicionar o MetaMask ao seu navegador!')
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
  }

  gerarChavesRSA(){
    var forge = require('node-forge');
    var rsa = forge.pki.rsa;

    //Gera as chaves
    var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});

    //Armazena provisóriamente no local storage
    localStorage.setItem('privateKey',  forge.pki.privateKeyToPem(keypair.privateKey));
    localStorage.setItem('publicKey',  forge.pki.publicKeyToPem(keypair.publicKey));
    this.setState({
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey
    })
  }

  criptografarRSA = hash  => {
    var forge = require('node-forge');

    console.log('Public: '+ forge.pki.publicKeyToPem(this.state.publicKey));
    console.log('Private: '+ forge.pki.privateKeyToPem(this.state.privateKey));

    //Criptografa o dado com a chave pública
    var encrypted =  this.state.publicKey.encrypt(hash);
    console.log('Criptografado: '+encrypted);

    return encrypted;
  }

  descriptografarRSA = criptHash => {
    var forge = require('node-forge');

    console.log('Private: '+ forge.pki.privateKeyToPem(this.state.privateKey));
    console.log('Hash: '+criptHash);

    //Descriptografa o dado com a chave privada
    //criptHash= forge.util.decode64(criptHash);
    var decrypted = this.state.privateKey.decrypt(criptHash);

    console.log('Decriptografado: '+decrypted);

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
    this.setState({
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

  //Envia o arquivo
  enviaArquivo = descricao => {
    console.log("Enviando Arquivo para o IPFS...")

    //Adiciona o arquivo ao IPFS
    ipfs.add(this.state.buffer, (error, result) => {
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
      
      /////RSA/////

      //Criptografar o resultado Hash do IPFS
      result[0].hash= this.criptografarRSA(result[0].hash);
      
      //Enviar para o contrato inteligente
      this.state.criptdstorage.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, descricao).send({ from: this.state.account }).on('transactionHash', (hash) => {
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

      /////ECC/////

      //Criptografar o resultado Hash do IPFS
      //this.criptografarECC(result[0].hash).then( resultado => {
      //  console.log("Resultado: "+resultado);
      //  //Enviar para o contrato inteligente 
      //  this.state.criptdstorage.methods.uploadFile(resultado, resultado.length, this.state.type, this.state.name, descricao).send({ from: this.state.account }).on('transactionHash', (hash) => {
      //    this.setState({
      //     loading: false,
      //     type: null,
      //     name: null
      //   })
      //   window.location.reload()
      //  }).on('error', (e) =>{
      //    window.alert('Error')
      //    this.setState({loading: false})
      //  })
      //});

    })
  }

  //Função para descriptografar o Hash Link para o conteúdo no IPFS
  decripHashLink = hash => {

    /////RSA/////
    var hashDescrip = this.descriptografarRSA(hash);
    return hashDescrip;

    /////ECC/////
    // console.log("Hash para descriptografar: "+hash);
    // this.descriptografarECC(hash).then( resultado => {
    //   console.log("Resultado: "+resultado);
    //   localStorage.setItem('hash',  resultado);
    //   return resultado;
    // });
    // return localStorage.getItem('hash');
  }

  //Construtor com as informações necessárias do contrato inteligente e da criptografia
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      criptdstorage: null,
      files: [],
      loading: false,
      type: null,
      name: null,
      publicKey: null,
      privateKey: null
    }
    this.enviaArquivo = this.enviaArquivo.bind(this)
    this.decripHashLink = this.decripHashLink.bind(this)
    this.capturaArquivo = this.capturaArquivo.bind(this)
    this.criptografarRSA = this.criptografarRSA.bind(this)
    this.descriptografarRSA = this.descriptografarRSA.bind(this)
    this.criptografarECC = this.criptografarECC.bind(this)
    this.descriptografarECC = this.descriptografarECC.bind(this)
  }

  //Função para redenrizar os componentes
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              decripHashLink={this.decripHashLink}
              files={this.state.files}
              capturaArquivo={this.capturaArquivo}
              enviaArquivo={this.enviaArquivo}
              account={this.state.account}
            />
        }
      </div>
    );
  }
}

export default App;