import "dotenv/config";
import nodemailer from "nodemailer";

let transponder;

if (process.env.NODE_ENV !== "production") {
   transponder = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT)
  });
} else if (process.env.NODE_ENV === "production") {
  transponder = nodemailer.createTransport({
  // Configure production email transport
  });
}

export default transponder;
