# Colorado Care Exchange GraphQL Implementation

The server-side interface is exposed through a GraphQL API. The development environment url is:

[Development GraphQL Server](https://4atq1c83vc.execute-api.us-west-2.amazonaws.com/dev/graphql)

Through that endpoint, you can perform a GraphQL query to inspect the data schema as well as exposed queries and mutations. For more information on the GraphQL specification, please visit [GraphQL.org](https://graphql.org). 

NOTE: All endpoints are secured. Please reach out to Jason, Josh or Tony for API Keys.

There are many GraphQL query tools available, but my current favorite is [Banana Cake Pop](https://hotchocolate.io/docs/banana-cakepop).

When unlcear on which query or mutation actions are supported on the server, just query the development server endpoint to find a list of supported actions.