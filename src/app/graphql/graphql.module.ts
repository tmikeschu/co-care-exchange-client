import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { environment } from '../../environments/environment';
import { ApolloLink, concat, from } from 'apollo-link';
import { HttpHeaders } from '@angular/common/http';

const TOKEN_HEADER_KEY = 'x-api-key';
const uri = environment.serverUrl; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {
  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext({
      headers: new HttpHeaders().set(TOKEN_HEADER_KEY, 'KmFXIagDOypuL6YtCMzuaOyhs9cFodW2n6MK1eS1'),
    });

    return forward(operation);
  });

  const http = httpLink.create({ uri });

  return {
    // apollo.create({
    //   link: concat(authMiddleware, http),
    // });
    link: from([authMiddleware, http]),
    // link: httpLink.create(authMiddleware, http),
    //   link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
