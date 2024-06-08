import prisma from "prisma/prismaClient";
import { Request, Response } from "express";
import sendEmail from "src/utils/SendEmail";

export const getApplications = async (_req: Response, res: Request) => {
  const Applications = await prisma.application.findMany();
  res.json(Applications);
};

export const createApplication = async (req: Request, res: Response) => {
  const { name, email, scholarId, resumeUrl, WhyEcell, number, domain } =
    req.body;
  if (
    domain !== "Event" &&
    domain !== "Content" &&
    domain !== "Curation" &&
    domain !== "Design" &&
    domain !== "Marketing" &&
    domain !== "Publicity" &&
    domain !== "Collaboration"
  ) {
    res.status(400).json({ message: "Invalid Team" });
    return;
  }

  const exist = await existApplication(req, res);
  if (exist) {
    res.status(400).json({ message: "You have already applied for this team" });
    return;
  }

  let team = {
    teamName: "",
    teamLink: "",
  };
  if (domain === "Event") {
    team = {
      teamName: "Event Management",
      teamLink: "https://discord.gg/2Y9z8e8J",
    };
  } else if (domain === "Content") {
    team = {
      teamName: "Content",
      teamLink: "https://discord.gg/2Y9z8e8J",
    };
  } else if (domain === "Curation") {
    team = {
      teamName: "Curation",
      teamLink: "https://discord.gg/2Y9z8e8J",
    };
  } else if (domain === "Design") {
    team = {
      teamName: "Design",
      teamLink: "https://discord.gg/2Y9z8e8J",
    };
  } else if (domain === "Marketing") {
    team = {
      teamName: "Marketing",
      teamLink: "https://discord.gg/2Y9z8e8J",
    };
  } else if (domain === "Publicity") {
    team = {
      teamName: "Publicity",
      teamLink: "https://discord.gg/2Y9z8e8J",
    };
  } else if (domain === "Collaboration") {
    team = {
      teamName: "Collaboration & Outreach",
      teamLink: "https://discord.gg/2Y9z8e8J",
    };
  }

  try {
    prisma.application
      .create({
        data: {
          name,
          email,
          scholarId,
          resumeUrl,
          number,
          domain,
          WhyEcell,
        },
      })
      .then((data) => {
        const sunject = "Application for joining E-cell NIT Silchar";
        const text = `Thank you for applying to the ${team.teamName} team of E-cell NIT Silchar. We will get back to you soon.In the meanwhile, you can join our WhatsApp group  ${team.teamLink}`;
        const html = `
        <h2>Thank you for applying to the ${team.teamName} team of E-cell NIT Silchar.</h2>
        <p>We will get back to you soon.In the meanwhile, you can join our WhatsApp group <strong> <a href="${team.teamLink}">${team.teamName}</a></strong></p>`;
        sendEmail(email, sunject, text, html);
        res.json(data).status(200);
      })
      .catch((err) => {
        console.log(err);
        res.json(err).status(500);
      });
  } catch (error) {
    console.log(error);
  }
};
export const existApplication = async (req: Request, _res: Response) => {
  const { email, number, scholarId, resumeUrl, domain } = req.body;
  const Application = await prisma.application.findFirst({
    where: {
      AND: [
        {
          domain: domain,
        },
        {
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
      ],
    },
  });

  return Application;
};

export const getMyApplication = async (req: Request, res: Response) => {
  const { email } = req.body;
  const myApplications = await prisma.application.findMany({
    where: {
      email,
    },
  });
  res.json(myApplications);
};

