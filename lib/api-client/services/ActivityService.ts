/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActivityService {
    /**
     * @returns any Get current user activity.
     * @throws ApiError
     */
    public static activityControllerGetOwnActivity(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activity',
        });
    }
}
