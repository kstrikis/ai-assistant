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
                dialogId: { type: "integer" },
                parentMessageId: { type: "integer" }
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
            }
        }
    }
}

module.exports = Message