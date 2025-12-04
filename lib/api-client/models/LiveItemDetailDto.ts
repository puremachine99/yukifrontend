/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LiveBidDto } from './LiveBidDto';
import type { LiveChatMessageDto } from './LiveChatMessageDto';
import type { LiveItemMetaDto } from './LiveItemMetaDto';
export type LiveItemDetailDto = {
    item: LiveItemMetaDto;
    highestBid?: number;
    nextMinimumBid?: number;
    bids: Array<LiveBidDto>;
    chats: Array<LiveChatMessageDto>;
};

