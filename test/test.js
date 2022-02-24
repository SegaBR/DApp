const CriptDStorage = artifacts.require('./CriptDStorage.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CriptDStorage', ([deployer, uploader]) => {
  let criptdstorage

  before(async () => {
    criptdstorage = await CriptDStorage.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
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
    const fileHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
    const fileSize = '1'
    const fileType = 'Tipo'
    const fileName = 'Nome'
    const fileDescription = 'Descricao'

    before(async () => {
      result = await criptdstorage.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, { from: uploader })
      fileCount = await criptdstorage.fileCount()
    })

    //Tetsa o evento
    it('upload arquivo', async () => {
      //SUCESSO
      assert.equal(fileCount, 1)
      const event = result.logs[0].args
      assert.equal(event.fileId.toNumber(), fileCount.toNumber(), 'Id correto')
      assert.equal(event.fileHash, fileHash, 'Hash correto')
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