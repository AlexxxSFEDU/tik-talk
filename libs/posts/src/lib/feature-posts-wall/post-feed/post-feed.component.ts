import {ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, OnInit, Renderer2,} from '@angular/core';
import {debounce, fromEvent, tap, timer,} from 'rxjs';
import {PostInputComponent} from "../../ui";
import {PostComponent} from '../post/post.component';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Store} from "@ngrx/store";
import {postActions, selectPosts} from "../../data/store";

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostFeedComponent implements OnInit {
  hostElement = inject(ElementRef);
  store = inject(Store)
  r2 = inject(Renderer2);
  destroyRef = inject(DestroyRef)

  feed = this.store.selectSignal(selectPosts)

  ngOnInit() {
    this.store.dispatch(postActions.fetchPosts({}))
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

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
