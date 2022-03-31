pragma solidity ^0.5.0;

contract CriptDStorage {
  //Nome
  string public  name = 'CriptDStorage';

  //Numero de arquivos
  uint public fileCount = 0;

  //Map do ID do arquivo (chave:valor) 
  mapping(uint => File) public files;

  //Struct
  struct File{
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
  }

  //Evento
  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName, 
    string fileDescription,
    uint uploadTime,
    address payable uploader
  );

  //Construtor vazio
  constructor() public {
  }

  //Função de upload do arquivo (HASH)
  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public{
    
    //Verifica se as informações  do hash, tipo, descrição, 
    //nome, endereço do emissor e o tamanho do arquivo existe
    require(bytes(_fileHash).length > 0);
    require(bytes(_fileType).length > 0);
    require(bytes(_fileDescription).length > 0);
    require(bytes(_fileName).length > 0);
    require(msg.sender!=address(0));
    require(_fileSize>0);

    //Incrementa o ID do arquivo (sequence)
    fileCount ++;

    //Adiciona o arquivo ao contrato
    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
   
    //Aciona o evento
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);

  }
}