export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  feedback?: 'positive' | 'negative';
}
