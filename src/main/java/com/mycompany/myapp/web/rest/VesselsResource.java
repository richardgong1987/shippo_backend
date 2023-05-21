package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Vessels;
import com.mycompany.myapp.repository.VesselsRepository;
import com.mycompany.myapp.service.VesselsService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Vessels}.
 */
@RestController
@RequestMapping("/api")
public class VesselsResource {

    private final Logger log = LoggerFactory.getLogger(VesselsResource.class);

    private static final String ENTITY_NAME = "vessels";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VesselsService vesselsService;

    private final VesselsRepository vesselsRepository;

    public VesselsResource(VesselsService vesselsService, VesselsRepository vesselsRepository) {
        this.vesselsService = vesselsService;
        this.vesselsRepository = vesselsRepository;
    }

    /**
     * {@code POST  /vessels} : Create a new vessels.
     *
     * @param vessels the vessels to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vessels, or with status {@code 400 (Bad Request)} if the vessels has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vessels")
    public ResponseEntity<Vessels> createVessels(@RequestBody Vessels vessels) throws URISyntaxException {
        log.debug("REST request to save Vessels : {}", vessels);
        if (vessels.getId() != null) {
            throw new BadRequestAlertException("A new vessels cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vessels result = vesselsService.save(vessels);
        return ResponseEntity
            .created(new URI("/api/vessels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vessels/:id} : Updates an existing vessels.
     *
     * @param id the id of the vessels to save.
     * @param vessels the vessels to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vessels,
     * or with status {@code 400 (Bad Request)} if the vessels is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vessels couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vessels/{id}")
    public ResponseEntity<Vessels> updateVessels(@PathVariable(value = "id", required = false) final Long id, @RequestBody Vessels vessels)
        throws URISyntaxException {
        log.debug("REST request to update Vessels : {}, {}", id, vessels);
        if (vessels.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vessels.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vesselsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vessels result = vesselsService.update(vessels);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, vessels.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vessels/:id} : Partial updates given fields of an existing vessels, field will ignore if it is null
     *
     * @param id the id of the vessels to save.
     * @param vessels the vessels to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vessels,
     * or with status {@code 400 (Bad Request)} if the vessels is not valid,
     * or with status {@code 404 (Not Found)} if the vessels is not found,
     * or with status {@code 500 (Internal Server Error)} if the vessels couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vessels/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Vessels> partialUpdateVessels(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Vessels vessels
    ) throws URISyntaxException {
        log.debug("REST request to partial update Vessels partially : {}, {}", id, vessels);
        if (vessels.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vessels.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vesselsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vessels> result = vesselsService.partialUpdate(vessels);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, vessels.getId().toString())
        );
    }

    /**
     * {@code GET  /vessels} : get all the vessels.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vessels in body.
     */
    @GetMapping("/vessels")
    public ResponseEntity<List<Vessels>> getAllVessels(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Vessels");
        Page<Vessels> page = vesselsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /vessels/:id} : get the "id" vessels.
     *
     * @param id the id of the vessels to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vessels, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vessels/{id}")
    public ResponseEntity<Vessels> getVessels(@PathVariable Long id) {
        log.debug("REST request to get Vessels : {}", id);
        Optional<Vessels> vessels = vesselsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(vessels);
    }

    /**
     * {@code DELETE  /vessels/:id} : delete the "id" vessels.
     *
     * @param id the id of the vessels to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vessels/{id}")
    public ResponseEntity<Void> deleteVessels(@PathVariable Long id) {
        log.debug("REST request to delete Vessels : {}", id);
        vesselsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
