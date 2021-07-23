export const COIN_PRO_URL = 'https://api.pro.coinbase.com';
export const COIN_PRO_WS_URL = 'wss://ws-feed.pro.coinbase.com'
export enum actionType {
    buy = 'buy',
    sell = 'sell'
}
export enum responseDataType {
    snapshot = 'snapshot',
    l2update = "l2update"
}