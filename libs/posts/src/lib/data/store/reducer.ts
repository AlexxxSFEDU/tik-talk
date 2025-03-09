
import {createFeature, createReducer, on} from "@ngrx/store";
import {postActions } from "./actions";
import {Post, PostComment} from "../interfaces/post.interface";

export interface PostState {
  posts: Post[];
}

export const initialState: PostState = {
  posts: [],
}

export const postFeature = createFeature({
  name: "postFeature",
  reducer: createReducer(
    initialState,
    on(postActions.postsLoaded, (state, payload) => {
      return {
        ...state,
        posts: payload.posts
      }
    })
  )
})



