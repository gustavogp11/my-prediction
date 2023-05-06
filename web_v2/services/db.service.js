var mysql = require('mysql');
var appConfig = require('common-web').appConfig;

function DbSql() {

    this.pool = mysql.createPool({
        connectionLimit: 10,
        host: appConfig.db.host,
        user: appConfig.db.user,
        password: appConfig.db.password,
        database: appConfig.db.database
    });


    this.select = function (query, params) {
        if(!params) params = [];
        return new Promise((resolve, reject) => {
            this.pool.query(query, params, function (error, results, fields) {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    this.insert = function (table, data) {
        try {
            this.pool.query('INSERT INTO ' + table + ' SET ?', data, function (error, results, fields) {
                if (error) throw error;
                console.log(results.insertId);
            });
        } catch(ex) {
            console.error(ex);
            throw ex;
        }
    }

}

module.exports = new DbSql();