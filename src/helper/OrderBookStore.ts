import { IOrderBookData, Order } from "../interface/IOrderBookData";
import { processOrderbookUpdate } from "../util";

export class OrderBookStore {
    _data: Map<string, IOrderBookData | undefined>;
    private memoryLimit: number;

    constructor(memoryLimit = 0) {
        this._data = new Map();
        this.memoryLimit = memoryLimit;
    }

    public getSymbolList(): string[] {
        return Array.from(this._data.keys());
    }

    public hasOrderBook(symbol: string): boolean {
        return this._data.has(symbol);
    }
    public removeSymbolFromOrderBook(symbol: string) {
        if (this.hasOrderBook(symbol)) {
            this._data.delete(symbol);
        }
    }

    public getOrderBook(symbol: string): IOrderBookData | undefined {
        return this._data.get(symbol);
    }

    public updateOrderBook(symbol: string, asks: Order[], bids: Order[]): void {
        const { memoryLimit } = this;
        const data = this._data.get(symbol);

        if (data) {
            this._data.set(symbol, processOrderbookUpdate({ ...data }, asks, bids, memoryLimit));
            return;
        }

        this._data.set(symbol, processOrderbookUpdate({ asks: [], bids: [] }, asks, bids, memoryLimit));
    }
}