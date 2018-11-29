const opensea = require('opensea-js')
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;

const MnemonicWalletSubprovider = require('@0x/subproviders').MnemonicWalletSubprovider
const RPCSubprovider = require('web3-provider-engine/subproviders/rpc')
const Web3ProviderEngine = require('web3-provider-engine')
const MNEMONIC = process.env.MNEMONIC
const INFURA_KEY = process.env.INFURA_KEY
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const NETWORK = process.env.NETWORK
const DUTCH_AUCTION_OPTION_ID = "1";
const DUTCH_AUCTION_START_AMOUNT = 100;
const DUTCH_AUCTION_END_AMOUNT = 50;    
const NUM_DUTCH_AUCTIONS = 5;

const FIXED_PRICE_OPTION_ID = "2";
const NUM_FIXED_PRICE_AUCTIONS = 10;
const FIXED_PRICE = 100;

const INCLINE_PRICE_START = 10;
const INCREMENT_AMOUNT = 10;
const NUM_PER_INCREMENT = 5;
const NUM_INCREMENTS = 20;

if (!MNEMONIC || !INFURA_KEY || !NETWORK || !OWNER_ADDRESS || !FACTORY_CONTRACT_ADDRESS) {
    console.error("Please set a mnemonic, infura key, owner, network, and factory contract address.")
    return
}
const BASE_DERIVATION_PATH = `44'/60'/0'/0`;
const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({ mnemonic: MNEMONIC, baseDerivationPath: BASE_DERIVATION_PATH})
const infuraRpcSubprovider = new RPCSubprovider({
    rpcUrl: 'https://' + NETWORK + '.infura.io/' + INFURA_KEY,
})

const providerEngine = new Web3ProviderEngine()
providerEngine.addProvider(mnemonicWalletSubprovider)
providerEngine.addProvider(infuraRpcSubprovider)
providerEngine.start();

const seaport = new OpenSeaPort(providerEngine, {
  networkName: Network.Rinkeby
}, (arg) => console.log(arg))

async function main() {

    // Example: many fixed price auctions.
    console.log("Creating fixed price auctions...")
    for (var i = 0; i < NUM_FIXED_PRICE_AUCTIONS; i++) {
        const sellOrder = await seaport.createSellOrder({
            tokenId: FIXED_PRICE_OPTION_ID,
            tokenAddress: FACTORY_CONTRACT_ADDRESS,
            accountAddress: OWNER_ADDRESS,
            startAmount: FIXED_PRICE
        })
        console.log(`Successfully made fixed-price sell order! ${sellOrder.asset.openseaLink}\n`)
    }

    // Example: many declining Dutch auction.
    console.log("Creating dutch auctions...")
    for (var i = 0; i < NUM_DUTCH_AUCTIONS; i++) {
        // Expire one day from now
        const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)
        const sellOrder = await seaport.createSellOrder({
            tokenId: DUTCH_AUCTION_OPTION_ID,
            tokenAddress: FACTORY_CONTRACT_ADDRESS,
            accountAddress: OWNER_ADDRESS, 
            startAmount: DUTCH_AUCTION_START_AMOUNT,
            endAmount: DUTCH_AUCTION_END_AMOUNT,
            expirationTime: expirationTime
        })
        console.log(`Successfully made dutch-auction sell order! ${sellOrder.asset.openseaLink}\n`)
    }

    // TODO: Incremental prices example.
}

main()