insert into employee (id,first_name,last_name,email,phone_number,department) values (1,'User','Admin','test@admin.hu','06201234567','Vezető');

insert into app_user (id,app_user_name,app_user_password,app_user_group,employee_id) values (1,'admin','$2a$04$YDiv9c./ytEGZQopFfExoOgGlJL6/o0er0K.hiGb5TGKHUL8Ebn..','ROLE_ADMIN',1);