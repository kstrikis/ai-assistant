/* eslint-disable no-console */
import { connection } from "../boot.js"
import UsersSeeder from "./seeders/usersSeeder.js"
import ClassroomsSeeder from "./seeders/classroomsSeeder.js"

class Seeder {
  static async seed() {
    // include individual seed commands here

    console.log("Seeding users...")
    await UsersSeeder.seed()

    console.log("Seeding classroom...")
    await ClassroomsSeeder.seed()

    console.log("Done!")
    await connection.destroy()
  }
}

export default Seeder