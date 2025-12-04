/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAchievementDto } from '../models/CreateAchievementDto';
import type { UpdateAchievementDto } from '../models/UpdateAchievementDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AchievementService {
    /**
     * @param requestBody
     * @returns any Create achievement.
     * @throws ApiError
     */
    public static achievementControllerCreate(
        requestBody: CreateAchievementDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/achievement',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any List achievements.
     * @throws ApiError
     */
    public static achievementControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/achievement',
        });
    }
    /**
     * @param id
     * @returns any Get achievement detail.
     * @throws ApiError
     */
    public static achievementControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/achievement/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Update achievement.
     * @throws ApiError
     */
    public static achievementControllerUpdate(
        id: string,
        requestBody: UpdateAchievementDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/achievement/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Remove achievement.
     * @throws ApiError
     */
    public static achievementControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/achievement/{id}',
            path: {
                'id': id,
            },
        });
    }
}
