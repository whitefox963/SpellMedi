import React from "react";
import { Modal, Select, Input, Button } from "antd";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./medicalDetailsForm.css";

// MedicalDetails component gets patient medical details
const MedicalDetails = ({
    isMedicalDetailsModalOpen,
    setMedicalDetailsModalOpen,
    setCurrentChatDetails,
}) => {
    const onClose = () => setMedicalDetailsModalOpen(false);

    const handleSubmit = (values) => {
        onClose();
        const valuesAsString = Object.entries(values)
            .map(([key, value]) => `${key} is ${value}`)
            .join(" ; ");

        setCurrentChatDetails({
            message: "Give me treatment recommendations",
            medicalData: valuesAsString,
            doctorName: "",
        });
    };

    return (
        <Modal
            open={isMedicalDetailsModalOpen}
            width="960px"
            title="Enter Personal Details: "
            onCancel={onClose}
            footer={[
                <Button key="back" type="primary" danger onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    form="medicalForm"
                >
                    Submit
                </Button>,
            ]}
        >
            <Formik
                initialValues={{
                    age: 22,
                    gender: "male",
                    weight: "68",
                    height: "150",
                    currentSymptoms: "High temperature with running nose",
                    medicalHistory: "ulcer",
                    allergies: "nil",
                    otherTreatments: "nil",
                    smokeDrink: "no",
                    familyHistory: "nil",
                    complianceAndUnderstanding: "nil",
                }}
                validationSchema={Yup.object({
                    age: Yup.number().required("Age is required").positive().integer(),
                    gender: Yup.string().required("Gender is required"),
                    weight: Yup.number().required("Weight is required").positive(),
                    height: Yup.number().required("Height is required").positive(),
                })}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue }) => (
                    <Form id="medicalForm">
                        <div className="history_data-form">
                            {/* Age input field */}
                            <div className="form_input-container">
                                <label htmlFor="age">Age (in years):</label>
                                <Input
                                    className="input-box"
                                    type="number"
                                    id="age"
                                    name="age"
                                    onChange={(e) => setFieldValue("age", e.target.value)}
                                />
                            </div>
                            <ErrorMessage
                                name="age"
                                component="div"
                                className="error-message"
                            />

                            {/* Gender input field */}
                            <div className="form_input-container">
                                <label htmlFor="gender">Gender:</label>
                                <Select
                                    id="gender"
                                    name="gender"
                                    className="dropdown-box"
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                        { value: "transgender", label: "Other" },
                                    ]}
                                    onChange={(value) => setFieldValue("gender", value)}
                                />
                            </div>
                            <ErrorMessage
                                name="gender"
                                component="div"
                                className="error-message"
                            />

                            {/* Weight input field */}
                            <div className="form_input-container">
                                <label htmlFor="weight">Weight (in kilograms):</label>
                                <Input
                                    className="input-box"
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    onChange={(e) => setFieldValue("weight", e.target.value)}
                                />
                            </div>
                            <ErrorMessage
                                name="weight"
                                component="div"
                                className="error-message"
                            />

                            {/* Height input field */}
                            <div className="form_input-container">
                                <label htmlFor="height">Height (in centimeters):</label>
                                <Input
                                    className="input-box"
                                    type="number"
                                    id="height"
                                    name="height"
                                    onChange={(e) => setFieldValue("height", e.target.value)}
                                />
                            </div>
                            <ErrorMessage
                                name="height"
                                component="div"
                                className="error-message"
                            />

                            {/* Current symptoms input field */}
                            <div className="form_input-container">
                                <label htmlFor="currentSymptoms">
                                    Current Symptoms: What symptoms are you experiencing? When did
                                    they start? How severe are they?
                                </label>
                                <Input
                                    className="input-box"
                                    type="text"
                                    id="currentSymptoms"
                                    name="currentSymptoms"
                                    onChange={(e) =>
                                        setFieldValue("currentSymptoms", e.target.value)
                                    }
                                />
                            </div>
                            <ErrorMessage
                                name="currentSymptoms"
                                component="div"
                                className="error-message"
                            />

                            {/* Medical history input field */}
                            <div className="form_input-container">
                                <label htmlFor="medicalHistory">
                                    Medical History: Do you have any chronic medical conditions or
                                    surgeries or significant illnesses in the past? Are you
                                    currently taking any medications for it?
                                </label>
                                <Input
                                    className="input-box"
                                    type="text"
                                    id="medicalHistory"
                                    name="medicalHistory"
                                    onChange={(e) =>
                                        setFieldValue("medicalHistory", e.target.value)
                                    }
                                />
                            </div>
                            <ErrorMessage
                                name="medicalHistory"
                                component="div"
                                className="error-message"
                            />

                            {/* Allergies input field */}
                            <div className="form_input-container">
                                <label htmlFor="allergies">
                                    Allergies: Do you have any known allergies to medications,
                                    foods, or other substances?
                                </label>
                                <Input
                                    className="input-box"
                                    type="text"
                                    id="allergies"
                                    name="allergies"
                                    onChange={(e) => setFieldValue("allergies", e.target.value)}
                                />
                            </div>
                            <ErrorMessage
                                name="allergies"
                                component="div"
                                className="error-message"
                            />

                            

                            {/* Other treatments input field */}
                            <div className="form_input-container">
                                <label htmlFor="otherTreatments">
                                    Other Treatments: Are you currently undergoing any other
                                    treatments, therapies, or interventions for your condition?
                                </label>
                                <Input
                                    className="input-box"
                                    type="text"
                                    id="otherTreatments"
                                    name="otherTreatments"
                                    onChange={(e) =>
                                        setFieldValue("otherTreatments", e.target.value)
                                    }
                                />
                            </div>
                            <ErrorMessage
                                name="otherTreatments"
                                component="div"
                                className="error-message"
                            />

                            {/* Lifestyle factors input field */}
                            <div className="form_input-container">
                                <label htmlFor="smokeDrink">
                                    Lifestyle Factors: Do you smoke, drink alcohol, or use
                                    recreational drugs?
                                </label>
                                <Input
                                    className="input-box"
                                    type="text"
                                    id="smokeDrink"
                                    name="smokeDrink"
                                    onChange={(e) => setFieldValue("smokeDrink", e.target.value)}
                                />
                            </div>
                            <ErrorMessage
                                name="smokeDrink"
                                component="div"
                                className="error-message"
                            />

                            {/* Family history input field */}
                            <div className="form_input-container">
                                <label htmlFor="familyHistory">
                                    Social History: Are there any factors in your family history
                                    that may be relevant to your health?
                                </label>
                                <Input
                                    className="input-box"
                                    type="text"
                                    id="familyHistory"
                                    name="familyHistory"
                                    onChange={(e) =>
                                        setFieldValue("familyHistory", e.target.value)
                                    }
                                />
                            </div>
                            <ErrorMessage
                                name="familyHistory"
                                component="div"
                                className="error-message"
                            />

                            {/* Compliance and understanding input field */}
                            <div className="form_input-container">
                                <label htmlFor="complianceAndUnderstanding">
                                    Compliance and Understanding: Do you understand your medical
                                    condition, treatment plan, and follow-up care instructions?
                                </label>
                                <Input
                                    className="input-box"
                                    type="text"
                                    id="complianceAndUnderstanding"
                                    name="complianceAndUnderstanding"
                                    onChange={(e) =>
                                        setFieldValue("complianceAndUnderstanding", e.target.value)
                                    }
                                />
                            </div>
                            <ErrorMessage
                                name="complianceAndUnderstanding"
                                component="div"
                                className="error-message"
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default MedicalDetails;
