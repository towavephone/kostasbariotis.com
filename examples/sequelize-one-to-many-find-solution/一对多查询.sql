DROP TABLE IF EXISTS `sugo_train_scheme`;
CREATE TABLE `sugo_train_scheme`  (
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime(0) NULL DEFAULT NULL COMMENT '删除时间',
  `id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '主键ID',
  `name` varchar(512) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '方案名称',
  `status` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '方案报告状态，生成中：generating，已生成：generated',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '车次方案列表 ' ROW_FORMAT = Dynamic;

INSERT INTO `sugo_train_scheme` VALUES (NULL, NULL, NULL, '1', '32', NULL);
INSERT INTO `sugo_train_scheme` VALUES (NULL, NULL, NULL, '2', 'sfaf', '');

DROP TABLE IF EXISTS `sugo_train_scheme_ponit_info`;
CREATE TABLE `sugo_train_scheme_ponit_info`  (
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime(0) NULL DEFAULT NULL COMMENT '删除时间',
  `id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '主键ID',
  `scheme_id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '方案ID',
  `zm` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '站名',
  `zmdm` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '站名代码',
  `zmlx` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '站名类型',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '车次方案查询条件站点信息 ' ROW_FORMAT = Dynamic;

INSERT INTO `sugo_train_scheme_ponit_info` VALUES (NULL, NULL, NULL, '23', '1', '长沙', '23', 'start');
INSERT INTO `sugo_train_scheme_ponit_info` VALUES (NULL, NULL, NULL, '24', '1', '武汉', '555', 'pass');
INSERT INTO `sugo_train_scheme_ponit_info` VALUES (NULL, NULL, NULL, '25', '1', '湘潭', '666', 'end');
INSERT INTO `sugo_train_scheme_ponit_info` VALUES (NULL, NULL, NULL, '3', '2', '武汉', '555', 'start');
INSERT INTO `sugo_train_scheme_ponit_info` VALUES (NULL, NULL, NULL, '4', '2', '湘潭', '666', 'end');

# 查一对多的方法，使用 in
SELECT
	* 
FROM
	sugo_train_scheme a,
	sugo_train_scheme_ponit_info b 
WHERE
	a.id = b.scheme_id 
	AND a.id IN ( SELECT scheme_id FROM sugo_train_scheme_ponit_info WHERE zmdm = '23' AND zmlx = 'start' );

# 查一对多的方法，使用自连接
SELECT
	a.*,
	b.* 
FROM
	sugo_train_scheme a,
	sugo_train_scheme_ponit_info b,
	sugo_train_scheme_ponit_info c 
WHERE
	a.id = b.scheme_id 
	AND b.scheme_id = c.scheme_id 
	AND c.zmdm = '23' 
	AND c.zmlx = 'start';

# 查一对多的方法，使用 exists，一次查询不能顺带查出线路表
SELECT
	* 
FROM
	sugo_train_scheme a
WHERE
	EXISTS ( SELECT * FROM sugo_train_scheme_ponit_info b WHERE b.scheme_id=a.id and b.zmdm = '23' AND b.zmlx = 'start' )