import * as functions from "firebase-functions";

type Req = functions.https.Request;
type RequestResponseType =
  (req: Req, resp: functions.Response) =>
  void | Promise<void>;
type IO = (handler: RequestResponseType) => functions.HttpsFunction;

export type SlackUsecase = (req: Req) => void | Promise<void>;

const isRetry = (req: Req): boolean => {
  if (req.headers["X-Slack-Retry-Num"] &&
    req.headers["X-Slack-Retry-Reason"] === "http_timeout") {
    return true;
  } else {
    return false;
  }
};

export const requestConnectorOnSlack = (io: IO) => (usecase: SlackUsecase) =>
  io(async (req, resp) => {
    resp.sendStatus(200);
    if (isRetry(req)) return;
    try {
      await usecase(req);
    } catch (error) {
      functions.logger.error("Error: ", error);
    }
  });
