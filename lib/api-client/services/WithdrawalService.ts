/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateWithdrawalDto } from '../models/CreateWithdrawalDto';
import type { ProcessWithdrawalDto } from '../models/ProcessWithdrawalDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WithdrawalService {
    /**
     * @param requestBody
     * @returns any Create a withdrawal request.
     * @throws ApiError
     */
    public static withdrawalControllerCreate(
        requestBody: CreateWithdrawalDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/withdrawal',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any List withdrawals for the user.
     * @throws ApiError
     */
    public static withdrawalControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/withdrawal',
        });
    }
    /**
     * @param status
     * @returns any Admin list withdrawals.
     * @throws ApiError
     */
    public static withdrawalControllerAdminList(
        status?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/withdrawal/admin',
            query: {
                'status': status,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Process withdrawal request.
     * @throws ApiError
     */
    public static withdrawalControllerProcess(
        id: string,
        requestBody: ProcessWithdrawalDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/withdrawal/{id}/process',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
