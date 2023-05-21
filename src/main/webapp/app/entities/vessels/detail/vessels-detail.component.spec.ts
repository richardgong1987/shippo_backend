import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VesselsDetailComponent } from './vessels-detail.component';

describe('Vessels Management Detail Component', () => {
  let comp: VesselsDetailComponent;
  let fixture: ComponentFixture<VesselsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VesselsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ vessels: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VesselsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VesselsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load vessels on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.vessels).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
