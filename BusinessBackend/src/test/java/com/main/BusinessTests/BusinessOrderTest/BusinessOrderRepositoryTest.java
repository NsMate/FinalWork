package com.main.BusinessTests.BusinessOrderTest;

import com.main.Entites.Business.BusinessOrder;
import com.main.Entites.Business.Partner;
import com.main.Repositories.Business.BusinessOrderRepository;
import com.main.Repositories.Business.PartnerRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Date;
import java.util.List;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles("test")
public class BusinessOrderRepositoryTest {

    @Autowired
    private BusinessOrderRepository businessOrderRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    public Partner createPartner(){
        Partner partner = new Partner();
        partner.setCity("Budapest");
        partner.setContactEmail("test@test");
        partner.setContactFirstName("Nagy");
        partner.setContactLastName("Test");
        partner.setContactPhoneNumber("+361111112");
        partner.setPartnerName("Test Company");
        partner.setStreet("Test Strett");
        partner.setZipCode(1111);
        partner.setOwn(0);
        partner.setStreetNumber(12);
        return partnerRepository.save(partner);
    }
    public BusinessOrder createBusinessOrder(Partner partner){
        BusinessOrder order = new BusinessOrder();
        order.setIssueDate(Date.valueOf("2020-03-12"));
        order.setDueDate(Date.valueOf("2020-03-13"));
        order.setPartner(partner);
        order.setPaymentType("Átutalás");
        order.setVat("27");
        order.setStatus("OPEN");
        return businessOrderRepository.save(order);
    }

    @Test
    public void getClosedOrdersFromDbTest(){
        Partner partner = createPartner();

        BusinessOrder good1 = createBusinessOrder(partner);
        good1.setStatus("CLOSED");
        BusinessOrder good2 = createBusinessOrder(partner);
        good2.setStatus("CLOSED");
        BusinessOrder bad1 = createBusinessOrder(partner);
        bad1.setStatus("DONE");
        BusinessOrder bad2 = createBusinessOrder(partner);
        bad2.setStatus("OPEN");

        List<BusinessOrder> orders = businessOrderRepository.findAllClosedOrders();

        Assert.assertEquals(2,orders.size());
    }
}
