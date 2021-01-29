---
title: Sequelize一对多查询解决方案
path: /sequelize-one-to-many-find-solution/
date: 2021-1-5 13:55:57
tags: 后端, nodejs, Sequelize, SQL
---

# 前置知识

`embed:sequelize-one-to-many-find-solution/sql练习.sql`

# 需求背景

已知始发站、终点站，如何查出满足条件的方案线路？即根据一个表关联多个表时如何查询相关字段？

# sql 语句

根据以上的前置知识可得出一对多下的查询应该这样写：

`embed:sequelize-one-to-many-find-solution/一对多查询.sql`

# Sequelize 下的解决方案

1. 从表的设计上考虑：将始发站、终点站写在主表中，无需考虑一对多的问题
2. 根据以上的 sql 语句利用 Sequelize 去关联

最终为了实现上的简便，直接使用方案 1
