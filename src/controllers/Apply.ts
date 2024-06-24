import prisma from "prisma/prismaClient";
import { Request, Response } from "express";
import sendEmail from "src/utils/SendEmail";

export const getApplications = async (_req: Response, res: Request) => {
  const Applications = await prisma.application.findMany();
  res.json(Applications);
};

export const createApplication = async (req: Request, res: Response) => {
  const { name, email, scholarId, WhyEcell, number, teams ,contribution} =
    req.body;
  if (
    !name ||
    !email ||
    !scholarId ||
    !WhyEcell ||
    !number ||
    !teams
  ) {
    res.status(400).json({ message: "Please fill all the fields" });
    return;
  }
  if (teams.length === 0) {
    res.status(400).json({ message: "Please select atleast one team" });
    return;
  }

  const exist = await existApplication(req, res);
  if (exist) {
    res.status(400).json({ message: "You have already applied for this team" });
    return;
  }

  const availableTeams = [
    {
      teamName: "Marketing",
      teamLink: "https://chat.whatsapp.com/FEQssVGXlHE9mCuHV20Koo",
    },
    {
      teamName: "Content",
      teamLink: "https://chat.whatsapp.com/GlWVKkWotKu6L750tQoJak",
    },
    {
      teamName: "Design",
      teamLink: "https://chat.whatsapp.com/BvLSzQjyqAF7A5WmwvNdo8",
    },
    {
      teamName: "Publicity",
      teamLink: "https://chat.whatsapp.com/KGdzzQOZBilHHEyveN1pds",
    },
    {
      teamName:"Event",
      teamLink:"https://chat.whatsapp.com/BlUmN5ywJzrBRPKzA12heu"
    },
    {
      teamName:"Collaboration",
      teamLink:"https://chat.whatsapp.com/F2NJ25pjp7RAJAeVGhY3Y9"
    },
    {
      teamName:"Curation",
      teamLink:"https://chat.whatsapp.com/KRlRL4D2K88EzgL5cGIQdc"
    }
  ];
  const yourTeams = availableTeams.filter((team) =>
    teams.includes(team.teamName)
  );

  try {
    prisma.application
      .create({
        data: {
          name,
          email,
          scholarId,
          number,
          teams,
          WhyEcell,
          contribution
        },
      })
      .then((data) => {
        const sunject = "Application for joining E-cell NIT Silchar";
        const text = `Thank you for applying to the exciting teams of E-cell NIT Silchar. We will get back to you soon.In the meanwhile, you should join our WhatsApp group of the teams you have applied for.
        ${yourTeams.map((team) => `<a href="${team.teamLink}"><strong>${team.teamName}</strong></a>`)}
        `;
        const html = `
        <h2>Thank you for applying to the exciting teams of E-cell NIT Silchar.</h2>
        <p>We will get back to you soon.In the meanwhile, you should join our WhatsApp group of the teams you have applied for.
        ${yourTeams.map((team) => `<a href="${team.teamLink}"><strong>${team.teamName}</strong></a> <br>`)}`;
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
  const { email, number, scholarId} = req.body;
  const Application = await prisma.application.findFirst({
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
        }
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
