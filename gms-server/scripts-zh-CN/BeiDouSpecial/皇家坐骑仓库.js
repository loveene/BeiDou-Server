var status = -1;
var 坐骑ID = [];

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
        return;
    }

    if (mode == 1)
        status++;
    else
        status--;

    if (status == 0) {
        坐骑ID = 获取坐骑ID数组();

        if (坐骑ID.length === 0) {
            cm.sendOk("你还没有任何可用的坐骑记录！");
            cm.dispose();
            return;
        }

        var text = "请选择需要更换的坐骑：\r\n";
        for (var i = 0; i < 坐骑ID.length; i++) {
            text += "#L" + i + "# #v" + 坐骑ID[i] + "#\r\n";
        }
        cm.sendSimple(text);
    }
    else if (status == 1) {
        var rideId = parseInt(坐骑ID[selection]);
        if (isNaN(rideId)) {
            cm.sendOk("坐骑 ID 无效，无法切换。");
            cm.dispose();
            return;
        }
        cm.getPlayer().setSkillzq(rideId);
        cm.sendOk("#b更换坐骑成功！");
        cm.dispose();
    }
}

function 获取坐骑ID数组() {
    var 坐骑ID数组 = [];
    try {
        var DatabaseConnection = Packages.org.gms.util.DatabaseConnection;
        var connection = DatabaseConnection.getConnection();
        var sql = "SELECT points FROM bossrank2 WHERE cid = ? AND bossname = '坐骑'";
        var ps = connection.prepareStatement(sql);
        ps.setInt(1, cm.getPlayer().getId());
        var rs = ps.executeQuery();

        while (rs.next()) {
            坐骑ID数组.push(rs.getString("points"));
        }

        rs.close();
        ps.close();
        connection.close();
    } catch (e) {
        cm.sendOk("读取坐骑数据出错：" + e);
    }
    return 坐骑ID数组;
}
