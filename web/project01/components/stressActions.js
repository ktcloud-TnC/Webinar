// components/stressActions.js

import { useState } from 'react';

export const useStressTestActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const installStressTool = async () => {
    if(isLoading) return; // 이미 로딩 중이면 실행하지 않음
    setIsLoading(true);
    try {
      const response = await fetch('/api/install-stress-test', { method: 'POST' });
      if (response.ok) {
        alert('스트레스 테스트 도구가 설치되었습니다.');
      } else {
        alert('스트레스 테스트 도구 설치에 실패했습니다.');
      }
    } catch (error) {
      console.error('스트레스 테스트 도구 설치 중 오류가 발생했습니다:', error);
      alert('스트레스 테스트 도구 설치 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
  };
  
  const startWebStressTest = async () => {
    if(isLoading) return; // 이미 로딩 중이면 실행하지 않음
    setIsLoading(true);
    try {
      const response = await fetch('/api/start-stress-test', { method: 'POST' });
      if (response.ok) {
        alert('웹 서버 스트레스 테스트가 시작되었습니다.');
      } else {
        alert('웹 서버 스트레스 테스트 시작에 실패했습니다.');
      }
    } catch (error) {
      console.error('웹 서버 스트레스 테스트 시작 중 오류가 발생했습니다:', error);
      alert('웹 서버 스트레스 테스트 시작 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
  };

  return { installStressTool, startWebStressTest, isLoading };
};
