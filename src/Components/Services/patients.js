import { getAllPatients } from "../NetworkCalls/patients";

const getAllPatientsRestructured = async (token, setAlert) => {
  let patients = await getAllPatients(token, setAlert);

  if (patients)
    for (let i = 0; i < patients.length; i++) {
      let prescription = patients[i].prescription;
      for (let j = 0; j < prescription.length; j++) {
        let med = prescription[j].medicine;
        prescription[j] = {
          ...prescription[j],
          medicineName: med.medicineName,
          doze: med.doze,
          description: med.description,
          medID: med._id,
        };
        delete patients[i].prescription[j].medicine;
      }
    }

  return patients;
};

export { getAllPatientsRestructured };
