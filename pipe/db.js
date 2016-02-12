var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

module.exports = function() {
    return function(req, res, next) {
        if(global.db) return next();

        var conn = mongoose.connection;

        conn.on('error', next);

        conn.on('connected', function() {
            global.db = conn;

            var counterSchema = new Schema({
                sNum: String,
                count: Number
            });

            counterSchema.plugin(timestamps);

            var loggerSchema = new Schema({
                sNum: String
            });

            loggerSchema.plugin(timestamps);

            global.Counter = conn.model('Counter', counterSchema);
            global.Logger = conn.model('Logger', loggerSchema);

            next();
        });

        // When the connection is disconnected
        conn.on('disconnected', function () {
            console.log('Mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', function () {
            conn.close(function () {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });

        mongoose.connect('mongodb://localhost/multi-counter-demo-db');
    };
};