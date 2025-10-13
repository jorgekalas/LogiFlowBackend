import { Router } from "express";
import {
  listProducts, showCreate, createProduct,
  showEdit, updateProduct, deleteProduct
} from "../controllers/product.controller.js";

const router = Router();

router.get("/",        listProducts);
router.get("/new",     showCreate);
router.post("/",       createProduct);
router.get("/:id/edit",showEdit);
router.post("/:id",    updateProduct);  
router.post("/:id/delete", deleteProduct);

export default router;
