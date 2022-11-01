    const axios = require("axios")
    const {
        GraphQLObjectType,
        GraphQLString,
        GraphQLInt,
        GraphQLSchema,
        GraphQLList,
        GraphQLNonNull
    } = require("graphql");

    //Sample Data
    // const patient = [
    //     { id: 1, name: 'Jane Doe', email: 'janedoe@email.com', age: 24 },
    //     { id: 2, name: 'John Doe', email: 'jdoe@email.com', age: 43 },
    //     { id: 3, name: 'Terry Doe', email: 'terry@email.com', age: 15 }
        
    // ]

    //Patient Type
    const PatientType = new GraphQLObjectType({
        name: 'Patient',
        fields: () => ({
            id: { type: GraphQLString },
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            age: {type: GraphQLInt}
        })
    });

    //Root Query-baseline for all other queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        patient: {
            type: PatientType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                // for (let i = 0; i < patient.length; i++){
                //     if (patient[i].id == args.id) {
                //         return patient[i];
                //     }
                // }
                return axios.get('http://localhost:3000/patients/' + args.id)
                    .then(res => res.data);
            }
        },
        patients: {
            type: new GraphQLList(PatientType),
            resolve(parentValue, args) {
                return axios.get('http://localhost:3000/patients/')
                    .then(res => res.data);
            }
        }
    }
        
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPatient: {
            type: PatientType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                
            },
            resolve(parentValue, args) {
                return axios.post('http://localhost:3000/patients', {
                    name: args.name,
                    email: args.email,
                    age: args.age,
                })
                .then(res => res.data);    
            }
        },
        deletePatient: {
            type: PatientType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args) {
                return axios.delete('http://localhost:3000/patients/' + args.id)
                .then(res => res.data);    
            }
        },
        updatePatient: {
            type: PatientType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                email: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return axios.patch('http://localhost:3000/patients/' + args.id, args)
                .then(res => res.data);    
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});