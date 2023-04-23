import * as functions from "firebase-functions";
import {BasicSlackEvent, EnvelopedEvent} from "@slack/bolt";

type Req = functions.https.Request;
type RequestResponseType =
  (req: Req, resp: functions.Response) =>
  void | Promise<void>;
type IO = (handler: RequestResponseType) => functions.HttpsFunction;

export type SlackUsecase<T extends BasicSlackEvent> = (req: EnvelopedEvent<T>) => void | Promise<void>;

const isRetry = (req: Req): boolean => {
  if (req.headers["X-Slack-Retry-Num"] &&
    req.headers["X-Slack-Retry-Reason"] === "http_timeout") {
    return true;
  } else {
    return false;
  }
};

export const requestConnectorOnSlack = (io: IO) => <T extends BasicSlackEvent>(usecase: SlackUsecase<T>) =>
  io(async (req, resp) => {
    if (req.body.type !== "url_verification") {
      resp.sendStatus(200);
      if (isRetry(req)) return;
      try {
        await usecase(req.body);
      } catch (error) {
        functions.logger.error("Error: ", error);
      }
    } else {
      resp.send(req.body.challenge);
    }
  });
