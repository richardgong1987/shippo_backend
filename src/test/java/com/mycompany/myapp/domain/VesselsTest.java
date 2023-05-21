package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VesselsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vessels.class);
        Vessels vessels1 = new Vessels();
        vessels1.setId(1L);
        Vessels vessels2 = new Vessels();
        vessels2.setId(vessels1.getId());
        assertThat(vessels1).isEqualTo(vessels2);
        vessels2.setId(2L);
        assertThat(vessels1).isNotEqualTo(vessels2);
        vessels1.setId(null);
        assertThat(vessels1).isNotEqualTo(vessels2);
    }
}
