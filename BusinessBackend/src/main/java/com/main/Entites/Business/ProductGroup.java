package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "product_group")
public class ProductGroup implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "group_name")
    @NotNull
    @Size(max = 30)
    private String groupName;

    @Column(name = "description")
    @Size(max = 100)
    private String description;

    @OneToMany(mappedBy = "productGroup", cascade = CascadeType.REMOVE)
    private List<Product> productList;
}
