export interface OrderStatusChangeModel {
    orderId: string;
    userId: string;
    newStatus: number;
    reason: string;
    clientMutationId: string;
    requestId: string;
    shareId: string;
}
