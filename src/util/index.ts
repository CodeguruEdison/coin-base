import { IOrderBookData, Order } from './../interface/IOrderBookData';
const updateIndex = (sortedArray: Order[], order: Order, index: number, memoryLimit = 0): void => {
    const price = order[0];
    const amount = order[1];

    if (index < sortedArray.length && sortedArray[index][0] === price) {
        if (amount === 0) {
            sortedArray.splice(index, 1);
        } else {
            sortedArray.splice(index, 1, order);
        }
    } else if (amount !== 0) {
        sortedArray.splice(index, 0, order);
    }

    if (memoryLimit !== 0 && sortedArray.length > memoryLimit) {
        sortedArray.splice(memoryLimit, sortedArray.length - memoryLimit);
    }
};
const getSortedIndex = (array: Order[], price: number, inverse = false): number => {
    let low = 0;
    let high = array ? array.length : low;

    while (low < high) {
        const mid = (low + high) >>> 1;

        if ((!inverse && +array[mid][0] < +price) || (inverse && +array[mid][0] > +price)) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
};
const cleanOrderbookBid = (array: Order[], price: number): void => {
    for (let i = 0; i < array.length; i++) {
        if (price < array[i][0]) {
            array.splice(i, 1);
        } else {
            return;
        }
    }
};

const cleanOrderbookAsk = (array: Order[], price: number): void => {
    for (let i = 0; i < array.length; i++) {
        if (price > array[i][0]) {
            array.splice(i, 1);
        } else {
            return;
        }
    }
};
export const processOrderbookUpdate = (
    data: IOrderBookData,
    asks: Order[],
    bids: Order[],
    memoryLimit: number,
): IOrderBookData => {
    for (const order of asks) {
        const price = Number(order[0]);
        const amount = Number(order[1]);

        updateIndex(data.asks, [price, amount], getSortedIndex(data.asks, price, false), memoryLimit);

        if (amount !== 0 && data.bids[0] && price < data.bids[0][0]) {
            cleanOrderbookBid(data.bids, price);
        }
    }

    for (const order of bids) {
        const price = Number(order[0]);
        const amount = Number(order[1]);

        updateIndex(data.bids, [price, amount], getSortedIndex(data.bids, price, true), memoryLimit);

        if (amount !== 0 && data.asks[0] && price > data.asks[0][0]) {
            cleanOrderbookAsk(data.asks, price);
        }
    }

    return data;
};