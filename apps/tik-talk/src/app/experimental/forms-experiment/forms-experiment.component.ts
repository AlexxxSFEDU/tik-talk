import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Feature, MockService } from '../../mock.service';
import { KeyValuePipe } from '@angular/common';
import {AddressInputComponent} from "@tt/common-ui";
import {tap} from "rxjs";

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL',
}
interface Address {
  city?: string;
  street?: string;
  building?: number;
  apart?: number;
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apart: new FormControl<number | null>(initialValue.apart ?? null),
  });
}

function validateStartWith(forbiddenLetter: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value.startsWith(forbiddenLetter)
      ? { startWith: `${forbiddenLetter} - НЕЛЬЗЯ!` }
      : null;
  };
}

function validateDateRange({
  fromControlName,
  toControlName,
}: {
  fromControlName: string;
  toControlName: string;
}) {
  return (control: AbstractControl) => {
    const fromControl = control.get(fromControlName);
    const toControl = control.get(toControlName);

    if (!fromControl || !toControl) return null;

    const fromDate = new Date(fromControl.value);
    const toDate = new Date(toControl.value);

    return fromDate && toDate && fromDate > toDate
      ? {
          dateRange: {
            message: 'Дата начала не может быть позднее даты конца',
          },
        }
      : null;
  };
}

@Component({
  selector: 'app-forms-experiment',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, AddressInputComponent],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss',
})
export class FormsExperimentComponent {
  mockService = inject(MockService);
  ReceiverType = ReceiverType;
  features: Feature[] = [];
  form = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    name: new FormControl<string>('', [
      Validators.required,
      validateStartWith('Я'),
    ]),
    lastName: new FormControl<string>('', Validators.required),
    city: new FormControl<string>('', Validators.required),
    inn: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
    dateRange: new FormGroup(
      {
        from: new FormControl<string>(''),
        to: new FormControl<string>(''),
      },
      validateDateRange({ fromControlName: 'from', toControlName: 'to' })
    ),
  });

  constructor() {
    this.mockService
      .getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe((addrs) => {
        this.form.controls.addresses.clear();

        for (const addr of addrs) {
          this.form.controls.addresses.push(getAddressForm(addr));
        }
      });

    this.mockService
      .getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe((features) => {
        this.features = features;

        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          );
        }
      });

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.form.controls.inn.clearValidators();
        if (value === ReceiverType.LEGAL) {
          this.form.controls.inn.setValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ]);
        }
        this.form.controls.inn.updateValueAndValidity();
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;
    console.log(this.form.valid);
    console.log('this.form.value', this.form.value);
    console.log('this.form.getRawValue()', this.form.getRawValue());
    this.form.reset();
  }

  addAddress() {
    this.form.controls.addresses.push(getAddressForm());
  }

  deleteAddress(index: number) {
    this.form.controls.addresses.removeAt(index, { emitEvent: false });
  }

  sort = () => 0;
}
