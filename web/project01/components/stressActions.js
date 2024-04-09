// components/stressActions.js
import { useState, useEffect } from 'react';

export const useStressTestActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (message) {
      alert(message);
    }
  }, [message]); // message 상태가 변경될 때마다 실행됩니다.

  const installStressTool = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/install-stress-test', { method: 'POST' });
      if (response.ok) {
        setMessage('스트레스 테스트 도구가 설치되었습니다.');
      } else {
        setMessage('스트레스 테스트 도구 설치에 실패했습니다.');
      }
    } catch (error) {
      setMessage('스트레스 테스트 도구 설치 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const startWebStressTest = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/start-stress-test', { method: 'POST' });
      if (response.ok) {
        setMessage('웹 서버 스트레스 테스트가 완료 되었습니다.');
      } else {
        setMessage('웹 서버 스트레스 테스트 시작에 실패했습니다.');
      }
    } catch (error) {
      setMessage('웹 서버 스트레스 테스트 시작 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return { installStressTool, startWebStressTest, isLoading };
};
