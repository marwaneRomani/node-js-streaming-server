import bodyParser from "body-parser";
import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller.js";
import { validateUser } from "../models/User.model.js";

const router = Router();

const controller = new AuthController();

router.post("/api/signup", async (req,res) => {
    const result = await controller.signUp(req);

    res.status(result.status).json({ msg: result.msg });
})

router.post("/api/signin", async (req,res) => {
    const result = await controller.signIn(req);

    const jsonRes = { msg: result.msg }
    if (result.token)
        jsonRes.token = result.token

    res.status(result.status).json(jsonRes);
})

router.post("/api/reset-password", async (req,res) => {
    const result = await controller.forgotPassword(req);
    
    res.status(result.status).json({ msg: result.msg })
})

export default router;