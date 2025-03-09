import {Component, EventEmitter, HostBinding, inject, input, Output, Renderer2,} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AvatarCircleComponent, SvgComponent} from "@tt/common-ui";
import {GlobalStoreService} from "@tt/data-access";
import {Store} from "@ngrx/store";
import {postActions} from "../../data/store";


@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [AvatarCircleComponent, NgIf, SvgComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  profile = inject(GlobalStoreService).me;
  store = inject(Store)

  isCommentInput = input(false);
  postId = input<number>(0);

  postText = ' ';

  @Output() created = new EventEmitter();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  onTextAreaInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreatePost() {
    if (!this.postText) return;

    if (this.isCommentInput()) {
      this.store.dispatch(postActions.createComment({
        commentContent: {
          text: this.postText,
          authorId: this.profile()!.id,
          postId: this.postId(),
        }
      }))
      this.postText = ''
      return;
    }
    this.store.dispatch(postActions.createPost({
      postContent: {
        title: 'Клёвый пост',
        content: this.postText,
        authorId: this.profile()!.id,
      }
    }))
    this.postText = ''

  }
}
