package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Vessels;
import com.mycompany.myapp.repository.VesselsRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link VesselsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VesselsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OWNERID = "AAAAAAAAAA";
    private static final String UPDATED_OWNERID = "BBBBBBBBBB";

    private static final String DEFAULT_NACCS = "AAAAAAAAAA";
    private static final String UPDATED_NACCS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/vessels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VesselsRepository vesselsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVesselsMockMvc;

    private Vessels vessels;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vessels createEntity(EntityManager em) {
        Vessels vessels = new Vessels().name(DEFAULT_NAME).ownerid(DEFAULT_OWNERID).naccs(DEFAULT_NACCS);
        return vessels;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vessels createUpdatedEntity(EntityManager em) {
        Vessels vessels = new Vessels().name(UPDATED_NAME).ownerid(UPDATED_OWNERID).naccs(UPDATED_NACCS);
        return vessels;
    }

    @BeforeEach
    public void initTest() {
        vessels = createEntity(em);
    }

    @Test
    @Transactional
    void createVessels() throws Exception {
        int databaseSizeBeforeCreate = vesselsRepository.findAll().size();
        // Create the Vessels
        restVesselsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vessels)))
            .andExpect(status().isCreated());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeCreate + 1);
        Vessels testVessels = vesselsList.get(vesselsList.size() - 1);
        assertThat(testVessels.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testVessels.getOwnerid()).isEqualTo(DEFAULT_OWNERID);
        assertThat(testVessels.getNaccs()).isEqualTo(DEFAULT_NACCS);
    }

    @Test
    @Transactional
    void createVesselsWithExistingId() throws Exception {
        // Create the Vessels with an existing ID
        vessels.setId(1L);

        int databaseSizeBeforeCreate = vesselsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVesselsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vessels)))
            .andExpect(status().isBadRequest());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVessels() throws Exception {
        // Initialize the database
        vesselsRepository.saveAndFlush(vessels);

        // Get all the vesselsList
        restVesselsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vessels.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].ownerid").value(hasItem(DEFAULT_OWNERID)))
            .andExpect(jsonPath("$.[*].naccs").value(hasItem(DEFAULT_NACCS)));
    }

    @Test
    @Transactional
    void getVessels() throws Exception {
        // Initialize the database
        vesselsRepository.saveAndFlush(vessels);

        // Get the vessels
        restVesselsMockMvc
            .perform(get(ENTITY_API_URL_ID, vessels.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vessels.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.ownerid").value(DEFAULT_OWNERID))
            .andExpect(jsonPath("$.naccs").value(DEFAULT_NACCS));
    }

    @Test
    @Transactional
    void getNonExistingVessels() throws Exception {
        // Get the vessels
        restVesselsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVessels() throws Exception {
        // Initialize the database
        vesselsRepository.saveAndFlush(vessels);

        int databaseSizeBeforeUpdate = vesselsRepository.findAll().size();

        // Update the vessels
        Vessels updatedVessels = vesselsRepository.findById(vessels.getId()).get();
        // Disconnect from session so that the updates on updatedVessels are not directly saved in db
        em.detach(updatedVessels);
        updatedVessels.name(UPDATED_NAME).ownerid(UPDATED_OWNERID).naccs(UPDATED_NACCS);

        restVesselsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVessels.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVessels))
            )
            .andExpect(status().isOk());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeUpdate);
        Vessels testVessels = vesselsList.get(vesselsList.size() - 1);
        assertThat(testVessels.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVessels.getOwnerid()).isEqualTo(UPDATED_OWNERID);
        assertThat(testVessels.getNaccs()).isEqualTo(UPDATED_NACCS);
    }

    @Test
    @Transactional
    void putNonExistingVessels() throws Exception {
        int databaseSizeBeforeUpdate = vesselsRepository.findAll().size();
        vessels.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVesselsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vessels.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vessels))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVessels() throws Exception {
        int databaseSizeBeforeUpdate = vesselsRepository.findAll().size();
        vessels.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVesselsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vessels))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVessels() throws Exception {
        int databaseSizeBeforeUpdate = vesselsRepository.findAll().size();
        vessels.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVesselsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vessels)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVesselsWithPatch() throws Exception {
        // Initialize the database
        vesselsRepository.saveAndFlush(vessels);

        int databaseSizeBeforeUpdate = vesselsRepository.findAll().size();

        // Update the vessels using partial update
        Vessels partialUpdatedVessels = new Vessels();
        partialUpdatedVessels.setId(vessels.getId());

        partialUpdatedVessels.ownerid(UPDATED_OWNERID);

        restVesselsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVessels.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVessels))
            )
            .andExpect(status().isOk());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeUpdate);
        Vessels testVessels = vesselsList.get(vesselsList.size() - 1);
        assertThat(testVessels.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testVessels.getOwnerid()).isEqualTo(UPDATED_OWNERID);
        assertThat(testVessels.getNaccs()).isEqualTo(DEFAULT_NACCS);
    }

    @Test
    @Transactional
    void fullUpdateVesselsWithPatch() throws Exception {
        // Initialize the database
        vesselsRepository.saveAndFlush(vessels);

        int databaseSizeBeforeUpdate = vesselsRepository.findAll().size();

        // Update the vessels using partial update
        Vessels partialUpdatedVessels = new Vessels();
        partialUpdatedVessels.setId(vessels.getId());

        partialUpdatedVessels.name(UPDATED_NAME).ownerid(UPDATED_OWNERID).naccs(UPDATED_NACCS);

        restVesselsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVessels.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVessels))
            )
            .andExpect(status().isOk());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeUpdate);
        Vessels testVessels = vesselsList.get(vesselsList.size() - 1);
        assertThat(testVessels.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVessels.getOwnerid()).isEqualTo(UPDATED_OWNERID);
        assertThat(testVessels.getNaccs()).isEqualTo(UPDATED_NACCS);
    }

    @Test
    @Transactional
    void patchNonExistingVessels() throws Exception {
        int databaseSizeBeforeUpdate = vesselsRepository.findAll().size();
        vessels.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVesselsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vessels.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vessels))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVessels() throws Exception {
        int databaseSizeBeforeUpdate = vesselsRepository.findAll().size();
        vessels.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVesselsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vessels))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVessels() throws Exception {
        int databaseSizeBeforeUpdate = vesselsRepository.findAll().size();
        vessels.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVesselsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(vessels)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vessels in the database
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVessels() throws Exception {
        // Initialize the database
        vesselsRepository.saveAndFlush(vessels);

        int databaseSizeBeforeDelete = vesselsRepository.findAll().size();

        // Delete the vessels
        restVesselsMockMvc
            .perform(delete(ENTITY_API_URL_ID, vessels.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vessels> vesselsList = vesselsRepository.findAll();
        assertThat(vesselsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
