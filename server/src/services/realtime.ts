import { Response } from 'express';

export let realtimeClients: Response[] = [];

export function addRealtimeClient(res: Response) {
  realtimeClients.push(res);
  console.log(`[REALTIME] Client connected. Total connected clients: ${realtimeClients.length}`);
}

export function removeRealtimeClient(res: Response) {
  realtimeClients = realtimeClients.filter(c => c !== res);
  console.log(`[REALTIME] Client disconnected. Total connected clients: ${realtimeClients.length}`);
}

export function broadcast(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  let disconnectedCount = 0;
  
  realtimeClients.forEach(client => {
    try {
      client.write(payload);
    } catch (err) {
      disconnectedCount++;
    }
  });

  if (disconnectedCount > 0) {
    console.log(`[REALTIME] Failed to write to ${disconnectedCount} clients (likely closed).`);
  }
}
