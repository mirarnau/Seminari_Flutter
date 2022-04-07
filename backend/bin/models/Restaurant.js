"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RestaurantSchema = new mongoose_1.Schema({
    owner: { type: String, required: true },
    restaurantName: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    photos: [],
    rating: { type: Number },
    creationDate: { type: Date, default: Date.now },
    listTags: [{
            tagName: { type: String }
        }],
    listMenus: [] //Array containing the IDs of the menus.
});
exports.default = (0, mongoose_1.model)('Restaurant', RestaurantSchema);
