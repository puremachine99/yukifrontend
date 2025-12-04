/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayCartDto } from '../models/PayCartDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CartService {
    /**
     * @returns any Get current user cart.
     * @throws ApiError
     */
    public static cartControllerGetUserCart(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cart',
        });
    }
    /**
     * @param itemOnAuctionId
     * @returns any Add an item to cart.
     * @throws ApiError
     */
    public static cartControllerAddToCart(
        itemOnAuctionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cart/{itemOnAuctionId}',
            path: {
                'itemOnAuctionId': itemOnAuctionId,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Simulate paying cart.
     * @throws ApiError
     */
    public static cartControllerSimulatePay(
        id: string,
        requestBody: PayCartDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/cart/{id}/pay',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
