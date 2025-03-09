import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2
} from '@angular/core';
import {ChatWorkspaceMessageComponent} from './chat-workspace-message/chat-workspace-message.component';
import {debounce, firstValueFrom, fromEvent, tap, timer} from 'rxjs';
import {MessageInputComponent} from '../../../ui/message-input/message-input.component';
import {Chat, ChatService} from "@tt/data-access";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {KeyValuePipe} from "@angular/common";

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent, KeyValuePipe],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatService = inject(ChatService);
  r2 = inject(Renderer2)
  destroyRef = inject(DestroyRef)
  hostElement = inject(ElementRef)

  chat = input.required<Chat>();

  messages = this.chatService.updatedChatMessages;

  async onSendMessage(messageText: string) {
    this.chatService.wsAdapter.sendMessage(messageText, this.chat().id)
    /*   await firstValueFrom(
         this.chatService.sendMessage(this.chat().id, messageText)
       );*/
    await firstValueFrom(this.chatService.getChatById(this.chat().id));
  }

  ngAfterViewInit() {
    this.resizeFeed();
    fromEvent(window, 'resize')
      .pipe(
        debounce(() => timer(500)),
        tap(() => {
          this.resizeFeed();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeFeed()
    console.log('resized')
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

}
