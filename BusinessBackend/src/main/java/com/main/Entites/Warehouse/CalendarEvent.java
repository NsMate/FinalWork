package com.main.Entites.Warehouse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "calendar_event")
public class CalendarEvent {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "start_date")
    @NotNull
    private Date startDate;

    @Column(name = "event_title")
    @NotNull
    private String eventTitle;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "route_id", referencedColumnName = "id")
    private Route route;
}
