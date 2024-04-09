import React, { useEffect, useState } from 'react';
import styles from '../styles/Layout.module.css';

function ServerStatusBox({ serverType }) {
  const [serverStatus, setServerStatus] = useState({ cpuUsage: 0, memoryUsage: 0 });

  useEffect(() => {
    const endpoint = serverType === 'WEB' ? '/api/server-status' : '/api/was-server-status';
    async function fetchServerStatus() {
      const response = await fetch(endpoint);
      const data = await response.json();
      setServerStatus({
        cpuUsage: parseFloat(data.cpuUsage).toFixed(2), // CPU 사용량 소수점 두 자리로 포매팅
        memoryUsage: parseFloat(data.memoryUsage).toFixed(2) // 메모리 사용량 소수점 두 자리로 포매팅
      });
    }

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 5000); // 5초마다 상태 갱신

    return () => clearInterval(interval);
  }, [serverType]);

  const cpuUsageClassName = `${styles.serverBoxP} ${serverStatus.cpuUsage >= 100 ? styles.cpuUsageHigh : ''}`;

  return (
    <>
      <p className={cpuUsageClassName}>CPU 사용량: {serverStatus.cpuUsage}%</p>
      <p className={styles.serverBoxP}>메모리 사용량: {serverStatus.memoryUsage}%</p>
    </>
  );
}

export default ServerStatusBox;
