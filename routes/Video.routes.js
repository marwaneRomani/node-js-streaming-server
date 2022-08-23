import Authenticate from "../middlewares/Authenticate.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/api/videos", Authenticate ,(req,res) => {
    res.status(200).send({msg: "authenticated"})
})

export default router;