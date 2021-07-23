import React, { FC, useEffect, useRef, useState } from 'react';
import './App.css';
import { IApp } from './interface/IApp';
import { actionType, COIN_PRO_WS_URL, responseDataType } from './constants';
import { getInstruments } from './api';
import { Iinstrument } from './interface/Iinstrument';
import { IMessageRequestPayload } from './interface/IMessageRequestPayload';
import { OrderBookStore } from './helper/OrderBookStore';
import { ChangedOrder, IOrderBookData, Order } from './interface/IOrderBookData';

const App: FC<IApp> = (props) => {
  const OrderBooks = new OrderBookStore(10);
  const [instruments, setInstruments] = useState<Iinstrument[]>([]);
  const [pair, setPair] = useState<string>('');
  const [orderBookData, setOrderBookData] = useState<IOrderBookData | undefined>();
  let webSocketRefInstance = useRef<any>(null);
  let first = useRef(false);
  useEffect(() => {
    webSocketRefInstance.current = new WebSocket(COIN_PRO_WS_URL);

    const fetchInstruments = async () => {
      const instrumentFromApi = await getInstruments();
      console.log(instrumentFromApi);
      setInstruments(instrumentFromApi);
      first.current = true;
    }
    fetchInstruments();
    return () => {
      webSocketRefInstance.current.close()
    }
  }, []);
  useEffect(() => {
    if (!first.current) {
      return;
    }
    let messagePayload: IMessageRequestPayload = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker", "level2"]
    }
    let jsonMsg = JSON.stringify(messagePayload);
    webSocketRefInstance.current.send(jsonMsg);
    webSocketRefInstance.current.onmessage = onMessageRecieved;


  }, [pair])

  const onMessageRecieved = (e: MessageEvent) => {
    let data = JSON.parse(e.data);
    if (data.type === responseDataType.snapshot) {
      OrderBooks.updateOrderBook(pair, data.asks, data.bids);
      setOrderBookData(OrderBooks.getOrderBook(pair));
      return;
    }
    let prevaskChanged: Order[] = orderBookData?.asks ? [...orderBookData?.asks] : [];
    let prebidChanged: Order[] = orderBookData?.bids ? [...orderBookData?.bids] : [];
    if (data.type === responseDataType.l2update && data.product_id === pair) {
      let changes: ChangedOrder[] = data.changes;
      let [askChanged, bidChanged] = getChangedOrders({ changes, asks: prevaskChanged, bids: prebidChanged })
      OrderBooks.updateOrderBook(pair, askChanged, bidChanged);
      setOrderBookData(OrderBooks.getOrderBook(pair));
    }
  }
  const getChangedOrders = (payload: { changes: ChangedOrder[], asks: Order[], bids: Order[] }): [Order[], Order[]] => {
    const { changes, asks, bids } = payload;
    let parsedAmount = 0;
    for (let i = 0; i < changes.length; i++) {
      parsedAmount = 0;
      let change = changes[i];
      const [action, price, amount] = change;
      if (action === actionType.buy) {
        parsedAmount = +amount;
        bids.push([price, parsedAmount]);
      }
      if (action === actionType.sell) {
        parsedAmount = +amount;
        asks.push([price, parsedAmount])
      }
    }
    return [asks, bids];
  }
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let unSubscribeMessage: IMessageRequestPayload = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["level2"]
    }
    webSocketRefInstance.current.send(JSON.stringify(unSubscribeMessage));
    OrderBooks.removeSymbolFromOrderBook(pair);
    setOrderBookData(OrderBooks.getOrderBook(pair));
    setPair(e.target.value);
  }

  return (
    <div className="container">

      <select name="instruments" value={pair} onChange={handleOnChange}>
        {
          instruments && instruments.map((instrument, idx) => {
            return (<option key={idx} value={instrument.id}>
              {instrument.display_name}
            </option>);
          })
        }
      </select>
      <div>
        Bid
        <ul>
          {orderBookData && orderBookData?.bids.map((bid, i) => {
            return <li>{`${bid[0]} -> ${bid[1]}`} </li>
          })
          }
        </ul>

      </div>
      <div>
        Asks
        <ul>
          {orderBookData && orderBookData?.asks.map((ask, i) => {
            return <li>{`${ask[0]} -> ${ask[1]}`} </li>
          })
          }
        </ul>

      </div>

    </div>
  );
}

export default App;
