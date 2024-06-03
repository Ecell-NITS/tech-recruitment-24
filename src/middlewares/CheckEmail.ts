import { Request, Response,NextFunction } from "express";

const CheckEmail = async (req: Response, res: Request,next:NextFunction) => {
  const { email } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(email);
  if (!isValid) {
    res.status(400).json({ message: "Invalid email" });
  }else if(!email.includes("nits.ac.in") || !email.includes("_ug_22")){
    res.status(400).json({ message: "This application is only for NITS's students of batch 2023-2027" });
  }else
  next();
};

export default CheckEmail;