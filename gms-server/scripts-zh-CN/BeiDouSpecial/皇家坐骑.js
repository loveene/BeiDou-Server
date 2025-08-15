var status = -1;
var 随;
var itemds = [1932002, 1932005]; // 坐骑 ID 数组

function start() {
    status = -1;
    action(1, 0, 0);
}

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
    if (mode == 1) status++;
    else status--;

    if (status == 0) {
        // 确保玩家有骑乘技能（根据职业发对应技能）
        cm.teachSkill(1017, 1, 1, -1); // 初心者版本
        if (cm.getJob() >= 2000 && cm.getJob() <= 2112 && !cm.hasSkill(20001017)) {
            cm.teachSkill(20001017, 1, 1, -1); // 战神/骑士团版本
        }

        var text = "";
        text += "#r皇家骑宠抽奖NPC欢迎您的光临！\r\n";
        text += "#d注意：此骑宠为技能骑宠，使用后请打开技能面板查看（骑乘技能：#r1017/20001017#d）。\r\n";
        text += "★当前点券：#r" + cm.getPlayer().getCashShop().getCash(1) + "#k\r\n\r\n";
        text += "#L1##r抽取皇家坐骑 需求：1000点券#l\r\n";
        text += "#L2##r打开皇家坐骑仓库#l\r\n";
        text += "#L3##k#e查看可选骑宠种类#l\r\n";
        cm.sendSimple(text);

    } else if (status == 1) {
        if (selection == 1) {
            if (cm.getPlayer().getCashShop().getCash(1) >= 1000) {
                var 随 = Math.floor(Math.random() * itemds.length);
                var 坐骑ID = itemds[随];
                var 角色ID = cm.getPlayer().getId();
                var 角色名 = cm.getPlayer().getName();

                if (!是否已有坐骑_bossrank2(角色ID, 坐骑ID)) {
                    插入或累计坐骑记录_bossrank2(角色ID, 角色名, 坐骑ID, 1); // 不存在则插入，存在则+1
                } else {
                    插入或累计坐骑记录_bossrank2(角色ID, 角色名, 坐骑ID, 1); // 已存在则 count+1（可按需改成不加）
                }

                // 设置当前使用的坐骑ID（你的 getSkillzq() 会从 BossLog1 读取）
                cm.getPlayer().setSkillzq(坐骑ID);

                // 扣费
                cm.getPlayer().getCashShop().gainCash(1, -1000);

                cm.sendOk("抽取成功！\r\n请打开技能面板使用骑乘技能（雪人/骑宠技能）查看。\r\n您获得/累计的坐骑：#v" + 坐骑ID + "#");
                cm.dispose();
            } else {
                cm.sendOk("您的点券不足，当前剩余点券：" + cm.getPlayer().getCashShop().getCash(1));
                cm.dispose();
            }

        } else if (selection == 2) {
            // 打开坐骑仓库（记得把那个脚本里的查询也改到 bossrank2）
            openNpc("皇家坐骑仓库");

        } else if (selection == 3) {
            cm.sendOk("#r#e当前可选骑宠种类如下：\r\n\r\n#v1932002#   #v1932005#");
            cm.dispose();
        }
    }
}

function openNpc(scriptName) {
    cm.dispose();
    cm.openNpc(9900001, scriptName);
}

/**
 * bossrank2 结构约定：
 *   cid      : 角色ID
 *   cname    : 角色名
 *   bossname : 固定写 '坐骑'
 *   points   : 坐骑ID
 *   count    : 拥有/抽取次数（按需）
 */

// 是否已有该坐骑记录（bossrank2）
function 是否已有坐骑_bossrank2(cid, 坐骑ID) {
    var connection = null, ps = null, rs = null;
    try {
        var DatabaseConnection = Packages.org.gms.util.DatabaseConnection;
        connection = DatabaseConnection.getConnection();
        var sql = "SELECT id FROM bossrank2 WHERE cid = ? AND bossname = '坐骑' AND points = ?";
        ps = connection.prepareStatement(sql);
        ps.setInt(1, cid);
        ps.setInt(2, 坐骑ID); // 用整数更稳
        rs = ps.executeQuery();
        if (rs.next()) {
            return true;
        }
    } catch (e) {
        handleException(e, "数据库查询失败：");
    } finally {
        try { if (rs) rs.close(); } catch (ee) { }
        try { if (ps) ps.close(); } catch (ee) { }
        try { if (connection) connection.close(); } catch (ee) { }
    }
    return false;
}

// 插入新坐骑或累加次数（bossrank2）
function 插入或累计坐骑记录_bossrank2(cid, cname, 坐骑ID, 累计次数) {
    var connection = null, ps = null;
    try {
        var DatabaseConnection = Packages.org.gms.util.DatabaseConnection;
        connection = DatabaseConnection.getConnection();

        // 先尝试更新（存在则 count += 累计次数）
        var updateSql = "UPDATE bossrank2 SET count = count + ? WHERE cid = ? AND bossname = '坐骑' AND points = ?";
        ps = connection.prepareStatement(updateSql);
        ps.setInt(1, 累计次数);
        ps.setInt(2, cid);
        ps.setInt(3, 坐骑ID);
        var updated = ps.executeUpdate();
        ps.close();

        if (updated === 0) {
            // 不存在则插入
            var insertSql = "INSERT INTO bossrank2 (cid, cname, bossname, points, count) VALUES (?, ?, '坐骑', ?, ?)";
            ps = connection.prepareStatement(insertSql);
            ps.setInt(1, cid);
            ps.setString(2, cname);
            ps.setInt(3, 坐骑ID);
            ps.setInt(4, 累计次数);
            ps.executeUpdate();
        }
    } catch (e) {
        handleException(e, "数据库写入失败：");
    } finally {
        try { if (ps) ps.close(); } catch (ee) { }
        try { if (connection) connection.close(); } catch (ee) { }
    }
}

// 错误处理
function handleException(e, msg) {
    cm.getPlayer().dropMessage(5, msg + e.toString());
}
