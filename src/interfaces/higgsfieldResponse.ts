export interface HiggsfieldCollectionResponseArray {
    data: HiggsfieldCollectionResponse[];
}

export interface HiggsfieldCollectionResponse {
    id:              string;
    name:            string;
    items:           HiggsfieldCollectionResponseItem[];
    socials:         Socials;
    mintPrice:       string;
    avatarURL:       AvatarURL;
    recentChange:    string;
    contractAddress: string;
    categoryID:      CategoryID;
    mainStatistics:  MainStatistics;
    customURL?:      string;
    likes:           number;
    creator:         Creator;
    customURLorID:   string;
    statisticVolume: number;
}

export interface AvatarURL {
    size0: string;
    size1: string;
    size2: string;
    size3: string;
    size4: string;
    size5: string;
    size6: string;
}

export enum CategoryID {
    The625Dbc512D753Fd0De119E09 = "625dbc512d753fd0de119e09",
}

export interface Creator {
    userID:    string;
    avatarURL: string;
    userName:  string;
    verified:  boolean;
}

export interface HiggsfieldCollectionResponseItem {
    id:              string;
    previewURL:      string;
    explicitContent: boolean;
}

export interface MainStatistics {
    maxPrice:                   null | string;
    floorPrice:                 null | string;
    marketCap:                  null | string;
    totalOwners:                string;
    totalItems:                 number;
    totalVolume:                string;
    listedNftsAmountDict:       ListedNftsAmountDict;
    marketCapHistoryDict:       MarketCapHistoryDict;
    resolvePurchaseHistoryDict: ListedNftsAmountDict;
    ownersHistoryDict:          ErsHistoryDict;
    sellersHistoryDict:         ErsHistoryDict;
    buyersHistoryDict:          ErsHistoryDict;
    price:                      MarketCapHistoryDict;
}

export interface ErsHistoryDict {
    week?:    BuyersHistoryDictAllTime;
    month?:   BuyersHistoryDictAllTime;
    allTime?: BuyersHistoryDictAllTime;
}

export interface BuyersHistoryDictAllTime {
    amountInAll: number;
    items:       AllTimeItem[];
    brakePoints: string[];
}

export interface AllTimeItem {
    value:     string;
    timestamp: string;
    percent:   number;
}

export interface ListedNftsAmountDict {
    week?:    ListedNftsAmountDictAllTime;
    month?:   ListedNftsAmountDictAllTime;
    allTime?: ListedNftsAmountDictAllTime;
}

export interface ListedNftsAmountDictAllTime {
    items:       AllTimeItem[];
    brakePoints: string[];
}

export interface MarketCapHistoryDict {
    averagePrice?: AveragePrice;
    floorPrice?:   ListedNftsAmountDict;
}

export interface AveragePrice {
    week:    Month;
    month:   Month;
    allTime: ListedNftsAmountDictAllTime;
}

export interface Month {
    items:       PurpleItem[];
    brakePoints: string[];
}

export interface PurpleItem {
    timestamp: string;
    value:     number | string;
    percent:   number;
}

export interface Socials {
    site:    string;
    twitter: string;
    discord: string;
}
