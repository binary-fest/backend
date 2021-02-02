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
      "build/entity/**/*.ts"
   ],
   "migrations": [
      "build/migration/**/*.ts"
   ],
   "subscribers": [
      "build/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}