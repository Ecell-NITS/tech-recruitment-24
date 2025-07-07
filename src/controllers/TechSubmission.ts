import prisma from "prisma/prismaClient";
import { Request, Response } from "express";
import sendEmail from "src/utils/SendEmail";

export const getTechSubmissions = async (_req: Response, res: Request) => {
  const techSubmissions = await prisma.techSubmission.findMany();
  res.json(techSubmissions);
};

export const createTechSubmission = async (req: Request, res: Response) => {
    const { name, email, scholarId, resumeUrl, githubUrl, domain, liveUrl,videoUrl } =
        req.body;
    
    const exist = await existTechSubmission(req, res);
    if (exist) {
        res.status(400).json({ message: "You have already submitted" });
        return;
    }
    if (domain !== "Web" && domain !== "Flutter" && domain !== "UI") {
        res.status(400).json({ message: "Invalid domain" });
        return;
    }
    try {
        prisma.techSubmission
        .create({
            data: {
            name,
            email,
            scholarId,
            resumeUrl,
            githubUrl,
            domain,
            liveUrl,
            videoUrl,
            },
        })
        .then((data) => {
            const sunject = "Project Submission Acknowledgement";
            const text = `You have submitted your project successfully. We will get back to you soon. This is what was recived from you: Name:\n ${name}\n Email: ${email}\n Scholar ID: ${scholarId}\nDomain: ${domain}\n Project Link: ${githubUrl}\n ${liveUrl? "Demo Live Link:"+liveUrl+"\n":""} ${videoUrl? "Demo Live Link:"+videoUrl:""}`;
            const html = `
            <h2>You have submitted your project successfully.</h2>
            <p>We will get back to you soon.This is what was recived from you:<br> Name: ${name}<br> Email: ${email}<br> Scholar ID: ${scholarId}<br>Domain: ${domain}<br> Project Link: ${githubUrl}<br> ${liveUrl? "Demo Live Link:"+liveUrl+"<br>":""} ${videoUrl? "Demo Live Link:"+videoUrl:""}</p>`;
            sendEmail(email, sunject, text, html);
            return res.json({message:"Submission successful",data:data}).status(200);
        })
        .catch((err) => {
            console.log(err);
            return res.json({ message: err}).status(400);
        });
    } catch (error) {
         console.log(error);
         return res.json({ message: "Something went wrong.Please try again" }).status(500);
    }
};

export const existTechSubmission = async (req: Request, _res: Response) => {
    const { email } = req.body;
    const techSubmission = await prisma.techSubmission.findFirst({
        where: {
            email: email,
        },
    });
    if (techSubmission) {
        return true;
    }
    return false;
};

export const verifyTechApplication = async (req: Request, res: Response) => {
    const {email}=req.body;
    const techApplication = await prisma.techApplication.findFirst({
        where:{
            email:email,
        },
    });
    if(techApplication){
        return res.json(techApplication);
    }
    else{
        return res.status(404).json({message:"Application not found"});
    }
}