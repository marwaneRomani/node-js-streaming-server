import jwt from "jsonwebtoken";
import { config } from "dotenv";
config()

const { verify } = jwt;

const Authenticate = (req,res,next) => {
    const token = req.headers["x-auth-token"];

    verify(token,process.env.cookie_secrect, (err,decoded) => {
        if (err)    
            return res.status(400).json({ msg: "must be loged in." });
        
        req.token = decoded;
        next();
    });

}

export default Authenticate