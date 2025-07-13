import express from "express";
import { createTechSubmission, getTechSubmissions, verifyTechApplication } from "src/controllers/TechSubmission";
import { sendOtp, verifyOtp } from "src/utils/Otp";


const router = express.Router();

router.post("/sendOtp", sendOtp);
router.post("/",createTechSubmission);
router.get("/allSubmissions",getTechSubmissions);
router.post("/checkApplication",verifyOtp,verifyTechApplication);

export default router;