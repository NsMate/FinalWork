package com.main.BusinessTests.PartnerTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Business.PartnerController;
import com.main.Entites.Business.Partner;
import com.main.Repositories.Business.PartnerRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PartnerController.class)
@RunWith(SpringRunner.class)
public class PartnerControllerTest {

    @Autowired
    MockMvc mvc;

    private ObjectMapper mapper = new ObjectMapper();

    public Partner createPartner(){
        Partner partner = new Partner();
        partner.setCity("Budapest");
        partner.setContactEmail("test@test");
        partner.setContactFirstName("Nagy");
        partner.setContactLastName("Test");
        partner.setContactPhoneNumber("+361111112");
        partner.setPartnerName("Test comp");
        partner.setStreet("Test Strett");
        partner.setZipCode(1111);
        partner.setOwn(0);
        partner.setStreetNumber(12);
        return partner;
    }

    @MockBean
    private PartnerRepository partnerRepository;

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllPartnerEndpointTest() throws Exception {
        Partner partner1 = createPartner();
        partner1.setId(1L);
        partner1.setPartnerName("TestComp");
        Partner partner2 = createPartner();
        partner2.setId(2L);
        partner2.setPartnerName("TestComp2");

        List<Partner> partners = new ArrayList<>();
        partners.add(partner1);
        partners.add(partner2);

        Mockito.when(partnerRepository.findAll()).thenReturn(partners);

        mvc.perform(get("/partners")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].partnerName").value("TestComp"))
                .andExpect(jsonPath("$[1].partnerName").value("TestComp2"))
                .andReturn();

        Mockito.verify(partnerRepository,Mockito.times(1)).findAll();

    }

    @Test
    public void getSpecifiedPartnerEndpointTest() throws Exception {
        Partner partner = createPartner();
        partner.setId(1L);
        partner.setPartnerName("TestComp");

        Mockito.when(partnerRepository.findById(1L)).thenReturn(Optional.of(partner));

        mvc.perform(get("/partners/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.partnerName").value("TestComp"))
                .andReturn();

        Mockito.verify(partnerRepository,Mockito.times(1)).findById(1L);

    }

    @Test
    public void getOwnCompanyEndpointTest() throws Exception {
        Partner partner = createPartner();
        partner.setId(1L);
        partner.setOwn(1);
        partner.setPartnerName("TestComp");

        Mockito.when(partnerRepository.findByOwn(1)).thenReturn(Optional.of(partner));

        mvc.perform(get("/partners/own")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.partnerName").value("TestComp"))
                .andReturn();

        Mockito.verify(partnerRepository,Mockito.times(1)).findByOwn(1);

    }

    @Test
    public void getAllPartnersThatMatchInputEndpointTest() throws Exception {
        Partner partner1 = createPartner();
        partner1.setId(1L);
        partner1.setPartnerName("TestComp");
        Partner partner2 = createPartner();
        partner2.setId(2L);
        partner2.setPartnerName("TestComp2");

        List<Partner> partners = new ArrayList<>();
        partners.add(partner1);
        partners.add(partner2);

        Mockito.when(partnerRepository.findPartnerThatMatchersInput("Comp")).thenReturn(partners);

        mvc.perform(get("/partners/input/Comp")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].partnerName").value("TestComp"))
                .andExpect(jsonPath("$[1].partnerName").value("TestComp2"))
                .andReturn();

        Mockito.verify(partnerRepository,Mockito.times(1)).findPartnerThatMatchersInput("Comp");
    }

    @Test
    public void getAllPartnersThatNotOwnEndpointTest() throws Exception {
        Partner partner1 = createPartner();
        partner1.setId(1L);
        partner1.setOwn(0);
        partner1.setPartnerName("TestComp");
        Partner partner2 = createPartner();
        partner2.setId(2L);
        partner2.setOwn(0);
        partner2.setPartnerName("TestComp2");

        List<Partner> partners = new ArrayList<>();
        partners.add(partner1);
        partners.add(partner2);

        Mockito.when(partnerRepository.findAllOutsidePartners()).thenReturn(partners);

        mvc.perform(get("/partners/outsidePartners")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].partnerName").value("TestComp"))
                .andExpect(jsonPath("$[1].partnerName").value("TestComp2"))
                .andReturn();

        Mockito.verify(partnerRepository,Mockito.times(1)).findAllOutsidePartners();
    }

    @Test
    public void postPartnerEndpointTest() throws Exception {
        Partner partner = createPartner();
        partner.setId(1L);
        partner.setPartnerName("TestComp");

        Mockito.when(partnerRepository.save(partner)).thenReturn(partner);

        mvc.perform(post("/partners")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(partner)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.partnerName").value("TestComp"))
                .andReturn();

        Mockito.verify(partnerRepository,Mockito.times(1)).save(partner);

    }

    @Test
    public void putPartnerEndpointTest() throws Exception {
        Partner partner = createPartner();
        partner.setId(1L);
        partner.setPartnerName("TestComp");

        Mockito.when(partnerRepository.findById(1L)).thenReturn(Optional.of(partner));
        Mockito.when(partnerRepository.save(partner)).thenReturn(partner);

        mvc.perform(put("/partners/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(partner)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.partnerName").value("TestComp"))
                .andReturn();

        Mockito.verify(partnerRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(partnerRepository,Mockito.times(1)).save(partner);
    }

    @Test
    public void deleteProductEndpointTest() throws Exception{
        Partner partner = createPartner();
        partner.setId(1L);
        partner.setPartnerName("TestComp");

        Mockito.when(partnerRepository.findById(1L)).thenReturn(Optional.of(partner));

        mvc.perform(delete("/partners/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(partnerRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(partnerRepository,Mockito.times(1)).deleteById(1L);
    }
}
