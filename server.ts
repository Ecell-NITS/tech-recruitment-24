import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import TechApply  from "./src/routes/TechApply";
import { verifyOtp } from "src/utils/Otp";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

app.use("/tech",TechApply)
app.post("/verifyotp",verifyOtp);