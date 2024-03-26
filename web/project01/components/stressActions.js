// components/stressActions.js

export const installStressTool = async () => {
    try {
      const response = await fetch('/api/install-stress-test', { method: 'POST' });
      if (response.ok) {
        alert('스트레스 테스트 도구가 설치되었습니다.');
      } else {
        alert('스트레스 테스트 도구 설치 실패.');
      }
    } catch (error) {
      console.error('스트레스 테스트 도구 설치 중 오류가 발생했습니다:', error);
      alert('스트레스 테스트 도구 설치 중 오류가 발생했습니다.');
    }
  };
  
  export const startWebStressTest = async () => {
    try {
      const response = await fetch('/api/start-stress-test', { method: 'POST' });
      if (response.ok) {
        alert('웹 서버 스트레스 테스트가 시작되었습니다.');
      } else {
        alert('웹 서버 스트레스 테스트 시작 실패.');
      }
    } catch (error) {
      console.error('웹 서버 스트레스 테스트 시작 중 오류가 발생했습니다:', error);
      alert('웹 서버 스트레스 테스트 시작 중 오류가 발생했습니다.');
    }
  };