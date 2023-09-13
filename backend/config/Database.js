import {Sequelize} from "sequelize";

const db = new Sequelize('dbpuskom', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;