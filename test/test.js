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
//     var fileSalt = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'
//     var Salt ='QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'

//     var fs = require('fs');
//     var data = fs.readFileSync('M:/BlockChain/dstoragestart/criptdstorage/test/exame2.zip');

//     var stringBuf = Buffer.from(data);

//     var encrypted = stringBuf;
    
//       //AES ENCRYPT
//       var crypto = require('crypto');

//       var algorithm = 'aes-256-ctr'; 
      
//       var secretKey = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ' //QmT6AQ5VEG1Be8hd5dXuEgq4TCH64p9VYNuNp7dK7nTZ4K QmPsuCYaYMs5HTJbZAYfvkC3iYM1kyBfw9njf6ffJdZmHd QmZLq6nXohnYkBke9PU7KUcaBmw71Qmhfz5EfTAAWSjcPT
      
//       fileSalt = secretKey;
//       Salt = secretKey;
  
//       var iv = crypto.randomBytes(16);
  
//       var cipher = crypto.createCipheriv(algorithm, secretKey, iv);
//       encrypted = Buffer.concat([iv, cipher.update(stringBuf), cipher.final()]);
  
  
      
//       //AES DECRYPT
//       var crypto = require('crypto');
  
//       var algorithm = 'aes-256-ctr';
  
//       var decipher,
//       iv;
//       // Get the iv: the first 16 bytes
//       iv = encrypted.slice(0, 16);
  
//       // Get the rest
//       encrypted = encrypted.slice(16);
  
//       // Create a decipher
//       var decipher = crypto.createDecipheriv(algorithm, Salt, iv);
  
//       var decrpyted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    

//     //IPFS

//     const ipfsClient = require('ipfs-http-client')
//     //Padrão
//     const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 
//     //Adiciona o arquivo ao IPFS
//     ipfs.add(encrypted, (error, result) => {
//       if(error) {

//         return
//     }
//       fileHash =  result[0].hash;

//     })

//     var process = require('process')

//     // //RSA
//     // var forge = require('node-forge');
//     // var rsa = forge.pki.rsa;
//     // var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});

//     ////ECC
//     var eccrypto = require("eccrypto");
//     var privateKey = eccrypto.generatePrivate();
//     var publicKey = eccrypto.getPublic(privateKey);
//     var data;
//     var hexPrivateKey = privateKey.toString('hex');
//     var hexPublicKey = publicKey.toString('hex');

//     before(async () => {
//       // //RSA
//       // fileHash =  await keypair.publicKey.encrypt(Hash);
//       // fileSalt =  await keypair.publicKey.encrypt(fileSalt);

//       ///////ECC
//       fileHash = await eccrypto.encrypt(publicKey, Buffer.from(fileHash));
//       data = JSON.stringify({
//         iv: fileHash.iv.toString('hex'),
//         ciphertext: fileHash.ciphertext.toString('hex'),
//         mac: fileHash.mac.toString('hex'),
//         ephemPublicKey: fileHash.ephemPublicKey.toString('hex')
//       });
//       var forge = require('node-forge');
//       fileHash = forge.util.encode64(data);
//       fileSalt = await eccrypto.encrypt(publicKey, Buffer.from(fileSalt));

//       data = JSON.stringify({
//         iv: fileSalt.iv.toString('hex'),
//         ciphertext: fileSalt.ciphertext.toString('hex'),
//         mac: fileSalt.mac.toString('hex'),
//         ephemPublicKey: fileSalt.ephemPublicKey.toString('hex')
//       });
//       var forge = require('node-forge');
//       fileSalt = forge.util.encode64(data);

//       result = await criptdstorage.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, fileSalt, { from: uploader })
//       fileCount = await criptdstorage.fileCount()
//     })
 
//     //Testa o evento
//     it('upload arquivo', async () => {

//       //SUCESSO
//       assert.equal(fileCount, 1)
//       const event = result.logs[0].args
//       assert.equal(event.fileId.toNumber(), fileCount.toNumber(), 'Id correto')
    
      
//       // //RSA
//       // assert.equal(keypair.privateKey.decrypt(event.fileHash), keypair.privateKey.decrypt(event.fileHash), 'Hash correto')
//       // assert.equal(keypair.privateKey.decrypt(event.salt), Salt, 'Salt correto')

//       //ECC
//       var forge = require('node-forge');
//       var newData = forge.util.decode64(event.fileHash);
//       let encryptedContent = JSON.parse(newData);
//       encryptedContent = {
//           iv: Buffer.from(encryptedContent.iv, 'hex'),
//           ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
//           mac: Buffer.from(encryptedContent.mac, 'hex'),
//           ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex')
//       }
//       var deHash = await eccrypto.decrypt(privateKey, encryptedContent);

//       assert.equal(deHash, Hash, 'Hash correto')
      
//       var newData2 = forge.util.decode64(event.salt);
//       let encryptedContent2 = JSON.parse(newData2);
//       encryptedContent2 = {
//           iv: Buffer.from(encryptedContent2.iv, 'hex'),
//           ciphertext: Buffer.from(encryptedContent2.ciphertext, 'hex'),
//           mac: Buffer.from(encryptedContent2.mac, 'hex'),
//           ephemPublicKey: Buffer.from(encryptedContent2.ephemPublicKey, 'hex')
//       }
//       var deSalt = await eccrypto.decrypt(privateKey, encryptedContent2);
//       assert.equal(deSalt, Salt, 'Salt correto')


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
    //var userKey = '04449d8cc19dac4422caaeb9ebdf81b9c2ecd70047f048e849d54b0e0f3eb5afb5f9021693d3a7d6296548b7155dbdca011ed99fb4e19849db41e013888bc1458f'
    // var userKey = '-----BEGIN PUBLIC KEY-----'+
    // 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhpxBi0Bb13w4fAn3aMAN'+
    // 'ecMga/EsyxCitEQYUMpKMxxn0bzWN1zaSd0gMiU5hFazlhdCY5nKelFCGqhSm1wW'+
    // 'FeBRJMbkAsLqA/rR7JIZXnx/bpkM7X8vT2j5w4+Oe2zf8N5sOp8rnK0aVX42J7xT'+
    // 'eHq6JL8MwBivARy3eUqzzX3nxnpwamHAFycp2Ha6oAdCsmN0Y0ISm63RVD779lL7'+
    // 'Q5AI4XRnZ6U+xhTLqbPmYe9qO75g0j1cFSYdiP+GzAfBuT88joP4ryuL7p8JeUSj'+
    // 'y2jYWtxxavWQZYbfm36bElk78A1o9u49xC6xwp1DU800/9lMm/FgLK2FGBjKEq/A'+
    // 'fQIDAQAB'+
    // '-----END PUBLIC KEY-----';

    var userKey = '-----BEGIN PUBLIC KEY----- MIIBojANBgkqhkiG9w0BAQEFAAO'+
                  'CAY8AMIIBigKCAYEAkep7BJLT3uogBfMW+p8G eNCXgc3QBJ085QJK7r'+
                  '4CjvcehDx63NnikyqaHcu+qK0viX6+Rxa/rjLDcvm7vgkH 1clwRBs3qRe'+
                  'M18sYcYQhoQlUjgqB6tUoB6GZoxpBAfpajgHXozK6DyTLsVCrspYh 5wHCow'+
                  '8jiXmu0Uza+o1sDoFSeK1kn5c8NeWoyLpib26Z3FiTg3VoeAHe4iQAfbNa XiL'+
                  '6m4LS1CxLR4WT0FWFsslIUIKZCjPCLGCq2+L/Subkof3xNJzpqKGDl0zmyoSz Wf'+
                  'lODu0awlU0msMtqmtgAMQykqbz/xP1jCmG2EueScF00nW+4xRMSbekGIvSbaGa 4Ar'+
                  'azZ63E+bwcwDYH7lKkORcQe74L0MJWDZ8QJ7KTFJOzcx82aJj2FyADY/Yp3aJ UMy5vx'+
                  'r5eruyNcVLKBBjGa/QTJ+XTT4F+mTTq8tYnODg0K4hnCq/8JoMxpqJBA8i Q1/MPiaWBCX'+
                  'Jt+4jmJrelBzQmA+1zfkE4Vz5vlJDt6QfAgMBAAE= -----END PUBLIC KEY-----';

    var salt = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ'
    var permTimeStart = 1232312131231
    var permTimeEnd = 1231231312312

    const crypto = require('crypto');
    const identificador = crypto.createHash('sha256').update(fileId).digest('base64');

    var process = require('process')

    //RSA
    var forge = require('node-forge');
    var rsa = forge.pki.rsa;
    var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});

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
    
      //AES
      var crypto = require('crypto');

      var algorithm = 'aes-256-ctr'; 
      
      var secretKey = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ';
  
      var iv = crypto.randomBytes(16);
  
      var cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  
      var encrypted = Buffer.concat([iv, cipher.update(forge.pki.privateKeyToPem(keypair.privateKey)), cipher.final()]);
      var encodEncrypted = encrypted.toString('base64');
    
      //RSA do SALT
      var ch = forge.pki.publicKeyFromPem(userKey);
      var encData =  ch.encrypt(salt);

      // /////ECC/////
      // //AES
      // var crypto = require('crypto');

      // var algorithm = 'aes-256-ctr'; 
      
      // var secretKey = 'QdlAWZozcg*qm9M^zXjlD0l@KPP2q3FQ';
  
      // var iv = crypto.randomBytes(16);
  
      // var cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  
      // var encrypted = Buffer.concat([iv, cipher.update(hexPrivateKey), cipher.final()]);
      
      // var encodEncrypted = encrypted.toString('base64');

      // //ECC do SALT
      // var newPublicKey = Buffer.from(userKey, 'hex');
      // var encrypted = await eccrypto.encrypt(newPublicKey, Buffer.from(salt));
      // var data2 = JSON.stringify({
      //   iv: encrypted.iv.toString('hex'),
      //   ciphertext: encrypted.ciphertext.toString('hex'),
      //   mac: encrypted.mac.toString('hex'),
      //   ephemPublicKey: encrypted.ephemPublicKey.toString('hex')
      // });
      // //Encode o data para 64
      // var forge = require('node-forge');
      // var encData = forge.util.encode64(data2);

      result = await criptdpermission.uploadPerm(permAdress, identificador, encodEncrypted, encData, permTimeStart, permTimeEnd, { from: uploader })
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
      var privKey2 = '-----BEGIN RSA PRIVATE KEY----- MIIEogIBAAKCAQEAhpxBi0Bb13w4fAn3aMANecMga/EsyxCitEQYUMpKMxxn0bzW N1zaSd0gMiU5hFazlhdCY5nKelFCGqhSm1wWFeBRJMbkAsLqA/rR7JIZXnx/bpkM 7X8vT2j5w4+Oe2zf8N5sOp8rnK0aVX42J7xTeHq6JL8MwBivARy3eUqzzX3nxnpw amHAFycp2Ha6oAdCsmN0Y0ISm63RVD779lL7Q5AI4XRnZ6U+xhTLqbPmYe9qO75g 0j1cFSYdiP+GzAfBuT88joP4ryuL7p8JeUSjy2jYWtxxavWQZYbfm36bElk78A1o 9u49xC6xwp1DU800/9lMm/FgLK2FGBjKEq/AfQIDAQABAoIBAEzoC16Gx7Imi5L6 krrrNwfBHs3s/b2K5Jp/aTEHUjs/WGVxMSZyS1j2GEXuFJ1yd6oh4dFL9W3K7SyT zJZsl0WqYlHTvEODnvXlIHi7w/jCwn+qu8MY7iu9ey1q4GnN+2f/e/BGLkGWeLwt nr03EK192MnTyXIa6CmHgZ+vuWiGWT4Sf2GxjhMdUGraZRqUgm5OuociFhg8J8rQ igbHHiafmdnYyu7oa/mmV2g0tRc+t0Bw2dtLfXcSOvLGqIwuATj4FERpV8AXQieU gtGIqsX/ryARlpYblaeATXCNiAfJeyhw+GPiZdmJ9qWHDQM4COvZ9SPGqZKVzCTc 1UR3ahUCgYEAwtz0GNDaTXgM6CDZ/MqIHx4pwNIxTOT14kJfjl+yQm6NrDEX57YQ SbykrC/M2ahKSubkbUwXulLUPVImF/rqCCLalxCHoTiflU7rORhnsTPUS9mheCHX nkrMifj8OadDU/q9cvNhVD0Nc0M1HPsJnNVpi+dZaKE1WFp/rdXDEPcCgYEAsNfq Dr4imIrF+P9EFC+qmiKGJdCa3Z0o7EROt0orAkOLsCAU0FF9zQTh4KdOgYziVMhS Xs9lmd2BjO6XVjmd5YQImPaZ1ssigAQBHG06Xfoso2ygHCLcykjn2WZLpxl0VUUJ 1Z0xvCoV6fJ/Qx9AGKYH55wxieIuax4P84AwkSsCgYAvnWoP/ki5kVImDpD1kk+8 utQdB7+AOJpUlT9gPMYEMZtwrfZXakeEnRHn+S4nKVYuA0lh46wQnVi7Oy2PwoIZ Rtr++s0JehqUk1oq82mzBSUk+6LXBf338fMU68BGHjb3eFd+lTX9LYXx2kRKNpVc u1E1HGzegjXUxxhX09n8dQKBgGiEI3v1GaNIGTtROp4nkc+o6dm9kVm7Aa2prVAc kJC09QDx5Ps9vnkGEq1glEBy0G1FO5F3R9gJFwEBHgZC5TP5tc8Zp9BPnCNGupVf ZOiX6/vmPjaC0DTpo8VT9RBcNeoTdH2Aex13Th5HSLmV5Z7rua5EHO8d80sxqEHE mG+jAoGAPhaZ2T8Tx8lD/t5I8z2veAIQckaUh1rYAVu3f7XPheou6N2xLH5YXWLc 1gyiCjK4eut5U9vI4Jkj0QLkSLcVJxpUKoGxWQTOgfZGV3Dq3NOtH0iBcYvPT+3z N1OQEcagjNZEUkNgcsM13SQf3lbgtMTkAKkrZ7+3HI/lvcKGqiY= -----END RSA PRIVATE KEY-----';
      privKey2 = forge.pki.privateKeyFromPem(privKey2);
      var desalt = privKey2.decrypt(event.salt);      

      assert.equal(desalt, salt, 'Salt correto')

      var chave = Buffer.from(event.userKey, 'base64'); 

      //FUNC
      var crypto = require('crypto');
      var algorithm = 'aes-256-ctr';

      var decipher,
      iv;
      iv = chave.slice(0, 16);
      chave = chave.slice(16);

      var decipher = crypto.createDecipheriv(algorithm, desalt, iv);
      var decrpyted = Buffer.concat([decipher.update(chave), decipher.final()]);
      //FUNC

      var forge = require('node-forge');

      assert.equal(decrpyted, forge.pki.privateKeyToPem(keypair.privateKey), 'Chave priv correta')




      // /////ECC

      // var privkey2 = 'a56143f461ac631247c18c4f6cf109964a9377f1b6ff4c93b10ce1a6efb5d5b2';
      // var newPrivKey = Buffer.from(privkey2, 'hex');
      
      // var forge = require('node-forge');
      // var newData = forge.util.decode64(event.salt);

      // //Parse JSON do newData e destranforma de hex
      // let encryptedContent = JSON.parse(newData);
      // encryptedContent = {
      //   iv: Buffer.from(encryptedContent.iv, 'hex'),
      //   ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
      //   mac: Buffer.from(encryptedContent.mac, 'hex'),
      //   ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex')
      // }

      // var decryptedSalt = await eccrypto.decrypt(newPrivKey, encryptedContent);
      // var chave = Buffer.from(event.userKey, 'base64');
      // //FUNC
      // var crypto = require('crypto');
      // var algorithm = 'aes-256-ctr';

      // var decipher,
      // iv;
      // iv = chave.slice(0, 16);
      // chave = chave.slice(16);

      // var decipher = crypto.createDecipheriv(algorithm, decryptedSalt, iv);
      // var decrpyted = Buffer.concat([decipher.update(chave), decipher.final()]); 

      // assert.equal(decryptedSalt, salt, 'Salt correto')
      // assert.equal(decrpyted, hexPrivateKey, 'Chave priv correta')




      assert.equal(event.permAdress, permAdress, 'Endereco correto')
      assert.equal(event.fileId, identificador, 'ID correto')
      assert.equal(event.permTimeStart, permTimeStart, 'Tempo ini correto')
      assert.equal(event.permTimeEnd, permTimeEnd, 'Tempo fim correta')
      assert.equal(event.uploader, uploader, 'Emissor correto')

      //FALHA: arquivo sem hash, tamanho, tipo, nome, descrição, salt
      await criptdpermission.uploadPerm('', fileId, userKey, salt, permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;

      await criptdpermission.uploadPerm(permAdress, '', userKey, salt, permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;
      
      await criptdpermission.uploadPerm(permAdress, fileId, '', salt, permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;

      await criptdpermission.uploadPerm(permAdress, fileId, userKey, '', permTimeStart, permTimeEnd, { from: uploader }).should.be.rejected;
      
      await criptdpermission.uploadPerm(permAdress, fileId, userKey, salt, '', permTimeEnd, { from: uploader }).should.be.rejected;
      
      await criptdpermission.uploadPerm(permAdress, fileId, userKey, salt, permTimeStart, '', { from: uploader }).should.be.rejected;

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