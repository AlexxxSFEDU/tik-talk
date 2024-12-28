import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { AvatarUploadComponent } from '../../ui';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {profileActions, selectFilledFilters} from '../../data';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [AvatarUploadComponent, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent {
  fb = inject(FormBuilder);
  store = inject(Store)
  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });
  constructor() {
    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        takeUntilDestroyed()
      )
      .subscribe(formValue =>{
        this.store.dispatch(profileActions.filterEvents({filters: formValue})),
          console.log(formValue)
      });
  }

  ngOnInit() {
    this.store.select(selectFilledFilters).subscribe(filters => {
        this.searchForm.patchValue(filters);
      });
  }
}
