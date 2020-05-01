insert into employee (id,first_name,last_name,email,phone_number,department) values (1000,'User','Admin','test@admin.hu','06201234567','Vezető');
insert into employee (id,first_name,last_name,email,phone_number,department) values (1001,'Ádám','Nagy','test1@gmail.hu','06201234567','Pénzügy');
insert into employee (id,first_name,last_name,email,phone_number,department) values (1002,'Máté','Nagy','test2@freemail.hu','06201234567','Logisztika');
insert into employee (id,first_name,last_name,email,phone_number,department) values (1003,'János','Szabó','test3@citromail.hu','06206434567','Munkás');
insert into employee (id,first_name,last_name,email,phone_number,department) values (1004,'Péter','Molnár','test4@test.hu','06201231067','Munkás');

insert into app_user (id,app_user_name,app_user_password,app_user_group,employee_id) values (1000,'admin','$2a$04$YDiv9c./ytEGZQopFfExoOgGlJL6/o0er0K.hiGb5TGKHUL8Ebn..','ROLE_ADMIN',1000);

insert into product_group (id,group_name) values (1005,'Cipők');
insert into product (id,product_name,price,code,product_group_id) values  (1006,'Nike Air',18000,1111,1005);
insert into product (id,product_name,price,code,product_group_id) values  (1007,'Nike Run',14999,1112,1005);
insert into product (id,product_name,price,code,product_group_id) values  (1008,'Adidas Retro',20999,1113,1005);
insert into product (id,product_name,price,code,product_group_id) values  (1009,'Puma Run',19999,1114,1005);

insert into partner (id,partner_name,zip_code,city,street,street_number,contact_last_name,contact_first_name,contact_email,contact_phone_number,vat_number,partnership_type,own) values (1010,'Nike',1111,'Budapest','Deák Ferenc út',12,'Nagy','András','contact@nike.hu','+36201122334','11223344-2-33','Beszállító',0);
insert into partner (id,partner_name,zip_code,city,street,street_number,contact_last_name,contact_first_name,contact_email,contact_phone_number,vat_number,partnership_type,own) values (1011,'Adidas',1111,'Budapest','Kossuth Lajos út',11,'Szabó','Gyula','contact@adidas.hu','+36201122334','11894444-2-33','Beszállító',0);
insert into partner (id,partner_name,zip_code,city,street,street_number,contact_last_name,contact_first_name,contact_email,contact_phone_number,vat_number,partnership_type,own) values (1012,'Budapest Márkabolt',1081,'Budapest','Rákóczi út',11,'Molnár','Endre','bp.bolt@gmail.com','+36305622334','11892144-2-11','Vevő',0);

insert into vehicle (id,manufacturer,license_plate_number,vehicle_type) values (1013,'Ford','KJL-456','Szállítás');

insert into warehouse (id,zip_code,city,street,street_number) values (1014,'1111','Budapest','Mikszáth Kálmán út','10');


