/* eslint-disable no-restricted-globals */
/*global importScripts, findNumberOfMedicineUnavailable,   */

importScripts("helper.worker.js");

const functionList = {
  noOfMedsUnavailable: function (
    availabelMonths,
    patientID,
    prescription,
    purchases
  ) {
    let count = findNumberOfMedicineUnavailable(
      availabelMonths,
      prescription,
      purchases
    );

    postMessage({
      listnerName: "noOfMedsUnavailable",
      data: { count, patientID },
    });
  },
};

const defaultFunction = (...args) => {
  console.log("Default function called with below args:");
  console.log(args);
};

self.onmessage = (e) => {
  if (!e) {
    console.log(`Invalid e`);
    return;
  }

  if (!e?.data) {
    console.log(`e.data==undefined`);
    return;
  }

  let { functionName, args } = e.data;

  if (!functionName) {
    console.log(`functionName not present`);
    return;
  }

  if (functionList.hasOwnProperty(functionName)) {
    functionList[functionName].apply(self, args);
  } else {
    defaultFunction.apply(self, args);
  }
};
