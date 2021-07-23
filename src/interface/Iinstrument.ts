export interface Iinstrument {
    id: string;
    base_currency: string;
    quote_currency: string;
    base_min_size: string;
    base_max_size: string;
    quote_increment: string;
    base_increment: string;
    display_name: string;
    min_market_funds: string;
    max_market_funds: string;
    margin_enabled: boolean;
    fx_stablecoin: boolean;
    post_only: boolean;
    limit_only: boolean;
    cancel_only: boolean;
    trading_disabled: boolean;
    status: string;
    status_message: string;


}