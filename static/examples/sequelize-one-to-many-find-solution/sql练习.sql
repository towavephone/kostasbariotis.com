drop database  if exists Student_Course_Database ;
create database Student_Course_Database;
alter database Student_Course_Database character set utf8;
use Student_Course_Database;

create table student
(sno char(9) primary key,
 sname char(20) unique,
 ssex char(2),
 sage smallint,
 sdept char(20)
);
create table course
(cno char(4) primary key,
 cname char(40),
 cpno char(4),
 ccredit smallint,
 foreign key (cpno) references course(cno)
);
create table sc
(sno char(9),
cno char(4),
grade smallint ,
primary key (sno,cno),
foreign key (sno) references student(sno),
foreign key (cno) references course(cno)
);

insert into student values('200215121','李勇','男',20,'CS');
insert into student values('200215122','刘晨','女',19,'CS');
insert into student values('200215123','王敏','女',18,'MA');
insert into student values('200215125','张立','男',19,'IS');
insert into student values('200215124','刘武汉','男',21,'PE');
insert into student values('200215126','李四','男',16,'MA');
insert into student values('200215128','欧阳雨','女',17,'CS');
insert into student values('200215127','欧阳杰','男',14,'PY');

insert into course(Cno,Cname,Ccredit) values('6','数据处理',2);
insert into course(Cno,Cname,Ccredit) values('2','数学',2);
insert into course values('8','数字系统设计','2',5);
insert into course values('7','PASCAL语言','6',4);
insert into course values('5','数据结构','7',4);
insert into course values('4','操作系统','6',3);
insert into course values('1','数据库','5',4);
insert into course values('3','信息系统','1',4);
insert into course values('9','DB_Design','1',2);

insert into sc values('200215121','1',92);
insert into sc values('200215121','2',85);
insert into sc values('200215121','3',30);
insert into sc values('200215121','4',97);
insert into sc values('200215121','6',59);
insert into sc values('200215121','5',54);
insert into sc values('200215122','2',90);
insert into sc values('200215122','4',96);
insert into sc values('200215122','3',80);
insert into sc values('200215123','6',65);
insert into sc values('200215123','5',10);
insert into sc(sno,cno) values('200215127','2');

#1
select sno,sname from student;
#2
select sname,sno,sdept from student;
#3
select * from student;
#4
select sname,2004-sage from student;
#5
select sname,'Year of Birth:',2004-sage,lower(sdept) from student;
select sname NAME,'Year of Birth:' BIRTH,2004-sage BIRTHDAY,lower(sdept) DEPARTMENT from student;
#6
select all sno from sc;
select distinct sno from sc;
#7
select sname from student where sdept='CS';
#8
select sname,sage from student where sage<20;
#9
select distinct sno from sc where grade<60;
#10
select sname,sdept,sage from student where sage between 20 and 23;
#11
select sname,sdept,sage from student where sage not between 20 and 23;
#12
select sname,ssex,sdept from student where sdept in('CS','MA','IS');
#13
select sname,ssex,sdept from student where sdept not in ('CS','MA','IS');
#14
select * from student where sno like '200215121';
#15
select sname,sno,ssex from student where sname like '刘%';
#16
select sname from student where sname like '欧阳_';
#17
select sname,sno from student where sname like '_阳%';
#18
select sname,sno,ssex from student where sname not like '刘%';
#19
select cno,ccredit from course where cname like 'DB@_Design' escape '@';
select cno,ccredit from course where cname = 'DB_Design' ;
#20
select * from course where cname like 'DB@_%i__'escape '@';
#21
select sno,cno from sc where grade is null;
#22
select sno,cno from sc where grade is not null;
#23
select sname,sdept,sage from student where sdept='CS' and sage<20;
select sname,ssex,sdept from student where sdept ='CS' or sdept='MA' or sdept='IS';
#24
select sno,grade from sc where cno='2' order by grade desc;
#25
select * from student order by sdept,sage desc;
#26
select count(*) from student;
#27
select count(distinct sno) from sc;
#28
select avg(grade) from sc where cno='3';
#29
select max(grade)from sc where cno='3';
#30
select sum(ccredit) from sc,course where sno='200215122' and sc.cno=course.cno;
#31
select cno,count(sno) from sc group by cno;
#32
select sno from sc group by sno having count(*)>3;
#33 在使用 join 时，on 和 where 条件的区别: on 条件是在生成临时表时使用的条件，它不管 on 中的条件是否为真，都会返回左边表中的记录。where 条件是在临时表生成好后，再对临时表进行过滤的条件。
# 同 join
select student.*,sc.* from student,sc where student.sno=sc.sno;
# 在表中存在至少一个匹配时返回行，即求交集
select student.*,sc.* from student join sc on student.sno=sc.sno;
# 同 join
select student.*,sc.* from student inner join sc on student.sno=sc.sno;
# 即使右表中没有匹配，也从左表返回所有的行
select student.*,sc.* from student left join sc on student.sno=sc.sno;
# 即使左表中没有匹配，也从右表返回所有的行
select student.*,sc.* from student right join sc on student.sno=sc.sno;
# 只要其中一个表中存在匹配，就返回行，mysql 不支持
select student.*,sc.* from student full outer join sc on student.sno=sc.sno;
#34
select student.sno,sname,ssex,sage,sdept,cno,grade from student,sc where student.sno=sc.sno;
select student.sno,sname,ssex,sage,sdept,cno,grade from student,sc where student.sno=sc.sno;
#35
select first.cno,second.cpno from course first,course second where first.cpno=second.cno;
select first.cno,second.cpno from course first,course second where first.cpno=second.cno and second.cpno is not null;
#36
select student.sno,sname,ssex,sage,sdept,cno,grade from student left join sc on(student.sno=sc.sno);
select student.sno,sname,ssex,sage,sdept,cno,grade from student left join sc using(sno);
select student.sno,sname,ssex,sage,sdept,cno,grade from student right join sc on(student.sno=sc.sno);
select student.sno,sname,ssex,sage,sdept,cno,grade from student right join sc on(student.sno=sc.sno);
#37
select student.sno,sname from student,sc where student.sno=sc.sno and cno='1' and grade>90;
#38
select student.sno,sname,cname,grade from student,sc,course where student.sno=sc.sno and sc.cno=course.cno;
#39 和刘晨是相同专业的同学，一对多查询模板
select sname,sname,sdept from student where sdept in (select sdept from student where sname='刘晨');
select s1.sno,s1.sname,s1.sdept from student s1,student s2 where s1.sdept=s2.sdept and s2.sname='刘晨';
select sno,sname,sdept from student s1 where exists (select * from student s2 where s2.sdept=s1.sdept and s2.sname='刘晨');
#40 学信息系统课程的有谁
select sno,sname from student where sno in (select sno from sc where cno in (select cno from course where cname='信息系统'));
select student.sno,sname from student,sc,course where student.sno=sc.sno and sc.cno=course.cno and cname='信息系统';
#41 每位同学成绩大于所选课程平均分的课程
select sno,cno from sc x where grade>=(select avg(grade) from sc y where y.sno=x.sno);
select sc.sno,cno from sc,(select sno,avg(grade) A_G from sc group by sno) y where sc.sno=y.sno and sc.grade>=y.A_G;
#42 非 CS 专业下年龄小于 CS 的最大年龄的
select sname,sage from student where sage<any(select sage from student where sdept='CS') and sdept<>'CS';
select sname,sage from student where sage<(select max(sage) from student where sdept='CS')and sdept<>'CS';
#43 非 CS 专业下年龄小于 CS 的最小年龄的
select sname,sage from student where sage<all(select sage from student where sdept='CS')and sdept<>'CS';
select sname,sage from student where sage<(select min(sage) from student where sdept='CS')and sdept<>'CS';
#44 学数据库的同学有谁
select sname from student where exists (select * from sc where sno=student.sno and cno='1');
select sname from student where sno in (select sno from sc where cno='1');
select sname from student, sc where sc.sno=student.sno and cno='1';
#45 不学数据库的同学有谁
select sname from student where not exists (select * from sc where sno=student.sno and cno='1');
#46 
# 查询选修了全部课程的学生姓名
select sname from student where not exists (select * from course where not exists (select * from sc where sno=student.sno and cno=course.cno));
# 查询选修了全部已开课程的学生姓名
select sname from student where not exists (select * from sc x where not exists (select * from sc y where sno=student.sno and x.cno=y.cno));
#47
# 查询至少选修了学生200215122选修的全部课程的学生号码
select distinct sno from sc scx where not exists(select * from sc scy where sno='200215122' and not exists(select * from sc scz where scz.sno=scx.sno and scz.cno=scy.cno));
#48
select * from student where sdept='CS' union select * from student where sage<=19;
#49
select sno from sc where cno='1' union select sno from sc where cno='2';
#50 学cs同时不小于19岁的
-- select * from student where sdept='CS' intersect select * from student where sage<=19;
select s1.* from student s1 left join student s2 on s1.sno=s2.sno where s1.sdept='CS' and s1.sage<=19;
select * from student where sdept='CS' and sage<=19;
#51
#select sno from sc where cno='1' intersect select sno from sc where cno='2';
select sno from sc where cno='1' and sno in (select sno from sc where cno='2');
select scx.sno from sc scx,sc scy where scx.sno=scy.sno and scx.cno='1' and scy.cno='2';
#52
#select * from student where sdept='CS' except select * from student where sage<=19;
select * from student where sdept='CS' and sage>19;
#53
insert into student (sno,sname,ssex,sdept,sage) values ('200215129','陈东','男','IS',18);
#54
insert into student values ('200215130','张成民','男',18,'CS');
#55
insert into sc (sno,cno) values ('200215128','1');
insert into sc values ('200215129','1',null);
#56
create table dept_age
(
 sdept char(15),
 avg_age smallint
);
insert into dept_age (sdept,avg_age) select sdept,avg(sage) from student group by sdept;
select * from dept_age;
#57
update student set sage=22 where sno='200215121';
#58
update student set sage=sage+1;
#59
update sc set grade=0 where 'CS'=(select sdept from student where student.sno=sc.sno);
update sc set grade=100 where sno in (select sno from  student where sdept='CS');
#60	建立计算机系学生的视图
create view CS_Student as select sno,sname,sage from student where sdept='CS';
#61	建立计算机系学生的视图，并按要求进行修改和插入时仍需保证该视图只有计算机系的学生
create view CS_Student_Check as select sno,sname,sage from student where sdept='CS' with check option;
#62	建立计算机系选修了1号课程的学生的视图
create view CS_S1(sno,sname,grade) as select student.sno,sname,grade from student,sc where sdept='CS' and student.sno=sc.sno and sc.cno='1';
#63	建立计算机系选修了1号课程且成绩在90分以上的学生的视图
create view CS_S2 as select sno,sname,grade from CS_S1 where grade>=90;
#64	定义一个反映学生出生年份的视图
create view BT_S(sno,sname,sbirth) as select sno,sname,2004-sage from student;
#65 将学生的学号及他的平均成绩定义为一个视图
create view S_G(sno,gavg) as select sno,avg(grade) from sc group by sno;
#66	将student表中的所有女生记录定义为一个视图
create view F_Student as select * from student where ssex='女';
#67	在计算机系学生的视图中找出年龄小于20岁的学生
select sno,sage from CS_Student where sage<=20;
#68	查询选修了1号课程的计算机系的学生
select CS_Student.sno,sname from CS_Student,sc where CS_Student.sno=sc.sno and sc.cno='1';
#69	在S_G视图中查询平均成绩在90分以上的学生学号和平均成绩
select * from S_G where gavg>=90;
select sno,avg(grade) from sc group by sno having avg(grade)>=90;
#70	将计算机系学生视图CS_Student中学号为200215122的学生姓名改为刘辰
update CS_Student set sname='刘辰' where sno='200215122';
update student set sname='刘辰' where sno='200215122' and sdept='CS';
#71	向计算机系的学生视图CS_Student中插入一个新的学生记录，其中学号为200215129，姓名为赵新，年龄为20岁
insert into CS_Student values ('200215131','赵新',20);
insert into student(sno,sname,sage,sdept) values ('200215131','赵新',20,'CS');
#72	删除计算机学生视图CS_Student中学号为200215129的记录
delete from CS_Student where sno='200215131';
delete from student where sno='200215131' and sdept='CS';
#60
delete from sc where sno='200215128';
delete from student where sno='200215128';
#61
delete from sc where 'CS'=(select sdept from student where student.sno=sc.sno);
#62
delete from sc;
#67 删除视图
drop view	BT_S;
drop view CS_S1 cascade;