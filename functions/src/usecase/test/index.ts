import {WebUsecase} from "../../io/requestConnector";

export const helloWorld: WebUsecase = async () => {
  const wait2sec = () => new Promise((res) => {
    setTimeout(res, 2000);
  });

  await wait2sec();

  return "hello world!";
};
