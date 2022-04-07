"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Dish_1 = __importDefault(require("../models/Dish"));
class DishesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }
    async getAllDishes(req, res) {
        const allMenus = await Dish_1.default.find();
        if (allMenus.length == 0) {
            res.status(404).send("There are no dishes yet.");
        }
        else {
            res.status(200).send(allMenus);
        }
    }
    async getDishByTitle(req, res) {
        const dishFound = await Dish_1.default.findOne({ title: req.params.title });
        if (dishFound == null) {
            res.status(404).send("Menu not found.");
        }
        else {
            res.status(200).send(dishFound);
        }
    }
    async addDish(req, res) {
        const dishFound = await Dish_1.default.findOne({ title: req.body.title,
            rating: req.body.rating, price: req.body.price, imageUrl: req.body.imageUrl });
        if (dishFound != null) {
            res.status(409).send("Dish already exists.");
        }
        const { title, rating, price, imageUrl } = req.body;
        const newDish = new Dish_1.default({ title, rating, price, imageUrl });
        await newDish.save();
        res.status(201).send('Dish added.');
    }
    async updateDish(req, res) {
        const menuToUpdate = await Dish_1.default.findOneAndUpdate({ title: req.params.title }, req.body);
        if (menuToUpdate == null) {
            res.status(404).send("Dish not found.");
        }
        else {
            res.status(201).send("Dish updated.");
        }
    }
    async deleteDish(req, res) {
        const dishToDelete = await Dish_1.default.findOne({ title: req.params.title });
        if (dishToDelete == null) {
            res.status(404).send("Dish not found.");
            return;
        }
        await Dish_1.default.findOneAndDelete({ title: req.params.title });
        res.status(200).send("Dish deleted.");
    }
    routes() {
        this.router.get('/', this.getAllDishes);
        this.router.get('/title', this.getDishByTitle);
        this.router.post('/', this.addDish);
        this.router.put('/:title', this.updateDish);
        this.router.delete('/:title', this.deleteDish);
    }
}
const dishesRoutes = new DishesRoutes();
exports.default = dishesRoutes.router;
