import React, { useState, useEffect } from 'react';
import DoctorInfo from './DoctorInfo/DoctorInfo';
import './doctorsList.css';

// DoctorsList component displays the list of doctors
const DoctorsList = ({ setCurrentChatDetails }) => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);

  useEffect(() => {
    // Fetch doctor data
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/doctors`);
        if (!response.ok)
          throw new Error('Failed to fetch data');
        const data = await response.json();
        setDoctorsList(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Group doctors into rows of 3
  const doctorsInRows = [];
  for (let i = 0; i < doctorsList.length; i += 3)
    doctorsInRows.push(doctorsList.slice(i, i + 3));

  // Handles booking appointment for the selected doctor
  const handleSelectDoctor = (name) =>
    setCurrentChatDetails({
      message: `Book appointment for ${name}`,
      doctorName: name
    });

  if (doctorsList.length === 0)
    return <p className='no_doctor-message'>Sorry, but it appears there are no specialists available for this particular
      medical issue at the moment.</p>;

  return (
    <div className='doctor_list-container'>
      {/* Render doctors in rows */}
      {doctorsInRows.map((row, index) => (
        <div className='doctor_row' key={index}>
          {row.map(doctor => (
            <div className='doctor_details' key={doctor.id}>
              <img src={require(`${doctor.image_url}`)} alt={doctor.name} />
              <div className='doctor_info-container'>
                <div className='doctor-info'>
                  {doctor.name}
                </div>
                <div className='doctor-buttons'>
                  <button onClick={() => { setInfoModalOpen(true); setSelectedDoctor(doctor) }}>Show Info</button>
                  <button onClick={() => handleSelectDoctor(doctor.name)}>Book Appointment</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      {/* Modal displaying doctor details */}
      <DoctorInfo isOpen={isInfoModalOpen} onClose={() => setInfoModalOpen(false)} doctor={selectedDoctor} />
    </div>
  );
};

export default DoctorsList;
