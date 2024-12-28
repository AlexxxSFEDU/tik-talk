import { Component, inject } from '@angular/core';
import { SvgComponent } from '@tt/common-ui';
import { AsyncPipe, NgForOf } from '@angular/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '@tt/profile';
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe } from '@tt/common-ui';

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
})
export class SidebarComponent {
  profileService = inject(ProfileService);
  subscribers$ = this.profileService.getSubscribersShortList();
  me = this.profileService.me;
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
  }
}
