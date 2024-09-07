import { getNextScreen } from "./data_exchange.js";
import express from "express";
import {
  decryptRequest,
  encryptResponse,
  FlowEndpointException,
} from "./encryption.js";
import crypto from "crypto";
import dotenv from "dotenv";
import axios from "axios";
import { userInfo } from "../utils/user_info.js";
import { validMessage } from "../utils/initialValidMessage.js";
import logger from "../logger/data_logger.js";
dotenv.config();

const app = express();

app.use(
  express.json({
    // store the raw request body to use it for signature verification
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf?.toString(encoding || "utf8");
    },
  })
);

const { APP_SECRET, PASSPHRASE, PORT = "3000" } = process.env;

/*
Example:
```-----[REPLACE THIS] BEGIN RSA PRIVATE KEY-----
MIIE...
...
...AQAB
-----[REPLACE THIS] END RSA PRIVATE KEY-----```
*/

app.post("/", async (req, res) => {
  if (!process.env.PRIVATE_KEY) {
    throw new Error(
      'Private key is empty. Please check your env variable "PRIVATE_KEY".'
    );
  }

  if (!isRequestSignatureValid(req)) {
    // Return status code 432 if request signature does not match.
    // To learn more about return error codes visit: https://developers.facebook.com/docs/whatsapp/flows/reference/error-codes#endpoint_error_codes
    return res.status(432).send();
  }

  let decryptedRequest = null;
  try {
    decryptedRequest = decryptRequest(
      req.body,
      process.env.PRIVATE_KEY,
      PASSPHRASE
    );
  } catch (err) {
    logger.error("Error in decrypting request : ", err);
    if (err instanceof FlowEndpointException) {
      return res.status(err.statusCode).send();
    }
    return res.status(500).send();
  }

  const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;

  const screenResponse = await getNextScreen(decryptedBody);

  res.send(encryptResponse(screenResponse, aesKeyBuffer, initialVectorBuffer));
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

function isRequestSignatureValid(req) {
  if (!APP_SECRET) {
    console.warn(
      "App Secret is not set up. Please Add your app secret in /.env file to check for request validation"
    );
    return true;
  }

  const signatureHeader = req.get("x-hub-signature-256");
  const signatureBuffer = Buffer.from(
    signatureHeader.replace("sha256=", ""),
    "utf-8"
  );

  const hmac = crypto.createHmac("sha256", APP_SECRET);
  const digestString = hmac.update(req.rawBody).digest("hex");
  const digestBuffer = Buffer.from(digestString, "utf-8");

  if (!crypto.timingSafeEqual(digestBuffer, signatureBuffer)) {
    logger.error("Error: Request Signature did not match");
    return false;
  }
  return true;
}

const { WEBHOOK_VERIFY_TOKEN, metatoken, flow_id } = process.env;

app.post("/webhook", async (req, res) => {
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  const messageBody = message?.text?.body;

  const messageType = message?.type;
  if (message != undefined) {
    logger.info(
      `${new Date()} phone_number: ${
        req.body.entry[0].changes[0].value.contacts[0].wa_id
      } name: ${
        req.body.entry[0].changes[0].value.contacts[0].profile.name
      } message type: ${messageType} message: ${messageBody}`
    );
  }
  if (
    message != undefined &&
    message.type === "text" &&
    validMessage.has(message.text.body)
  ) {
    userInfo(req);
    // log incoming messages
    //console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

    // extract the business number to send the reply from it
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    // mark incoming message as read
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${metatoken}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });
    // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${metatoken}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: message.from,
        type: "interactive",
        interactive: {
          type: "flow",
          header: {
            type: "text",
            text: `${message.text.body}`,
          },
          body: {
            text: "Flow message body",
          },
          footer: {
            text: "Flow message footer",
          },
          action: {
            name: "flow",
            parameters: {
              flow_message_version: "3",
              flow_token: "random",
              flow_id: flow_id,
              flow_cta: "Book!",
              flow_action: "data_exchange",
              mode: "draft",
            },
          },
        },
      },
    });
  }
  res.sendStatus(200);
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    logger.info("Webhook verified successfully!");
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});
