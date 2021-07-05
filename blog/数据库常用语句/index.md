---
title: 数据库常用语句
categories:
  - 面试
tags: 面试, 数据库
path: /database-commonly-used-statements/
date: 2018-04-02 17:45:38
---

以下是 sql 常用语句整理：

```sql
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

#1	查询全体学生的学号与姓名
select sno,sname from student;
#2	查询全体学生的学号与姓名与所在系
select sname,sno,sdept from student;
#3	查询全体学生的详细记录
select *from student;
#4	查询全体学生的姓名及出生年份
select sname,2004-sage from student;
#5	查询全体学生的姓名，出生年份和所在的院系，要求用小写字母表示所有系名
select sname,'Year of Birth:',2004-sage,lower(sdept) from student;
select sname NAME,'Year of Birth:' BIRTH,2004-sage BIRTHDAY,lower(sdept) DEPARTMENT from student;
#6	查询选修了课程的学生学号
select all sno from sc;
select distinct sno from sc;
#7	查询计算机科学系全体学生的名单
select sname from student where sdept='CS';
#8	查询所有年龄在20岁以下的学生姓名及年龄
select sname,sage from student where sage<20;
#9	查询考试成绩有不及格的学生学号
select distinct sno from sc where grade <60;
#10	查询年龄在20~23岁之间的学生姓名，系别和年龄
select sname,sdept,sage from student where sage between 20 and 23;
#11	查询年龄不在20~23之间的学生姓名，系别和年龄
select sname,sdept,sage from student where sage not between 20 and 23;
#12	查询计算机科学系，数学系，信息系学生的姓名与性别
select sname,ssex,sdept from student where sdept in('CS','MA','IS');
select sname,ssex,sdept from student where sdept ='CS' or sdept='MA' or sdept='IS';
#13	查询既不是计算机系，数学系，也不是信息系的学生姓名与性别
select sname,ssex,sdept from student where sdept not in ('CS','MA','IS');
#14	查询学号为200215121的学生的详细情况
select *from student where sno like '200215121';
#15	查询所有姓刘的学生的学生姓名，学号，性别
select sname,sno,ssex from student where sname like '刘%';
#16	查询姓“欧阳”且全名为3个汉字的学生姓名
select sname from student where sname like '欧阳_';
#17	查询名字中第二个字为“阳”字的学生姓名与学号
select sname,sno from student where sname like '_阳%';
#18	查询所有不姓刘的学生姓名，学号，性别
select sname,sno,ssex from student where sname not like '刘%';
#19	查询DB_Design课程的课程号和学分
select cno,ccredit from course where cname like 'DB@_Design' escape '@';
select cno,ccredit from course where cname = 'DB_Design' ;
#20	查询以“DB_”开头，且倒数第三个字符为i的详细情况
select *from course where cname like 'DB@_%i__'escape '@';
#21	查询缺少成绩的学生学号和相应的课程号
select sno,cno from sc where grade is null;
#22	查询所有有成绩的学生学号和课程号
select sno,cno from sc where grade is not null;
#23	查询计算机系年龄在20岁以下的学生姓名
select sname,sdept,sage from student where sdept='CS' and sage<20;
#24	查询选修了2号课程的学生学号及其成绩，查询结果按分数降序排列
select sno,grade from sc where cno='2' order by grade desc;
#25	查询全体学生情况，查询结果按所在系的系号升序排列，同一系中的学生按年龄降序排列
select *from student order by sdept,sage desc;
#26	查询学生总人数
select count(*) from student;
#27	查询选修了课程的学生人数
select count(distinct sno)from sc;
#28	计算3号课程的学生平均成绩
select avg(grade) from sc where cno='3';
#29	计算3号课程的学生最高成绩
select max(grade)from sc where cno='3';
#30	查询学生200215122选修课程的总学分数
select sum(ccredit) from sc,course where sno='200215122' and sc.cno=course.cno;
#31	求各个课程及相应的选课人数
select cno,count(sno) from sc group by cno;
#32	查询选修了3门以上课程的学生学号
select sno from sc group by sno having count(*)>3;
#33	查询每个学生及其选修课程的情况
select student.*,sc.* from student,sc where student.sno=sc.sno;
#34	对例33用自然连接完成
select student.sno,sname,ssex,sage,sdept,cno,grade from student,sc where student.sno=sc.sno;
#35	查询每一门课的间接先行课
select first.cno,second.cpno from course first,course second where first.cpno=second.cno;
select first.cno,second.cpno from course first,course second where first.cpno=second.cno and second.cpno is not null;
#36	对例33的改写
select student.sno,sname,ssex,sage,sdept,cno,grade from student left join sc on(student.sno=sc.sno);
select student.sno,sname,ssex,sage,sdept,cno,grade from student left join sc using(sno);
select student.sno,sname,ssex,sage,sdept,cno,grade from student right join sc on(student.sno=sc.sno);
#37	查询选修了1号课程且平均成绩在90分以上的所有学生
select student.sno,sname from student,sc where student.sno=sc.sno and cno='1' and grade>90;
#38	查询每个学生的学号，姓名，选修的课程名及成绩
select student.sno,sname,cname,grade from student,sc,course where student.sno=sc.sno and sc.cno=course.cno;
#39	查询与刘晨在同一系学习的学生
select sname,sname,sdept from student where sdept in (select sdept from student where sname='刘晨');
select s1.sno,s1.sname,s1.sdept from student s1,student s2 where s1.sdept=s2.sdept and s2.sname='刘晨';
select sno,sname,sdept from student s1 where exists ( select* from student s2 where s2.sdept=s1.sdept and s2.sname='刘晨');
#40	查询选修了课程名为信息系统的学生学号与姓名
select sno,sname from student where sno in (select sno from sc where cno in(select cno from course where cname='信息系统'));
select student.sno,sname from student,sc,course where student.sno=sc.sno and sc.cno=course.cno and cname='信息系统';
#41	找出每个学生超过他选修课程平均成绩的课程号
select sno,cno from sc x where grade>=(select avg(grade) from sc y where y.sno=x.sno);
select sc.sno,cno from sc,(select sno,avg(grade) A_G from sc group by sno) y where sc.sno=y.sno and sc.grade>=y.A_G;
#42	查询其他系中比计算机系某一学生年龄小的学生姓名与年龄
select sname,sage from student where sage<any(select sage from student where sdept='CS') and sdept<>'CS';
select sname,sage from student where sage<(select max(sage) from student where sdept='CS')and sdept<>'CS';
#43	查询其他系比计算机系所有学生年龄小的学生姓名及年龄
select sname,sage from student where sage<all(select sage from student where sdept='CS')and sdept<>'CS';
select sname,sage from student where sage<(select min(sage) from student where sdept='CS')and sdept<>'CS';
#44	查询所有选修了1号课程的学生姓名
select sname from student where exists(select * from sc where sno=student.sno and cno='1');
#45	查询没有选修1号课程的学生姓名
select sname from student where not exists (select * from sc where sno=student.sno and cno='1');
#46
#查询选修了全部课程的学生姓名
select sname from student where not exists ( select * from course where not exists( select * from sc where sno=student.sno and cno=course.cno));
#查询选修了全部已开课程的学生姓名
select sname from student where not exists( select * from sc x where not exists( select * from sc y where sno=student.sno and x.cno=y.cno));
#47
#查询至少选修了学生200215122选修的全部课程的学生号码
select distinct sno from sc scx where not exists( select * from sc scy where sno='200215122' and not exists( select * from sc scz where scz.sno=scx.sno and scz.cno=scy.cno));
#48	查询计算机系学生及年龄不大于19岁的学生
 select * from student where sdept='CS' union select * from student where sage<=19;
 #49	查询选修了课程1或2号的学生
 select sno from sc where cno='1' union select sno from sc where cno='2';
 #50	查询计算机学生与年龄不大于19岁的学生的交集
 #select * from student where sdept='CS' intersect select * from student where sage<=19;
select s1.* from student s1 left join(student s2) on(s1.sno=s2.sno) where s1.sdept='CS' and s1.sage<=19;
 select * from student where sdept='CS' and sage<=19;
 #51	查询既选修了课程1又选修了课程2的学生
 #select sno from sc where cno='1' intersect select sno from sc where cno='2';
 select sno from sc where cno='1' and sno in (select sno from sc where cno='2');
 select scx.sno from sc scx,sc scy where scx.sno=scy.sno and scx.cno='1' and scy.cno='2';
 #52	查询计算机系的学生与年龄不大于19岁学生的差集
 #select * from student where sdept='CS' except select * from student where sage<=19;
 select * from student where sdept='CS' and sage>19;
 #53	将一个新学生元组插入到student表中
 insert into student (sno,sname,ssex,sdept,sage) values ('200215129','陈东','男','IS',18);
 #54	将学生张成民的信息插入到student表中
 insert into student values ('200215130','张成民','男',18,'CS');
#55	插入一条选课记录
insert into sc (sno,cno) values ('200215128','1');
insert into sc values ('200215129','1',null);
#56	对每一个系，求学生的平均年龄，并把结果存入数据库
create table  dept_age
( sdept char(15) primary  key ,
avg_age smallint
);
insert into dept_age (sdept,avg_age) select sdept,avg(sage) from student group by sdept;
select *from dept_age;
#57	将学生200215121的年龄改为22岁
update student set sage=22 where sno='200215121';
#58	将所有学生的年龄加1岁
update student set sage=sage+1;
#59	将计算机系的全体学生的成绩置0
update sc set  grade=0 where 'CS'=( select sdept from  student where student.sno=sc.sno);
update sc set  grade=100 where sno in  (select sno from  student where sdept='CS');
#60	建立计算机系学生的视图
create view CS_Student as select sno,sname,sage from student where sdept='CS';
#61	建立计算机系学生的视图，并按要求进行修改和插入时仍需保证该视图只有计算机系的学生
create view CS_Student_Check as select sno,sname,sage from student where sdept='CS' with check option;
#62	建立计算机系选修了1号课程的学生的视图
create view CS_S1(sno,sname,grade) as select student.sno,sname,grade  from student,sc where sdept='CS' and student.sno=sc.sno and sc.cno='1';
#63	建立计算机系选修了1号课程且成绩在90分以上的学生的视图
create view CS_S2 as select sno,sname,grade from CS_S1 where grade>=90;
#64	定义一个反映学生出生年份的视图
create view BT_S(sno,sname,sbirth) as select sno,sname,2004-sage from student ;
#65 将学生的学号及他的平均成绩定义为一个视图
create view S_G(sno,gavg) as select sno,avg(grade) from sc group  by sno;
#66	将student表中的所有女生记录定义为一个视图
create view F_Student as select * from student where ssex='女';
#67	在计算机系学生的视图中找出年龄小于20岁的学生
select sno,sage from CS_Student where sage<=20;
#68	查询选修了1号课程的计算机系的学生
select CS_Student.sno,sname from CS_Student,sc where CS_Student.sno=sc.sno and sc.cno='1';
#69	在S_G视图中查询平均成绩在90分以上的学生学号和平均成绩
select * from S_G where gavg>=90;
select sno,avg( grade) from sc group  by sno having avg( grade)>=90;
#70	将计算机系学生视图CS_Student中学号为200215122的学生姓名改为刘辰
update CS_Student set sname='刘辰' where sno='200215122';
update student set sname='刘辰' where sno='200215122' and sdept='CS';
#71	向计算机系的学生视图CS_Student中插入一个新的学生记录，其中学号为200215129，姓名为赵新，年龄为20岁
insert into CS_Student values ( '200215131','赵新',20);#不能自动插入系名'CS'
insert into student(sno,sname,sage,sdept) values ( '200215131','赵新',20,'CS');
#72	删除计算机学生视图CS_Student中学号为200215129的记录
delete from CS_Student where sno='200215131';#不能删除此人
delete from student where sno='200215131' and sdept='CS';#去掉sdept='CS'可删除此人
#73	删除学号为200215128的学生记录
delete from sc where sno='200215128';
delete from student where sno='200215128';
#74	删除计算机系所有学生的选课记录
delete from sc where 'CS'=(select sdept from  student where student.sno=sc.sno);
#75	删除所有学生的选课记录
delete from sc;
#76 删除视图
drop view	BT_S;
drop view  CS_S1 cascade;
```
