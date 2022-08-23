import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bycrpt from "bcrypt";
import dotenv from "dotenv";

import { User, validateUser } from "../models/User.model.js";


dotenv.config();

const { verify, sign } = jwt;
const { hash, compare, genSalt } = bycrpt;


export class AuthController {
    async signUp( req ) {

        const { username, email, password } = req.body;
        
        if (!username || !email || !password )  
            return { msg: "all fields are required.", status: 400 };
        
        const { error } = validateUser(username,email,password);

        if (error)
            return { msg: isValidUser.error.message, status: 400 };

        const isUser = await User.findOne({ email });
        
        if (isUser) 
            return {msg: "user already registered", status: 400 }

        const salt = await genSalt(10);     
        const hashedPassord = await hash(password,salt);
        
        const user = new User({ 
            username,
            email,
            password: hashedPassord
        })
        await user.save();

        return { msg: "user registered successfully. ", status: 200}
    }

    async signIn( req ) {
        const { email, password } = req.body;

        if ( !email || !password )
            return {msg: "all fields are requied.", status: 400 };

        const user = await User.findOne({ email });
        if (!user)
            return { msg: "incorrect info.", status: 404 };

        const correctPassword = await compare(password, user.password);
        if (!correctPassword)
            return { msg: "incorrect info.", status: 400 };

        const token_payload = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = sign(token_payload, process.env.cookie_secrect);

        return {msg: "loged in", status: 200, token };
    }
    
    async forgotPassword(req) {
        
        const { email, newPassword } = req.body;

        if (!email || !newPassword)
            return { msg : "all fields are required", status: 400}

        const user = await User.findOne({ email });

        if (!user) 
            return { msg: "no user with this email." , status: 404 };
        
        const { error } = validateUser(user.username,user.email, newPassword);

        if (error) 
            return { msg: error.message, status: 400 };

        const salt = await genSalt(10);
        const newHashedPassword = await hash(newPassword,salt);


        user.password = newHashedPassword;

        await user.save();

        return { msg: "password updated.", status: 200 };
    }   
}

// import formidable from "formidable";
// import { hash,genSalt, compare } from "bcrypt";
// import jwt from "jsonwebtoken";
// import { User } from "../models/User.model.js"
// import { config } from  "dotenv";
// config()

// const { IncomingForm } = formidable;
// const { verify, sign } = jwt;


// export class AuthController {
//     //sign up method 
//     signUp(req,res) {
//         const form = new IncomingForm();

//         form.parse(req, async (err,fields,files) => {
//             if (err) 
//                 return res.status(500).json({msg: "network error: failed to creat your account."})
            
//             const { username,email,password } = fields;

//             const salt = await genSalt(10);
//             const hashedPassword =  hash(password,salt);

//             const user = new User({
//                 username,
//                 email,
//                 password: hashedPassword
//             });
//             try {
//                 const result = await user.save();
//                 res.status(200).json({ msg: "account created." })
//             } catch (err) {
//                 res.status(400).json({ msg: "failed to create user!"})
//             }
//         })
//     }
//     //sign in methode 
//     signIn(req,res) {
//         const form = new IncomingForm();

//         form.parse(req,async (err,fields,files) => {
//             if (err)
//                 return res.status(500).json({ msg: "network error, failed to log in."});
                
//             const { account, password } = fields;
//             if(!account || !password )
//                 return res.status(400).json({ msg: "all fields are required."});

//             const isEmail = account.includes('@');
            
//             const user = (isEmail) ? await User.findOne({ email: account }) 
//                                    : await User.findOne({ username: account });

//                 if (!user) 
//                     return res.status(404).json({ msg: "account with this email is not exist."})
            
//                 const isPassword = await compare(password, user.password);
//                 if ( !isPassword ) 
//                     return res.status(400).json({ msg: "incorect password"})
                
//                 const { _id ,username ,email } = user;
//                 const token_payload = {
//                     id: _id,
//                     username,
//                     email
//                 }

//                 const token = sign(token_payload,process.env.cookie_secrect, {expiresIn: "30d"})
//                 return res.status(200).json({token})

//         })
//     }

//     //forgot password method
//     forgotPassword(req,res) {
//         const form = new IncomingForm();

//         form.parse(req, async (err,fields,files) => {
//             if (err)    
//                 return res.status(500).json({ msg: "network error." });
//             const { account, newPassword } = fields;

//             //regex expression
//             const isEmail = account.includes('@');

//             const salt = await genSalt(10);
//             const newHashedPassword = await hash(newPassword,salt);

//             try {
//                 const user = (isEmail) ? await User.findOneAndUpdate({ email: account },{$set: {password: newHashedPassword}})
//                                        : await User.findOneAndUpdate({ username: account },{$set: {password: newHashedPassword}});
//                 return res.status(200).json({ msg: "password was reset."})
//             } catch (error) {
//                 return res.status(404).json({msg: error.message})
//             }
//         })
//     }

// }