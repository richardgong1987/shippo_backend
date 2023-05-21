import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VesselsFormService } from './vessels-form.service';
import { VesselsService } from '../service/vessels.service';
import { IVessels } from '../vessels.model';

import { VesselsUpdateComponent } from './vessels-update.component';

describe('Vessels Management Update Component', () => {
  let comp: VesselsUpdateComponent;
  let fixture: ComponentFixture<VesselsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vesselsFormService: VesselsFormService;
  let vesselsService: VesselsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VesselsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(VesselsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VesselsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vesselsFormService = TestBed.inject(VesselsFormService);
    vesselsService = TestBed.inject(VesselsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const vessels: IVessels = { id: 456 };

      activatedRoute.data = of({ vessels });
      comp.ngOnInit();

      expect(comp.vessels).toEqual(vessels);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVessels>>();
      const vessels = { id: 123 };
      jest.spyOn(vesselsFormService, 'getVessels').mockReturnValue(vessels);
      jest.spyOn(vesselsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vessels });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vessels }));
      saveSubject.complete();

      // THEN
      expect(vesselsFormService.getVessels).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vesselsService.update).toHaveBeenCalledWith(expect.objectContaining(vessels));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVessels>>();
      const vessels = { id: 123 };
      jest.spyOn(vesselsFormService, 'getVessels').mockReturnValue({ id: null });
      jest.spyOn(vesselsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vessels: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vessels }));
      saveSubject.complete();

      // THEN
      expect(vesselsFormService.getVessels).toHaveBeenCalled();
      expect(vesselsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVessels>>();
      const vessels = { id: 123 };
      jest.spyOn(vesselsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vessels });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vesselsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
