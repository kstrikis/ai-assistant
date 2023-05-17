const Model = require("./Model")

class Dialog extends Model {
    static get tableName() {
        return "dialogs"
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["userId"],
            properties: {
                userId: { type: "integer" }
            }
        }
    }

    static get relationMappings() {
        const { User, Message } = require("./index.js")
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "dialogs.userId",
                    to: "users.id"
                }
            },
            messages: {
                relation: Model.HasManyRelation,
                modelClass: Message,
                join: {
                    from: "dialogs.id",
                    to: "messages.dialogId"
                }
            }
        }
    }
}

module.exports = Dialog