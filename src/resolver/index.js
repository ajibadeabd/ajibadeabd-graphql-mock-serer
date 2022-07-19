
const { userCollection }= require("../database/database.json");

const mockedResolver = {
        Query: {
          me: (_parent, args, { req:{ headers } } ) => {
              const userPosition = Math.floor(Math.random() * 3);
              return userCollection[userPosition]
          },
      },
}

module.exports = mockedResolver