
module.exports.db = {};

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoURI = require('./.env.json').MONGODB_URI;

var state = {
    db: null
};

module.exports.connect = function(url, done) {
    if(state.db) return done;

    MongoClient.connect(mongoURI, function(err, db) {
        if(err) {
            console.log("it's going to be a loooong night");
            console.log("This is the err:\n" + err);
            return done(err);
        } else {
            console.log("Connected successfully to mongo server");
            state.db = db;
            done;
        }
    });
};

module.exports.get = function() {
    return state.db;
};

module.exports.getURI = function() {
    return mongoURI;
};

module.exports.randomObjectId = function() {
    var objectId = mongodb.ObjectID;
    return new objectId();
};

module.exports.ObjectId = function(arg) {
    return ObjectId(arg);
}