CREATE DATABASE apptestdb;
USE apptestdb;

create TABLE userinfo (
    userid varchar(32) not null PRIMARY KEY,
    userpassword varchar(32) not null,
    username varchar(16) not null,
    useremail varchar(64) not null,
    useraddress varchar(64) not null,
    useraddressdet varchar(64) not null,
    userpoint int not null,
    champseq varchar(20000) default ""
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
select * from userinfo;
-- drop table userinfo;




create table userboard (
	idx int not null auto_increment PRIMARY KEY, 
    userid varchar(256) null,
    title varchar(256) null,
    content varchar(256) null,
    regdate varchar(256) null,
    modidate varchar(256) null,
    hit varchar(256) null
);

select * from userboard;
-- drop table userboard;

create table commentboard (
	idx int not null auto_increment PRIMARY KEY, 
    userid varchar(256) null,
    comments varchar(256) null,
    board_idx int,
    foreign key (board_idx) references userboard(idx) 
    on update cascade on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

select * from commentboard;
-- drop table commentboard;