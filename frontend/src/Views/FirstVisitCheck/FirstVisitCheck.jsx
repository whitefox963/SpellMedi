import React, { useState } from "react";
import { Modal, Button, Input } from "antd";
import "./firstVisitCheck.css";
import { capitalizeFirstLetter } from "../../Utils/CapitalizeFirstLetter";

// FirstVisitCheck component handles user identification for first-time visits
const FirstVisitCheck = ({
    setChatHistory,
    isFirstVisitCheckModalOpen,
    setIsFirstVisitCheckModalOpen,
    setPatientDetails
}) => {
    const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
    const [userId, setUserId] = useState("");

    const handleClose = () => setHasVisitedBefore(false);

    // Handles response for first-time visit
    const handleFirstVisitResponse = () => {
        setIsFirstVisitCheckModalOpen(false);
        setChatHistory([
            {
                role: "Bot",
                content:
                    "Greetings User!! I am your medical assistant. How can I support you today?",
            },
        ]);
    };

    // Handles submission of user ID
    const handleSubmit = async () => {
        setIsFirstVisitCheckModalOpen(false);
        setHasVisitedBefore(false);

        try {
            const response = await fetch(`http://localhost:5000/patients?userid=${userId}`);
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            const userName = data.name;

            setPatientDetails(data);
            setChatHistory([
                {
                    role: "Bot",
                    content: `Greetings ${capitalizeFirstLetter(userName)}!! Welcome back! I am your medical assistant. How can I support you today?`,
                },
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleVisitedBeforeResponse = () => setHasVisitedBefore(true);

    return (
        <>
            <Modal
                closeIcon={false}
                title="Hey User!"
                open={isFirstVisitCheckModalOpen}
                footer={[
                    <Button onClick={handleVisitedBeforeResponse} type="primary">
                        Yes
                    </Button>,
                    <Button onClick={handleFirstVisitResponse} type="primary">
                        No
                    </Button>,
                ]}
            >
                <p className="prev_p">
                    Welcome!!! We're here to provide you with support and guidance for
                    your health needs!!
                </p>
                <p className="prev_p">
                    Before we proceed, could you please let us know if you've used our
                    medical bot before?
                </p>
            </Modal>

            {/* Modal for entering user ID */}
            <Modal
                title="Enter User ID"
                open={hasVisitedBefore}
                onCancel={handleClose}
                footer={[
                    <Button onClick={handleClose} type="primary" danger>
                        Cancel
                    </Button>,
                    <Button onClick={handleSubmit} type="primary">
                        Submit
                    </Button>,
                ]}
            >
                <p className="prev_p">
                    To access personalized features and keep the conversation going,
                    please enter your user ID:
                </p>
                <div className="beforeVisit_input">
                    <label htmlFor="userId">User ID</label>
                    <Input
                        className="userid-input"
                        type="text"
                        id="userId"
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
            </Modal>
        </>
    );
};

export default FirstVisitCheck;
