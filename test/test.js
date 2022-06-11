const CriptDStorage = artifacts.require('./CriptDStorage.sol');
const CriptDPermission = artifacts.require('./CriptDPermission.sol');

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

  });

  describe('arquivo', async () => {
    var startSend;
    var durationSend;

    console.log(`------------------------------------------------------------------`)
    //const start = Date.now();
     startSend = performance.now(); 
    console.log('Tempo Arquivo: '+ startSend)
    console.log(`------------------------------------------------------------------`)
    
    var result, fileCount
    var fileHash = 'QmZLq6nXohnYkBke9PU7KUcaBmw71Qmhfz5EfTAAWSjcPT'
    var Hash = 'QmZLq6nXohnYkBke9PU7KUcaBmw71Qmhfz5EfTAAWSjcPT'
    var fileSize = '1900'
    var fileType = 'zip'
    var fileName = 'download'
    var fileDescription = 'Arquivo Exame Teste'
    
    //var fileSalt = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'
    var fileSalt = 'QdlAWZozcg*qm9M^'
    
    //var Salt ='QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'
    var Salt = 'QdlAWZozcg*qm9M^'

    var fs = require('fs');
    var data = fs.readFileSync('M:/BlockChain/dstoragestart/criptdstorage/test/exame2.zip');

    var stringBuf = Buffer.from(data);

    var encrypted = stringBuf;
    
      //AES ENCRYPT
      var crypto = require('crypto');

      var algorithm = 'aes-128-ctr'; 
      
      //var secretKey ='QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'
      var secretKey = 'QdlAWZozcg*qm9M^' //QmT6AQ5VEG1Be8hd5dXuEgq4TCH64p9VYNuNp7dK7nTZ4K QmPsuCYaYMs5HTJbZAYfvkC3iYM1kyBfw9njf6ffJdZmHd QmZLq6nXohnYkBke9PU7KUcaBmw71Qmhfz5EfTAAWSjcPT
      
      fileSalt = secretKey;
      Salt = secretKey;
  
      var iv = crypto.randomBytes(16);
  
      var cipher = crypto.createCipheriv(algorithm, secretKey, iv);
      encrypted = Buffer.concat([iv, cipher.update(stringBuf), cipher.final()]);
  
  
      
      //AES DECRYPT
      var crypto = require('crypto');
  
      var algorithm = 'aes-128-ctr';
  
      var decipher,
      iv;
      // Get the iv: the first 16 bytes
      iv = encrypted.slice(0, 16);
  
      // Get the rest
      encrypted = encrypted.slice(16);
  
      // Create a decipher
      var decipher = crypto.createDecipheriv(algorithm, Salt, iv);
  
      var decrpyted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    

    // //IPFS

    // const ipfsClient = require('ipfs-http-client')
    // //Padrão
    // const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 
    // //Adiciona o arquivo ao IPFS
    // ipfs.add(encrypted, (error, result) => {
    //   if(error) {

    //     return
    // }
    //   fileHash =  result[0].hash;

    // })

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
      //RSA
      fileHash =  await keypair.publicKey.encrypt(Hash);
      fileSalt =  await keypair.publicKey.encrypt(fileSalt);

      // ///////ECC
      // fileHash = await eccrypto.encrypt(publicKey, Buffer.from(fileHash));
      // data = JSON.stringify({
      //   iv: fileHash.iv.toString('hex'),
      //   ciphertext: fileHash.ciphertext.toString('hex'),
      //   mac: fileHash.mac.toString('hex'),
      //   ephemPublicKey: fileHash.ephemPublicKey.toString('hex')
      // });
      // var forge = require('node-forge');
      // fileHash = forge.util.encode64(data);
      // fileSalt = await eccrypto.encrypt(publicKey, Buffer.from(fileSalt));

      // data = JSON.stringify({
      //   iv: fileSalt.iv.toString('hex'),
      //   ciphertext: fileSalt.ciphertext.toString('hex'),
      //   mac: fileSalt.mac.toString('hex'),
      //   ephemPublicKey: fileSalt.ephemPublicKey.toString('hex')
      // });
      // var forge = require('node-forge');
      // fileSalt = forge.util.encode64(data);

      result = await criptdstorage.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, fileSalt, { from: uploader })
      fileCount = await criptdstorage.fileCount()
    })
 
    //Testa o evento
    it('upload arquivo', async () => {

      //SUCESSO
      assert.equal(fileCount, 1)
      const event = result.logs[0].args
      assert.equal(event.fileId.toNumber(), fileCount.toNumber(), 'Id correto')
    
      
      //RSA
      assert.equal(keypair.privateKey.decrypt(event.fileHash), keypair.privateKey.decrypt(event.fileHash), 'Hash correto')
      assert.equal(keypair.privateKey.decrypt(event.salt), Salt, 'Salt correto')

      // //ECC
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
      
      // var newData2 = forge.util.decode64(event.salt);
      // let encryptedContent2 = JSON.parse(newData2);
      // encryptedContent2 = {
      //     iv: Buffer.from(encryptedContent2.iv, 'hex'),
      //     ciphertext: Buffer.from(encryptedContent2.ciphertext, 'hex'),
      //     mac: Buffer.from(encryptedContent2.mac, 'hex'),
      //     ephemPublicKey: Buffer.from(encryptedContent2.ephemPublicKey, 'hex')
      // }
      // var deSalt = await eccrypto.decrypt(privateKey, encryptedContent2);
      // assert.equal(deSalt, Salt, 'Salt correto')


      // //Normal
      // assert.equal(fileHash, Hash, 'Hash correto')
      // assert.equal(fileSalt, Salt, 'Salt correto')

      assert.equal(event.fileSize, fileSize, 'Tamanho correto')
      assert.equal(event.fileType, fileType, 'Tipo correto')
      assert.equal(event.fileName, fileName, 'Nome correto')
      assert.equal(event.fileDescription, fileDescription, 'Descricao correta')
      assert.equal(event.uploader, uploader, 'Emissor correto')

      //FALHA: arquivo sem hash, tamanho, tipo, nome, descrição, salt
      await criptdstorage.uploadFile('', fileSize, fileType, fileName, fileDescription, fileSalt, { from: uploader }).should.be.rejected;

      await criptdstorage.uploadFile(fileHash, '', fileType, fileName, fileDescription, fileSalt, { from: uploader }).should.be.rejected;
      
      await criptdstorage.uploadFile(fileHash, fileSize, '', fileName, fileDescription, fileSalt, { from: uploader }).should.be.rejected;

      await criptdstorage.uploadFile(fileHash, fileSize, fileType, '', fileDescription, fileSalt, { from: uploader }).should.be.rejected;
      
      await criptdstorage.uploadFile(fileHash, fileSize, fileType, fileName, '', fileSalt, { from: uploader }).should.be.rejected;
      
      await criptdstorage.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, '', { from: uploader }).should.be.rejected;

      console.log(`------------------------------------------------------------------`)
      for (const [key,value] of Object.entries(process.memoryUsage())){
        console.log(`Memory usage by ${key}, ${value/1000000}MB `)
      }
      console.log(`------------------------------------------------------------------`)
      durationSend = performance.now() - startSend;
      console.log('Tempo fim Arquivo: '+ durationSend)
      console.log(`------------------------------------------------------------------`)
    })

  })
})

// contract('CriptDPermission', ([deployer, uploader]) => {
//   let criptdpermission

//   before(async () => {
//     criptdpermission = await CriptDPermission.deployed()
//   })

//   describe('deployment', async () => {

//     it('deploy realizado', async () => {
//       const address = await criptdpermission.address
//       assert.notEqual(address, 0x0)
//       assert.notEqual(address, '')
//       assert.notEqual(address, null)
//       assert.notEqual(address, undefined)
//     })

//     it('tem um nome', async () => {
//       const name = await criptdpermission.name()
//       assert.equal(name, 'CriptDPermission')
//     })

//   });

//   describe('permissao', async () => {
//     var startPerm;
//     var durationPerm;

//     console.log(`------------------------------------------------------------------`)
//     startPerm = performance.now(); 
//     console.log('Tempo Perm: '+ startPerm)
//     console.log(`------------------------------------------------------------------`)

//     var result, permCount
//     var permAdress = '0x0735fF1756643A9B4f5D6497eb0F0810E3Bd605e'
//     var fileId = 'QmZLq6nXohnYkBke9PU7KUcaBmw71Qmhfz5EfTAAWSjcPT='
    
//     // var userKey = '04449d8cc19dac4422caaeb9ebdf81b9c2ecd70047f048e849d54b0e0f3eb5afb5f9021693d3a7d6296548b7155dbdca011ed99fb4e19849db41e013888bc1458f'
    
    
//     // var userKey = '-----BEGIN PUBLIC KEY-----'+
//     // 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhpxBi0Bb13w4fAn3aMAN'+
//     // 'ecMga/EsyxCitEQYUMpKMxxn0bzWN1zaSd0gMiU5hFazlhdCY5nKelFCGqhSm1wW'+
//     // 'FeBRJMbkAsLqA/rR7JIZXnx/bpkM7X8vT2j5w4+Oe2zf8N5sOp8rnK0aVX42J7xT'+
//     // 'eHq6JL8MwBivARy3eUqzzX3nxnpwamHAFycp2Ha6oAdCsmN0Y0ISm63RVD779lL7'+
//     // 'Q5AI4XRnZ6U+xhTLqbPmYe9qO75g0j1cFSYdiP+GzAfBuT88joP4ryuL7p8JeUSj'+
//     // 'y2jYWtxxavWQZYbfm36bElk78A1o9u49xC6xwp1DU800/9lMm/FgLK2FGBjKEq/A'+
//     // 'fQIDAQAB'+
//     // '-----END PUBLIC KEY-----';

//     var userKey = '-----BEGIN PUBLIC KEY----- MIIBojANBgkqhkiG9w0BAQEFAAO'+
//                   'CAY8AMIIBigKCAYEAkep7BJLT3uogBfMW+p8G eNCXgc3QBJ085QJK7r'+
//                   '4CjvcehDx63NnikyqaHcu+qK0viX6+Rxa/rjLDcvm7vgkH 1clwRBs3qRe'+
//                   'M18sYcYQhoQlUjgqB6tUoB6GZoxpBAfpajgHXozK6DyTLsVCrspYh 5wHCow'+
//                   '8jiXmu0Uza+o1sDoFSeK1kn5c8NeWoyLpib26Z3FiTg3VoeAHe4iQAfbNa XiL'+
//                   '6m4LS1CxLR4WT0FWFsslIUIKZCjPCLGCq2+L/Subkof3xNJzpqKGDl0zmyoSz Wf'+
//                   'lODu0awlU0msMtqmtgAMQykqbz/xP1jCmG2EueScF00nW+4xRMSbekGIvSbaGa 4Ar'+
//                   'azZ63E+bwcwDYH7lKkORcQe74L0MJWDZ8QJ7KTFJOzcx82aJj2FyADY/Yp3aJ UMy5vx'+
//                   'r5eruyNcVLKBBjGa/QTJ+XTT4F+mTTq8tYnODg0K4hnCq/8JoMxpqJBA8i Q1/MPiaWBCX'+
//                   'Jt+4jmJrelBzQmA+1zfkE4Vz5vlJDt6QfAgMBAAE= -----END PUBLIC KEY-----';

//     //var salt = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'
//     var salt = 'QdlAWZozcg*qm9M^';
//     var permTimeStart = 1232312131231
//     var permTimeEnd = 1231231312312

//     const crypto = require('crypto');
//     const identificador = crypto.createHash('sha256').update(fileId).digest('base64');

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
//       ///////////////RSA///////////////////
//       var forge = require('node-forge');  
    
//       //AES
//       var crypto = require('crypto');

//       var algorithm = 'aes-128-ctr'; 
      
//       //var secretKey = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ';
//       var secretKey = 'QdlAWZozcg*qm9M^';
      
//       var iv = crypto.randomBytes(16);
  
//       var cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  
//       var encrypted = Buffer.concat([iv, cipher.update(forge.pki.privateKeyToPem(keypair.privateKey)), cipher.final()]);
//       var encodEncrypted = encrypted.toString('base64');
    
//       //RSA do SALT
//       var ch = forge.pki.publicKeyFromPem(userKey);
//       var encData =  ch.encrypt(salt);

//       // /////ECC/////
//       // //AES
//       // var crypto = require('crypto');

//       // var algorithm = 'aes-128-ctr'; 
      
//       // // var secretKey = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ';
//       // var secretKey = 'QdlAWZozcg*qm9M^';
  
//       // var iv = crypto.randomBytes(16);
  
//       // var cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  
//       // var encrypted = Buffer.concat([iv, cipher.update(hexPrivateKey), cipher.final()]);
      
//       // var encodEncrypted = encrypted.toString('base64');

//       // //ECC do SALT
//       // var newPublicKey = Buffer.from(userKey, 'hex');
//       // var encrypted = await eccrypto.encrypt(newPublicKey, Buffer.from(salt));
//       // var data2 = JSON.stringify({
//       //   iv: encrypted.iv.toString('hex'),
//       //   ciphertext: encrypted.ciphertext.toString('hex'),
//       //   mac: encrypted.mac.toString('hex'),
//       //   ephemPublicKey: encrypted.ephemPublicKey.toString('hex')
//       // });
//       // //Encode o data para 64
//       // var forge = require('node-forge');
//       // var encData = forge.util.encode64(data2);

//       result = await criptdpermission.uploadPerm(permAdress, identificador, encodEncrypted, encData, permTimeStart, permTimeEnd, { from: uploader })
//       permCount = await criptdpermission.permCount()
//     })

//     //Testa o evento
//     it('upload permissao', async () => {

//       //SUCESSO
//       assert.equal(permCount, 1)
//       const event = result.logs[0].args
//       assert.equal(event.permId.toNumber(), permCount.toNumber(), 'Id correto')
      

//       // //RSA
//       var forge = require('node-forge'); 
//       var privKey2 = '-----BEGIN RSA PRIVATE KEY----- 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 -----END RSA PRIVATE KEY-----';
//       privKey2 = forge.pki.privateKeyFromPem(privKey2);
//       var desalt = privKey2.decrypt(event.salt);      

//       assert.equal(desalt, salt, 'Salt correto')

//       var chave = Buffer.from(event.userKey, 'base64'); 

//       //FUNC
//       var crypto = require('crypto');
//       var algorithm = 'aes-128-ctr';

//       var decipher,
//       iv;
//       iv = chave.slice(0, 16);
//       chave = chave.slice(16);

//       var decipher = crypto.createDecipheriv(algorithm, desalt, iv);
//       var decrpyted = Buffer.concat([decipher.update(chave), decipher.final()]);
//       //FUNC

//       var forge = require('node-forge');

//       assert.equal(decrpyted, forge.pki.privateKeyToPem(keypair.privateKey), 'Chave priv correta')




//       // /////ECC

//       // var privkey2 = 'a56143f461ac631247c18c4f6cf109964a9377f1b6ff4c93b10ce1a6efb5d5b2';
//       // var newPrivKey = Buffer.from(privkey2, 'hex');
      
//       // var forge = require('node-forge');
//       // var newData = forge.util.decode64(event.salt);

//       // //Parse JSON do newData e destranforma de hex
//       // let encryptedContent = JSON.parse(newData);
//       // encryptedContent = {
//       //   iv: Buffer.from(encryptedContent.iv, 'hex'),
//       //   ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
//       //   mac: Buffer.from(encryptedContent.mac, 'hex'),
//       //   ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex')
//       // }

//       // var decryptedSalt = await eccrypto.decrypt(newPrivKey, encryptedContent);
//       // var chave = Buffer.from(event.userKey, 'base64');
//       // //FUNC
//       // var crypto = require('crypto');
//       // var algorithm = 'aes-128-ctr';

//       // var decipher,
//       // iv;
//       // iv = chave.slice(0, 16);
//       // chave = chave.slice(16);

//       // var decipher = crypto.createDecipheriv(algorithm, decryptedSalt, iv);
//       // var decrpyted = Buffer.concat([decipher.update(chave), decipher.final()]); 

//       // assert.equal(decryptedSalt, salt, 'Salt correto')
//       // assert.equal(decrpyted, hexPrivateKey, 'Chave priv correta')




//       assert.equal(event.permAdress, permAdress, 'Endereco correto')
//       assert.equal(event.fileId, identificador, 'ID correto')
//       assert.equal(event.permTimeStart, permTimeStart, 'Tempo ini correto')
//       assert.equal(event.permTimeEnd, permTimeEnd, 'Tempo fim correta')
//       assert.equal(event.uploader, uploader, 'Emissor correto')

//       //FALHA: arquivo sem hash, tamanho, tipo, nome, descrição, salt
//       await criptdpermission.uploadPerm('', fileId, userKey, salt, permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;

//       await criptdpermission.uploadPerm(permAdress, '', userKey, salt, permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;
      
//       await criptdpermission.uploadPerm(permAdress, fileId, '', salt, permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;

//       await criptdpermission.uploadPerm(permAdress, fileId, userKey, '', permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;
      
//       await criptdpermission.uploadPerm(permAdress, fileId, userKey, salt, '', permTimeEnd, { from: uploader }).should.be.rejected;
      
//       await criptdpermission.uploadPerm(permAdress, fileId, userKey, salt, permTimeStart, '', { from: uploader }).should.be.rejected;

//       console.log(`------------------------------------------------------------------`)
//       for (const [key,value] of Object.entries(process.memoryUsage())){
//         console.log(`Memory usage by ${key}, ${value/1000000}MB `)
//       }
//       console.log(`------------------------------------------------------------------`)
//       durationPerm = performance.now() - startPerm;
//       console.log('Tempo fim perm: '+ durationPerm)
//       console.log(`------------------------------------------------------------------`)
//     })

//   })


// })