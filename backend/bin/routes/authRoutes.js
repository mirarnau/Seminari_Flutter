"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Role_1 = __importDefault(require("../models/Role"));
const Role_2 = require("../models/Role");
const config_1 = __importDefault(require("../config"));
class AuthRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    async register(req, res) {
        const { name, age, password, roles } = req.body;
        //encrypt password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashed = await bcryptjs_1.default.hash(password, salt);
        const newUser = new User_1.default({ name, age, password: hashed, roles });
        if (roles) {
            for (let i = 0; i < roles.length; i++) {
                if (!Role_2.ROLES.includes(roles[i])) {
                    return res.status(400).json({ message: 'Roles do not exist' });
                }
            }
            const foundRoles = await Role_1.default.find({ name: { $in: roles } });
            newUser.roles = foundRoles.map(role => role._id);
        }
        else {
            const userrole = await Role_1.default.findOne({ name: 'user' });
            newUser.roles = [userrole._id];
        }
        //if the user specifies his roles, we search these roles on the database
        const savedUser = await newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: savedUser._id, name: savedUser.name }, config_1.default.SECRET, {
            expiresIn: 3600 //seconds
        });
        res.status(200).json({ token });
    }
    async login(req, res) {
        const userFound = await User_1.default.findOne({ email: req.body.name }).populate('roles');
        if (!userFound)
            return res.status(400).json({ message: "User not found" });
        const matchPassword = await bcryptjs_1.default.compare(req.body.password, userFound.password);
        if (!matchPassword)
            return res.status(401).json({ token: null, message: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({ id: userFound._id, name: userFound.name }, config_1.default.SECRET, {
            expiresIn: 3600
        });
        res.json({ token: token });
    }
    async comparePassword(password, recievedPassword) {
        return await bcryptjs_1.default.compare(password, recievedPassword); //returns true if passwords coincide
    }
    routes() {
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
    }
}
const authRoutes = new AuthRoutes();
exports.default = authRoutes.router;
