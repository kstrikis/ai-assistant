const Model = require("./Model")

class Classroom extends Model {
    static get tableName() {
        return "classroom"
    }
    
    static get jsonSchema() {
        return {
            type: "object",
            required: ["name"],
            properties: {
                name: { type: "string" }
            }
        }       
    }

    static get relationMappings() {
        const { User } = require("./index")
        return {
            users: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: "classrooms.id",
                    to: "users.classroomId"
                }
            }
        }
    }
}