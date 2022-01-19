const MongoClient = require("mongodb").MongoClient;
const config = require('../config.json');
const CosmosClient = require('@azure/cosmos').CosmosClient

let connection = null;
let url = config.mongodbConnection

const options = {
    endpoint: config.endpoint,
    key: config.key,
    userAgentSuffix: 'SteamverseDB'
  };

module.exports.connect = () => new Promise((resolve, reject) => {
    // MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    //     if (err) { reject(err); return; };
    //     resolve(db);        
    //     connection = db;
    // });
    connection = new CosmosClient(options)
});

module.exports.get = () => {
    if(!connection) {
        throw new Error('Call connect first!');
    }
    return connection;
}

module.exports.getDB = () => {
    if(!connection) {
        throw new Error('Call connect first!');
    }
    return connection.database(config.dbName)
}