package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Vessels;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Vessels}.
 */
public interface VesselsService {
    /**
     * Save a vessels.
     *
     * @param vessels the entity to save.
     * @return the persisted entity.
     */
    Vessels save(Vessels vessels);

    /**
     * Updates a vessels.
     *
     * @param vessels the entity to update.
     * @return the persisted entity.
     */
    Vessels update(Vessels vessels);

    /**
     * Partially updates a vessels.
     *
     * @param vessels the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Vessels> partialUpdate(Vessels vessels);

    /**
     * Get all the vessels.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Vessels> findAll(Pageable pageable);

    /**
     * Get the "id" vessels.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Vessels> findOne(Long id);

    /**
     * Delete the "id" vessels.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
