/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAdPlanDto } from '../models/CreateAdPlanDto';
import type { UpdateAdPlanDto } from '../models/UpdateAdPlanDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdPlanService {
    /**
     * @param requestBody
     * @returns any Create ad plan.
     * @throws ApiError
     */
    public static adPlanControllerCreate(
        requestBody: CreateAdPlanDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ad-plan',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any List ad plans.
     * @throws ApiError
     */
    public static adPlanControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ad-plan',
        });
    }
    /**
     * @param id
     * @returns any Get ad plan by id.
     * @throws ApiError
     */
    public static adPlanControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ad-plan/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Update ad plan.
     * @throws ApiError
     */
    public static adPlanControllerUpdate(
        id: string,
        requestBody: UpdateAdPlanDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/ad-plan/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Remove ad plan.
     * @throws ApiError
     */
    public static adPlanControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/ad-plan/{id}',
            path: {
                'id': id,
            },
        });
    }
}
