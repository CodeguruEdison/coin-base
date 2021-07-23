/** price,amount */
export type Order = [number, number];
export type ChangedOrder = [string, number, number]; // [string] & Order
export interface IOrderBookData {
    asks: Order[];
    bids: Order[];
}