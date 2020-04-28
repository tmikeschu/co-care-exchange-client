import { throwError } from 'rxjs';

export function handleGQLErrors(data: any) {
    if (data && data.errors) {
        const messages = data.errors.map((e) => e.message).join(', ');
        return throwError(messages);
    }
    return data.data;
}
