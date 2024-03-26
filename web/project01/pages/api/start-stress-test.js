// pages/api/start-stress-test.js
import { exec } from 'child_process';

export default function handler(req, res) {
    // 스트레스 테스트 명령 실행
    exec("stress --cpu 1 --timeout 500", (error, stdout, stderr) => {
        if (error) {
            console.error('스트레스 테스트 실행 중 오류 발생:', error);
            return res.status(500).json({ message: '스트레스 테스트 시작 실패' });
        }
        res.json({ message: '스트레스 테스트가 시작되었습니다.' });
    });
}
