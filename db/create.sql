use my_prediction;

drop table if exists audit_log;
drop table if exists message;

create table audit_log (
	id int auto_increment primary key,
	_data varchar(3000),
	_timestamp bigint,
	_type varchar(255)
);

create table message (
	id int auto_increment primary key,
	text varchar(255),
	author varchar(500),
	created_at bigint,
	eth_tx varchar(500),
	msg_uuid varchar(500)
);
	