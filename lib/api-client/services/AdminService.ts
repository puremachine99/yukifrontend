/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProcessWithdrawalDto } from '../models/ProcessWithdrawalDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
    /**
     * @returns any Get admin dashboard data.
     * @throws ApiError
     */
    public static adminControllerGetDashboard(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/dashboard',
        });
    }
    /**
     * @returns any List users (admin).
     * @throws ApiError
     */
    public static adminControllerGetUsers(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users',
        });
    }
    /**
     * @param id
     * @returns any Get overview for a user.
     * @throws ApiError
     */
    public static adminControllerGetUserOverview(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any Ban a user.
     * @throws ApiError
     */
    public static adminControllerBanUser(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/users/{id}/ban',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any Unban a user.
     * @throws ApiError
     */
    public static adminControllerUnbanUser(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/users/{id}/unban',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param status
     * @returns any List auctions with filter.
     * @throws ApiError
     */
    public static adminControllerGetAuctions(
        status?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/auctions',
            query: {
                'status': status,
            },
        });
    }
    /**
     * @param id
     * @returns any Approve auction.
     * @throws ApiError
     */
    public static adminControllerApproveAuction(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/auctions/{id}/approve',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any Reject auction.
     * @throws ApiError
     */
    public static adminControllerRejectAuction(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/auctions/{id}/reject',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any Report auction.
     * @throws ApiError
     */
    public static adminControllerReportAuction(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/auctions/{id}/report',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param status
     * @returns any List withdrawals by status.
     * @throws ApiError
     */
    public static adminControllerGetWithdrawals(
        status?: 'pending' | 'approved' | 'rejected' | 'paid',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/withdrawals',
            query: {
                'status': status,
            },
        });
    }
    /**
     * @returns any Get pending withdrawals.
     * @throws ApiError
     */
    public static adminControllerGetPendingWithdrawals(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/withdrawals/pending',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Process withdrawal.
     * @throws ApiError
     */
    public static adminControllerProcessWithdrawal(
        id: string,
        requestBody: ProcessWithdrawalDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/withdrawals/{id}/process',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Get revenue summary (admin).
     * @throws ApiError
     */
    public static adminControllerGetRevenueSummary(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/revenue-summary',
        });
    }
}
