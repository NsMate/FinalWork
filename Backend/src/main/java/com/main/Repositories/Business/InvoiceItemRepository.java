package com.main.Repositories.Business;

import com.main.Entites.Business.InvoiceItem;
import org.springframework.data.repository.CrudRepository;

public interface InvoiceItemRepository extends CrudRepository<InvoiceItem,Long> {
}
