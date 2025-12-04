/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateBidDto } from '../models/CreateBidDto';
import type { UpdateBidDto } from '../models/UpdateBidDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BidService {
    /**
     * @param requestBody
     * @returns any Create a bid.
     * @throws ApiError
     */
    public static bidControllerCreate(
        requestBody: CreateBidDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bid',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any List bids for the user.
     * @throws ApiError
     */
    public static bidControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bid',
        });
    }
    /**
     * @param auctionId
     * @param itemOnAuctionId
     * @returns any Buy item instantly (Buy Now).
     * @throws ApiError
     */
    public static bidControllerBuyNow(
        auctionId: string,
        itemOnAuctionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auction/{auctionId}/{itemOnAuctionId}/buy-now',
            path: {
                'auctionId': auctionId,
                'itemOnAuctionId': itemOnAuctionId,
            },
        });
    }
    /**
     * @param id
     * @returns any Get bid detail for the user.
     * @throws ApiError
     */
    public static bidControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bid/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Update bid for the user.
     * @throws ApiError
     */
    public static bidControllerUpdate(
        id: string,
        requestBody: UpdateBidDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/bid/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Remove bid for the user.
     * @throws ApiError
     */
    public static bidControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/bid/{id}',
            path: {
                'id': id,
            },
        });
    }
}
