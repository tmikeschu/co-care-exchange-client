import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CreateUserInput} from '../../graphql/models/create-user-input.model';

const UserForEmail = gql`
  query UserForEmail($emailAddress: String!) {
    users(where: { emailAddress: $emailAddress }) {
      id
      emailAddress
    }
  }
`;

const CreateUser = gql`
  mutation UserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
        firstName
        lastName
      }
      clientMutationId
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apollo: Apollo) {}

  getUser(emailAddress: String): Observable<object> {
    return this.apollo
      .query({
        query: UserForEmail,
        variables: {
          emailAddress: emailAddress,
        },
      })
      .pipe(
        map((response: any) => {
          console.log('DEBUG DATA ', response);
          const data = response.data;
          return data.users && data.users.length ? data.users[0] : null;
        })
      );
    // this.apollo
    //     .query({
    //       query: gql`
    //       {
    // users(where: { emailAddress: "scarlet@dfb.org"}) {
    //     id,
    //     emailAddress
    // }
    //       }
    //     `,
    //     })
    //     .subscribe(console.log);
    // const query = {
    //   query: 'query GetPrompts {prompts{id,audience,display,groupName,promptType,sizes,item,unitsOfIssue}}',
    //   variables: {},
    // };
    // return this.http.post<any>(`${environment.serverUrl}`, query);
  }

  saveUser(userProfile: CreateUserInput) {
      console.log('DEBUG save user ', userProfile);
      return this.apollo
          .mutate({
              mutation: CreateUser,
              variables: {
                  input: userProfile,
              },
          })
          .pipe(
              map((response: any) => {
                  console.log('DEBUG CREATE USER DATA ', response);
                  const data = response.data;
                  return data.users && data.users.length ? data.users[0] : null;
              })
          );
  }
}

// query Users {
//   organizations {
//     id,
//         name
//   }
// }
