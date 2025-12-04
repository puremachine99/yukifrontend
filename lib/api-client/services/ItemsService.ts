/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateItemDto } from '../models/CreateItemDto';
import type { CreateMediaDto } from '../models/CreateMediaDto';
import type { ItemAuctionHistoryDto } from '../models/ItemAuctionHistoryDto';
import type { ItemResponseDto } from '../models/ItemResponseDto';
import type { UpdateItemDto } from '../models/UpdateItemDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemsService {
    /**
     * @param category
     * @param variety
     * @param limit
     * @param page
     * @returns any List public items.
     * @throws ApiError
     */
    public static itemsControllerGetPublicItems(
        category?: string,
        variety?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/items/public',
            query: {
                'category': category,
                'variety': variety,
                'limit': limit,
                'page': page,
            },
        });
    }
    /**
     * @param id
     * @returns ItemResponseDto
     * @throws ApiError
     */
    public static itemsControllerFindOne(
        id: string,
    ): CancelablePromise<ItemResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/items/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any Get item media.
     * @throws ApiError
     */
    public static itemsControllerGetMedia(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/items/{id}/media',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param limit
     * @param page
     * @returns any List seller items.
     * @throws ApiError
     */
    public static itemsControllerGetMyItems(
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seller/items',
            query: {
                'limit': limit,
                'page': page,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Create item.
     * @throws ApiError
     */
    public static itemsControllerCreate(
        requestBody: CreateItemDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/seller/items',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any List seller items available for auction.
     * @throws ApiError
     */
    public static itemsControllerGetAvailableSellerItems(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seller/items/available',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Upload item media.
     * @throws ApiError
     */
    public static itemsControllerUploadMedia(
        id: string,
        requestBody: CreateMediaDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/seller/items/{id}/media',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Update item.
     * @throws ApiError
     */
    public static itemsControllerUpdate(
        id: string,
        requestBody: UpdateItemDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/seller/items/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Soft delete item.
     * @throws ApiError
     */
    public static itemsControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/seller/items/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param sellerId
     * @param limit
     * @param page
     * @returns ItemAuctionHistoryDto
     * @throws ApiError
     */
    public static itemsControllerGetSellerProfileItems(
        sellerId: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<Array<ItemAuctionHistoryDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile/{sellerId}/items',
            path: {
                'sellerId': sellerId,
            },
            query: {
                'limit': limit,
                'page': page,
            },
        });
    }
    /**
     * @param id
     * @returns any Auction history of this item.
     * @throws ApiError
     */
    public static itemsControllerGetAuctionHistory(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/items/{id}/auctions',
            path: {
                'id': id,
            },
        });
    }
}
