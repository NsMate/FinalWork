package com.main.Entites.User;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "app_user")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class AppUser implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "app_user_name")
    @NotNull
    private String appUserName;

    @Column(name = "app_user_password")
    @NotNull
    private String appUserPassword;

    @Column(name = "app_user_group")
    @NotNull
    @Enumerated(EnumType.STRING)
    private Role appUserGroup;

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;

    public enum Role {
        ROLE_LOGISTICS, ROLE_FINANCE, ROLE_ADMIN, ROLE_WORKER
    }
}
