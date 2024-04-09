// pages/api/install-stress-test.js
import { exec } from 'child_process';

export default function handler(req, res) {
    // EPEL 리포지토리 설치 및 stress 설치 명령 실행
    exec("sudo dnf -y install stress-ng", (installError, stdout, stderr) => {
        if (installError) {
            console.error('stress 설치 중 오류 발생:', installError);
            return res.status(500).send(); // 상태 코드 500으로만 응답, 메시지는 제거
        }
        res.status(200).send(); // 성공 시 상태 코드 200으로만 응답, 메시지는 제거
    });
}
