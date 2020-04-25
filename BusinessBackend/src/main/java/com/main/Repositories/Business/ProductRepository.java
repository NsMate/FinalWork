package com.main.Repositories.Business;
import com.main.Entites.Business.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends CrudRepository<Product,Long> {

    @Query("select p from Product p where (lower(p.productName) like lower(concat('%', ?1 , '%')))")
    List<Product> findProductThatMatchesInput(String input);

    Optional<Product> findByCode(Integer code);

    Optional<Product> findByProductName(String productName);
}
