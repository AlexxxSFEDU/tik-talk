import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {CommentComponent, PostInputComponent} from "../../ui";
import {Post} from "../../data";
import {AvatarCircleComponent, CreatedAtPipe, SvgComponent} from "@tt/common-ui";
import {Store} from "@ngrx/store";
import {postActions} from "../../data/store";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    SvgComponent,
    PostInputComponent,
    CommentComponent,
    CreatedAtPipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent {
  store = inject(Store)
  post = input<Post>();

  async onCreated() {
    this.store.dispatch(postActions.fetchPosts({}))
  }
}
