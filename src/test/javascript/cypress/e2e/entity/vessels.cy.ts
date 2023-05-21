import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Vessels e2e test', () => {
  const vesselsPageUrl = '/vessels';
  const vesselsPageUrlPattern = new RegExp('/vessels(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const vesselsSample = {};

  let vessels;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/vessels+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/vessels').as('postEntityRequest');
    cy.intercept('DELETE', '/api/vessels/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (vessels) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/vessels/${vessels.id}`,
      }).then(() => {
        vessels = undefined;
      });
    }
  });

  it('Vessels menu should load Vessels page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('vessels');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Vessels').should('exist');
    cy.url().should('match', vesselsPageUrlPattern);
  });

  describe('Vessels page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(vesselsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Vessels page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/vessels/new$'));
        cy.getEntityCreateUpdateHeading('Vessels');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', vesselsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/vessels',
          body: vesselsSample,
        }).then(({ body }) => {
          vessels = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/vessels+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/vessels?page=0&size=20>; rel="last",<http://localhost/api/vessels?page=0&size=20>; rel="first"',
              },
              body: [vessels],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(vesselsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Vessels page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('vessels');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', vesselsPageUrlPattern);
      });

      it('edit button click should load edit Vessels page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Vessels');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', vesselsPageUrlPattern);
      });

      it('edit button click should load edit Vessels page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Vessels');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', vesselsPageUrlPattern);
      });

      it('last delete button click should delete instance of Vessels', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('vessels').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', vesselsPageUrlPattern);

        vessels = undefined;
      });
    });
  });

  describe('new Vessels page', () => {
    beforeEach(() => {
      cy.visit(`${vesselsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Vessels');
    });

    it('should create an instance of Vessels', () => {
      cy.get(`[data-cy="name"]`).type('Sports maximize Creative').should('have.value', 'Sports maximize Creative');

      cy.get(`[data-cy="ownerid"]`).type('matrix wireless').should('have.value', 'matrix wireless');

      cy.get(`[data-cy="naccs"]`).type('relationships embrace calculate').should('have.value', 'relationships embrace calculate');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        vessels = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', vesselsPageUrlPattern);
    });
  });
});
