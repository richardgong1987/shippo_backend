import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vessels.test-samples';

import { VesselsFormService } from './vessels-form.service';

describe('Vessels Form Service', () => {
  let service: VesselsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VesselsFormService);
  });

  describe('Service methods', () => {
    describe('createVesselsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVesselsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            ownerid: expect.any(Object),
            naccs: expect.any(Object),
          })
        );
      });

      it('passing IVessels should create a new form with FormGroup', () => {
        const formGroup = service.createVesselsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            ownerid: expect.any(Object),
            naccs: expect.any(Object),
          })
        );
      });
    });

    describe('getVessels', () => {
      it('should return NewVessels for default Vessels initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVesselsFormGroup(sampleWithNewData);

        const vessels = service.getVessels(formGroup) as any;

        expect(vessels).toMatchObject(sampleWithNewData);
      });

      it('should return NewVessels for empty Vessels initial value', () => {
        const formGroup = service.createVesselsFormGroup();

        const vessels = service.getVessels(formGroup) as any;

        expect(vessels).toMatchObject({});
      });

      it('should return IVessels', () => {
        const formGroup = service.createVesselsFormGroup(sampleWithRequiredData);

        const vessels = service.getVessels(formGroup) as any;

        expect(vessels).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVessels should not enable id FormControl', () => {
        const formGroup = service.createVesselsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVessels should disable id FormControl', () => {
        const formGroup = service.createVesselsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
