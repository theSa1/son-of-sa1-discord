import { Client } from "paho-mqtt";
import crypto from "crypto";

const encryptionKey =
  "9ced54a89687e1173e91c1f225fc02abf275a119fda8a41d731d2b04dac95ff5";

const escapeEarly = (input: string, shouldEscape: boolean) => {
  if (!shouldEscape) return input;

  return encodeURIComponent(input)
    .replace(/[~'*]/g, (char) => `%${char.charCodeAt(0).toString(16)}`)
    .replace(/%../g, (match) => match.toLowerCase());
};

export const getHmac = (path: string) => {
  const startTime = Math.floor(Date.now() / 1000);
  const endTime = startTime + 60;
  const message = `exp=${endTime}~url=${escapeEarly(path, true)}`;
  const hmac = crypto.createHmac("sha256", Buffer.from(encryptionKey, "hex"));
  hmac.update(message);
  const hmacDigest = hmac.digest("hex");

  return `exp=${endTime}~hmac=${hmacDigest}`;
};
