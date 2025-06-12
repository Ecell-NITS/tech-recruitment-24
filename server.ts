import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import TechApply  from "./src/routes/TechApply";
import Apply  from "./src/routes/Apply";
import TechSubmission  from "./src/routes/TechSubmission";
import { verifyOtp } from "src/utils/Otp";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

function reloadWebsite() {
  axios.get("https://tech-recruitment-24-k2j0.onrender.com")
    .then(response => {
      console.log("Time Noted for Website Update:", response.status);
    })
    .catch(error => {
      console.error("Error reloading website:", error.message);
    });
} 

setInterval(reloadWebsite, 1000 * 60 * 10); // Reload every 10 minutes

app.get("/",(_req,res)=>{
  res.send({message:"This is the recruitment api for the 2024-28 team of ecell nits. Please use the /tech route to access the tech endpoints.",status:200})
})

app.use("/tech",TechApply)
app.use("/",Apply)
app.use("/submit",TechSubmission)
app.post("/verifyotp",verifyOtp);
