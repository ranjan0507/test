import mongoose from "mongoose";
import { Document,Schema } from "mongoose";

export interface Ilink extends Document {
	hash : string ;
	userId : mongoose.Types.ObjectId ;
	contentId : mongoose.Types.ObjectId ;
}

const linkSchema = new Schema<Ilink>({
	hash : {
		type : String ,
		required : true ,
		unique : true 
	} ,
	userId : {
		type : Schema.Types.ObjectId ,
		ref : 'users' ,
		required : true
	} ,
	contentId : {
		types : Schema.Types.ObjectId ,
		
	}
},{
	timestamps : true 
})

export const Link = mongoose.model<Ilink>('links',linkSchema) ;