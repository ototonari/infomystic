import * as functions from "firebase-functions";

type Res = functions.https.Request;
type RequestResponseType =
  (req: Res, resp: functions.Response) =>
  void | Promise<void>;
type IO = (handler: RequestResponseType) => functions.HttpsFunction;

export type Usecase = (req: Res) => void | Promise<void>;

export const requestConnectorOnSlack = (io: IO) => (usecase: Usecase) =>
  io(async (req, resp) => {
    resp.sendStatus(200);
    try {
      await usecase(req);
    } catch (error) {
      functions.logger.error("Error: ", error);
    }
  });
