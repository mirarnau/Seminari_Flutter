"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoles = void 0;
const Role_1 = __importDefault(require("../models/Role"));
const createRoles = async () => {
    try {
        const count = await Role_1.default.estimatedDocumentCount();
        //If there are already roles in the DB, do nothing.
        if (count > 0)
            return;
        const values = await Promise.all([
            new Role_1.default({ name: 'user' }).save(),
            new Role_1.default({ name: 'moderator' }).save(),
            new Role_1.default({ name: 'admin' }).save()
        ]); //Executes all promises at the same time
        console.log(values);
    }
    catch (error) {
        console.error(error);
    }
};
exports.createRoles = createRoles;
