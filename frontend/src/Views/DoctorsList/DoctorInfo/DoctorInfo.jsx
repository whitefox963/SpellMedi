import React from 'react';
import { Modal } from 'antd';
import './doctorInfo.css';

// DoctorInfo component renders a modal displaying detailed doctor information
const DoctorInfo = ({ isOpen, onClose, doctor }) => (
    <Modal
        open={isOpen}
        title="Doctor Information"
        onCancel={onClose}
        footer={null}
    >
        {/* Displays doctor details*/}
        <ul className='doctor_container'>
            <li><span>Name:</span>{doctor.name}</li>
            <li><span>Gender:</span>{doctor.gender}</li>
            <li><span>Clinic Name:</span>{doctor.clinic_place}</li>
            <li><span>Clinic Address:</span>{doctor.clinic_address}</li>
            <li><span>Specialist:</span>{doctor.specialist}</li>
            <li><span>Experience:</span>{doctor.experience} Yrs</li>
            <li><span>Rating:</span>{doctor.rating} out of 5</li>
        </ul>
    </Modal>
);

export default DoctorInfo;
