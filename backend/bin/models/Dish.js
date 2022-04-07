"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DishSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    rating: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true }
});
exports.default = (0, mongoose_1.model)('Dish', DishSchema);
