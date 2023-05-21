package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A Vessels.
 */
@Entity
@Table(name = "vessels")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Vessels implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "ownerid")
    private String ownerid;

    @Column(name = "naccs")
    private String naccs;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Vessels id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Vessels name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwnerid() {
        return this.ownerid;
    }

    public Vessels ownerid(String ownerid) {
        this.setOwnerid(ownerid);
        return this;
    }

    public void setOwnerid(String ownerid) {
        this.ownerid = ownerid;
    }

    public String getNaccs() {
        return this.naccs;
    }

    public Vessels naccs(String naccs) {
        this.setNaccs(naccs);
        return this;
    }

    public void setNaccs(String naccs) {
        this.naccs = naccs;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vessels)) {
            return false;
        }
        return id != null && id.equals(((Vessels) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vessels{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", ownerid='" + getOwnerid() + "'" +
            ", naccs='" + getNaccs() + "'" +
            "}";
    }
}
