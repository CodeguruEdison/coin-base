import { COIN_PRO_URL } from "../constants"
import { Iinstrument } from "../interface/Iinstrument";

//TODO: remove any
export const getInstruments = async (): Promise<Iinstrument[]> => {
    const url = `${COIN_PRO_URL}/products`;
    let response = await fetch(url);
    let pairs: Iinstrument[] = [];
    pairs = await response.json();
    let filteredInstruments: Iinstrument[] = pairs.filter((pair: any) => pair.quote_currency === 'USD');
    filteredInstruments = filteredInstruments.sort((a: any, b: any) => {
        if (a.base_currency < b.base_currency) {
            return -1;
        }
        if (a.base_currency > b.base_currency) {
            return 1;
        }
        return 0;
    });
    return filteredInstruments;
}