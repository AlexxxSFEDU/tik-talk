import { Component, inject } from '@angular/core';
import { ProfileCardComponent } from '../../ui';
import { AsyncPipe } from '@angular/common';
import { selectFilteredProfiles} from '../../data';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent, AsyncPipe],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {

  store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);
  constructor() {}
}
