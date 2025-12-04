/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayTransactionDto } from '../models/PayTransactionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransactionService {
    /**
     * @returns any List transactions for the user.
     * @throws ApiError
     */
    public static transactionControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transaction',
        });
    }
    /**
     * @param cartId
     * @param requestBody
     * @returns any Pay a transaction.
     * @throws ApiError
     */
    public static transactionControllerPayTransaction(
        cartId: string,
        requestBody: PayTransactionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/transaction/{cartId}/pay',
            path: {
                'cartId': cartId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Seller revenue summary.
     * @throws ApiError
     */
    public static transactionControllerGetSellerSummary(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transaction/seller/summary',
        });
    }
    /**
     * @returns any Daily summary.
     * @throws ApiError
     */
    public static transactionControllerGetTodaySummary(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transaction/summary/daily',
        });
    }
}
