export interface OrderCancelModel {
    orderId: string;
    cancellingUserId: string;
    cancellationReason: string;
    clientMutationId: string;
}