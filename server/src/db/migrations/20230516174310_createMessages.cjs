/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.createTable("messages", (table) => {
        table.bigIncrements("id");
        table.text("content").notNullable();
        table.string("messageType").notNullable();
        table.boolean("reviewed");
        table.bigInteger("dialogId").notNullable().unsigned().references("dialogs.id").onDelete("CASCADE");
        table.bigInteger("parentMessageId").unsigned().references("messages.id").onDelete("CASCADE");
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.dropTableIfExists("messages");
}
