import joinMonsterAdapter from 'join-monster-graphql-tools-adapter'
import joinMonster from 'join-monster'
import pg from 'pg'

const resolvers = {
  Query: {
    // call joinMonster in the "user" resolver, and all child fields that are tagged with "sqlTable" are handled!
    user(parent: any, args: any, ctx: any, resolveInfo: any) {
      const pool = new pg.Pool({
        user: 'postgres',
        password: 'docker',
        host: 'localhost',
        port: 54321,
        database: 'blsweb'
      })

      return joinMonster(resolveInfo, ctx, (sql: any) => {
        return pool.query(sql).then((result: { rows: any; }) => result.rows)
      }, { dialect: 'pg' })
    }
  },
  User: {
    // the only field that needs a resolver, joinMonster hydrates the rest!
    fullName(user: { first_name: string; last_name: string; }) {
      return user.first_name + ' ' + user.last_name
    }
  }
}