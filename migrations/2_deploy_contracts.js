const CriptDStorage = artifacts.require("CriptDStorage");
const CriptDPermission = artifacts.require("CriptDPermission");

module.exports = function(deployer) {
  deployer.deploy(CriptDStorage);
  deployer.deploy(CriptDPermission);
};
