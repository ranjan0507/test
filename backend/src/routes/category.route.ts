import { Router } from "express";
import { createCategory,updateCategoryName , deleteCategory, getUserCategories } from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router() ;

router.use(authenticate) ;

router.post("/",createCategory) ;
router.get("/",getUserCategories) ;
router.patch("/:categoryId",updateCategoryName) ;
router.delete("/:categoryId",deleteCategory) ;

export default router ;