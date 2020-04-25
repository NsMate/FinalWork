package com.main.Repositories.Business;

import com.main.Entites.Business.Invoice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends CrudRepository<Invoice,Long> {

    @Query("select i from Invoice i where i.status = 'CLOSED' and i.id not in " +
            "(select r.invoice.id from Route r where r.invoice != null)")
    List<Invoice> findClosedInvoices();

    @Query("select i from Invoice i where i.route.id = ?1")
    Optional<Invoice> findInvoiceByRoute(Long id);
}
