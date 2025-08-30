import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);

            if (user.role === 'Technician') {
                navigate('/technician');
            } else if (user.role === 'Dentist') {
                navigate('/dentist');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            console.error('Login failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleLogin} className={styles.loginForm}>
                <h2 className={styles.title}>OralVis Healthcare Login</h2>
                <div className={styles.inputGroup}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className={styles.errorMessage}>{error}</p>}
            </form>
        </div>
    );
}

export default LoginPage;
