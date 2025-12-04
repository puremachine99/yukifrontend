/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSellerReviewDto } from '../models/CreateSellerReviewDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SellerReviewService {
    /**
     * @param requestBody
     * @returns any Create a seller review.
     * @throws ApiError
     */
    public static sellerReviewControllerCreate(
        requestBody: CreateSellerReviewDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/seller-review',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Buyer pending reviews.
     * @throws ApiError
     */
    public static sellerReviewControllerPending(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seller-review/pending',
        });
    }
    /**
     * @param sellerId
     * @param page
     * @param limit
     * @returns any List reviews for a seller.
     * @throws ApiError
     */
    public static sellerReviewControllerListBySeller(
        sellerId: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seller-review/seller/{sellerId}',
            path: {
                'sellerId': sellerId,
            },
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
}
