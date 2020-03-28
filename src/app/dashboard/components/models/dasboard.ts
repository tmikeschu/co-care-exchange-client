export interface Status {
    requestId: string;
    name: string;
    status: string;
    address: string;
    statusId: number;
    styleclass?: string;
    confirm?: boolean;
    deny?: boolean;
    statusType: string;
    statusTypeId: number;
}