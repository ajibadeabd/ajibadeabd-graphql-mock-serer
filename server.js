const { ApolloServer, gql } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');
const casual = require('casual');
const { addMocksToSchema } = require("@graphql-tools/mock")
const path = require("path")
const { makeExecutableSchema  } = require("@graphql-tools/schema")
const  mockedResolver = require("./src/resolver/index");
const   { loadFilesSync }  = require("@graphql-tools/load-files");
const { config } = require("dotenv")
/*
config env variable
*/ 
config()
const { 
    resolvers: scalerResolver,
   } = require("graphql-scalars");

const  typeDefs = loadFilesSync(
  path.join(process.cwd(), './src/schema/me.graphql'),
  {
    extensions: ['graphql'],
  }
)
const mocks = {
    Int: () => 6,
    Float: () => 22.1,
    String: () => casual.string,
    Date: () => casual.date(format = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'),
    PhoneNumber: () => casual.phone,
    EmailAddress: ()=> casual.email,
    JSON: ()=> scalerResolver.JSON,
    userGenderEnum: ()=> 'male',
    userLanguageEnum: ()=> casual.language_code,
  };
  
const executableSchema = makeExecutableSchema({
  typeDefs,
});
const schemaWithMocks = addMocksToSchema({
  schema: executableSchema,
  resolvers: { ...mockedResolver },
  mocks, // override the defaults mocked data typr
  mockEntireSchema: false,  // allow external resolver to be used along side mocked schema
});


const server = new ApolloServer({
  schema: schemaWithMocks,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: (ctx) => ctx,
  introspection: true,
})


const port = process.env.PORT || 3000
server.listen(port).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})