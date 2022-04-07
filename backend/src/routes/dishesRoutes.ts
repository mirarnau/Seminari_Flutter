import {Request, response, Response, Router} from 'express';

import Dish from '../models/Dish';

class DishesRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

    public async getAllDishes(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
        const allMenus = await Dish.find();
        if (allMenus.length == 0){
            res.status(404).send("There are no dishes yet.")
        }
        else{
            res.status(200).send(allMenus);
        }
    }

    public async getDishByTitle(req: Request, res: Response) : Promise<void> {
        const dishFound = await Dish.findOne({title: req.params.title});
        if(dishFound == null){
            res.status(404).send("Menu not found.");
        }
        else{
            res.status(200).send(dishFound);
        }
    }
    
    public async addDish(req: Request, res: Response) : Promise<void> {
        const dishFound = await Dish.findOne({title: req.body.title,
        rating: req.body.rating, price: req.body.price, imageUrl: req.body.imageUrl});
        if (dishFound != null){
            res.status(409).send("Dish already exists.");
        }
        const {title, rating, price, imageUrl} = req.body;
        const newDish = new Dish({title, rating, price, imageUrl})
        await newDish.save();
        res.status(201).send('Dish added.');
        
    }

    public async updateDish (req: Request, res: Response) : Promise<void> {
        const menuToUpdate = await Dish.findOneAndUpdate ({title: req.params.title}, req.body);
        if(menuToUpdate == null){
            res.status(404).send("Dish not found.");
        }
        else{
            res.status(201).send("Dish updated.");
        }
    }

    public async deleteDish (req: Request, res: Response) : Promise<void> {
        const dishToDelete = await Dish.findOne ({title: req.params.title});
        if (dishToDelete == null){
            res.status(404).send("Dish not found.");
            return;
        }
        await Dish.findOneAndDelete({title: req.params.title});
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

export default dishesRoutes.router;