// pages/api/ws.js
import { createServer } from 'http';
import { Server } from 'ws';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function handler(req, res) {
    // 이 핸들러는 Next.js에서 API 라우트로 인식하지 않습니다.
    if (!res.socket.server.ws) {
        console.log('Initializing WebSocket');

        // 웹소켓 서버 초기화
        const httpServer = createServer();
        const wsServer = new Server({ server: httpServer });
        res.socket.server.ws = wsServer;

        // 웹소켓 프록시 설정
        const wsProxy = createProxyMiddleware({
            target: process.env.WAS_SERVER_IP || 'http://172.25.1.177',
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/api/ws': '', // 엔드포인트 조정
            },
            router: {
                // 특정 경로에 대한 요청을 다른 대상으로 라우팅
                'localhost:3000/api/ws': 'http://172.25.1.177/api/ws',
            },
        });

        // 웹소켓 연결 요청 처리
        wsServer.on('connection', (socket, req) => {
            console.log('WebSocket client connected');
            socket.on('message', (message) => {
                console.log(`Received message: ${message}`);
            });
        });

        // HTTP 서버에 웹소켓 프록시 미들웨어 연결
        httpServer.on('upgrade', wsProxy.upgrade);
    }

    res.end();
}
