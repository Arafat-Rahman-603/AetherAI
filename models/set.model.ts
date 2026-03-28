import {Schema,model,models} from "mongoose";

interface ISet {
    userId:string;
    business:string;
    email:string;
    data:string;
}

const setSchema = new Schema<ISet>({
    userId:{
        type:String,
        required:true,
    },
    business:{
        type:String,
    },
    email:{
        type:String,
    },
    data:{
        type:String,
    },
},
{timestamps:true}
);

const Set = models.Set || model("Set",setSchema);

export default Set;