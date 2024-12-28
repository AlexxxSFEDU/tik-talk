import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';

import {
  debounce,
  debounceTime,
  firstValueFrom,
  fromEvent,
  tap,
  timer,
} from 'rxjs';
import {PostService} from "../../data";
import {PostInputComponent} from "../../ui";
import {PostComponent} from "@tt/posts";

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  feed = this.postService.posts;

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }
  ngAfterViewInit() {
    this.resizeFeed();
    fromEvent(window, 'resize')
      .pipe(
        debounce(() => timer(500)),
        tap(() => {
          this.resizeFeed();
        })
      )
      .subscribe();
  }
  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
