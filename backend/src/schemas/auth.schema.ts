import z from "zod";

export const registerSchema = z.object({
	username : z.string().min(3) ,
	password : z.string().min(6)
})

export const loginSchema = z.object({
	username : z.string().min(3) ,
	password : z.string().min(6)
})

export type RegisterInput = z.infer<typeof registerSchema>
export type loginInput = z.infer<typeof loginSchema>