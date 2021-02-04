console.log("process.env.DATABASE_URL :>> ", process.env.DATABASE_URL)

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
   "type": "postgres",
   "url": process.env.DATABASE_URL,
   "synchronize": true,
   "logging": false,
   "extra": {
      "ssl": process.env.NODE_ENV === 'production' ? true : false
   },
   "entities": [
      isProduction ? "build/entity/**/*.js" :  "src/entity/**/*.ts"
   ],
   "migrations": [
      isProduction ? "build/migration/**/*.js" :  "src/migration/**/*.ts"
   ],
   "subscribers": [
      isProduction ? "build/subscriber/**/*.js" :  "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}