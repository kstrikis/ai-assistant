const Model = require("./Model")

class Dialog extends Model {
    static get tableName() {
        return "dialogs"
    }

    messagesForApi = async () => {
        const dialogMessages = await this
            .$relatedQuery("messages")
            .where('messageType', 'answer')
            .withGraphFetched('question')
            .orderBy('id')
        const formattedMessages = []
        dialogMessages.map(answer => {
            formattedMessages.push({ role: "user", content: answer.question.content })
            formattedMessages.push({ role: "assistant", content: answer.content })
        })
        return formattedMessages
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["userId"],
            properties: {
                userId: { type: ["integer", "string"] }
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