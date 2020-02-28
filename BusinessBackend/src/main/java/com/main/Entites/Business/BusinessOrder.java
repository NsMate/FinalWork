package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "bus_order")
public class BusinessOrder implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "due_date")
    @NotNull
    private Date dueDate;

    @ManyToOne
    @JoinColumn(name = "partner_id", referencedColumnName = "id")
    @JsonIgnore
    private Partner partner;

    @OneToMany(mappedBy = "businessOrder")
    private List<OrderItem> orderItemList;
}
