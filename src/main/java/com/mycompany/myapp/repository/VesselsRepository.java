package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Vessels;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Vessels entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VesselsRepository extends JpaRepository<Vessels, Long> {}
