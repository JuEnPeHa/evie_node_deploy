export interface ParasCollectionArray extends Array<ParasCollectionAPIResponse> {
    
}

export interface ParasCollectionAPIResponse {
    status: number;
    data:   Data;
}

export interface Data {
    results: Result_p[];
    skip:    number;
    limit:   number;
}

export interface Result_p {
    _id:           string;
    collection_id: string;
    collection:    string;
    creator_id:    string;
    blurhash?:     string;
    description?:  string;
    media?:        string;
    updatedAt?:    number;
    cover?:        string;
    socialMedia?:  SocialMedia;
    isCreator?:    boolean;
    volume:        string;
    total_owners:  number;
    total_cards:   number;
    createdAt?:    number;
}

export interface SocialMedia {
    twitter:  string;
    discord?: string;
    website?: string;
}
