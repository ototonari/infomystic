import * as functions from "firebase-functions";

type Req = functions.https.Request;
type RequestResponseType =
  (req: Req, resp: functions.Response) =>
  void | Promise<void>;
type IO = (handler: RequestResponseType) => functions.HttpsFunction;
// type ResultType = {
//   result: "success" | "failure"
//   value?: string
// }
// type ErrorMessage = {
//   message: string
// }
export type WebUsecase = (req: Req) => string | Promise<string>;

export const requestConnector = (io: IO) => (usecase: WebUsecase) =>
  io(async (req, resp) => {
    try {
      const data = await usecase(req);
      resp.status(200).send(data);
    } catch (error) {
      functions.logger.error("Error: ", error);

      resp.status(500).json({errorMessage: error});
    }
  });
