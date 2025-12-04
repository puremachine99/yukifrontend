/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FollowService {
    /**
     * @param targetId
     * @returns any Toggle follow state.
     * @throws ApiError
     */
    public static followControllerToggleFollow(
        targetId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/follow/{targetId}',
            path: {
                'targetId': targetId,
            },
        });
    }
    /**
     * @returns any List followers.
     * @throws ApiError
     */
    public static followControllerGetFollowers(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/follow/followers',
        });
    }
    /**
     * @returns any List following users.
     * @throws ApiError
     */
    public static followControllerGetFollowing(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/follow/following',
        });
    }
}
