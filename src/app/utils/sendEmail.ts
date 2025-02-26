import nodemailer from "nodemailer";
import config from "../config";
export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production", // true for port 465, false for other ports
    auth: {
      user: "sowmik.sec@gmail.com",
      pass: "fodw djci zuvi scgm",
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: "sowmik.sec@gmail.com", // sender address
    to,
    subject: "Reset your password within 10 munites.", // Subject line
    text: "", // plain text body
    html,
  });
};
