

const sqlite3 = require('sqlite3').verbose();

// Replace 'your_database.sqlite3' with the path to your SQLite database file
const dbPath = 'database/data.sqlite3';

// Open the SQLite database
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
     * @param {string[]} keys - An array of column names to update.
     * @param {string} where - The Lookup Key to use to find the record to update.
     * @param {Array} vals - An array of values to set for the specified columns. LAST VALUE iS THE LOOKUP VALUE
    */
    function UPDATE(db, table, keys, where, vals) {
        let tmp = '';
        for (let i = 0; i < keys.length; i++) {
            if (i == 0) tmp = keys[i] + '=?';
            else tmp += ',' + keys[i] + '=?';
        }
        let cmd = `UPDATE ${table} SET ${tmp} WHERE ${where} = ?`;
        console.log(cmd);
        RUN(db, cmd, vals);
    }

    /**
     * Insert record in a table.
     *
     * @param {sqlite3.Database} db - The SQLite database object.
     * @param {string} table - The name of the table to update.
     * @param {string[]} keys - An array of column names to update. - "DEFAULT" fordefault variables
     * @param {string} where - The Lookup Key to use to find the record to update.
     * @param {Array} vals - An array of values to set for the specified columns.
    */

    function INSERT(db, table, keys, vals) {
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
        RUN(db, cmd, vals);
    }
    /**
     * 
     * @param {sqlite3.Database} db - The SQLite database object.
     * @param {string} table - The name of the table to update.
     * @param {string[] | string} column - The column(s) to retrieve. * for all
     * @param {string} userId - The user ID to look up
     * @returns {object} Returns the row that was retrived as an object
     */

    function GET(db, column, table, userId) {
        db.get(`SELECT ${column} FROM ${table} WHERE id = ?`, [userId], (err, row) => {
            if (err) {
                console.error(err.message);
            } else {
                if (row) {
                    console.log(`Retrieved value: `);
                    console.log(row);
                    return row;
                } else {
                    console.log('No matching rows found.');
                }
            }
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
        db.run(cmd, vals, function(err) {
            if (err) {
                return console.error(err.message);
            }
        });
    }

    // Return only the public functions
    return {
        UPDATE,
        INSERT,
        GET
    };
})();

module.exports = { sql, db };
