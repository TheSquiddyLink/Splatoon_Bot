// NOTE: King Salmons have health set to 2

const { exec } = require('child_process');
const fs = require('fs');
const readLine = require('readline');

const sqlite = ".database\\.SQLite\\sqlite3.exe "
const output = ".database\\data.sqlite3";
const sql = ".database\\main.sql"

const sqliteCommand = `${sqlite} ${output} < ${sql}`;;

if(fs.existsSync(output)){
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Database already made, replace or attempt merge? (r/m) ', (answer) => {
    if(answer == 'r'){
      rl.question("Are you sure? This will delete all data! (y/n)", (answer) => {
        if(answer == 'y'){
          fs.unlinkSync(output)
          create()
        }
        rl.close();
      });
    } else create()
  });
} else create()

function create() {
  exec(sqliteCommand, { cwd: process.cwd() }, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
  
    console.log(stdout);
    console.error(stderr);
  });
  
}
