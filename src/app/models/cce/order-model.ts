export interface OrderCancelModel {
    orderId: string;
    cancellingUserId: string;
    reason: string;
    clientMutationId: string;
}

export interface OrderChangeStatusModel {
    orderId: string;
    agreementUserId: string;
    newStatusId: number;
    clientMutationId: string;
}