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
                let message = "서버가 정상적으로 작동하지 않아 로그 내용을 불러올 수 없습니다.";
                if (error.message === "NAS에 정상적으로 연결되지 않아 로그 기록이 중단되었습니다.") {
                    message = error.message;
                }
                setLogContent(message);
            });
    }, []);

    return (
        <div>
            {logContent.split('\n').map((line, index) => (
                // 배열의 각 요소(텍스트 라인)를 div 또는 span으로 감싸고, key를 제공합니다.
                <div key={index}>{line}</div>
            ))}
        </div>
    );
}

export default Fetch_web_LogContent;
