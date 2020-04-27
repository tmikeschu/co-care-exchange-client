export interface OrderChangeInput {
    orderId: string;
    userId: string;
    status: number;
    reason: string;
    clientMutationId: string;
    requestId: string;
    shareId: string;
    description: String;
}
