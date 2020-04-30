import gql from 'graphql-tag';

export const UpdateOrder = gql`
    mutation UpdateOrder($input: OrderChangeInput!) {
        updateOrder(input: $input) {
            clientMutationId,
            order {
                id,
                status,
                sharerNotes
            },
            orderViewModel {
                name,
                status,
                statusDisplay,
                orderId,
                dialogMessage,
                deliveryAddress,
                addressLabel,
                shareId,
                unitOfIssue,
                quantity
                requestId,
                details,
                sharerNotes,
                itemId
            }
        }
    }
`;
