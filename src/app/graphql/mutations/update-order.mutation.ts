import gql from 'graphql-tag';

export const UpdateOrder = gql`
    mutation UpdateOrder($input: OrderChangeInput!) {
        updateOrder(input: $input) {
            clientMutationId,
            order {
                id,
                status,
                description
            },
            orderViewModel {
                name,
                statusText,
                orderId,
                dialogMessage,
                statusId,
                deliveryAddress,
                addressLabel,
                shareId,
                unitOfIssue,
                quantity
                requestId,
                details,
                description
            }
        }
    }
`;
