/* ==================
 脚本类型: 万能传送   
 脚本作者：汉堡  
 联系方式：北斗项目组
 =====================
 */

var bossmaps = Array(
    Array(230040420, 380000, "鱼王BOSS                  #r（消耗38万金币）#b"), 
    Array(220080000, 380000, "闹钟BOSS                  #r（消耗38万金币）#b"), 
    Array(211042300, 380000, "扎昆BOSS                  #r（消耗38万金币）#b"),
    Array(702070400, 380000, "妖僧BOSS                  #r（消耗38万金币）#b"),
    Array(541020700, 380000, "树精BOSS                  #r（消耗38万金币）#b"), 
    Array(105100100, 380000, "巨魔蝙蝠                  #r（消耗38万金币）#b"), 
    Array(240040700, 380000, "暗黑龙王                  #r（消耗38万金币）#b"),
    Array(270000100, 380000, "品克缤BOSS                #r（消耗38万金币）#b")
);

var monstermaps = Array(
    Array(104040000, 500, "射手训练场#r（500金币）#b　　 　　适合 1 ~ 15 级玩家", 0),
    Array(101010100, 580, "大木林#r（580金币）#b 　　　   　 适合 8 ~ 15 级玩家", 0),
    Array(103000101, 680, "地铁<第1地区>#r（680金币）#b　  　适合 20 ~ 25 级玩家", 10),
    Array(220010500, 780, "露台大厅#r（780金币）#b           适合 25 ~ 30 级玩家", 25),
    Array(101030001, 880, "野猪的领土Ⅱ#r（880金币）#b　 　  适合 25 ~ 35 级玩家", 25),
    Array(103000105, 980, "地铁<第4地区>#r（980金币）#b　  　适合 35 ~ 50 级玩家", 35),
    Array(100040103, 1080, "猴子森林Ⅱ#r（1080金币）#b 　　　 适合 35 ~ 50 级玩家", 35),
    Array(220040000, 1180, "时间之路1#r（1180金币）#b　 　　　适合 45 ~ 60 级玩家", 45),
    Array(105040306, 1280, "巨人之林#r（1280金币）#b　　 　 　适合 50 ~ 65 级玩家", 50),
    Array(250010304, 2280, "流浪熊的地盘#r（2280金币）#b 　 　适合 55 ~ 75 级玩家", 55),
    Array(251010402, 2380, "海盗团老巢2#r（2380金币）#b　　 　适合 65 ~ 75 级玩家", 65),
    Array(541010010, 2580, "幽灵船2#r（2580金币）#b　　　 　　适合 60 ~ 80 级玩家", 60),
    Array(600020300, 2680, "狼蛛洞穴#r（2680金币）#b　　　  　适合 80 ~ 90 级玩家", 80),
    Array(240010500, 2780, "山羊峡谷#r（2780金币）#b　　  　　适合 85 ~ 100 级玩家", 85),
    Array(230040100, 2880, "深海峡谷2#r（2880金币）#b　　 　　适合 90 ~ 100 级玩家", 90),
    Array(551030100, 2980, "阴森世界入口#r（2980金币）#b　　　适合 95 ~ 120 级玩家", 95),
    Array(240030102, 3080, "消失的树林#r（3080金币）#b　  　　适合 100 ~ 120 级玩家", 100),
    Array(240040511, 3280, "被遗忘的龙之巢#r（3280金币）#b  　适合 105 ~ 130 级玩家", 105),
    Array(541020000, 3580, "乌鲁城入口#r（3580金币）#b　　  　适合 105 ~ 150 级玩家", 105)
);

var townmaps = Array(
    Array(104000000, 500, "明珠港#r               （消耗5百金币）#b"),
    Array(100000000, 800, "射手村#r               （消耗8百金币）#b"),
    Array(101000000, 800, "魔法密林#r             （消耗8百金币）#b"),
    Array(102000000, 800, "勇士部落#r             （消耗8百金币）#b"),
    Array(103000000, 800, "废弃都市#r             （消耗8百金币）#b"),
    Array(120000000, 800, "诺特勒斯号码头#r       （消耗8百金币）#b"),
    Array(105040300, 1000, "林中之城#r             （消耗1千金币）#b"),
    Array(200000000, 1000, "天空之城#r             （消耗1千金币）#b"),
    Array(211000000, 5000, "冰峰雪域#r             （消耗5千金币）#b"),
    Array(230000000, 1000, "水下世界#r             （消耗1千金币）#b"),
    Array(222000000, 1000, "童话村#r               （消耗1千金币）#b"),
    Array(220000000, 5000, "玩具城#r               （消耗5千金币）#b"),
    Array(701000000, 5000, "东方神州#r             （消耗5千金币）#b"),
    Array(250000000, 5000, "武陵#r                 （消耗5千金币）#b"),
    Array(702000000, 1000, "少林寺#r               （消耗1千金币）#b"),
    Array(260000000, 500, "阿里安特#r             （消耗5百金币）#b"),
    Array(600000000, 500, "新叶城#r               （消耗5百金币）#b"),
    Array(240000000, 5000, "神木村#r               （消耗5千金币）#b"),
    Array(261000000, 1000, "马加提亚#r             （消耗1千金币）#b"),
    Array(221000000, 1000, "地球防御本部#r         （消耗1千金币）#b"),
    Array(251000000, 1000, "百草堂#r               （消耗1千金币）#b"),
    Array(701000200, 10000, "上海豫园#r             （消耗1万金币）#b"),
    Array(550000000, 10000, "吉隆大都市#r           （消耗1万金币）#b"),
    Array(130000000, 1000, "圣地#r                 （消耗1千金币）#b")
);

var fubenmaps = Array(
    Array(109080000, 0, "#b打椰子                   #r（获得北斗纪念币）#k "),
    Array(109040001, 0, "#b高地跳跳                 #r（获得北斗纪念币）#k "),
    Array(109030001, 0, "#b上楼                     #r（获得北斗纪念币）#k "),
    Array(109060000, 0, "#b滚雪球                   #r（获得北斗纪念币）#k "),
    Array(109010000, 0, "#b寻宝                     #r（获得北斗纪念币）#k ")
);

var status;
var chosenMap;
var mapType;

function start() {
    mapType = -1;
    let text = "尊贵的GM大人，您想去哪里呢？\r\n";
    text += "#L0#BOSS地图#l\r\n";
    text += "#L1#练级地图#l\r\n";
    text += "#L2#城镇地图#l\r\n";
    text += "#L3#活动地图#l\r\n";
    cm.sendSimple(text);
}

function action(mode, type, selection) {
    if (mode === 0) {
        cm.dispose();
        return;
    }
    if (mapType === -1) {
        mapType = selection;
        let text = "";
        if (mapType === 0) { // BOSS Maps
            for (let i = 0; i < bossmaps.length; i++) {
                text += "#L" + i + "#" + bossmaps[i][2] + "#l\r\n";
            }
        } else if (mapType === 1) { // Level-Up Maps
            for (let i = 0; i < monstermaps.length; i++) {
                text += "#L" + i + "#" + monstermaps[i][2] + " #k状态:[" + (cm.getLevel() >= monstermaps[i][3] ? "#r开放" : "#b封印-需等级:" + monstermaps[i][3] + "") + "]#l\r\n";
            }
        } else if (mapType === 2) { // Town Maps
            for (let i = 0; i < townmaps.length; i++) {
                text += "#L" + i + "#" + townmaps[i][2] + "#l\r\n";
            }
        } else if (mapType === 3) { // Event Maps
            for (let i = 0; i < fubenmaps.length; i++) {
                text += "#L" + i + "#" + fubenmaps[i][2] + "#l\r\n";
            }
        }
        cm.sendSimple(text);
    } else if (chosenMap === undefined) {
        chosenMap = selection;
        let mapArray;
        if (mapType === 0) mapArray = bossmaps;
        else if (mapType === 1) mapArray = monstermaps;
        else if (mapType === 2) mapArray = townmaps;
        else if (mapType === 3) mapArray = fubenmaps;

        if (mapType === 1 && cm.getLevel() < mapArray[chosenMap][3]) {
            cm.sendOk("对不起，等级不足 " + mapArray[chosenMap][3] + " 级才能进入该地图。");
            cm.dispose();
            return;
        }

        cm.sendYesNo("你确定要去 " + mapArray[chosenMap][2] + "? 需要 [#r" + mapArray[chosenMap][1] + " 金币#k]");
    } else {
        let mapArray;
        if (mapType === 0) mapArray = bossmaps;
        else if (mapType === 1) mapArray = monstermaps;
        else if (mapType === 2) mapArray = townmaps;
        else if (mapType === 3) mapArray = fubenmaps;

        if (cm.getMeso() < mapArray[chosenMap][1]) {
            cm.sendOk("对不起，你的金币不足 " + mapArray[chosenMap][1] + "。");
            cm.dispose();
            return;
        }

        cm.gainMeso(-mapArray[chosenMap][1]);
        cm.getPlayer().saveLocationOnWarp();
        cm.warp(mapArray[chosenMap][0]);
        cm.dispose();
    }
}