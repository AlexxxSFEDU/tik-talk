import { Profile } from '@tt/profile';

export interface Chat {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: Message[];
  companion?: Profile;
}

export interface Message {
  text: string;
  id: number;
  userFromId: number;
  personalChatId: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user?: Profile;
  isMine?: boolean;
}

export interface LastMessageResponse {
  id: number;
  userFrom: Profile;
  message: string | null;
}
