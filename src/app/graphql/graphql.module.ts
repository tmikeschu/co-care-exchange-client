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
    // TODO -- replace key with idToken when ready
    operation.setContext({
      headers: new HttpHeaders().set(TOKEN_HEADER_KEY, environment.apiKey),
    });

    return forward(operation);
  });

  const http = httpLink.create({ uri });

  return {
    link: from([authMiddleware, http]),
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
