import React, { useState } from 'react';
import axios from 'axios';

const Chat = ({ sessionId }) => {
    const [userMessage, setUserMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const [imageUrl, setImageUrl] = useState('');

    const handleSendMessage = async () => {
        try {
            const response = await axios.post('http://localhost:4949/chat', { userMessage, sessionId });
            setResponses([...responses, { role: 'user', content: userMessage }, { role: 'assistant', content: response.data.reply }]);
            setImageUrl('http://localhost:4949/api/get-image?sessionId=' + sessionId);
            setUserMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <div>
                {responses.map((msg, index) => (
                    <p key={index} className={msg.role}>{msg.content}</p>
                ))}
            </div>
            <textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)} />
            <button onClick={handleSendMessage}>Send</button>
            {imageUrl && <img src={imageUrl} alt="Generated" />}
        </div>
    );
};

export default Chat;