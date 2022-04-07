"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isModerator = exports.verifyToken = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Role_1 = __importDefault(require("../models/Role"));
const config_1 = __importDefault(require("../config"));
const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    let jwtPayload;
    try {
        jwtPayload = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).json({ message: "No token" });
        return;
    }
    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { id } = jwtPayload;
    const user = await User_1.default.findById(id);
    if (!user)
        return res.status(404).json({ message: "No user found" });
    //Call the next middleware or controller
    next();
};
exports.verifyToken = verifyToken;
const isModerator = async (req, res, next) => {
    const user = await User_1.default.findById(res.locals.jwtPayload.id);
    const roles = await Role_1.default.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name == 'moderator' || roles[i].name == 'admin') {
            next();
            return;
        }
    }
    return res.status(403).json({ message: "Requires moderator role" });
};
exports.isModerator = isModerator;
const isAdmin = async (req, res, next) => {
    const user = await User_1.default.findById(res.locals.jwtPayload.id);
    const roles = await Role_1.default.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name == 'admin') {
            next();
            return;
        }
    }
    return res.status(403).json({ message: "Requires admin role" });
};
exports.isAdmin = isAdmin;
