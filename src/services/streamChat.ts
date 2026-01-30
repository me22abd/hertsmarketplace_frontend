/**
 * Stream Chat service for initializing and managing Stream Chat client
 */
import { StreamChat, Channel, User } from 'stream-chat';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

let client: StreamChat | null = null;

/**
 * Initialize Stream Chat client with user token
 */
export async function initializeStreamClient(userId: string, token: string): Promise<StreamChat> {
  if (!STREAM_API_KEY) {
    throw new Error('VITE_STREAM_API_KEY is not configured');
  }

  // Create new client instance
  client = StreamChat.getInstance(STREAM_API_KEY);

  // Connect user
  await client.connectUser(
    {
      id: userId,
    },
    token
  );

  return client;
}

/**
 * Get current Stream Chat client instance
 */
export function getStreamClient(): StreamChat | null {
  return client;
}

/**
 * Disconnect Stream Chat client
 */
export async function disconnectStreamClient(): Promise<void> {
  if (client) {
    await client.disconnectUser();
    client = null;
  }
}

/**
 * Get or watch a Stream channel
 */
export async function getStreamChannel(channelId: string): Promise<Channel> {
  if (!client) {
    throw new Error('Stream client not initialized. Call initializeStreamClient first.');
  }

  const channel = client.channel('messaging', channelId);
  await channel.watch();
  return channel;
}
