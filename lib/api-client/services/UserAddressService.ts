/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserAddressDto } from '../models/CreateUserAddressDto';
import type { UpdateUserAddressDto } from '../models/UpdateUserAddressDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserAddressService {
    /**
     * @param requestBody
     * @returns any Create user address.
     * @throws ApiError
     */
    public static userAddressControllerCreate(
        requestBody: CreateUserAddressDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user-address',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any List user addresses.
     * @throws ApiError
     */
    public static userAddressControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user-address',
        });
    }
    /**
     * @param id
     * @returns any Get a user address.
     * @throws ApiError
     */
    public static userAddressControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user-address/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Update user address.
     * @throws ApiError
     */
    public static userAddressControllerUpdate(
        id: string,
        requestBody: UpdateUserAddressDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user-address/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Delete user address.
     * @throws ApiError
     */
    public static userAddressControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user-address/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any Set an address as default.
     * @throws ApiError
     */
    public static userAddressControllerSetDefault(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user-address/{id}/default',
            path: {
                'id': id,
            },
        });
    }
}
