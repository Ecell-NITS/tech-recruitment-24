import express from "express";
import {
  createTechApplication,
  getMyApplication,
  getTechApplications,
} from "src/controllers/TechApply";

import CheckEmail from "src/middlewares/CheckEmail";
import { sendOtp, verifyOtp } from "src/utils/Otp";

const router = express.Router();

router.get("/applications", getTechApplications);

router.post("/apply", CheckEmail,verifyOtp , createTechApplication);

router.post("/apply/sendotp",sendOtp);

router.get("/application",verifyOtp ,getMyApplication);

export default router;
