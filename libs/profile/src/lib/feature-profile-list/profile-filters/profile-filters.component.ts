import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AvatarUploadComponent} from '../../ui';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, first, startWith} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {profileActions, selectFilledFilters} from '../../data';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [AvatarUploadComponent, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFiltersComponent {
  fb = inject(FormBuilder);
  store = inject(Store)
  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });
  filters = {};

  constructor() {
    this.store.select(selectFilledFilters).pipe(first()).subscribe(filledFilters => {
      this.filters = filledFilters;
      this.searchForm.patchValue(this.filters);
    });
    this.searchForm.valueChanges
      .pipe(
        startWith(this.filters),
        debounceTime(300),
        takeUntilDestroyed()
      )
      .subscribe(formValue => {
        this.store.dispatch(profileActions.filterEvents({filters: formValue}));
      });
  }
}
