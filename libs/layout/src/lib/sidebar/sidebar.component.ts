import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {ImgUrlPipe, SvgComponent} from '@tt/common-ui';
import {AsyncPipe, NgForOf} from '@angular/common';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {firstValueFrom, Subscription, timer} from 'rxjs';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AuthService, ChatService, isErrorMessage, ProfileService} from "@tt/data-access";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgComponent,
    NgForOf,
    SubscriberCardComponent,
    RouterLink,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  profileService = inject(ProfileService);
  #chatService = inject(ChatService);
  authService = inject(AuthService);
  chatService = inject(ChatService);
  destroyRef = inject(DestroyRef)

  wsSubscription!: Subscription;
  subscribers$ = this.profileService.getSubscribersShortList();

  me = this.profileService.me;
  unreadMessagesCount = this.chatService.unreadMessagesCount;


  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
    this.connectWs()
  }

  async reconnect() {
    await firstValueFrom(this.profileService.getMe())
    await firstValueFrom(timer(2000))
    this.connectWs()
  }

  connectWs() {
    this.wsSubscription?.unsubscribe()
    this.wsSubscription = this.#chatService.connectWs().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((message) => {
      if (isErrorMessage(message)) {
        this.reconnect()
      }
    })
  }
}
