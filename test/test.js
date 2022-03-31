const CriptDStorage = artifacts.require('./CriptDStorage.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CriptDStorage', ([deployer, uploader]) => {
  let criptdstorage

  before(async () => {
    criptdstorage = await CriptDStorage.deployed()
  })

  describe('deployment', async () => {
    it('deploy realizado', async () => {
      const address = await criptdstorage.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('tem um nome', async () => {
      const name = await criptdstorage.name()
      assert.equal(name, 'CriptDStorage')
    })
  })

  describe('arquivo', async () => {
    let result, fileCount
    let fileHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
    let Hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
    const fileSize = '1'
    const fileType = 'Tipo'
    const fileName = 'Nome'
    const fileDescription = 'Descricao'

    var process = require('process')

    //RSA
    //var forge = require('node-forge');
    //var rsa = forge.pki.rsa;
    //var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});

    //ECC
    // var eccrypto = require("eccrypto");
    // var privateKey = eccrypto.generatePrivate();
    // var publicKey = eccrypto.getPublic(privateKey);
    // var data;

    before(async () => {
      //RSA
      //fileHash =  await keypair.publicKey.encrypt(Hash);

      //ECC
      // fileHash = await eccrypto.encrypt(publicKey, Buffer.from(fileHash));
      // data = JSON.stringify({
      //   iv: fileHash.iv.toString('hex'),
      //   ciphertext: fileHash.ciphertext.toString('hex'),
      //   mac: fileHash.mac.toString('hex'),
      //   ephemPublicKey: fileHash.ephemPublicKey.toString('hex')
      // });
      // var forge = require('node-forge');
      // fileHash = forge.util.encode64(data);

      let used = process.memoryUsage().heapUsed / 1024 / 1024;
      for (const [key,value] of Object.entries(process.memoryUsage())){
        console.log(`Memory usage by ${key}, ${value/1000000}MB `)
      }

      console.log(`------------------------------------------------------------------`)

      result = await criptdstorage.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, { from: uploader })
      fileCount = await criptdstorage.fileCount()

      used = process.memoryUsage().heapUsed / 1024 / 1024;
      for (const [key,value] of Object.entries(process.memoryUsage())){
        console.log(`Memory usage by ${key}, ${value/1000000}MB `)
      }
      console.log(`------------------------------------------------------------------`)

    })

    //Testa o evento
    it('upload arquivo', async () => {
      
      //SUCESSO
      assert.equal(fileCount, 1)
      const event = result.logs[0].args
      assert.equal(event.fileId.toNumber(), fileCount.toNumber(), 'Id correto')
      
      //RSA
      //assert.equal(keypair.privateKey.decrypt(event.fileHash), Hash, 'Hash correto')

      //ECC
      // var forge = require('node-forge');
      // var newData = forge.util.decode64(event.fileHash);
      // let encryptedContent = JSON.parse(newData);
      // encryptedContent = {
      //     iv: Buffer.from(encryptedContent.iv, 'hex'),
      //     ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
      //     mac: Buffer.from(encryptedContent.mac, 'hex'),
      //     ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex')
      // }
      // var deHash = await eccrypto.decrypt(privateKey, encryptedContent);
      // assert.equal(deHash, Hash, 'Hash correto')
      
      //Normal
      assert.equal(fileHash, Hash, 'Hash correto')
      
      let used = process.memoryUsage().heapUsed / 1024 / 1024;
      for (const [key,value] of Object.entries(process.memoryUsage())){
        console.log(`Memory usage by ${key}, ${value/1000000}MB `)
      }

      assert.equal(event.fileSize, fileSize, 'Tamanho correto')
      assert.equal(event.fileType, fileType, 'Tipo correto')
      assert.equal(event.fileName, fileName, 'Nome correto')
      assert.equal(event.fileDescription, fileDescription, 'Descricao correta')
      assert.equal(event.uploader, uploader, 'Emissor correto')

      //FALHA: arquivo sem hash, tamanho, tipo, nome, descrição
      await criptdstorage.uploadFile('', fileSize, fileType, fileName, fileDescription, { from: uploader }).should.be.rejected;

      await criptdstorage.uploadFile(fileHash, '', fileType, fileName, fileDescription, { from: uploader }).should.be.rejected;
      
      await criptdstorage.uploadFile(fileHash, fileSize, '', fileName, fileDescription, { from: uploader }).should.be.rejected;

      await criptdstorage.uploadFile(fileHash, fileSize, fileType, '', fileDescription, { from: uploader }).should.be.rejected;
      
      await criptdstorage.uploadFile(fileHash, fileSize, fileType, fileName, '', { from: uploader }).should.be.rejected;
    })
  })
})