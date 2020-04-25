package com.main.Repositories.Business;

import com.main.Entites.Business.Partner;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface PartnerRepository extends CrudRepository<Partner,Long> {

    Optional<Partner> findByOwn(int own);

    Optional<Partner> findByPartnerName(String partnerName);

    @Query("select p from Partner p where (lower(p.partnerName) like lower(concat('%', ?1 , '%'))) and p.own != 1")
    List<Partner> findPartnerThatMatchersInput(String input);

    @Query("select p from Partner p where p.own != 1")
    List<Partner> findAllOutsidePartners();
}
