
import path from 'path';

const _fileDB: string = 'database.sqlite';

module.exports = {
    client: 'sqlite3',
    connection: {
        filename:  path.resolve(__dirname, 'src', 'database', _fileDB),
    },
    migrations:  {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds:  {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true
};