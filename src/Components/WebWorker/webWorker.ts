export default class WebWorker {
  worker: Worker;
  listner: object = {};

  constructor(url) {
    this.worker = new Worker(url);
    if (this.worker) {
      this.worker.onmessage = (e) => {
        let { listnerName, data } = e.data;

        let fn = this.listner[listnerName];
        fn(data);
      };

      this.worker.onerror = (e) => {
        console.log(`Error in file ${e.filename}, at line number: ${e.lineno}`);
      };
    }
  }

  addListner = function (name: string, fn: (e: object) => {}) {
    this.listner[name] = fn;
  };

  removeLister = function (name: string) {
    delete this.listner[name];
  };

  terminate = function () {
    this.worker.terminate();
  };

  postMessage = function (message: object | number | Array<any>) {
    this.worker.postMessage(message);
  };

  queryFunction = function (functionName: string, ...args: Array<any>) {
    this.worker.postMessage({ functionName, args });
  };
}
