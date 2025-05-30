import { getHmac } from "./get-hmac";

export const getBaseMessage = async (id: string) => {
  const path = `/v1/global/fastscore/message/base?messageId=${id}`;
  const hmac = getHmac(path);

  const res = await fetch(`https://hs-consumer-api.espncricinfo.com${path}`, {
    headers: {
      "x-hsci-auth-token": hmac,
    },
  });

  const data = await res.json();

  return data;
};
