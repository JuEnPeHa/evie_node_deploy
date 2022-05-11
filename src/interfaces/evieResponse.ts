export interface EvieAPICollectionResponse {
    status: number;
    data:   DataEvie;
}

export interface DataEvie {
    results: ResultEvie[];
    skip:    number;
    limit:   number;
}

export interface ResultEvie {
    _id:           string;
    description:   string;
    media:         string;
    collection_id: string;
    collection:    string;
    creator_id:    string;
    volume:        string;
    volume_usd:    number;
    total_sales:   number;
    total_owners:  number;
    total_cards:   number;
    avg_price:     string;
    avg_price_usd: number;
}

