

const sqlite3 = require('sqlite3').verbose();

const dbPath = '.database\\data.sqlite3';

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`Connected to the database: ${dbPath}`);
  }
});



const sql = (() => {
    /**
     * Update records in a table.
     *
     * @param {sqlite3.Database} db - The SQLite database object.
     * @param {string} table - The name of the table to update.
     * @param {string[]} columns - An array of column names to update.
     * @param {string} key - The Lookup Key to use to find the record to update.
     * @param {string} id - The lookup value for the given key
     * @param {string[]} vals - An array of values to set for the specified columns.
    */
    async function UPDATE(db, table, columns, key, id , vals) {
        let tmp = '';
        for (let i = 0; i < columns.length; i++) {
            if (i == 0) tmp = columns[i] + '=?';
            else tmp += ',' + columns[i] + '=?';
        }
        vals.push(id)
        let cmd = `UPDATE ${table} SET ${tmp} WHERE ${key} = ?`;
        console.log('Check Below')
        console.log(cmd);
        console.log(vals)
        return new Promise(async (resolve, reject) => {
            let result = await RUN(db, cmd, vals)
            resolve(result)

        })
    }

    /**
     * Insert record in a table.
     *
     * @param {sqlite3.Database} db - The SQLite database object.
     * @param {string} table - The name of the table to update.
     * @param {string[]} keys - An array of column names to update. - "DEFAULT" fordefault variables
     * @param {string} where - The Lookup Key to use to find the record to update.
     * @param {string[]} vals - An array of values to set for the specified columns.
    */

    async function INSERT(db, table, keys, vals) {
        let tmp = '';
        if(vals){
            for (let i = 0; i < keys.length; i++) {
                console.log(keys[i])
                if (i == 0) tmp = ' (?'
                else tmp += ',?'
                if (i == keys.length - 1) tmp += ')';
            }
            keys = `(${keys})`
        }

        let cmd = `INSERT INTO ${table} ${keys} VALUES${tmp}`;
        console.log(cmd);
        return new Promise(async (resolve, reject) => {
            let result = await RUN(db, cmd, vals)
            resolve(result)

        })
        
    }
    /**
     * 
     * @param {sqlite3.Database} db - The SQLite database object.
     * @param {string} table - The name of the table to update.
     * @param {string[] | string} column - The column(s) to retrieve.
     * @param {string} userId - The user ID to look up
     * @returns {object} Returns the row that was retrived as an object
     */

    function GET(db, table, column, where, userId) {
        console.log(`User ID: ${userId}`)
        let part2 = '';
        if(!(userId === undefined)) {
            part2 = ` WHERE ${where} = ?`;
        } else {
            userId = []
        }
        let cmd = `SELECT ${column} FROM ${table}${part2}`
        console.log(cmd);


        return new Promise((resolve, reject) => {

            db.get(cmd, userId, (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    if (row) {
                        console.log(`Retrieved value: `);
                        console.log(row);
                        resolve(row);
                    } else {
                        console.log(`Lookup ID: ${userId}`);
                        console.log('No matching rows found.');
                        resolve(null);
                    }
                }
            })
        })
    }

    /**
     * 
     * @param {sqlite3.Database} db - The SQLite database object.
     * @param {string} table - The name of the table to update.
     * @param {string[] | string} column - The column(s) to retrieve. * for all
     * @returns {object} - Returns all the rows in the table as an array of objects
     */

    function ALL(db, table, column){
        let cmd = `SELECT ${column} FROM ${table}`

        return new Promise((resolve, reject) => {
            db.all(cmd, [], (err, rows) => {
                if(err){
                    console.error(err.message);
                } else {
                    resolve(rows)
                }


            })
        })
    }

    /**
     * Private function to execute a database command.
     *
     * @param {sqlite3.Database} db - The SQLite database object.
     * @param {string} cmd - The SQL command to execute.
     * @param {Array} vals - An array of values to be used in the SQL command.
    */

    function RUN(db, cmd, vals) {
        console.log(`Running command: ${cmd}`);
        return new Promise((resolve, reject) => {
            db.run(cmd, vals, function(err) {
                if (err) {
                    if(err.message.includes('UNIQUE constraint failed')) {
                        console.log('UNIQUE constraint failed, returning null');
                        resolve(null)
                    } else {
                        console.error(err.message);
                        reject(err);
                    }
                } else {
                    console.log(`Changes: ${this.changes}`);
                    resolve({
                        changes: this.changes,
                        lastID: this.lastID
                    })
                }
            });
        })
  
    }

    function DELETE(db, table, where, value) {
        let message = `DELETE FROM ${table} WHERE ${where} = ${value}`;
        RUN(db, message, []);
    }
    // Return only the public functions
    return {
        UPDATE,
        INSERT,
        GET,
        DELETE,
        ALL
    };
})();

module.exports = { sql, db };
