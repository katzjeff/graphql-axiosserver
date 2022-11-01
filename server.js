const express = require("express");
const schema = require("./schema.js")
const port = 4000

const expressGraphQL = require("express-graphql").graphqlHTTP;
// const { graphqlHTTP } = require('express-graphql');

const app = express()

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql:true
}));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


