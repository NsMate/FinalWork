package com.main.Repositories.Business;

import com.main.Entites.Business.BusinessOrder;
import com.main.Entites.Warehouse.Route;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessOrderRepository extends CrudRepository<BusinessOrder,Long> {

    @Query("select b from BusinessOrder b where b.status = 'CLOSED' and b.id not in " +
            "(select r.businessOrder.id from Route r where r.businessOrder != null)")
    List<BusinessOrder> findAllClosedOrders();

    @Query("select b from BusinessOrder b where b.route.id = ?1")
    Optional<BusinessOrder> findOrderByRoute(Long id);
}
