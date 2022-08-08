
export interface PreCartItem {
    tokenId: string;
    contractId: string;
}

export interface CartItem extends PreCartItem {
    price: string | number;
}
