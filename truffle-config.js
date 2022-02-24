require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privateKeys = process.env.PRIVATE_KEYS || ""

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" //Qualquer ID da rede
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), //Array de chaves privadas de contas
          `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`//URL de um nó no Ethereum
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 3
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}