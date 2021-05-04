var _TASKMANAGERDB;
var _USERSCOLLECTION;
require('dotenv').config();

class UsersDAO {

    /**
     * 
     * @param {*} connection 
     * @description connection Object is needed to create a connection with the database and making use of it in the entire class methods
     */
     static async injectDB(connection) {
        if (_TASKMANAGERDB) {
            return;
        }
        try {
            _TASKMANAGERDB = await connection.db(process.env.DATABASE);
            _USERSCOLLECTION = await _TASKMANAGERDB.collection("users");
        } catch (error) {
            console.error(`Unable to estalish the connection to the TestDB ${error}`);
            throw error
        }
    }
   
    /**
     * 
     * @param {String} mail 
     * @description - This function is for getting the user by email address.
     * @returns - User details Object 
     */

    static async findUserByMail(mail){
        try{
            return await _USERSCOLLECTION.findOne({email:mail})

        }catch(err){
            return { error: error }
        }

    }

    /**
     * 
     * @param {String} UserObject 
     * @description - This function is for getting the user by email address.
     * @returns - User details Object 
     */

    static async createNewUser(Object){
        try {
            let user = await _USERSCOLLECTION.insertOne(Object);
            if (!user) return { error: "Error while saving the data" }
            return user;
        } catch (error) {
            return { error: error }
        }

    }

}
module.exports = UsersDAO