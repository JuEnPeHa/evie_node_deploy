export interface NFTData {
    token_id:            string;
    owner_id:            string;
    metadata:           Metadata;
    approvedAccountIDS: ApprovedAccountIDS;
}

export interface ApprovedAccountIDS {
}

export interface Metadata {
    title:         string;
    description:   string | null;
    media:         string;
    media_hash:     string | null;
    copies:        number;
    issued_at:      string | null;
    expires_at:     string | null;
    starts_at:      string | null;
    updated_at:     string | null;
    extra:         string | null;
    reference:     string | null;
    reference_hash: string | null;
}
