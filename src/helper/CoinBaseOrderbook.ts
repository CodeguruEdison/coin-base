import { processOrderbookUpdate } from '../util';
import { IOrderBookData, Order } from '../interface/IOrderBookData';

export class Orderbook {
    _data: IOrderBookData;
    protected symbol: string;
    private memoryLimit: number;

    constructor(symbol = 'none', memoryLimit = 0) {
        this._data = {
            asks: [],
            bids: [],
        };
        this.symbol = symbol;
        this.memoryLimit = memoryLimit;
    }

    public getOrderBook(): IOrderBookData {
        return this._data;
    }

    public updateOrderBook(asks: Order[], bids: Order[]): void {
        const { memoryLimit } = this;
        const data = this._data;

        this._data = processOrderbookUpdate({ ...data }, asks, bids, memoryLimit);
    }
}