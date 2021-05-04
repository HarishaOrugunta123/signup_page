const {MongoClient} = require("mongodb");
require("dotenv").config();
const UsersDAO = require("../dataAccessLayer/UserDAO");
// Replace this with your MONGOURI.
const MONGOURI = process.env.MONGO_DB_CLUSTER_URL;

const InitiateMongoServer = async () =>{
    try{
        let client =await MongoClient.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
        await UsersDAO.injectDB(client);
        // , async (err, client) =>{
        //     if (err) {
        //         console.log(" Could not make connection with the DB");
        //         throw err;
        //     }else{
        //         console.log(" Made a connection with the DB");
                
        //     }
              
        // }
        // );
    }catch(e){
        console.log(e);
        throw e;
    }
};
module.exports = InitiateMongoServer;