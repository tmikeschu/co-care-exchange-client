export class Agreement{
    id: string;
    discriminator: string;
    requestorAnswerId: string;
    shareerAnswerId: string;
    requesterUserId: string;
    sharerUserId: string;
    isPending: boolean;
    isFulfilled: boolean;
    isCancelled: boolean;
    dropOffLatitude: number;
    dropOffLongitude: number;
    pickUpLatitude: number;
    pickUpLongitude: number;
    cancelledOn: Date;
    cancelledBy: string;
    status: number;
}