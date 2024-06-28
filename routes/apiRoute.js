import  Router  from "express";
const router = Router();


router.get("/",(req, res)=>{
    res.json("Express app")
})

export default router;