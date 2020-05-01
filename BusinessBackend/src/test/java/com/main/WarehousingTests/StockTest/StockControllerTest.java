package com.main.WarehousingTests.StockTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Warehouse.StockController;
import com.main.Controllers.Warehouse.VehicleController;
import com.main.Entites.Warehouse.Stock;
import com.main.Repositories.Warehouse.StockRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StockController.class)
@RunWith(SpringRunner.class)
public class StockControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    private StockRepository stockRepository;

    private ObjectMapper mapper = new ObjectMapper();

    public Stock createStock(){
        Stock stock = new Stock();
        stock.setQuantity(10);
        stock.setUnit("kg");
        return stock;
    }

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllStockTest() throws Exception{
        Stock stock = createStock();
        Stock stock1 = createStock();
        stock1.setUnit("láda");
        List<Stock> stockList = new ArrayList<>();
        stockList.add(stock);
        stockList.add(stock1);

        Mockito.when(stockRepository.findAll()).thenReturn(stockList);

        mvc.perform(get("/stocks")
                            .contentType(MediaType.APPLICATION_JSON))
                            .andExpect(status().isOk())
                            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                            .andExpect(jsonPath("$[0].unit").value("kg"))
                            .andExpect(jsonPath("$[1].unit").value("láda"));

        Mockito.verify(stockRepository,Mockito.times(1)).findAll();
    }

    @Test
    public void getStockById() throws Exception{
        Stock stockToFind = createStock();
        stockToFind.setId(1L);

        Mockito.when(stockRepository.findById(stockToFind.getId())).thenReturn(Optional.of(stockToFind));

        mvc.perform(get("/stocks/1")
                            .contentType(MediaType.APPLICATION_JSON))
                            .andExpect(status().isOk())
                            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                            .andExpect(jsonPath("$.id").value(1L));

        Mockito.verify(stockRepository,Mockito.times(1)).findById(1L);
    }

    @Test
    public void postStock() throws Exception{
        Stock stock = createStock();

        Mockito.when(stockRepository.save(Mockito.any(Stock.class))).thenReturn(stock);

        mvc.perform(post("/stocks")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(stock)))
                            .andExpect(status().isOk())
                            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        Mockito.verify(stockRepository,Mockito.times(1)).save(Mockito.any(Stock.class));
    }

    @Test
    public void putStock() throws Exception{
        Stock oldStock = createStock();
        oldStock.setId(1L);
        Stock newStock = createStock();
        newStock.setId(1L);

        Mockito.when(stockRepository.findById(1L)).thenReturn(Optional.of(oldStock));
        Mockito.when(stockRepository.save(newStock)).thenReturn(newStock);

        mvc.perform(put("/stocks/1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(newStock)))
                    .andExpect(status().isOk())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.id").value(oldStock.getId()));

        Mockito.verify(stockRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(stockRepository,Mockito.times(1)).save(newStock);
    }

    @Test
    public void deleteStock() throws Exception{
        Stock stock = createStock();
        stock.setId(1L);

        Mockito.when(stockRepository.findById(1L)).thenReturn(Optional.of(stock));

        mvc.perform(delete("/stocks/1")
                    .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(stockRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(stockRepository,Mockito.times(1)).deleteById(1L);
    }


}
