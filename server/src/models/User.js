/* eslint-disable import/no-extraneous-dependencies */
const Bcrypt = require("bcrypt");
const unique = require("objection-unique");
const Model = require("./Model");

const saltRounds = 10;

const uniqueFunc = unique({
  fields: ["email"],
  identifiers: ["id"],
});

class User extends uniqueFunc(Model) {
  static get tableName() {
    return "users";
  }

  set password(newPassword) {
    this.cryptedPassword = Bcrypt.hashSync(newPassword, saltRounds);
  }

  authenticate(password) {
    return Bcrypt.compareSync(password, this.cryptedPassword);
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "role"],

      properties: {
        email: { type: "string", pattern: "^\\S+@\\S+\\.\\S+$" },
        cryptedPassword: { type: "string" },
        role: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    const { Dialog, Classroom } = require("./index.js")
    return {
      dialogs: {
        relation: Model.HasManyRelation,
        modelClass: Dialog,
        join: {
          from: "users.id",
          to: "dialogs.userId"
        }
      },
      classroom: {
        relation: Model.BelongsToOneRelation,
        modelClass: Classroom,
        join: {
          from: "users.classroomId",
          to: "classrooms.id"
        }
      }
    }
  }

  $formatJson(json) {
    const serializedJson = super.$formatJson(json);

    if (serializedJson.cryptedPassword) {
      delete serializedJson.cryptedPassword;
    }

    return serializedJson;
  }
}

module.exports = User;
