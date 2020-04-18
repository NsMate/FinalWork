package com.main.Repositories.Business;

import com.main.Entites.Business.Invoice;
import com.main.Entites.Warehouse.Route;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends CrudRepository<Invoice,Long> {

    @Query("select i from Invoice i where i.status = 'CLOSED' and i.route is NULL")
    List<Invoice> findAllClosedInvoices();

    @Query("select i from Invoice i where i.route.id = ?1")
    Optional<Invoice> findInvoiceByRoute(Long id);
}
