import { DataSourceOptions, DataSource } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "greencolor26",
    database: "blog-nestjs",
    entities:[],
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;