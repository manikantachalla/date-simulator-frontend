import React, { useState } from 'react';
import axios from 'axios';

const CreateSession = ({ onSessionCreated }) => {
    const [formData, setFormData] = useState({
        personA: '',
        personB: '',
        time: '',
        location: '',
        context: { interestsA: '', interestsB: '' },
        initialMessage: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4949/create-session', formData);
            onSessionCreated(response.data.sessionId);
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="personA" placeholder="Person A" onChange={handleChange} required />
            <input type="text" name="personB" placeholder="Person B" onChange={handleChange} required />
            <input type="text" name="time" placeholder="Time" onChange={handleChange} required />
            <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
            <input type="text" name="context.interestsA" placeholder="Person A's Interests" onChange={handleChange} required />
            <input type="text" name="context.interestsB" placeholder="Person B's Interests" onChange={handleChange} required />
            <input type="text" name="initialMessage" placeholder="Initial Message" onChange={handleChange} required />
            <button type="submit">Create Session</button>
        </form>
    );
};

export default CreateSession;