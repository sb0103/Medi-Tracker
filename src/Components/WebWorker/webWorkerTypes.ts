export interface IWorkerRequest {
  functionName: string;
  args: Array<any>;
}

export interface IWorkerFunList {
  noOfMedsUnavailable: any;
}

export interface IWorkerResponse {
  listnerName: string;
  data: object;
}

export interface IWorkerResponseData_MUA {
  count: number;
  patientID: string;
}
