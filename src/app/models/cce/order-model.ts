// export interface OrderCancelModel {
//     orderId: string;
//     cancellingUserId: string;
//     reason: string;
//     clientMutationId: string;
// }

export interface OrderStatusChangeModel {
    id: string;
    requesterUserId: string;
    status: number;
    cancellationReason: string;
    clientMutationId: string;
}

//id, status, cancellationReason, requesterUserId