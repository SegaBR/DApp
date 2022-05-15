pragma solidity ^0.5.0;

contract CriptDPermission {
  //Nome
  string public  name = 'CriptDPermission';

  //Numero de arquivos
  uint public permCount = 0;

  //Map do ID do arquivo (chave:valor) 
  mapping(uint => Perm) public perms;

  //Struct
  struct Perm{
    uint permId;
    string permAdress;
    string fileId;
    string userKey;
    string salt;
    uint permTimeStart;
    uint permTimeEnd;
    uint uploadTime;
    address payable uploader;
  }

  //Evento
  event PermUploaded(
    uint permId,
    string permAdress,
    string fileId,
    string userKey,
    string salt,
    uint permTimeStart,
    uint permTimeEnd,
    uint uploadTime,
    address payable uploader
  );

  //Construtor vazio
  constructor() public {
  }

  //Função de upload da permissao
  function uploadPerm(string memory _permAdress, string memory _fileId, string memory _userKey, string memory _salt,  uint _permTimeStart, uint _permTimeEnd) public{
    
    //Verifica se as informações existem
    require(bytes(_permAdress).length > 0);
    require(bytes(_userKey).length > 0);
    require(bytes(_salt).length > 0);
    require(msg.sender!=address(0));
    require(bytes(_fileId).length > 0);
    require(_permTimeStart>0);
    require(_permTimeEnd>0);

    //Incrementa o ID da pem (sequence)
    permCount ++;

    //Adiciona o arquivo ao contrato
    perms[permCount] = Perm(permCount, _permAdress, _fileId, _userKey, _salt, _permTimeStart, _permTimeEnd, now, msg.sender);
   
    //Aciona o evento
    emit PermUploaded(permCount, _permAdress, _fileId, _userKey, _salt, _permTimeStart, _permTimeEnd, now, msg.sender);

  }
}