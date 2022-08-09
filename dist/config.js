"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
// let mainnet: boolean = false;
//let CONTRACT_NAME = mainnet ? "" : 'evie.jeph.testnet';
function getConfig(env) {
    //   if (env === 'mainnet') {
    //     mainnet = true;
    // } else {
    //     mainnet = false;
    // }
    switch (env) {
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
                contractName: 'dev-1659076300799-36922271884219',
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org'
            };
        default:
            throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.ts.`);
    }
}
exports.getConfig = getConfig;
//export default getConfig(process.env.NODE_ENV || 'testnet');
