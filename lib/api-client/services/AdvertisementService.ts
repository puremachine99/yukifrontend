/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAdPlanDto } from '../models/CreateAdPlanDto';
import type { CreateAdvertisementDto } from '../models/CreateAdvertisementDto';
import type { UpdateAdPlanDto } from '../models/UpdateAdPlanDto';
import type { UpdateAdvertisementStatusDto } from '../models/UpdateAdvertisementStatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdvertisementService {
    /**
     * @param position
     * @returns any Get active advertisements.
     * @throws ApiError
     */
    public static advertisementControllerGetActive(
        position?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ads/active',
            query: {
                'position': position,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Create advertisement plan.
     * @throws ApiError
     */
    public static advertisementControllerCreatePlan(
        requestBody: CreateAdPlanDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ads/plan',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any List advertisement plans.
     * @throws ApiError
     */
    public static advertisementControllerFindPlans(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ads/plan',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Update advertisement plan.
     * @throws ApiError
     */
    public static advertisementControllerUpdatePlan(
        id: string,
        requestBody: UpdateAdPlanDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/ads/plan/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Remove advertisement plan.
     * @throws ApiError
     */
    public static advertisementControllerRemovePlan(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/ads/plan/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Create advertisement.
     * @throws ApiError
     */
    public static advertisementControllerCreateAd(
        requestBody: CreateAdvertisementDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ads',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any List current user ads.
     * @throws ApiError
     */
    public static advertisementControllerMyAds(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ads/me',
        });
    }
    /**
     * @param status
     * @returns any Admin list advertisements.
     * @throws ApiError
     */
    public static advertisementControllerAdminList(
        status?: 'pending' | 'approved' | 'rejected' | 'active' | 'expired',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ads/admin',
            query: {
                'status': status,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Update advertisement status.
     * @throws ApiError
     */
    public static advertisementControllerUpdateStatus(
        id: string,
        requestBody: UpdateAdvertisementStatusDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/ads/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
