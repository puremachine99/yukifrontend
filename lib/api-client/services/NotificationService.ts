/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationService {
    /**
     * @returns any Get notifications for the user.
     * @throws ApiError
     */
    public static notificationControllerGetUserNotifications(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notification',
        });
    }
    /**
     * @param id
     * @returns any Mark a notification as read.
     * @throws ApiError
     */
    public static notificationControllerMarkAsRead(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notification/{id}/read',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any Mark a notification as read.
     * @throws ApiError
     */
    public static notificationControllerPatchRead(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/notification/{id}/read',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any Mark all notifications as read.
     * @throws ApiError
     */
    public static notificationControllerMarkAllAsRead(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notification/read-all',
        });
    }
}
