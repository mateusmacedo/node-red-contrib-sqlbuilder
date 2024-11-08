# SQL - Module for Node-Red

## Description

This is a "batteries included" SQL query builder for CockroachDB, MariaDB, MSSQL, MySQL, PostgreSQL, SQLite3, Oracle DB, and Amazon Redshift designed to be flexible, portable, and fun to use.

Building SQL manually is difficult and error prone, especially if you use multiple databases, as each has its own dialect.

This module is based on the excellent Knex.js project (<https://knexjs.org>), which allows to use JavaScript to generate the correct SQL.

## Snapshot

![SQLBuilder Basic Example](snapshots/20211121143000.png?raw=true "Basic use")

### Example Queries

- Select columns from table based on a where clause

```javascript
query.select(["id", "first_name"]).from("users").where({
    id: msg.user_id
})
```

- Multiple inserts

Wnat to insert multiple rows. Its easy, just add the objects to an array

```javascript
query.insert([
    msg.user01,
    msg.user02
]).into('users')
```

- Subquery

Example of a subquery in a WHERE IN clause

```javascript
query
    .from("users")
    .whereNotIn("id",
        query
            .from("users_unsubscribed")
            .select(["user_id"]))
    .limit(1)
    .orderByRaw("RANDOM()")
    .select(["*"])
```

## Full Query Documentation

- <https://knexjs.org/#Builder>
