import prisma from "prisma/prismaClient";
import { Request, Response } from "express";
import sendEmail from "src/utils/SendEmail";

export const getTechApplications = async (_req: Response, res: Request) => {
  const techApplications = await prisma.techApplication.findMany();
  res.json(techApplications);
};

export const createTechApplication = async (req: Request, res: Response) => {
  const { name, email, scholarId, resumeUrl, githubUrl, number, domain } =
    req.body;

  const exist = await existTechApplication(req, res);
  if (exist) {
    res.status(400).json({ message: "You have already applied" });
    return;
  }
  if(domain !== "Web" && domain !== "Flutter" && domain !== "UI"){
    res.status(400).json({ message: "Invalid domain" });
    return;
  }
  try {
    prisma.techApplication
      .create({
        data: {
          name,
          email,
          scholarId,
          resumeUrl,
          githubUrl,
          number,
          domain,
        },
      })
      .then((data) => {
        const sunject = "Tech Application";
        const text = `Thank you for applying to the tech team. We will get back to you soon.`;
        sendEmail(email, sunject, text);
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  } catch (error) {
    console.log(error);
  }
};
export const existTechApplication = async (req: Request, _res: Response) => {
  const { email, number, scholarId, resumeUrl } = req.body;
  const techApplication = await prisma.techApplication.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
        {
          number: number,
        },
        {
          scholarId: scholarId,
        },
        {
          resumeUrl: resumeUrl,
        },
      ],
    },
  });

  return techApplication;
};

export const getMyApplication = async (req: Request, res: Response) => {
  const { email } = req.body;
  const myApplications = await prisma.techApplication.findUnique({
    where: {
      email,
    },
  });
  res.json(myApplications);
}