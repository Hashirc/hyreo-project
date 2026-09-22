import { Router } from 'express';
import { addRealtimeClient, removeRealtimeClient } from '../services/realtime';

const router = Router();

router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  addRealtimeClient(res);

  // Send a heartbeat ping immediately and every 30 seconds
  res.write(`event: ping\ndata: ${JSON.stringify({ time: new Date() })}\n\n`);
  
  const keepAlive = setInterval(() => {
    try {
      res.write(`event: ping\ndata: ${JSON.stringify({ time: new Date() })}\n\n`);
    } catch (e) {
      clearInterval(keepAlive);
    }
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
    removeRealtimeClient(res);
  });
});

export default router;
