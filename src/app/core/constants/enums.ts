export enum Status {
    FindingMatch = 'Matching'
    , NewMatchFound = 'Matched'
    , DeliveryPending = 'Confirmed'
    , OrderFulfilled = 'Fulfilled'
    , OrderCancelled = 'Cancelled'
}

export enum UIState {
    Loading = 'loading'
    , Done = 'done'
}
