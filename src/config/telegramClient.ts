import axios from "axios";

const BOT_TOKEN = `${process.env.BOT_TOKEN}` || "";
const CHANNEL_ID = `${process.env.CHANNEL_ID}` || "";

export default async function sendMessage({
  email,
  name,
  unit,
  phone_number,
}: {
  email: string;
  unit: string;
  name: string;
  phone_number: string;
}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const message = `
Unit: ${unit}
Name: ${name}
Email: ${email}
Phone no: ${phone_number}
Description: I have finished my ${unit} studies and would appreciate the opportunity to be assessed.
`;
  try {
    await axios.post(url, {
      chat_id: CHANNEL_ID,
      text: message,
    });
    return { isSuccess: true };
  } catch (error) {
    return { isSuccess: false };
  }
}
