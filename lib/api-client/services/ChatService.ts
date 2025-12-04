/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateChatDto } from '../models/CreateChatDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatService {
    /**
     * @param auctionId
     * @returns any Get chat by auction.
     * @throws ApiError
     */
    public static chatControllerFindByAuction(
        auctionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/auction/{auctionId}',
            path: {
                'auctionId': auctionId,
            },
        });
    }
    /**
     * @param auctionId
     * @param requestBody
     * @returns any Create chat message.
     * @throws ApiError
     */
    public static chatControllerCreate(
        auctionId: string,
        requestBody: CreateChatDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat/auction/{auctionId}',
            path: {
                'auctionId': auctionId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Delete chat message.
     * @throws ApiError
     */
    public static chatControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/chat/{id}',
            path: {
                'id': id,
            },
        });
    }
}
