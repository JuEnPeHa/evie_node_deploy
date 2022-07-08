export interface MintbaseNFTData {
    token_id?:            string;
    owner_id?:            string;
    approved_account_ids?: ApprovedAccountIDS;
    metadata?:           Metadata;
    royalty?:            Royalty;
    split_owners?:        null;
    minter?:             string;
    loan?:               null;
    composeable_stats?:   ComposeableStats;
    origin_key?:          null;
}

export interface ApprovedAccountIDS {
}

export interface ComposeableStats {
    local_depth?:            number;
    cross_contract_children?: number;
}

export interface Metadata {
    title?:         null;
    description?:   null;
    media?:         null;
    media_hash?:     null;
    copies?:        number;
    issued_at?:      null;
    expires_at?:     null;
    starts_at?:      null;
    updated_at?:     null;
    extra?:         string;
    reference?:     string;
    reference_hash?: null;
}

export interface Royalty {
    split_between?: ApprovedAccountIDS;
    percentage?:   Percentage;
}

export interface Percentage {
    numerator?: number;
}
