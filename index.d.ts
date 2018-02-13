/// <reference types="node" />
declare module "src/proxy" {
    import { Transaction } from 'bitcoinjs-lib';
    import * as fs from 'fs';
    export interface BlockchainProxy {
        getPrevHash: (tx: Transaction) => Promise<any>;
        baseUrl?: string;
        api?: any;
        client?: any;
    }
    export class Stub implements BlockchainProxy {
        getPrevHash(tx: Transaction): Promise<string>;
    }
    export class RPC implements BlockchainProxy {
        client: any;
        constructor(confPath: fs.PathLike);
        getPrevHash(tx: Transaction): Promise<string[]>;
    }
    export class BlockchainInfo implements BlockchainProxy {
        baseUrl: string;
        api: any;
        constructor();
        getPrevHash(tx: Transaction): Promise<any>;
    }
}
declare module "test/index" {
}
