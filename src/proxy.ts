import {Transaction} from 'bitcoinjs-lib'
import * as fs from 'fs'
const explorer =  require("blockchain.info/blockexplorer")
const Client = require('bitcoin-core')
const ini = require("ini")

export interface BlockchainProxy {
  getPrevHash: (tx: Transaction) => Promise<any>;
  baseUrl?: string;
  api?: any;
}

/*
export class LocalBchProxy implements BlockchainProxy {
}
*/

export class RPC implements BlockchainProxy {
  public client: any;
  constructor(confPath: fs.PathLike){
    let conf = ini.parse(fs.readFileSync(confPath, "utf-8"))
    const opts = {username: conf.rpcuser, password: conf.rpcpassword, host: conf.rpcconnect, network: "mainnet"}
    this.client = new Client(opts)
  }

  public async getPrevHash (tx: Transaction): Promise<string> {
    console.log( `tx is ${JSON.stringify(tx)}`)
    console.log( `client is ${JSON.stringify(this.client)}`)
    let RawTx: string = await this.client.getRawTransaction(tx.getId())
    console.log(`Raw TX is ${RawTx}`)
    let txwithInfo = await this.client.decodeRawTransaction(RawTx)
    console.log( `tx withInfo is ${txwithInfo}`)
    let prevTxRaw: any = await Promise.all( txwithInfo.vin.txid.map((id: string)  => this.client.getRawTransaction(id)))
    let prevTx: Transaction = Transaction.fromHex(prevTxRaw)
    return prevTx.getId()
  }
}

export class BlockchainInfo implements BlockchainProxy {
  public baseUrl = 'http://blockchain.info/'
  public api: any;
  constructor() {
    this.api = explorer.usingNetwork(0)
  }
  public async getPrevHash (tx: Transaction){
    let result
    let hexTx: string = tx.getId()
    try {
      result = await this.api.getTx(hexTx)
      result = result.inputs
    } catch(e) {
      console.warn(`failed to get TX from blockchain.info with ${hexTx}`)
      throw e
    }
    console.log(result)
    return result
  }
}
