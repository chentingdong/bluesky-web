import joinMonster from 'join-monster';
import pg from 'pg';
const resolvers = {
    Query: {
        // call joinMonster in the "user" resolver, and all child fields that are tagged with "sqlTable" are handled!
        user(parent, args, ctx, resolveInfo) {
            const pool = new pg.Pool({
                user: 'postgres',
                password: 'docker',
                host: 'localhost',
                port: 54321,
                database: 'blsweb'
            });
            return joinMonster(resolveInfo, ctx, (sql) => {
                return pool.query(sql).then((result) => result.rows);
            }, { dialect: 'pg' });
        }
    },
    User: {
        // the only field that needs a resolver, joinMonster hydrates the rest!
        fullName(user) {
            return user.first_name + ' ' + user.last_name;
        }
    }
};
