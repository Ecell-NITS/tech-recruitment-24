import express from "express";
import {
  createApplication,
  getMyApplication,
  getApplications,
} from "src/controllers/Apply";

import CheckEmail from "src/middlewares/CheckEmail";
import { sendOtp, verifyOtp } from "src/utils/Otp";

const router = express.Router();

router.get("/applications", getApplications);

router.post("/apply", verifyOtp ,CheckEmail, createApplication);

router.post("/apply/sendotp",sendOtp);

router.get("/myapplication",verifyOtp ,getMyApplication);



export default router;
