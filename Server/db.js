import mysql from "mysql2";

// environment dev, pro판단
const environment = process.argv[2];
if (!environment) {
  console.log("Invalid Argument:", environment);
}

let dbSetting = null;
if (environment === "dev") {
  dbSetting = {
    host: process.env.AWS_DOMAIN,
    user: process.env.MYSQL_EXTERNAL_USER,
    password: process.env.MYSQL_EXTERNAL_PWD,
    database: process.env.MYSQL_EXTERNAL_DB,
  };
} else if (environment === "pro") {
  dbSetting = {
    host: "127.0.0.1",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
  };

  // // SSL 인증서 키
  // const sslKeys = {
  //   ca: fs.readFileSync("/etc/letsencrypt/live/ujung.link/fullchain.pem"),
  //   key: fs.readFileSync("/etc/letsencrypt/live/ujung.link/privkey.pem"),
  //   cert: fs.readFileSync("/etc/letsencrypt/live/ujung.link/cert.pem"),
  // };
  // httpsServer = https.createServer(sslKeys, app);
}

// Connect to MySQL
const db = mysql.createPool(dbSetting);

db.getConnection((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected");
});

export default db;
