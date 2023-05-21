import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVessels } from '../vessels.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../vessels.test-samples';

import { VesselsService } from './vessels.service';

const requireRestSample: IVessels = {
  ...sampleWithRequiredData,
};

describe('Vessels Service', () => {
  let service: VesselsService;
  let httpMock: HttpTestingController;
  let expectedResult: IVessels | IVessels[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VesselsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Vessels', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const vessels = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vessels).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vessels', () => {
      const vessels = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vessels).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vessels', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vessels', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Vessels', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVesselsToCollectionIfMissing', () => {
      it('should add a Vessels to an empty array', () => {
        const vessels: IVessels = sampleWithRequiredData;
        expectedResult = service.addVesselsToCollectionIfMissing([], vessels);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vessels);
      });

      it('should not add a Vessels to an array that contains it', () => {
        const vessels: IVessels = sampleWithRequiredData;
        const vesselsCollection: IVessels[] = [
          {
            ...vessels,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVesselsToCollectionIfMissing(vesselsCollection, vessels);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vessels to an array that doesn't contain it", () => {
        const vessels: IVessels = sampleWithRequiredData;
        const vesselsCollection: IVessels[] = [sampleWithPartialData];
        expectedResult = service.addVesselsToCollectionIfMissing(vesselsCollection, vessels);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vessels);
      });

      it('should add only unique Vessels to an array', () => {
        const vesselsArray: IVessels[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vesselsCollection: IVessels[] = [sampleWithRequiredData];
        expectedResult = service.addVesselsToCollectionIfMissing(vesselsCollection, ...vesselsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vessels: IVessels = sampleWithRequiredData;
        const vessels2: IVessels = sampleWithPartialData;
        expectedResult = service.addVesselsToCollectionIfMissing([], vessels, vessels2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vessels);
        expect(expectedResult).toContain(vessels2);
      });

      it('should accept null and undefined values', () => {
        const vessels: IVessels = sampleWithRequiredData;
        expectedResult = service.addVesselsToCollectionIfMissing([], null, vessels, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vessels);
      });

      it('should return initial array if no Vessels is added', () => {
        const vesselsCollection: IVessels[] = [sampleWithRequiredData];
        expectedResult = service.addVesselsToCollectionIfMissing(vesselsCollection, undefined, null);
        expect(expectedResult).toEqual(vesselsCollection);
      });
    });

    describe('compareVessels', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVessels(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVessels(entity1, entity2);
        const compareResult2 = service.compareVessels(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVessels(entity1, entity2);
        const compareResult2 = service.compareVessels(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVessels(entity1, entity2);
        const compareResult2 = service.compareVessels(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
