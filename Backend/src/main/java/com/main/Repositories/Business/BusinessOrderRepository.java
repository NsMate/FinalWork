package com.main.Repositories.Business;

import com.main.Entites.Business.BusinessOrder;
import org.springframework.data.repository.CrudRepository;

public interface BusinessOrderRepository extends CrudRepository<BusinessOrder,Long> {
}
