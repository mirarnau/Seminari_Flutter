"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
class RestaurantsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }
    async getAllRestaurants(req, res) {
        const allRestaurants = await Restaurant_1.default.find();
        if (allRestaurants.length == 0) {
            res.status(404).send("There are no restaurants yet.");
        }
        else {
            res.status(200).send(allRestaurants);
        }
    }
    async getRestaurantByName(req, res) {
        const restaurantFound = await Restaurant_1.default.findOne({ restaurantName: req.params.restaurantName });
        if (restaurantFound == null) {
            res.status(404).send("Restaurant not found.");
        }
        else {
            res.status(200).send(restaurantFound);
        }
    }
    async getRestaurantById(req, res) {
        const restaurantFound = await Restaurant_1.default.findById(req.params._id).populate('owner');
        if (restaurantFound == null) {
            res.status(404).send("Restaurant not found.");
        }
        else {
            res.status(200).send(restaurantFound);
        }
    }
    async addRestaurant(req, res) {
        const restaurantFound = await Restaurant_1.default.findOne({ restaurantName: req.body.restaurantName });
        if (restaurantFound != null) {
            res.status(409).send("This restaurant already exists.");
        }
        else {
            const { owner, restaurantName, email, address, description } = req.body;
            const newRestaurant = new Restaurant_1.default({ owner, restaurantName, email, address, description });
            await newRestaurant.save();
            res.status(201).send('Restaurant added.');
        }
    }
    async updateRestaurant(req, res) {
        const restaurantToUpdate = await Restaurant_1.default.findOneAndUpdate({ restaurantName: req.params.restaurantName }, req.body);
        if (restaurantToUpdate == null) {
            res.status(404).send("Restaurant not found.");
        }
        else {
            res.status(201).send('Restaurant updated.');
        }
    }
    async deleteRestaurant(req, res) {
        const restaurantToDelete = await Restaurant_1.default.findOneAndDelete({ restaurantName: req.params.restaurantName });
        if (restaurantToDelete == null) {
            res.status(404).send("Restaurant not found.");
        }
        else {
            res.status(200).send('Restaurant deleted.');
        }
    }
    async filterRestaurants(req, res) {
        const listTastesCustomer = req.body.tags;
        if (listTastesCustomer.length == 0) {
            res.status(409).send("No tags specidfied in the petition.");
        }
        else {
            const tagsList = listTastesCustomer.map(taste => taste.tagName);
            const allRestaurants = await (Restaurant_1.default.find());
            const filteredResutaurants = allRestaurants.filter((restaurant) => {
                let tagsMatches = 0;
                for (let i = 0; i < tagsList.length; i++) {
                    const tagsRestaurant = restaurant.listTags.map((tag) => tag.tagName);
                    console.log(tagsList[i]);
                    console.log(tagsRestaurant);
                    if (tagsRestaurant.includes(tagsList[i])) {
                        tagsMatches++;
                        if (tagsMatches == tagsList.length) {
                            return restaurant;
                        }
                    }
                }
            });
            if (filteredResutaurants.length == 0) {
                res.status(404).send("Any restaurant fulfills the requirements.");
            }
            else {
                res.status(200).send(filteredResutaurants);
            }
        }
    }
    async sortByRating(req, res) {
        const allRestaurants = await Restaurant_1.default.find();
        if (allRestaurants == null) {
            res.status(404).send("There are no restaurants yet.");
        }
        else {
            const sortedRestaurants = allRestaurants.sort((n1, n2) => {
                if (n1.rating > n2.rating) {
                    return -1;
                }
                if (n1.rating < n2.rating) {
                    return 1;
                }
                return 0;
            });
            res.status(200).send(sortedRestaurants);
        }
    }
    routes() {
        this.router.get('/', [middlewares_1.authJwt.verifyToken], this.getAllRestaurants);
        this.router.get('/:_id', [middlewares_1.authJwt.verifyToken], this.getRestaurantById);
        this.router.get('/name/:restaurantName', [middlewares_1.authJwt.verifyToken], this.getRestaurantByName);
        this.router.get('/filters/tags', [middlewares_1.authJwt.verifyToken], this.filterRestaurants);
        this.router.get('/filters/rating', [middlewares_1.authJwt.verifyToken], this.sortByRating);
        this.router.post('/', [middlewares_1.authJwt.verifyToken, middlewares_1.authJwt.isModerator], this.addRestaurant);
        this.router.put('/:restaurantName', [middlewares_1.authJwt.verifyToken, middlewares_1.authJwt.isAdmin], this.updateRestaurant);
        this.router.delete('/:restaurantName', [middlewares_1.authJwt.verifyToken, middlewares_1.authJwt.isAdmin], this.deleteRestaurant);
    }
}
const restaurantsRoutes = new RestaurantsRoutes();
exports.default = restaurantsRoutes.router;
