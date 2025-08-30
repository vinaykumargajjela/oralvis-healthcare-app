import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import styles from './DentistDashboard.module.css';

function DentistDashboard() {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleClearAllScans = async () => {
        if (!window.confirm("Are you sure you want to delete ALL scans? This action is permanent.")) {
            return;
        }
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/scans/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setScans([]);
        } catch (error) {
            console.error('Failed to clear all scans:', error);
            alert(`Error: ${error.response?.data?.message || 'Could not clear scans.'}`);
        }
    };

    const handleDelete = async (scanId) => {
        if (!window.confirm("Are you sure you want to delete this scan? This action cannot be undone.")) {
            return;
        }
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/scans/${scanId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setScans(scans.filter(scan => scan.id !== scanId));
        } catch (error) {
            console.error('Failed to delete scan:', error);
            alert(`Error: ${error.response?.data?.message || 'Could not delete scan.'}`);
        }
    };

    useEffect(() => {
        const fetchScans = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/scans`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setScans(response.data);
            } catch (error) {
                console.error('Failed to fetch scans:', error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchScans();
    }, [navigate]);

    const handleDownloadReport = (scan) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('OralVis Healthcare Scan Report', 10, 20);
        doc.setFontSize(12);
        doc.text(`Patient Name: ${scan.patientName}`, 10, 40);
        doc.text(`Patient ID: ${scan.patientId}`, 10, 50);
        doc.text(`Scan Type: ${scan.scanType}`, 10, 60);
        doc.text(`Region: ${scan.region}`, 10, 70);
        doc.text(`Upload Date: ${scan.uploadDate}`, 10, 80);

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = scan.imageUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg');
            doc.addImage(dataURL, 'JPEG', 10, 100, 180, 160);
            doc.save(`report-${scan.patientId}-${scan.id}.pdf`);
        };
        img.onerror = () => alert("Could not load image for PDF. Check browser console for CORS errors.");
    };

    if (loading) return <div className={styles.message}>Loading scans...</div>;

    return (
        <div className={styles.dashboard}>
            <div className={styles.dashboardHeader}>
                <h2 className={styles.title}>Dentist Dashboard</h2>
                <div className={styles.headerActions}>
                    <button onClick={handleClearAllScans} className={`${styles.button} ${styles.clearAllButton}`}>Clear All Scans</button>
                    <button onClick={handleLogout} className={`${styles.button} ${styles.logoutButton}`}>Logout</button>
                </div>
            </div>
            {scans.length > 0 ? (
                <div className={styles.scansGrid}>
                    {scans.map(scan => (
                        <div key={scan.id} className={styles.scanCard}>
                            <img src={scan.imageUrl} alt="Scan" className={styles.scanImage} />
                            <div className={styles.cardContent}>
                                <p><strong>Patient:</strong> {scan.patientName} (ID: {scan.patientId})</p>
                                <p><strong>Type:</strong> {scan.scanType} - {scan.region}</p>
                                <p><strong>Date:</strong> {scan.uploadDate}</p>
                            </div>
                            <div className={styles.cardActions}>
                                <a href={scan.imageUrl} target="_blank" rel="noopener noreferrer" className={styles.linkButton}>View Full Image</a>
                                <button onClick={() => handleDownloadReport(scan)} className={styles.button}>Report</button>
                                <button onClick={() => handleDelete(scan.id)} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.message}>No scans have been uploaded yet.</p>
            )}
        </div>
    );
}

export default DentistDashboard;

