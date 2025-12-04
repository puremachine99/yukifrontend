/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateAdvertisementStatusDto = {
    status: UpdateAdvertisementStatusDto.status;
    note?: string;
    startDate?: string;
    endDate?: string;
    transactionId?: number;
};
export namespace UpdateAdvertisementStatusDto {
    export enum status {
        PENDING = 'pending',
        APPROVED = 'approved',
        REJECTED = 'rejected',
        ACTIVE = 'active',
        EXPIRED = 'expired',
    }
}

