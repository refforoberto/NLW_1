import knex from 'knex';
import path from 'path';

const _fileDB: string = 'database.sqlite';

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename:  path.resolve(__dirname, _fileDB),
    },
    useNullAsDefault: true 
});

export default connection;