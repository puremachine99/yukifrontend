/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddAuctionItemsDto } from '../models/AddAuctionItemsDto';
import type { AuctionRecapDto } from '../models/AuctionRecapDto';
import type { CreateAuctionDto } from '../models/CreateAuctionDto';
import type { CreateBidDto } from '../models/CreateBidDto';
import type { LiveItemDetailDto } from '../models/LiveItemDetailDto';
import type { UpdateAuctionDto } from '../models/UpdateAuctionDto';
import type { UpdateAuctionItemDto } from '../models/UpdateAuctionItemDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuctionService {
    /**
     * @returns any List public auctions.
     * @throws ApiError
     */
    public static auctionControllerGetAllPublicAuctions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auction',
        });
    }
    /**
     * @param requestBody
     * @returns any Create auction.
     * @throws ApiError
     */
    public static auctionControllerCreate(
        requestBody: CreateAuctionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auction',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any List live auctions.
     * @throws ApiError
     */
    public static auctionControllerGetLiveAuctions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auction/live',
        });
    }
    /**
     * @param id
     * @returns any Get live auction room detail.
     * @throws ApiError
     */
    public static auctionControllerGetLiveRoom(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auction/live/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param itemId
     * @returns LiveItemDetailDto Live bidding & chat feed for a specific item.
     * @throws ApiError
     */
    public static auctionControllerGetLiveItemDetail(
        id: number,
        itemId: number,
    ): CancelablePromise<LiveItemDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auction/live/{id}/items/{itemId}',
            path: {
                'id': id,
                'itemId': itemId,
            },
        });
    }
    /**
     * @returns any List auctions for current user.
     * @throws ApiError
     */
    public static auctionControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auction/me',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Update auction.
     * @throws ApiError
     */
    public static auctionControllerUpdate(
        id: string,
        requestBody: UpdateAuctionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/auction/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Delete auction.
     * @throws ApiError
     */
    public static auctionControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/auction/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any Get auction detail.
     * @throws ApiError
     */
    public static auctionControllerGetAuctionDetail(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auction/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Launch auction.
     * @throws ApiError
     */
    public static auctionControllerLaunch(
        id: string,
        requestBody: {
            startTime: string;
            endTime: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auction/{id}/launch',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Get auction items.
     * @throws ApiError
     */
    public static auctionControllerGetAuctionItems(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auction/{id}/items',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Add items to auction.
     * @throws ApiError
     */
    public static auctionControllerAddAuctionItems(
        id: number,
        requestBody: AddAuctionItemsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auction/{id}/items',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Get available items.
     * @throws ApiError
     */
    public static auctionControllerGetAvailableItems(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auction/{id}/available-items',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param itemId
     * @param requestBody
     * @returns any Update auction item price.
     * @throws ApiError
     */
    public static auctionControllerUpdateAuctionItemPrice(
        id: number,
        itemId: number,
        requestBody: UpdateAuctionItemDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/auction/{id}/items/{itemId}',
            path: {
                'id': id,
                'itemId': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param itemId
     * @returns any Remove auction item.
     * @throws ApiError
     */
    public static auctionControllerRemoveAuctionItem(
        id: number,
        itemId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/auction/{id}/items/{itemId}',
            path: {
                'id': id,
                'itemId': itemId,
            },
        });
    }
    /**
     * @param auctionId
     * @param itemId
     * @param requestBody
     * @returns any Place a bid for an item.
     * @throws ApiError
     */
    public static auctionControllerPlaceBid(
        auctionId: number,
        itemId: number,
        requestBody: CreateBidDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auction/{auctionId}/items/{itemId}/bid',
            path: {
                'auctionId': auctionId,
                'itemId': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns AuctionRecapDto Auction recap summary.
     * @throws ApiError
     */
    public static auctionControllerGetRecap(
        id: number,
    ): CancelablePromise<AuctionRecapDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auction/{id}/recap',
            path: {
                'id': id,
            },
        });
    }
}
