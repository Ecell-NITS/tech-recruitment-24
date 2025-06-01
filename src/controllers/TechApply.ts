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
  if (domain !== "Web" && domain !== "Flutter" && domain !== "UI") {
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
        const text = `Thank you for applying to the Technical team of E-cell NIT Silchar. We will get back to you soon.In the meanwhile, you can join our WhatsApp group  https://chat.whatsapp.com/JtuFnzCMzcfDl8ZH5m4wKM Please click on the link above to join the WhatsApp group.`;
        const html = `
        <h2>Thank you for applying to the Technical team of E-cell NIT Silchar.</h2>
        <p>We will get back to you soon.In the meanwhile, you can join our WhatsApp group <strong> <a href="https://chat.whatsapp.com/JtuFnzCMzcfDl8ZH5m4wKM">Ecell Tech Team Applicants 25</a></strong></p>
        <br>
        <p style="font-style: italic; font-size: 1.15em;">Please click on the link above to join the WhatsApp group.</p>`;
        sendEmail(email, sunject, text, html);
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
};
export const deleteTechApplication = async (req: Request, res: Response) => {
  const { email } = req.body;
  const deletedApplication = await prisma.techApplication.delete({
    where: {
      email: email,
    },
  });
  sendEmail(email, "Application Deleted", "Your application has been deleted. If this was not you, contact the team immediately", "");
  res.json(deletedApplication);
}
