import { User } from "../../models/index.js";

class UsersSeeder {
    static async seed() {
        const users = [
            { 'email': 'teacher1@example.com', 'role': 'teacher', 'cryptedPassword': "$2b$10$uU2clGCuDZLRR0PWUkTaJuLeAMux9X.7/tADQj7Bc16ogukzcgdGK" },
            { 'email': 'student1@example.com', 'role': 'student', 'cryptedPassword': "$2b$10$uU2clGCuDZLRR0PWUkTaJuLeAMux9X.7/tADQj7Bc16ogukzcgdGK" },
        ]
        for (const user of users) {
            const inDB = await User.query().findOne({ 'email': user.email })
            if (!inDB) {
                await User.query().insert(user)
            }
        }
    }
}

export default UsersSeeder