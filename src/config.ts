// let mainnet: boolean = false;
//let CONTRACT_NAME = mainnet ? "" : 'evie.jeph.testnet';
export function getConfig(env: string) {
//   if (env === 'mainnet') {
//     mainnet = true;
// } else {
//     mainnet = false;
// }
  switch(env) {
    case 'mainnet':
    case 'production':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: 'jeph.near',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      };
    case 'development':
    case 'testnet':
      return {
        networkId: 'default',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: 'dev-1660244871256-92189441173983',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
      };
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.ts.`);
  }
}

//export default getConfig(process.env.NODE_ENV || 'testnet');