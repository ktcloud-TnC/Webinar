// pages/api/install-stress-test.js
import { exec } from 'child_process';

export default function handler(req, res) {
    // EPEL 리포지토리 설치 및 stress 설치 명령 실행
    exec("sudo dnf install -y epel-release && sudo dnf install -y stress", (installError, stdout, stderr) => {
        if (installError) {
            console.error('stress 설치 중 오류 발생:', installError);
            return res.status(500).json({ message: 'stress 설치 실패' });
        }
        res.json({ message: '스트레스 테스트 도구가 설치되었습니다.' });
    });
}
