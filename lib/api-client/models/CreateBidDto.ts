/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateBidDto = {
    /**
     * Bid amount. Required unless isBuyNow=true.
     */
    amount?: number;
    /**
     * Set true to instantly buy the item using buyNow price.
     */
    isBuyNow?: boolean;
};

