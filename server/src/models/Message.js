const Model = require("./Model")

class Message extends Model {
    static get tableName() {
        return "messages"
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["content", "messageType", "dialogId"],
            properties: {
                content: { type: "string" },
                messageType: { type: "string" },
                reviewed: { type: "boolean" },
                dialogId: { type: ["integer", "string"] },
                parentMessageId: { type: ["integer", "string"] }
            }
        }
    }

    static get relationMappings() {
        const { Dialog } = require("./index.js")
        return {
            dialog: {
                relation: Model.BelongsToOneRelation,
                modelClass: Dialog,
                join: {
                    from: "messages.dialogId",
                    to: "dialogs.id"
                }
            },
            answers: {
                relation: Model.HasManyRelation,
                modelClass: Message,
                join: {
                    from: "messages.id",
                    to: "messages.parentMessageId"
                }
            },
            question: {
                relation: Model.BelongsToOneRelation,
                modelClass: Message,
                join: {
                    from: "messages.parentMessageId",
                    to: "messages.id"
                }
            }
        }
    }
}

module.exports = Message