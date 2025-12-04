/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WishlistService {
    /**
     * @param itemId
     * @returns any Toggle wishlist item.
     * @throws ApiError
     */
    public static wishlistControllerToggleWishlist(
        itemId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/wishlist/{itemId}',
            path: {
                'itemId': itemId,
            },
        });
    }
    /**
     * @returns any Get wishlist items.
     * @throws ApiError
     */
    public static wishlistControllerGetWishlist(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/wishlist',
        });
    }
}
