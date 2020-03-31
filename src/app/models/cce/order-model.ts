export interface OrderCancelModel {
    orderId: string;
    cancellingUserId: string;
    reason: string;
    clientMutationId: string;
}