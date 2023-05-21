import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVessels, NewVessels } from '../vessels.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVessels for edit and NewVesselsFormGroupInput for create.
 */
type VesselsFormGroupInput = IVessels | PartialWithRequiredKeyOf<NewVessels>;

type VesselsFormDefaults = Pick<NewVessels, 'id'>;

type VesselsFormGroupContent = {
  id: FormControl<IVessels['id'] | NewVessels['id']>;
  name: FormControl<IVessels['name']>;
  ownerid: FormControl<IVessels['ownerid']>;
  naccs: FormControl<IVessels['naccs']>;
};

export type VesselsFormGroup = FormGroup<VesselsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VesselsFormService {
  createVesselsFormGroup(vessels: VesselsFormGroupInput = { id: null }): VesselsFormGroup {
    const vesselsRawValue = {
      ...this.getFormDefaults(),
      ...vessels,
    };
    return new FormGroup<VesselsFormGroupContent>({
      id: new FormControl(
        { value: vesselsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(vesselsRawValue.name),
      ownerid: new FormControl(vesselsRawValue.ownerid),
      naccs: new FormControl(vesselsRawValue.naccs),
    });
  }

  getVessels(form: VesselsFormGroup): IVessels | NewVessels {
    return form.getRawValue() as IVessels | NewVessels;
  }

  resetForm(form: VesselsFormGroup, vessels: VesselsFormGroupInput): void {
    const vesselsRawValue = { ...this.getFormDefaults(), ...vessels };
    form.reset(
      {
        ...vesselsRawValue,
        id: { value: vesselsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VesselsFormDefaults {
    return {
      id: null,
    };
  }
}
