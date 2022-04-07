import {Schema, model} from 'mongoose';

const DishSchema = new Schema({
    title: {type: String, required:true},
    rating: {type: Number, required:true},
    price: {type: Number, required:true},
    imageUrl: {type: String, required:true}
})
export default model('Dish', DishSchema);