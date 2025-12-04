/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaResponseDto } from './MediaResponseDto';
export type ItemResponseDto = {
    id: number;
    name: string;
    variety?: string;
    gender?: string;
    size?: number;
    media: Array<MediaResponseDto>;
    description?: string;
    createdAt: string;
    updatedAt: string;
};

