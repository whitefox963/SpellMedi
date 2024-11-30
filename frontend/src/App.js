import React, { useEffect, useRef, useState, useCallback } from "react";
import { notification, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import MedicalDetails from "./Views/MedicalDetailsForm/MedicalDetailsForm";
import DoctorsList from "./Views/DoctorsList/DoctorsList";
import TypingAnimation from "./SharedComponents/TypingAnimation";
import BouncingLoader from "./SharedComponents/BouningLoader";
import FirstVisitCheck from "./Views/FirstVisitCheck/FirstVisitCheck";
import "./App.css";

const App = () => {
  const [api, contextHolder] = notification.useNotification();

  const [isMedicalDetailsModalOpen, setMedicalDetailsModalOpen] = useState(false);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [isFirstVisitCheckModalOpen, setIsFirstVisitCheckModalOpen] = useState(true);
  const [patientDetails, setPatientDetails] = useState({});
  const [currentChatDetails, setCurrentChatDetails] = useState({
    message: "",
    medicalData: "",
    doctorName: "", 
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState({
    doctorName: "",
    date: "",
  });
  const botContainerRef = useRef(null);

  // Scroll to the bottom of the chat container whenever chat history changes
  useEffect(() => {
    botContainerRef.current.scrollTop = botContainerRef.current.scrollHeight;
  }, [chatHistory]);

  // Extract appointment details from the user's message
  const extractAppointmentDetails = useCallback(
    (appointmentString) => {
      const regex =
        /Patient Name:\s*\[(.*?)\]\s*\|\s*Phone Number:\s*\[(.*?)\]\s*\|\s*Email Address:\s*\[(.*?)\]\s*\|\s*Appointment Start Time:\s*\[(.*?)\]/;
      const match = appointmentString.match(regex);
      if (match) {
        const [, patientName, phoneNumber, mailId, startTime] = match;
        return {
          patientName,
          phoneNumber,
          mailId,
          startTime,
          isReturningUser: !!patientDetails?.name,
        };
      }
      return null;
    },
    [patientDetails]
  );

  // Fetch response from the bot based on the current chat details
  const fetchBotResponse = useCallback(async () => {
    try {
      const newChatHistory = [
        ...chatHistory,
        { role: "You", content: currentChatDetails.message },
        isBookingInProgress && currentChatDetails.doctorName !== ""
          ? {
            role: "Bot",
            content:
              "Please provide your preferred date for the appointment\nFormat: DD MM",
            cancel: true,
          }
          : { role: "Bot", content: <BouncingLoader />, isShow: false },
      ];
      setChatHistory(newChatHistory);

      // Reset current chat details if booking is in progress
      if (isBookingInProgress) {
        setCurrentChatDetails((prevState) => ({ ...prevState, message: "" }));
        setIsBookingInProgress(false);
      } else {
        // Set appointment details if doctor name is provided
        if (currentChatDetails.doctorName !== "") {
          setAppointmentDetails({
            doctorName: currentChatDetails.doctorName,
            date: currentChatDetails.message,
          });
        }

        // Send appointment details to the server
        const response = await fetch("http://localhost:5000/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            appointmentDetails.doctorName && appointmentDetails.date
              ? {
                ...appointmentDetails,
                ...extractAppointmentDetails(currentChatDetails.message),
              }
              : currentChatDetails
          ),
        });

        setTimeout(async () => {
          try {
            const {
              response: gptResponse,
              isShow,
              cancel,
            } = await response.json();

            setChatHistory((prevChatHistory) => [
              ...prevChatHistory.slice(0, -1),
              { role: "Bot", content: gptResponse, isShow, cancel },
            ]);

            setCurrentChatDetails({
              message:
                currentChatDetails.doctorName !== ""
                  ? `Patient Name: [${patientDetails?.name || "..."}]  |  Phone Number: [${patientDetails?.mobile || "..."}]  |  Email Address: [${patientDetails?.email || "..."}]  |  Appointment Start Time: [...]`
                  : "",
              medicalData: "",
              doctorName: "",
            });

            // Reset appointment details after fetching response
            if (appointmentDetails.doctorName && appointmentDetails.date) 
              setAppointmentDetails({ doctorName: "", date: "" });
          } catch (error) {
            console.error("Error processing response:", error);
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [
    chatHistory,
    currentChatDetails,
    appointmentDetails,
    patientDetails,
    isBookingInProgress,
    extractAppointmentDetails,
  ]);

  // Clear chat data
  const clearChatData = () => {
    setCurrentChatDetails({ message: "", doctorName: "" });
    setIsBookingInProgress(false);
    setAppointmentDetails({ doctorName: "", date: "" });
  };

  // Handle chat clearing
  const handleClearChat = () => {
    setChatHistory([]);
    clearChatData();
  };

  // Show notification for canceled booking
  const openNotification = () => {
    clearChatData();
    api["warning"]({
      message: "Cancelled",
      description: "Your Booking has been cancelled!!",
      duration: 2,
    });
  };

  // Start the appointment booking process
  const startAppointmentBooking = () => {
    setIsBookingInProgress(true);
    getDoctorList();
  };

  // Simulate fetching the doctor list and updating chat history
  const getDoctorList = () => {
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { role: "You", content: "Book an appointment for me" },
      { role: "Bot", content: <BouncingLoader /> },
    ]);

    setTimeout(() => {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory.slice(0, -1),
        {
          role: "Bot",
          content: <DoctorsList setCurrentChatDetails={setCurrentChatDetails} />,
          cancel: true,
        },
      ]);
    }, 1000);
  };

  // Initialize first visit check modal
  useEffect(() => {
    setIsFirstVisitCheckModalOpen(true);
  }, []);

  return (
    <div className="app-container">
      {contextHolder}
      <Button
        className="clear-button"
        type="primary"
        danger
        onClick={handleClearChat}
        icon={<DeleteOutlined />}
      >
        Clear Chat
      </Button>
      <div className="bot-container" ref={botContainerRef}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-message ${chat.role.toLowerCase()}-message`}
          >
            <img
              className={`chat-avatar ${chat.role.toLowerCase()}-avatar`}
              src={require(`./Images/${chat.role.toLowerCase()}_avatar.png`)}
              alt={`${chat.role} avatar`}
            />
            {typeof chat.content === "string" ? (
              <div className="message-content">
                {chat.role === "Bot" && !chat.cancel ? (
                  <TypingAnimation
                    text={chat.content
                      .replace(/[\[\]]/g, "")
                      .replace(/\|/g, "\n")}
                    interval={30}
                    lineInterval={50}
                  />
                ) : (
                  chat.content
                    .replace(/[\[\]]/g, "")
                    .replace(/\|/g, "\n")
                    .split("\n")
                    .map((line, lineIndex) => <div key={lineIndex}>{line}</div>)
                )}
                {chat.role === "Bot" && chat.isShow && (
                  <div className="suggestions-button">
                    <button onClick={() => setMedicalDetailsModalOpen(true)}>
                      Treatment Recommendation
                    </button>
                    <button onClick={startAppointmentBooking}>
                      Book Appointment
                    </button>
                  </div>
                )}
              </div>
            ) : (
              chat.content
            )}
            {chat.cancel && (
              <button className="cancel-button" onClick={openNotification}>
                Stop Booking
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="bot_input-container">
        <input
          type="text"
          placeholder="Chat here"
          value={currentChatDetails.message}
          onChange={(e) =>
            setCurrentChatDetails((prevState) => ({
              ...prevState,
              message: e.target.value,
            }))
          }
        />
        <button onClick={fetchBotResponse}>
          <span>&#x2191;</span>
        </button>
      </div>
      <MedicalDetails
        isMedicalDetailsModalOpen={isMedicalDetailsModalOpen}
        setMedicalDetailsModalOpen={setMedicalDetailsModalOpen}
        setCurrentChatDetails={setCurrentChatDetails}
      />
      <FirstVisitCheck
        setChatHistory={setChatHistory}
        isFirstVisitCheckModalOpen={isFirstVisitCheckModalOpen}
        setIsFirstVisitCheckModalOpen={setIsFirstVisitCheckModalOpen}
        setPatientDetails={setPatientDetails}
      />
    </div>
  );
};

export default App;
