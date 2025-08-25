// import https from "https";

// import { HttpsProxyAgent } from "https-proxy-agent";
// import openidClient from "openid-client";

// const agent = new HttpsProxyAgent(process.env.HTTP_PROXY!);

async function FC() {
  // const data = await new Promise<string>((resolve) => {
  //   const req = https.request(
  //     "https://accounts.google.com/.well-known/openid-configuration",
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "User-Agent": "openid-client/5.7.1 (https://github.com/panva/openid-client)",
  //         "Accept-Encoding": "identity",
  //       },
  //       timeout: 10_1000,
  //       agent,
  //     },
  //     (res) => {
  //       let str = "";
  //       res.on("data", (d) => {
  //         str += d;
  //       });
  //       res.on("end", function () {
  //         console.log("end", str);
  //         resolve(str);
  //       });
  //     }
  //   );
  //   req.on("error", (e) => {
  //     console.error("error", e.message);
  //   });
  //   req.end();
  // });
  // openidClient.custom.setHttpOptionsDefaults({
  //   agent
  // });
  // const data = await openidClient.Issuer.discover("https://accounts.google.com/.well-known/openid-configuration");

  return <>{JSON.stringify('data')}</>;
}

export default FC;
