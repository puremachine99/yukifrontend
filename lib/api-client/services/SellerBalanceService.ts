/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SellerBalanceService {
    /**
     * @returns any Seller balance summary.
     * @throws ApiError
     */
    public static sellerBalanceControllerGetMyBalance(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seller-balance/me',
        });
    }
    /**
     * @param range
     * @returns any Seller balance chart.
     * @throws ApiError
     */
    public static sellerBalanceControllerGetMyChart(
        range?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seller-balance/me/chart',
            query: {
                'range': range,
            },
        });
    }
    /**
     * @param status
     * @param page
     * @param limit
     * @returns any Admin list balances.
     * @throws ApiError
     */
    public static sellerBalanceControllerListBalances(
        status?: 'pending' | 'available' | 'withdrawn',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seller-balance',
            query: {
                'status': status,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @returns any Admin overview balance.
     * @throws ApiError
     */
    public static sellerBalanceControllerGetOverview(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seller-balance/overview',
        });
    }
    /**
     * @param sellerId
     * @returns any Get seller balance detail.
     * @throws ApiError
     */
    public static sellerBalanceControllerGetSellerBalance(
        sellerId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seller-balance/{sellerId}',
            path: {
                'sellerId': sellerId,
            },
        });
    }
    /**
     * @param sellerId
     * @param range
     * @returns any Get seller chart detail.
     * @throws ApiError
     */
    public static sellerBalanceControllerGetSellerChart(
        sellerId: string,
        range?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seller-balance/{sellerId}/chart',
            path: {
                'sellerId': sellerId,
            },
            query: {
                'range': range,
            },
        });
    }
}
