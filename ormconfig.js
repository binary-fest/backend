console.log("process.env.DATABASE_URL :>> ", process.env.DATABASE_URL)
module.exports = {
   "type": "postgres",
   "url": process.env.DATABASE_URL,
   "synchronize": true,
   "logging": false,
   "extra": {
      "ssl": process.env.NODE_ENV === 'production' ? true : false
   },
   "entities": [
      `${process.env.NODE_ENV === 'production' ? 'build' : 'src'}/entity/**/*.ts`
   ],
   "migrations": [
      `${process.env.NODE_ENV === 'production' ? 'build' : 'src'}/migration/**/*.ts`
   ],
   "subscribers": [
      `${process.env.NODE_ENV === 'production' ? 'build' : 'src'}/subscriber/**/*.ts`
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}