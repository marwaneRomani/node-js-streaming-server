import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "videos"
        }
    ],
    subscribers: {
        type: Array,
        default: []
    },
    userSubscribedChannels: {
        type: Array,
        default: []
    }
});

const User = mongoose.model('user',userSchema);


function validateUser(username,email,password) {
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(50)
            .required(),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .min(8)
    })

    return schema.validate({ username,email,password });
}
export {
    User,
    validateUser
};