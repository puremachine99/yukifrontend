/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuctionRecapItemDto } from './AuctionRecapItemDto';
export type AuctionRecapDto = {
    auctionId: number;
    startTime?: string;
    endTime?: string;
    /**
     * Unique viewers tracked via socket subscriptions.
     */
    totalVisitors: number;
    totalBids: number;
    items: Array<AuctionRecapItemDto>;
};

