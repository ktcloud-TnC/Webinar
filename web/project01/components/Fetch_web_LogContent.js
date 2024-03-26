// components/Fetch_web_LogContent.js
import { useEffect, useState } from 'react';

function Fetch_web_LogContent() {
    const [logContent, setLogContent] = useState('');

    useEffect(() => {
        fetch('/api/nas-logs')
            .then(response => {
                if (!response.ok) {
                    throw new Error("NAS에 정상적으로 연결되지 않아 로그 기록이 중단되었습니다.");
                }
                return response.text();
            })
            .then(data => {
                setLogContent(data);
            })
            .catch(error => {
                if (error.message === "NAS에 정상적으로 연결되지 않아 로그 기록이 중단되었습니다.") {
                    setLogContent(error.message);
                } else {
                    setLogContent("서버가 정상적으로 작동하지 않아 로그 내용을 불러올 수 없습니다.");
                }
            });
    }, []);

    return (
        <div>
        {logContent}
        </div>
    );
}

export default Fetch_web_LogContent;
