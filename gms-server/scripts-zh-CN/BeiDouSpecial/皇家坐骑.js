/*
NPC Name: 皇家骑宠抽奖NPC
Map(s): 示例地图
Description: 抽取/管理皇家坐骑。适配 Nashorn/GraalVM JavaScript 引擎。
*/

//------------------------------
// 全局变量、装饰字串等
var FY0 = "┏━━━━━━━━━━━━━━━━━━━━━━━┓";
var FY1 = "┃      - FtMs -     ┃";
var FY2 = "┃  脚本仿制 　定制脚本 ┃";
var FY3 = "┃  技术支持 　游戏顾问 ┃";
var FY4 = "┃  ＷＺ添加 　地图制作 ┃";
var FY5 = "┃  售登陆器 　售下载器 ┃";
var FY6 = "┣━━━━━━━━━━━━━━━━━━━━━━━┫";
var FY7 = "┃  唯一QQ: 303765282 ┃";
var FY8 = "┗━━━━━━━━━━━━━━━━━━━━━━━┛";

var status = -1;
var 随;
var itemds = [1932002, 1932005]; // 坐骑 ID 数组，可根据需要扩充
var random = true;

//------------------------------
// NPC对话入口
function start() {
    status = -1;
    action(1, 0, 0);
}

//------------------------------
// NPC对话流程
function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
        return;
    }
    if (status >= 0 && mode == 0) {
        cm.sendOk("感谢你的光临！");
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (status == 0) {
        // 教授坐骑相关技能（例如雪人技能，用于显示坐骑外观）
        cm.teachSkill(1017, 1, 1, -1); // 1017 假设为雪人技能ID
        if (cm.getJob() >= 2000 && cm.getJob() <= 2112 && !cm.hasSkill(20001017)) {
            cm.teachSkill(20001017, 1, 1, -1);
        }
        // 构造对话文本
        var text = "";
        text += "#r皇家骑宠抽奖NPC欢迎您的光临！\r\n";
        text += "#d注意：此骑宠为技能骑宠，使用后请打开技能面板查看。\r\n";
        text += "★当前点券：#r" + cm.getPlayer().getCashShop().getCash(1) + "#k\r\n\r\n";
        text += "#L1##r抽取皇家坐骑 需求：1000点券#l\r\n";
        text += "#L2##r打开皇家坐骑仓库#l\r\n";
        text += "#L3##k#e查看可选骑宠种类#l\r\n";
        cm.sendSimple(text);
    } else if (status == 1) {
        if (selection == 1) {
            // 玩家选择抽取坐骑
            if (cm.getPlayer().getCashShop().getCash(1) >= 1000) {
                // 随机抽取一个坐骑ID
                var 随 = Math.floor(Math.random() * itemds.length);
                var 坐骑ID = itemds[随];
                // 设置玩家对应的骑宠技能（系统需支持 setSkillzq 方法）
                cm.getPlayer().setSkillzq(坐骑ID);

                var 玩家ID = cm.getPlayer().getId();
                var 玩家姓名 = cm.getPlayer().getName();
                // 数据库操作：查询玩家是否已有此坐骑记录
                var 累计数量 = 获取坐骑数量(玩家ID, 坐骑ID);
                if (累计数量 == -1) {
                    // 没有记录则插入
                    插入坐骑记录(玩家ID, 玩家姓名, 坐骑ID);
                } else {
                    // 已有记录则更新获得次数
                    更新坐骑数量(玩家ID, 坐骑ID, 累计数量 + 1);
                }
                // 扣除1000点券
                cm.getPlayer().getCashShop().gainCash(1, -1000);
                cm.sendOk("抽取成功！\r\n请打开技能面板使用雪人技能查看。\r\n您获得的坐骑：#v" + 坐骑ID + "#");
                cm.dispose();
            } else {
                cm.sendOk("您的点券不足，当前剩余点券：" + cm.getPlayer().getCashShop().getCash(1));
                cm.dispose();
            }
        } else if (selection == 2) {
           
            // 打开坐骑仓库
			    openNpc("皇家坐骑仓库");
        } else if (selection == 3) {
            // 查看可选骑宠种类
            cm.sendOk("#r#e当前可选骑宠种类如下：\r\n\r\n#v1932002#   #v1932005#");
            cm.dispose();
        }
    }
}

function openNpc(scriptName) {
    cm.dispose();
    cm.openNpc(9900001, scriptName);
}
//===============================
// 数据库操作函数

// 查询玩家某个坐骑的获得次数，如果不存在返回 -1
function 获取坐骑数量(玩家ID, 坐骑ID) {
    var connection = null;
    var preparedStatement = null;
    var resultSet = null;
    try {
		var DatabaseConnection = Packages.org.gms.util.DatabaseConnection; // 这里要用正确的包路径
connection = DatabaseConnection.getConnection();
        // connection = cm.getCnonection();
        var sql = "SELECT count FROM bossrank2 WHERE cid = ? AND points = ?";
        preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setInt(1, 玩家ID);
        preparedStatement.setInt(2, 坐骑ID);
        resultSet = preparedStatement.executeQuery();
        if (resultSet.next()) {
            return resultSet.getInt("count");
        }
    } catch (e) {
        handleException(e, "数据库查询失败：");
    } finally {
        if (resultSet != null) resultSet.close();
        if (preparedStatement != null) preparedStatement.close();
        if (connection != null) connection.close();
    }
    return -1;
}

// 插入一条新坐骑记录（初次获得时调用）
function 插入坐骑记录(玩家ID, 玩家姓名, 坐骑ID) {
    var connection = null;
    var preparedStatement = null;
    try {
	var DatabaseConnection = Packages.org.gms.util.DatabaseConnection;	
connection = DatabaseConnection.getConnection();
     //   connection = cm.getConnection();
        var sql = "INSERT INTO bossrank2 (cid, cname, bossname, points, count) VALUES (?, ?, ?, ?, ?)";
        preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setInt(1, 玩家ID);
        preparedStatement.setString(2, 玩家姓名);
        preparedStatement.setString(3, "皇家坐骑");
        preparedStatement.setInt(4, 坐骑ID);
        preparedStatement.setInt(5, 1); // 初始次数为 1
        preparedStatement.executeUpdate();
    } catch (e) {
        handleException(e, "数据库插入失败：");
    } finally {
        if (preparedStatement != null) preparedStatement.close();
        if (connection != null) connection.close();
    }
}

// 更新某个坐骑记录的获得次数
function 更新坐骑数量(玩家ID, 坐骑ID, 新数量) {
    var connection = null;
    var preparedStatement = null;
    try {
       var DatabaseConnection = Packages.org.gms.util.DatabaseConnection;	
connection = DatabaseConnection.getConnection();
        var sql = "UPDATE bossrank2 SET count = ? WHERE cid = ? AND points = ?";
        preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setInt(1, 新数量);
        preparedStatement.setInt(2, 玩家ID);
        preparedStatement.setInt(3, 坐骑ID);
        preparedStatement.executeUpdate();
    } catch (e) {
        handleException(e, "数据库更新失败：");
    } finally {
        if (preparedStatement != null) preparedStatement.close();
        if (connection != null) connection.close();
    }
}

// 统一异常处理函数
function handleException(e, messagePrefix) {
    var errorMessage = (messagePrefix ? messagePrefix : "发生错误：") + e.toString();
    cm.getPlayer().dropMessage(5, errorMessage);
}
