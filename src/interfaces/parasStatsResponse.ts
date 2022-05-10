export interface ParasStatsArray extends Array<ParasStatsAPIResponse> {
    
}

export interface ParasStatsAPIResponse {
    _id:           string;
    volume:        string;
    volume_usd:    number;
    collection_id: string;
    total_sales:   number;
    total_owners:  number;
    total_cards:   number;
    avg_price:     string;
    avg_price_usd: number;
}
