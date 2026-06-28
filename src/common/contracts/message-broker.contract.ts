export interface IMessageBroker {
  publish(channel: string, message: unknown): Promise<void>;
  subscribe(channel: string, callback: (message: unknown) => void): Promise<void>;
}
export const MESSAGE_BROKER_TOKEN = 'MESSAGE_BROKER';
