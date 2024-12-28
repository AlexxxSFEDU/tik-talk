import { Component, inject } from '@angular/core';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatWorkspaceMessagesWrapperComponent } from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component';
import {ActivatedRoute, Router} from '@angular/router';

import {filter, of, switchMap} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ChatService } from '../../data';
import { MessageInputComponent } from '../../ui/message-input/message-input.component';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessagesWrapperComponent,
    MessageInputComponent,
    AsyncPipe,
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  chatService = inject(ChatService);


  activeChat$ = this.route.params.pipe(
    switchMap(({id}) => {
      if (id === 'new') {
        return this.route.queryParams.pipe(
          filter(({id}) => id),
          switchMap(({userId}) => {
            return this.chatService.createChat(userId).pipe(
              switchMap(chat =>
              {
                this.router.navigate(['chats', chat.id])
                return of(null)
              })
            )
          })
        )
      }
      return this.chatService.getChatById(id)
    })
  );
}
