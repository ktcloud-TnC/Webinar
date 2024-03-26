// components/Fetch_was_LogContent.js
import { useEffect, useState } from 'react';

function Fetch_was_LogContent() {
    const [logData, setLogData] = useState('');

    useEffect(() => {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/api/ws`;
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            setLogData((prevLogData) => `${prevLogData}\n${event.data}`);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>{logData}</div>
    );
}

export default Fetch_was_LogContent;
