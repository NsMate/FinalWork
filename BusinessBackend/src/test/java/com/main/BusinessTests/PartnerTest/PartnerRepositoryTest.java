package com.main.BusinessTests.PartnerTest;

import com.main.Entites.Business.Partner;
import com.main.Repositories.Business.PartnerRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles("test")
public class PartnerRepositoryTest {

    @Autowired
    private PartnerRepository partnerRepository;

    public Partner createPartner(String name, int own){
        Partner partner = new Partner();
        partner.setCity("Budapest");
        partner.setContactEmail("test@test");
        partner.setContactFirstName("Nagy");
        partner.setContactLastName("Test");
        partner.setContactPhoneNumber("+361111112");
        partner.setPartnerName(name);
        partner.setStreet("Test Strett");
        partner.setZipCode(1111);
        partner.setOwn(own);
        partner.setStreetNumber(12);
        return partnerRepository.save(partner);
    }

    @Test
    public void getPartnersThatMatchInputFromDb(){
        partnerRepository.deleteAll();

        Partner good1 = createPartner("good1",0);
        Partner good2 = createPartner("good2",0);
        Partner good3 = createPartner("good3",0);

        Partner bad1 = createPartner("bad1",0);
        Partner bad2 = createPartner("bad2",0);

        List<Partner> goodPartners = partnerRepository.findPartnerThatMatchersInput("good");
        List<Partner> badPartners = partnerRepository.findPartnerThatMatchersInput("bad");

        Assert.assertEquals(3,goodPartners.size());
        Assert.assertEquals(2,badPartners.size());
    }

    @Test
    public void getOutsidePartnersFromDb(){
        partnerRepository.deleteAll();

        Partner good1 = createPartner("good1",0);
        Partner good2 = createPartner("good2",0);
        Partner good3 = createPartner("good3",0);

        Partner bad1 = createPartner("bad1",0);
        Partner bad2 = createPartner("bad2",0);

        List<Partner> outsidePartners = partnerRepository.findAllOutsidePartners();

        Assert.assertEquals(5,outsidePartners.size());
    }
}
