const CriptDStorage = artifacts.require('./CriptDStorage.sol');
const CriptDPermission = artifacts.require('./CriptDPermission.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

// contract('CriptDStorage', ([deployer, uploader]) => {
//   let criptdstorage

//   before(async () => {
//     criptdstorage = await CriptDStorage.deployed()
//   })

//   describe('deployment', async () => {

//     it('deploy realizado', async () => {
//       const address = await criptdstorage.address
//       assert.notEqual(address, 0x0)
//       assert.notEqual(address, '')
//       assert.notEqual(address, null)
//       assert.notEqual(address, undefined)
//     })

//     it('tem um nome', async () => {
//       const name = await criptdstorage.name()
//       assert.equal(name, 'CriptDStorage')
//     })

//   });

//   describe('arquivo', async () => {
//     var startSend;
//     var durationSend;

//     console.log(`------------------------------------------------------------------`)
//     //const start = Date.now();
//      startSend = performance.now(); 
//     console.log('Tempo Arquivo: '+ startSend)
//     console.log(`------------------------------------------------------------------`)
    
//     var result, fileCount
//     var fileHash = 'QmZLq6nXohnYkBke9PU7KUcaBmw71Qmhfz5EfTAAWSjcPT'
//     var Hash = 'QmZLq6nXohnYkBke9PU7KUcaBmw71Qmhfz5EfTAAWSjcPT'
//     var fileSize = '1900'
//     var fileType = 'zip'
//     var fileName = 'download'
//     var fileDescription = 'Arquivo Exame Teste'
    
//     //var fileSalt = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'
//     var fileSalt = 'QdlAWZozcg*qm9M^'
    
//     //var Salt ='QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'
//     var Salt = 'QdlAWZozcg*qm9M^'

//     var fs = require('fs');
//     var data = fs.readFileSync('M:/BlockChain/dstoragestart/criptdstorage/test/exame2.zip');

//     var stringBuf = Buffer.from(data);

//     var encrypted = stringBuf;
    
//       //AES ENCRYPT
//       var crypto = require('crypto');

//       var algorithm = 'aes-128-ctr'; 
      
//       //var secretKey ='QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'
//       var secretKey = 'QdlAWZozcg*qm9M^' //QmT6AQ5VEG1Be8hd5dXuEgq4TCH64p9VYNuNp7dK7nTZ4K QmPsuCYaYMs5HTJbZAYfvkC3iYM1kyBfw9njf6ffJdZmHd QmZLq6nXohnYkBke9PU7KUcaBmw71Qmhfz5EfTAAWSjcPT
      
//       fileSalt = secretKey;
//       Salt = secretKey;
  
//       var iv = crypto.randomBytes(16);
  
//       var cipher = crypto.createCipheriv(algorithm, secretKey, iv);
//       encrypted = Buffer.concat([iv, cipher.update(stringBuf), cipher.final()]);
  
  
      
//       //AES DECRYPT
//       var crypto = require('crypto');
  
//       var algorithm = 'aes-128-ctr';
  
//       var decipher,
//       iv;
//       // Get the iv: the first 16 bytes
//       iv = encrypted.slice(0, 16);
  
//       // Get the rest
//       encrypted = encrypted.slice(16);
  
//       // Create a decipher
//       var decipher = crypto.createDecipheriv(algorithm, Salt, iv);
  
//       var decrpyted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    

//     // //IPFS

//     // const ipfsClient = require('ipfs-http-client')
//     // //Padrão
//     // const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 
//     // //Adiciona o arquivo ao IPFS
//     // ipfs.add(encrypted, (error, result) => {
//     //   if(error) {

//     //     return
//     // }
//     //   fileHash =  result[0].hash;

//     // })

//     var process = require('process')

//     //RSA
//     var forge = require('node-forge');
//     var rsa = forge.pki.rsa;
//     var keypair = rsa.generateKeyPair({bits: 3072, e: 0x10001});

//     // ////ECC
//     // var eccrypto = require("eccrypto");
//     // var privateKey = eccrypto.generatePrivate();
//     // var publicKey = eccrypto.getPublic(privateKey);
//     // var data;
//     // var hexPrivateKey = privateKey.toString('hex');
//     // var hexPublicKey = publicKey.toString('hex');

//     before(async () => {
//       //RSA
//       fileHash =  await keypair.publicKey.encrypt(Hash);
//       fileSalt =  await keypair.publicKey.encrypt(fileSalt);

//       // ///////ECC
//       // fileHash = await eccrypto.encrypt(publicKey, Buffer.from(fileHash));
//       // data = JSON.stringify({
//       //   iv: fileHash.iv.toString('hex'),
//       //   ciphertext: fileHash.ciphertext.toString('hex'),
//       //   mac: fileHash.mac.toString('hex'),
//       //   ephemPublicKey: fileHash.ephemPublicKey.toString('hex')
//       // });
//       // var forge = require('node-forge');
//       // fileHash = forge.util.encode64(data);
//       // fileSalt = await eccrypto.encrypt(publicKey, Buffer.from(fileSalt));

//       // data = JSON.stringify({
//       //   iv: fileSalt.iv.toString('hex'),
//       //   ciphertext: fileSalt.ciphertext.toString('hex'),
//       //   mac: fileSalt.mac.toString('hex'),
//       //   ephemPublicKey: fileSalt.ephemPublicKey.toString('hex')
//       // });
//       // var forge = require('node-forge');
//       // fileSalt = forge.util.encode64(data);

//       result = await criptdstorage.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, fileSalt, { from: uploader })
//       fileCount = await criptdstorage.fileCount()
//     })
 
//     //Testa o evento
//     it('upload arquivo', async () => {

//       //SUCESSO
//       assert.equal(fileCount, 1)
//       const event = result.logs[0].args
//       assert.equal(event.fileId.toNumber(), fileCount.toNumber(), 'Id correto')
    
      
//       //RSA
//       assert.equal(keypair.privateKey.decrypt(event.fileHash), keypair.privateKey.decrypt(event.fileHash), 'Hash correto')
//       assert.equal(keypair.privateKey.decrypt(event.salt), Salt, 'Salt correto')

//       // //ECC
//       // var forge = require('node-forge');
//       // var newData = forge.util.decode64(event.fileHash);
//       // let encryptedContent = JSON.parse(newData);
//       // encryptedContent = {
//       //     iv: Buffer.from(encryptedContent.iv, 'hex'),
//       //     ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
//       //     mac: Buffer.from(encryptedContent.mac, 'hex'),
//       //     ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex')
//       // }
//       // var deHash = await eccrypto.decrypt(privateKey, encryptedContent);

//       // assert.equal(deHash, Hash, 'Hash correto')
      
//       // var newData2 = forge.util.decode64(event.salt);
//       // let encryptedContent2 = JSON.parse(newData2);
//       // encryptedContent2 = {
//       //     iv: Buffer.from(encryptedContent2.iv, 'hex'),
//       //     ciphertext: Buffer.from(encryptedContent2.ciphertext, 'hex'),
//       //     mac: Buffer.from(encryptedContent2.mac, 'hex'),
//       //     ephemPublicKey: Buffer.from(encryptedContent2.ephemPublicKey, 'hex')
//       // }
//       // var deSalt = await eccrypto.decrypt(privateKey, encryptedContent2);
//       // assert.equal(deSalt, Salt, 'Salt correto')


//       // //Normal
//       // assert.equal(fileHash, Hash, 'Hash correto')
//       // assert.equal(fileSalt, Salt, 'Salt correto')

//       assert.equal(event.fileSize, fileSize, 'Tamanho correto')
//       assert.equal(event.fileType, fileType, 'Tipo correto')
//       assert.equal(event.fileName, fileName, 'Nome correto')
//       assert.equal(event.fileDescription, fileDescription, 'Descricao correta')
//       assert.equal(event.uploader, uploader, 'Emissor correto')

//       //FALHA: arquivo sem hash, tamanho, tipo, nome, descrição, salt
//       await criptdstorage.uploadFile('', fileSize, fileType, fileName, fileDescription, fileSalt, { from: uploader }).should.be.rejected;

//       await criptdstorage.uploadFile(fileHash, '', fileType, fileName, fileDescription, fileSalt, { from: uploader }).should.be.rejected;
      
//       await criptdstorage.uploadFile(fileHash, fileSize, '', fileName, fileDescription, fileSalt, { from: uploader }).should.be.rejected;

//       await criptdstorage.uploadFile(fileHash, fileSize, fileType, '', fileDescription, fileSalt, { from: uploader }).should.be.rejected;
      
//       await criptdstorage.uploadFile(fileHash, fileSize, fileType, fileName, '', fileSalt, { from: uploader }).should.be.rejected;
      
//       await criptdstorage.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, '', { from: uploader }).should.be.rejected;

//       console.log(`------------------------------------------------------------------`)
//       for (const [key,value] of Object.entries(process.memoryUsage())){
//         console.log(`Memory usage by ${key}, ${value/1000000}MB `)
//       }
//       console.log(`------------------------------------------------------------------`)
//       durationSend = performance.now() - startSend;
//       console.log('Tempo fim Arquivo: '+ durationSend)
//       console.log(`------------------------------------------------------------------`)
//     })

//   })
// })

contract('CriptDPermission', ([deployer, uploader]) => {
  let criptdpermission

  before(async () => {
    criptdpermission = await CriptDPermission.deployed()
  })

  describe('deployment', async () => {

    it('deploy realizado', async () => {
      const address = await criptdpermission.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('tem um nome', async () => {
      const name = await criptdpermission.name()
      assert.equal(name, 'CriptDPermission')
    })

  });

  describe('permissao', async () => {
    var startPerm;
    var durationPerm;

    console.log(`------------------------------------------------------------------`)
    startPerm = performance.now(); 
    console.log('Tempo Perm: '+ startPerm)
    console.log(`------------------------------------------------------------------`)

    var result, permCount
    var permAdress = '0x0735fF1756643A9B4f5D6497eb0F0810E3Bd605e'
    var fileId = 'QmZLq6nXohnYkBke9PU7KUcaBmw71Qmhfz5EfTAAWSjcPT='

    var userKey = '04449d8cc19dac4422caaeb9ebdf81b9c2ecd70047f048e849d54b0e0f3eb5afb5f9021693d3a7d6296548b7155dbdca011ed99fb4e19849db41e013888bc1458f'

    //var salt = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'
    var salt = 'QdlAWZozcg*qm9M^';
    var criptsalt = '';
    var permTimeStart = 1232312131231
    var permTimeEnd = 1231231312312

    const crypto = require('crypto');

    var process = require('process')

    //RSA
    var forge = require('node-forge');
    var rsa = forge.pki.rsa;
    var keypair = rsa.generateKeyPair({bits: 3072, e: 0x10001});

    // ////ECC
    // var eccrypto = require("eccrypto");
    // var privateKey = eccrypto.generatePrivate();
    // var publicKey = eccrypto.getPublic(privateKey);
    // var data;
    // var hexPrivateKey = privateKey.toString('hex');
    // var hexPublicKey = publicKey.toString('hex');

    before(async () => {
      ///////////////RSA///////////////////
      var forge = require('node-forge');  
    
      //RSA do SALT
      var ch = forge.pki.publicKeyFromPem(forge.pki.publicKeyToPem(keypair.publicKey));
      criptsalt = keypair.publicKey.encrypt(salt);
      console.log('Data: '+ criptsalt)
      salt = keypair.privateKey.decrypt(criptsalt);
      var hashID = keypair.publicKey.encrypt(fileId);

      // /////ECC/////
      // //ECC do SALT
      // var newPublicKey = Buffer.from(userKey, 'hex');
      // var criptsalt1 = await eccrypto.encrypt(publicKey, Buffer.from(salt));
      // var data2 = JSON.stringify({
      //   iv: criptsalt1.iv.toString('hex'),
      //   ciphertext: criptsalt1.ciphertext.toString('hex'),
      //   mac: criptsalt1.mac.toString('hex'),
      //   ephemPublicKey: criptsalt1.ephemPublicKey.toString('hex')
      // });
      // //Encode o data para 64
      // var forge = require('node-forge');
      // var criptsalt = forge.util.encode64(data2);

      // //ECC do SALT
      // var newData = forge.util.decode64(criptsalt);
      // //Parse JSON do newData e destranforma de hex
      // let encryptedContent = JSON.parse(newData);
      // encryptedContent = {
      //   iv: Buffer.from(encryptedContent.iv, 'hex'),
      //   ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
      //   mac: Buffer.from(encryptedContent.mac, 'hex'),
      //   ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex')
      // }
      // var decryptedSalt = await eccrypto.decrypt(privateKey, encryptedContent);

      // //ECC do HASH
      // var hashID1 = await eccrypto.encrypt(publicKey, Buffer.from(fileId));
      // var data3 = JSON.stringify({
      //   iv: hashID1.iv.toString('hex'),
      //   ciphertext: hashID1.ciphertext.toString('hex'),
      //   mac: hashID1.mac.toString('hex'),
      //   ephemPublicKey: hashID1.ephemPublicKey.toString('hex')
      // });
      // //Encode o data para 64
      // var forge = require('node-forge');
      // var hashID = forge.util.encode64(data3);


      result = await criptdpermission.uploadPerm('Perm Teste', permAdress, 'pdf', hashID, criptsalt, permTimeStart, permTimeEnd, { from: uploader })
      permCount = await criptdpermission.permCount()
    })

    //Testa o evento
    it('upload permissao', async () => {

      //SUCESSO
      assert.equal(permCount, 1)
      const event = result.logs[0].args
      assert.equal(event.permId.toNumber(), permCount.toNumber(), 'Id correto')
      

      // //RSA
      var forge = require('node-forge');
      var desalt = keypair.privateKey.decrypt(event.sectKey);      

      assert.equal(desalt, salt, 'Salt correto')
      
      var dehash = keypair.privateKey.decrypt(event.fileHash);  
      assert.equal(dehash, fileId, 'Hash Correto')


      // /////ECC
      
      // var forge = require('node-forge');
      // var newData = forge.util.decode64(event.sectKey);

      // //Parse JSON do newData e destranforma de hex
      // let encryptedContent = JSON.parse(newData);
      // encryptedContent = {
      //   iv: Buffer.from(encryptedContent.iv, 'hex'),
      //   ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
      //   mac: Buffer.from(encryptedContent.mac, 'hex'),
      //   ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex')
      // }

      // var decryptedSalt = await eccrypto.decrypt(privateKey, encryptedContent);

      // var newData2 = forge.util.decode64(event.fileHash);

      // //Parse JSON do newData e destranforma de hex
      // let encryptedContent2 = JSON.parse(newData2);
      // encryptedContent2 = {
      //   iv: Buffer.from(encryptedContent2.iv, 'hex'),
      //   ciphertext: Buffer.from(encryptedContent2.ciphertext, 'hex'),
      //   mac: Buffer.from(encryptedContent2.mac, 'hex'),
      //   ephemPublicKey: Buffer.from(encryptedContent2.ephemPublicKey, 'hex')
      // }
      // var decryptedHash = await eccrypto.decrypt(privateKey, encryptedContent2);
      // assert.equal(decryptedSalt, salt, 'Salt correto')
      // assert.equal(decryptedHash, fileId, 'Hash Correto')




      assert.equal(event.permAdress, permAdress, 'Endereco correto')
      assert.equal(event.fileType, 'pdf', 'ID correto')
      assert.equal(event.permDescription, 'Perm Teste', 'ID correto')
      assert.equal(event.permTimeStart, permTimeStart, 'Tempo ini correto')
      assert.equal(event.permTimeEnd, permTimeEnd, 'Tempo fim correta')
      assert.equal(event.uploader, uploader, 'Emissor correto')

      //FALHA: permissao sem infos
      await criptdpermission.uploadPerm('', permAdress, 'pdf', fileId, salt, permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;

      await criptdpermission.uploadPerm('Perm Teste', '', 'pdf', fileId, salt, permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;
      
      await criptdpermission.uploadPerm('Perm Teste', permAdress, '', fileId, salt, permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;

      await criptdpermission.uploadPerm('Perm Teste', permAdress, 'pdf', '', salt, permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;
      
      await criptdpermission.uploadPerm('Perm Teste', permAdress, 'pdf', fileId, '', permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;
      
      await criptdpermission.uploadPerm('Perm Teste', permAdress, 'pdf', fileId, salt, '', permTimeEnd, { from: uploader }).should.be.rejected;
      
      await criptdpermission.uploadPerm('Perm Teste', permAdress, 'pdf', fileId, salt, permTimeStart, '', { from: uploader }).should.be.rejected;

      console.log(`------------------------------------------------------------------`)
      for (const [key,value] of Object.entries(process.memoryUsage())){
        console.log(`Memory usage by ${key}, ${value/1000000}MB `)
      }
      console.log(`------------------------------------------------------------------`)
      durationPerm = performance.now() - startPerm;
      console.log('Tempo fim perm: '+ durationPerm)
      console.log(`------------------------------------------------------------------`)
    })

  })


})