/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaInput } from './MediaInput';
export type CreateItemDto = {
    name: string;
    variety?: string;
    gender?: string;
    age?: string;
    description?: string;
    category: string;
    startingBid?: number;
    bidIncrement?: number;
    buyItNow?: number;
    size?: number;
    weight?: number;
    origin?: string;
    breeder?: string;
    condition?: string;
    certificateUrl?: string;
    attributes: Record<string, any>;
    media?: Array<MediaInput>;
};

