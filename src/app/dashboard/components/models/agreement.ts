export class Agreement {
    orderId: string;
    discriminator: string;
    deliveryCoordinates: {
        latitude: number,
        longitude: number
    };
    deliveryAddress: string;
    cancelledOn: Date;
    cancelledBy: string;
    name: string;
    statusId: number;
    statusText: string;
    dialogMessage: string;
    statusTypeId: number; // 1=need;2=share
    shareId: string;
    requestId: string;
    requesterName: string;
    sharerName: string;
}
