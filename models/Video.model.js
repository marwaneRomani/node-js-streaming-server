import mongoose from "mongoose";


const { Schema, model } = mongoose;

const videoSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String,
        required: true
    },
    path: {
        type: "string",
        required: true,
        unique: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    views: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
})
function validateVideo(title,owner,path) {
    const schema = Joi.object({
        title: Joi.string()
            .alphanum()
            .min(3)
            .max(500)
            .required(),

        owner: Joi.string()
                  .required(),
        
        path: Joi.string()
                 .required()
    })

    return schema.validate({ title,owner,path });
}

const Video = model("video",videoSchema);


export  {
    Video,
    validateVideo
};