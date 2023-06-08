import { User, Classroom } from "../../models/index.js"

class ClassroomsSeeder {
    static async seed() {
        const classroom = await Classroom.query().insert({ 'name': 'First Classroom' })
        const teacher = await User.query().findOne({ 'email': 'teacher1@example.com' })
        await teacher.$query().patch({ 'classroomId': classroom.id })
        const student = await User.query().findOne({ 'email': 'student1@example.com' })
        await student.$query().patch({ 'classroomId': classroom.id })

    }
}

export default ClassroomsSeeder