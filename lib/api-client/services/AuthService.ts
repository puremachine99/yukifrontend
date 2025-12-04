/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RefreshTokenDto } from '../models/RefreshTokenDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @param requestBody
     * @returns any Register a new user.
     * @throws ApiError
     */
    public static authControllerRegister(
        requestBody: {
            name: string;
            email: string;
            password: string;
            phone: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Login and get tokens.
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: {
            email: string;
            password: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Refresh access token.
     * @throws ApiError
     */
    public static authControllerRefresh(
        requestBody: RefreshTokenDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
