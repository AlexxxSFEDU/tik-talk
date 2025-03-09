import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ProfileCardComponent} from '../../ui';
import {AsyncPipe} from '@angular/common';
import {profileActions, selectFilteredProfiles} from '../../data';
import {ProfileFiltersComponent} from '../profile-filters/profile-filters.component';
import {Store} from "@ngrx/store";
import {InfiniteScrollTriggerComponent} from "@tt/common-ui";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent, AsyncPipe, InfiniteScrollTriggerComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {

  store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);

  constructor() {
  }

  timeToFetch() {
    this.store.dispatch(profileActions.setPage({}))
  }
}
