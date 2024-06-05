import express from "express";
import {
  createTechApplication,
  deleteTechApplication,
  getMyApplication,
  getTechApplications,
} from "src/controllers/TechApply";

import CheckEmail from "src/middlewares/CheckEmail";
import { sendOtp, verifyOtp } from "src/utils/Otp";

const router = express.Router();

router.get("/applications", getTechApplications);

router.post("/apply", CheckEmail,verifyOtp , createTechApplication);

router.post("/apply/sendotp",sendOtp);

router.get("/myapplication",verifyOtp ,getMyApplication);

router.delete("/application/delete",verifyOtp,deleteTechApplication);

export default router;
