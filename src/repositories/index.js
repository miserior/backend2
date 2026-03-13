import { productDBManager } from "../dao/productDBManager.js";
import { cartDBManager } from "../dao/cartDBManager.js";
import userModel from "../dao/models/userModel.js"; 


import ProductRepository from "./products.repository.js";
import CartRepository from "./carts.repository.js";
import UserRepository from "./users.repository.js";


const pDao = new productDBManager();
const cDao = new cartDBManager();
const uDao = userModel; 


export const productService = new ProductRepository(pDao);
export const cartService = new CartRepository(cDao);
export const userService = new UserRepository(uDao);