package com.main.Repositories.Warehouse;

import com.main.Entites.Warehouse.Stock;
import org.springframework.data.repository.CrudRepository;

public interface StockRepository extends CrudRepository<Stock,Long> {
}
