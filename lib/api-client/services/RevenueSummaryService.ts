/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RevenueSummaryService {
    /**
     * @param periodType
     * @param page
     * @param limit
     * @returns any List revenue summaries.
     * @throws ApiError
     */
    public static revenueSummaryControllerList(
        periodType?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/revenue-summary',
            query: {
                'periodType': periodType,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @returns any Get revenue overview.
     * @throws ApiError
     */
    public static revenueSummaryControllerOverview(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/revenue-summary/overview',
        });
    }
    /**
     * @param range
     * @returns any Get revenue chart data.
     * @throws ApiError
     */
    public static revenueSummaryControllerChart(
        range?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/revenue-summary/chart',
            query: {
                'range': range,
            },
        });
    }
    /**
     * @param id
     * @returns any Find revenue summary by id.
     * @throws ApiError
     */
    public static revenueSummaryControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/revenue-summary/{id}',
            path: {
                'id': id,
            },
        });
    }
}
