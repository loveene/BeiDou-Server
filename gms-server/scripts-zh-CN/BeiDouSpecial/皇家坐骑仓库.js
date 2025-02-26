
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
var 坐骑ID = []; // 声明全局变量

function start() {
status = -1;
action(1, 0, 0);
}

function action(mode, type, selection) {
if (mode == -1) {
cm.dispose();
} else {
if (mode == 1)
status++;
else
status--;
if (status == -1) {
cm.dispose();
}
else if (status == 0) {
var text = "请选择需要更换的坐骑\r\n";
坐骑ID = 获取坐骑ID数组();
for (var i = 0; i < 坐骑ID.length; i++) {
text += "#L" + i + "# #v" + 坐骑ID[i] + "#\r\n";
}
cm.sendSimple(text);
}
else if (status == 1) {
// 确保转换为数字，如果需要
var rideId = parseInt(坐骑ID[selection]);
// 打印调试信息（如服务器允许）
// cm.说明("切换到坐骑ID：" + rideId);
cm.getPlayer().setSkillzq(rideId);
cm.sendOk("#b更换坐骑成功！");
cm.dispose(); // 结束对话
}
}
}

function 获取坐骑ID数组(){
var DatabaseConnection = Packages.org.gms.util.DatabaseConnection;
var connection = DatabaseConnection.getConnection();
var sql = "SELECT * FROM bossrank2 WHERE cid = ?";
var ps = connection.prepareStatement(sql);
ps.setInt(1, cm.getPlayer().getId());
var rs = ps.executeQuery();
var 坐骑ID数组 = [];
while (rs.next()) {
坐骑ID数组.push(rs.getString("points"));
}
rs.close();
ps.close();
connection.close();
return 坐骑ID数组;
}