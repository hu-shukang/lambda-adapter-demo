import * as aws from '@aws-sdk/client-ses';
import nodemailer from 'nodemailer';

// 创建 SES 客户端
const ses = new aws.SESClient({ region: process.env.REGION }); // 请根据您的 AWS 区域进行调整

// 创建 Nodemailer 传输器
const transporter = nodemailer.createTransport({
  SES: { ses, aws: aws },
});

const sendHtmlMail = async (to: string[], html: string) => {
  return await transporter.sendMail({
    from: process.env.COGNITO_FROM_EMAIL,
    to: to,
    html: html,
  });
};

const sendTextMail = async (to: string[], text: string) => {
  return await transporter.sendMail({
    from: process.env.COGNITO_FROM_EMAIL,
    to: to,
    text: text,
  });
};

export const Mail = {
  sendHtml: sendHtmlMail,
  sendText: sendTextMail,
};
