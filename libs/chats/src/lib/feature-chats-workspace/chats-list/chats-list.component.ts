import {ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, Renderer2} from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {debounce, fromEvent, map, startWith, switchMap, tap, timer} from 'rxjs';
import {ChatService} from "@tt/data-access";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    RouterLinkActive,
    RouterLink,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsListComponent {
  chatsService = inject(ChatService);
  destroyRef = inject(DestroyRef);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  filterChatsControl = new FormControl('');

  chats$ = this.chatsService.getMyChats().pipe(
    switchMap((chats) => {
      return this.filterChatsControl.valueChanges.pipe(
        startWith(''),
        map((inputValue) => {
          return chats.filter((chat) => {
            return (
              `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
                .toLowerCase()
                .includes(inputValue!.toLowerCase()) || ''
            );
          });
        })
      );
    })
  );

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
  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
