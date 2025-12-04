/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LikeService {
    /**
     * @param itemId
     * @returns any Toggle like for an item.
     * @throws ApiError
     */
    public static likeControllerToggleLike(
        itemId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/like/{itemId}',
            path: {
                'itemId': itemId,
            },
        });
    }
    /**
     * @returns any Get liked items.
     * @throws ApiError
     */
    public static likeControllerGetLikedItems(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/like',
        });
    }
}
