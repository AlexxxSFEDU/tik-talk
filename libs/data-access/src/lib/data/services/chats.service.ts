import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ChatWsService} from "../interfaces/chat-ws-service.interface";
import {ChatWsMessage} from "../interfaces/chat-ws-message.interface";
import {isNewMessage, isUnreadMessage} from "../interfaces/type-guard";
import {ChatWsRxjsService} from "./chat-ws-rxjs.service";
import {Chat, LastMessageResponse, Message, ProfileService} from "@tt/data-access";
import {AuthService} from "../../auth/services/auth.service"

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http = inject(HttpClient);
  #authService = inject(AuthService);
  me = inject(ProfileService).me;

  wsAdapter: ChatWsService = new ChatWsRxjsService()

  activeChatMessages = signal<Message[]>([]);
  updatedChatMessages = signal<{ [date: string]: Message[] }>({})
  unreadMessagesCount = signal(0)

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWsMessage
    }) as Observable<ChatWsMessage>
  }

  handleWsMessage = (message: ChatWsMessage) => {
    if (!('action' in message)) return

    if (isUnreadMessage(message)) {
      this.unreadMessagesCount.set(message.data.count);
    }

    if (isNewMessage(message)) {
      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isMine: false
        }
      ])
    }
  }

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageResponse[]>(
      `${this.chatsUrl}get_my_chats/`
    );
  }

  groupMessageByDate(activeChatMessages: Message[]) {
    return activeChatMessages.reduce((acc, el) => {
      const date = el.createdAt.split('T')[0];
      const todayDate = new Date().toISOString().split('T')[0];

      if (date === todayDate) {
        if (!acc["Сегодня"]) {
          acc["Сегодня"] = [];
        }
        acc["Сегодня"].push(el);
      } else {
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(el);
      }
      return acc
    }, {} as { [date: string]: Message[] })
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });
        this.updatedChatMessages.set(this.groupMessageByDate(patchedMessages));
        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()!.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }
}
