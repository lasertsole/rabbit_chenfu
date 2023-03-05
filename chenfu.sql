/*
 Navicat Premium Data Transfer

 Source Server         : moye
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : chenfu

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 05/03/2023 23:20:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for announcement
-- ----------------------------
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement`  (
  `title` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公告标题(长度不能超过30个字符)',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公告内容(最长1000字)',
  `publisher_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '公告发布时间'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of announcement
-- ----------------------------
INSERT INTO `announcement` VALUES ('开展内容整改专项行动', '作为平台企业，我们应当认真履行好企业主体责任，对网民负责、对社会负责。我们将组织全公司进行学习，全方位提高员工的思想觉悟，把对主体责任的认识作为企业纪律铁条，贯彻到日常工作中去。除了开展整改专项行动以外，我们还将主动配合有关部门加强对用户的正面引导和规范管理，制作和传播弘扬主旋律、正能量的内容，与行业内各平台一起推动行业健康发展，共同维护网络信息传播秩序，营造积极健康、风清气正的网络空间。', '2023-03-01 10:22:37');
INSERT INTO `announcement` VALUES ('关于开展抵制<<原神>>工作报告', '“我们的文化不是拿去让你们随便用的，这不好笑。”\r\n\r\n他们觉得丘丘人是反派，所以被妖魔化，借鉴他们的舞蹈是在将他们印第安人妖魔化。\r\n\r\n参考借鉴是属于正常的创作范围，就拿创作灵感来说，本身就需要有一个参考的范围。\r\n\r\n而印第安人的祭拜行为其实就很适合展开联想和思考，并不是歧视，反而更像是一种思考和借鉴。', '2023-03-01 10:35:15');

-- ----------------------------
-- Table structure for newwork
-- ----------------------------
DROP TABLE IF EXISTS `newwork`;
CREATE TABLE `newwork`  (
  `works` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '发表作品(唯一，防止抄袭)',
  `works_describe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作品描述',
  `author_profile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作者头像',
  `author_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作者名字',
  `appoint` int NOT NULL DEFAULT 0 COMMENT '点赞数',
  `author_id` int(32) UNSIGNED ZEROFILL NOT NULL COMMENT '用户唯一id,用于识别用户',
  `work_id` int(32) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT '作品唯一id',
  PRIMARY KEY (`work_id`) USING BTREE,
  UNIQUE INDEX `work_unique`(`works` ASC) USING BTREE COMMENT '保证作品唯一'
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of newwork
-- ----------------------------
INSERT INTO `newwork` VALUES ('/files/01130_9049698068.jpg', '孤独摇滚', '/files/b2d8197fb7606bc37383dc876487e846.png', '沉浮4', 517, 00000000000000000000000000000004, 00000000000000000000000000000001);
INSERT INTO `newwork` VALUES ('/files/145250_17005731512.jpg', '牵着我的手', '/files/ca2797d24566adfa7d3f6b04b7a1deb4.webp', '沉浮3', 34, 00000000000000000000000000000003, 00000000000000000000000000000002);
INSERT INTO `newwork` VALUES ('/files/16467_76799064315.jpg', '又生了个女儿~', '/files/ffa50974444fb502a28e4f783898d602.jpg', '沉浮1', 99, 00000000000000000000000000000001, 00000000000000000000000000000003);
INSERT INTO `newwork` VALUES ('/files/223136_49612231063.jpg', '都市龙娘', '/files/沉浮兔.png', '沉浮5', 210, 00000000000000000000000000000005, 00000000000000000000000000000004);
INSERT INTO `newwork` VALUES ('/files/f3baeca8589392d2923e6e65a37b245.jpg', '少女与海', '/files/chenfuProfile.jpg', '沉浮2', 88, 00000000000000000000000000000002, 00000000000000000000000000000005);

-- ----------------------------
-- Table structure for newwork_like
-- ----------------------------
DROP TABLE IF EXISTS `newwork_like`;
CREATE TABLE `newwork_like`  (
  `user_id` int(32) UNSIGNED ZEROFILL NOT NULL COMMENT '点赞用户id',
  `work_id` int(32) UNSIGNED ZEROFILL NOT NULL COMMENT '点赞作品id',
  PRIMARY KEY (`user_id`, `work_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of newwork_like
-- ----------------------------
INSERT INTO `newwork_like` VALUES (00000000000000000000000000000001, 00000000000000000000000000000001);
INSERT INTO `newwork_like` VALUES (00000000000000000000000000000001, 00000000000000000000000000000003);
INSERT INTO `newwork_like` VALUES (00000000000000000000000000000003, 00000000000000000000000000000003);
INSERT INTO `newwork_like` VALUES (00000000000000000000000000000004, 00000000000000000000000000000003);
INSERT INTO `newwork_like` VALUES (00000000000000000000000000000005, 00000000000000000000000000000002);

-- ----------------------------
-- Table structure for requirebox
-- ----------------------------
DROP TABLE IF EXISTS `requirebox`;
CREATE TABLE `requirebox`  (
  `title` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '需求标题',
  `describe_require` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '需求描述',
  `describe_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '需求描述图,可以为空',
  `money` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '价格范围',
  `tag` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '需求类型',
  `calendar` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '截稿日期',
  `id` int(32) UNSIGNED ZEROFILL NOT NULL COMMENT '用户唯一id,用于识别用户'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of requirebox
-- ----------------------------
INSERT INTO `requirebox` VALUES ('看看我家宝宝', '新接回来的女宝，画成萝莉少女御姐都可以。想吃一口饭饭', '/files/QQ图片20230221141946.png', '50-1500', '自设/OC', '2023-05-01', 00000000000000000000000000000001);
INSERT INTO `requirebox` VALUES ('黑白露肩头像', '两张人物头像，露肩膀，古风一男一女，头部需要简单的装饰，无需背景。会买断，价格可洽谈', '', '50-100', '头像', '2023-03-01', 00000000000000000000000000000002);
INSERT INTO `requirebox` VALUES ('bl古风双人氛围插', '国风插画，需要多张，要擅长国风的，需要试稿', '/files/85044_44453568709.jpg', '100-200', '插画', '2023-03-01', 00000000000000000000000000000003);

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session`  (
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '对话发表时间',
  `source_id` int(32) UNSIGNED ZEROFILL NOT NULL COMMENT '发话方唯一id',
  `target_id` int(32) UNSIGNED ZEROFILL NOT NULL COMMENT '目标方唯一id',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '对话内容'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of session
-- ----------------------------
INSERT INTO `session` VALUES ('2023-02-23 14:30:17', 00000000000000000000000000000001, 00000000000000000000000000000002, '我不是针对你');
INSERT INTO `session` VALUES ('2023-02-23 14:32:18', 00000000000000000000000000000001, 00000000000000000000000000000002, '我是说原神玩家都是辣鸡');
INSERT INTO `session` VALUES ('2023-02-23 14:32:48', 00000000000000000000000000000002, 00000000000000000000000000000001, '你说的对，但是《原神》是由米哈游自主研发的一款全新开放世界冒险游戏。游戏发生在一个被称作「提瓦特」的幻想世界，在这里，被神选中的人将被授予「神之眼」，导引元素之力。你将扮演一位名为「旅行者」的神秘角色，在自由的旅行中邂逅性格各异、能力独特的同伴们，和他们一起击败强敌，找回失散的亲人——同时，逐步发掘「原神」的真相。');
INSERT INTO `session` VALUES ('2023-02-23 17:33:01', 00000000000000000000000000000002, 00000000000000000000000000000001, '现在充160再送160，快来一起原吧');
INSERT INTO `session` VALUES ('2023-02-23 18:18:37', 00000000000000000000000000000003, 00000000000000000000000000000001, '先生、トイレに行ってもいいですか？');
INSERT INTO `session` VALUES ('2023-02-23 18:19:22', 00000000000000000000000000000001, 00000000000000000000000000000003, '駄 目 で す');
INSERT INTO `session` VALUES ('2023-02-23 18:19:36', 00000000000000000000000000000003, 00000000000000000000000000000001, 'ﾌﾞﾘﾌﾞﾘﾌﾞﾘﾌﾞﾘｭﾘｭﾘｭﾘｭﾘｭﾘｭ！！！！！！');

-- ----------------------------
-- Table structure for showcase
-- ----------------------------
DROP TABLE IF EXISTS `showcase`;
CREATE TABLE `showcase`  (
  `works` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '推荐作品',
  `author_profile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作者头像',
  `author_comment` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作者留言',
  `price` decimal(10, 2) NOT NULL COMMENT '作品价格(初价)',
  `sold_num` int NOT NULL COMMENT '已出售数量',
  `author_name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作者名字',
  `id` int(32) UNSIGNED ZEROFILL NOT NULL COMMENT '用户唯一id,用于识别用户'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of showcase
-- ----------------------------
INSERT INTO `showcase` VALUES ('/files/122045_64565599030.jpg', '/files/QQ图片20230221141828.jpg', '精美立绘固定价', 230.00, 25, '沉浮5', 00000000000000000000000000000001);
INSERT INTO `showcase` VALUES ('/files/132848_12887677513.jpg', '/files/03827_30706178703.webp', 'live2D,不急的可以进来', 1500.00, 23, '沉浮4', 00000000000000000000000000000002);
INSERT INTO `showcase` VALUES ('/files/chenfuworks.jpg', '/files/chenfuProfile.jpg', '下单1h出成品图', 998.00, 100, '沉浮1', 00000000000000000000000000000003);
INSERT INTO `showcase` VALUES ('/files/QQ图片20230221141919.jpg', '/files/沉浮兔.png', '出图快，并附赠live2D', 778.00, 50, '沉浮2', 00000000000000000000000000000004);
INSERT INTO `showcase` VALUES ('/files/QQ图片20230221141932.jpg', '/files/imageFont.png', '私信留言要求，24小时内回复，价格商定', 211.00, 25, '沉浮3', 00000000000000000000000000000005);

-- ----------------------------
-- Table structure for trends
-- ----------------------------
DROP TABLE IF EXISTS `trends`;
CREATE TABLE `trends`  (
  `id` int(32) UNSIGNED ZEROFILL NOT NULL COMMENT '用户唯一id,用于识别用户',
  `submited_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '用户发动态时间',
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `user_profile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作者头像',
  `user_recommend` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户留言',
  `user_photos` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户发表图片，可以为多张或空'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of trends
-- ----------------------------
INSERT INTO `trends` VALUES (00000000000000000000000000000001, '2023-02-22 15:32:52', '沉浮SAMA', '/files/03827_30706178703.webp', '又生了两个女儿', '/files/16467_76799064315.jpg;/files/132848_12887677513.jpg');
INSERT INTO `trends` VALUES (00000000000000000000000000000002, '2023-02-22 16:27:41', '超级沉浮人', '/files/ca2797d24566adfa7d3f6b04b7a1deb4.webp', '回收旧立绘，旧live2D，旧动图', NULL);
INSERT INTO `trends` VALUES (00000000000000000000000000000003, '2023-02-22 16:22:08', '5a51872311e41e5eb309907c094da9ed', '/files/8d6ccccbff41789d75751c54d41c0a3e.jpg', '完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿完结撒花✿✿ヽ(°▽°)ノ✿', '/files/1515_8654509424.jpg');

-- ----------------------------
-- Table structure for user_login
-- ----------------------------
DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login`  (
  `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户输入密码',
  `phone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户注册手机号码的哈希值',
  `profile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户头像',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '账号创建时间',
  `modify_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后一次修改时间',
  `token` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '令牌',
  `salt` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '盐值',
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名(初始值为随机值，用户自行更改)',
  `id` int(32) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT '用户唯一id',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_token`(`token` ASC) USING BTREE COMMENT 'token唯一',
  UNIQUE INDEX `unique_phone`(`phone` ASC) USING BTREE COMMENT 'phone唯一'
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_login
-- ----------------------------
INSERT INTO `user_login` VALUES ('a784259af7381de02157b0e097668db5', '19820482808', '/files/ffa50974444fb502a28e4f783898d602.jpg', '2023-02-28 21:14:10', '2023-03-05 22:31:43', 'bd37d3e98f086d6683655f2469b611f7', 'de34f0f880ee09d56a2df39b53e9534b', '沉浮1', 00000000000000000000000000000001);
INSERT INTO `user_login` VALUES ('350a7623174a8c86b1b107e97f293344', '19820482807', '/files/chenfuProfile.jpg', '2023-02-28 21:14:28', '2023-03-05 22:31:57', '712b606ca1216d2e6f33d391bd36e4b3', '930096f0c63a9ded00517d0f777d7b97', '沉浮2', 00000000000000000000000000000002);
INSERT INTO `user_login` VALUES ('91f404b4421bd7f5c0388753cdcf1fe8', '19820482806', '/files/ca2797d24566adfa7d3f6b04b7a1deb4.webp', '2023-02-28 21:14:41', '2023-03-05 22:32:09', 'c3969c0cfefe471de7f9d43ed22a3b4a', '77e932ae9524b0a0b6b1d2633458a5d0', '沉浮3', 00000000000000000000000000000003);
INSERT INTO `user_login` VALUES ('784e413312e2b37c20e3367f06665d93', '19820482809', '/files/b2d8197fb7606bc37383dc876487e846.png', '2023-03-05 22:29:44', '2023-03-05 22:32:17', '172e8eb73785bea8df382b382ab74f65', '2d986b41382f99a9ad4fe27847471bfa', '沉浮4', 00000000000000000000000000000004);
INSERT INTO `user_login` VALUES ('6b0a6a8183b70fffcd957718013ae2b1', '19820482810', '/files/沉浮兔.png', '2023-03-02 16:31:31', '2023-03-05 22:32:21', '4b653abd1540370f78cc8090509cebf5', '95136de22897b1998ab3efa1522868c0', '沉浮5', 00000000000000000000000000000005);

SET FOREIGN_KEY_CHECKS = 1;
