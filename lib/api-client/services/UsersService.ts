/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * @param requestBody
     * @returns any Create a user.
     * @throws ApiError
     */
    public static usersControllerCreate(
        requestBody: CreateUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any List all users.
     * @throws ApiError
     */
    public static usersControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
        });
    }
    /**
     * @param id
     * @returns any Get user by id.
     * @throws ApiError
     */
    public static usersControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Update user (admin).
     * @throws ApiError
     */
    public static usersControllerUpdateUser(
        id: string,
        requestBody: UpdateUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Delete user (admin).
     * @throws ApiError
     */
    public static usersControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any Get current user profile.
     * @throws ApiError
     */
    public static usersControllerGetOwnProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
        });
    }
    /**
     * @param requestBody
     * @returns any Update own profile.
     * @throws ApiError
     */
    public static usersControllerUpdateOwnProfile(
        requestBody: UpdateUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Get public profile.
     * @throws ApiError
     */
    public static usersControllerGetPublicProfile(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/public/{id}',
            path: {
                'id': id,
            },
        });
    }
}
