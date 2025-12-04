/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProcessWithdrawalDto = {
    status: ProcessWithdrawalDto.status;
    payoutReference?: string;
    payoutReceipt?: string;
};
export namespace ProcessWithdrawalDto {
    export enum status {
        APPROVED = 'approved',
        REJECTED = 'rejected',
        PAID = 'paid',
    }
}

