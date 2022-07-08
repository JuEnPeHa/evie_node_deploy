export interface ArweaveNftResponse {
    category?:      string;
    description?:   string;
    copies?:        number;
    media_hash?:     string;
    lock?:          null;
    visibility?:    string;
    youtube_url?:    null;
    animation_url?:  string;
    animation_hash?: string;
    document?:      null;
    document_hash?:  null;
    royalty?:       Royalty;
    royalty_perc?:   number;
    split_revenue?:  Royalty;
    tags?:          any[];
    media?:         string;
    extra?:         Extra[];
    title?:         string;
    store?:         string;
    externalURL?:   string;
    type?:          string;
}

export interface Extra {
    trait_type?: string;
    value?:     string;
}

export interface Royalty {
}
