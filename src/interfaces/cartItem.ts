
export interface PreCartItem {
    token_id: string;
    contract_id: string;
}

export interface CartItem extends PreCartItem {
    price: string | number;
}
