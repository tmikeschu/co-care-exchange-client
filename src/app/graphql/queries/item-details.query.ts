import gql from 'graphql-tag';

export const ItemDetails = gql`
    query ItemDetails($itemId: ID!, $userId: ID!) {
        itemDetails(itemId: $itemId, userId: $userId) {
            addressLabel
            deliveryAddress
            details
            dialogMessage
            itemId
            name
            orderId
            quantity
            requesterName
            requesterNotes
            requestId
            shareId
            sharerName
            sharerNotes
            status
            statusDisplay
            unitOfIssue
        }
    }
`;
