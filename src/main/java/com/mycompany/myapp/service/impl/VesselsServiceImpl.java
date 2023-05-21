package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Vessels;
import com.mycompany.myapp.repository.VesselsRepository;
import com.mycompany.myapp.service.VesselsService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Vessels}.
 */
@Service
@Transactional
public class VesselsServiceImpl implements VesselsService {

    private final Logger log = LoggerFactory.getLogger(VesselsServiceImpl.class);

    private final VesselsRepository vesselsRepository;

    public VesselsServiceImpl(VesselsRepository vesselsRepository) {
        this.vesselsRepository = vesselsRepository;
    }

    @Override
    public Vessels save(Vessels vessels) {
        log.debug("Request to save Vessels : {}", vessels);
        return vesselsRepository.save(vessels);
    }

    @Override
    public Vessels update(Vessels vessels) {
        log.debug("Request to update Vessels : {}", vessels);
        return vesselsRepository.save(vessels);
    }

    @Override
    public Optional<Vessels> partialUpdate(Vessels vessels) {
        log.debug("Request to partially update Vessels : {}", vessels);

        return vesselsRepository
            .findById(vessels.getId())
            .map(existingVessels -> {
                if (vessels.getName() != null) {
                    existingVessels.setName(vessels.getName());
                }
                if (vessels.getOwnerid() != null) {
                    existingVessels.setOwnerid(vessels.getOwnerid());
                }
                if (vessels.getNaccs() != null) {
                    existingVessels.setNaccs(vessels.getNaccs());
                }

                return existingVessels;
            })
            .map(vesselsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Vessels> findAll(Pageable pageable) {
        log.debug("Request to get all Vessels");
        return vesselsRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Vessels> findOne(Long id) {
        log.debug("Request to get Vessels : {}", id);
        return vesselsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Vessels : {}", id);
        vesselsRepository.deleteById(id);
    }
}
