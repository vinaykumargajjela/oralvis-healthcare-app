import React, { useState } from 'react';
import axios from 'axios';
import styles from './TechnicianDashboard.module.css';
import { useNavigate } from 'react-router-dom';

function TechnicianDashboard() {
    const [formData, setFormData] = useState({
        patientName: '',
        patientId: '',
        scanType: 'RGB',
        region: 'Frontal',
    });
    const [scanImage, setScanImage] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setScanImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: 'Uploading...', type: '' });
        const token = localStorage.getItem('token');
        const uploadData = new FormData();

        const options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata'
        };
        const clientTimestamp = new Intl.DateTimeFormat('en-IN', options).format(new Date());
        uploadData.append('uploadDate', clientTimestamp);

        Object.keys(formData).forEach(key => uploadData.append(key, formData[key]));
        uploadData.append('scanImage', scanImage);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage({ text: 'Scan uploaded successfully!', type: 'success' });
            e.target.reset();
            setFormData({ patientName: '', patientId: '', scanType: 'RGB', region: 'Frontal' });
        } catch (error) {
            console.error('Upload failed:', error);
            setMessage({ text: `Upload failed: ${error.response?.data?.message || error.message}`, type: 'error' });
        }
    };

    return (
        <div className={styles.dashboard} style={{ position: 'relative' }}>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <h2 className={styles.title}>Technician Dashboard - Upload Scan</h2>
            <form onSubmit={handleSubmit} className={styles.formGrid}>
                <input name="patientName" placeholder="Patient Name" onChange={handleChange} required className={styles.input} />
                <input name="patientId" placeholder="Patient ID" onChange={handleChange} required className={styles.input} />
                <select name="scanType" onChange={handleChange} value={formData.scanType} className={styles.select}>
                    <option value="RGB">RGB</option>
                </select>
                <select name="region" onChange={handleChange} value={formData.region} className={styles.select}>
                    <option value="Frontal">Frontal</option>
                    <option value="Upper Arch">Upper Arch</option>
                    <option value="Lower Arch">Lower Arch</option>
                </select>
                <input type="file" name="scanImage" onChange={handleFileChange} accept="image/png, image/jpeg" required className={styles.fileInput} style={{ gridColumn: '1 / -1' }} />
                <button type="submit" className={styles.button}>Upload Scan</button>
                {message.text && (
                    <div className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
}

export default TechnicianDashboard;

