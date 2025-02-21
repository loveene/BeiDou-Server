var status = -1;
var selectedGender = -1;
var selectedLevel = -1;

// 定义各等级血衣的材料和要求
var requirements = {
    0: { // 初级血衣
        level: 30,
        meso: 1000000,
        materials: [
            [4001126, 100, "枫叶"],  
            [4001006, 100, "火焰羽毛"],
            [4000016, 50, "红色蜗牛壳"],
            [4000000, 50, "蓝色蜗牛壳"],
            [4000011, 50, "蘑菇芽孢"]
        ],
        hp: 300,
        str: 3,
        dex: 3,
        int_: 3,   
        luk: 3
    },
    1: { // 中级血衣
        level: 50,
        meso: 3000000,
        materials: [
            [4001126, 300, "枫叶"],           
            [4001006, 300, "火焰羽毛"],
            [4000030, 100, "龙皮"],
            [4000115, 100, "齿轮"],        
            [1050018, 1, "初级男性血衣"],
            [1051017, 1, "初级女性血衣"]
        ],
        hp: 500,
        str: 5,
        dex: 5,
        int_: 5,   
        luk: 5
    },
    2: { // 高级血衣
        level: 70,
        meso: 5000000,
        materials: [
            [4001126, 800, "枫叶"],     
            [4001006, 800, "火焰羽毛"],
            [4000285, 150, "红腰带"],
            [4000379, 150, "绿色精华"],
            [4000296, 150, "蘑菇芽"],
            [1050018, 1, "中级男性血衣"],
            [1051017, 1, "中级女性血衣"]
        ],
        hp: 800,
        str: 10,
        dex: 10,
        int_: 10,   
        luk: 10
    }
};

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else if (mode == 0) {
        status--;
        if (status < 0) {
            cm.dispose();
            return;
        }
    } else {
        cm.dispose();
        return;
    }

    if (status == 0) {
        var text = "#e#r血衣制作中心#k#n\r\n";
        text += "#L0##v1050018##b制作男性血衣#l\r\n";
        text += "#L1##v1051017##b制作女性血衣#l\r\n";
        cm.sendSimple(text);
    } else if (status == 1) {
        selectedGender = selection;
        
        // 检查玩家已有的血衣等级
        var currentLevel = checkCurrentBloodyLevel(selectedGender);
        
        var text = "#e#r血衣制作中心#k#n\r\n";
        text += "#b当前血衣等级: " + (currentLevel == -1 ? "未制作" : "第" + (currentLevel + 1) + "级") + "#k\r\n\n";
        
        // 显示所有等级的血衣信息
        text += "#L0##v" + (selectedGender == 0 ? 1050018 : 1051017) + "##b制作初级血衣 (HP+300)#l\r\n";
        text += showRequirements(0, selectedGender) + "\r\n";
        
        text += "#L1##v" + (selectedGender == 0 ? 1050018 : 1051017) + "##b制作中级血衣 (HP+500)#l\r\n";
        text += showRequirements(1, selectedGender) + "\r\n";
        
        text += "#L2##v" + (selectedGender == 0 ? 1050018 : 1051017) + "##b制作高级血衣 (HP+800)#l\r\n";
        text += showRequirements(2, selectedGender) + "\r\n";
        
        cm.sendSimple(text);
    } else if (status == 2) {
        selectedLevel = selection;
        
        // 检查是否满足前置条件
        var currentLevel = checkCurrentBloodyLevel(selectedGender);
        if (selectedLevel > 0 && currentLevel < selectedLevel - 1) {
            cm.sendOk("你需要先制作" + getLevelName(selectedLevel - 1) + "血衣才能制作" + getLevelName(selectedLevel) + "血衣！");
            cm.dispose();
            return;
        }
        
        // 检查各种条件
        if (!checkRequirements(selectedLevel, selectedGender)) {
            cm.dispose();
            return;
        }
        
        // 确认制作提示
        var text = "你确定要制作" + getLevelName(selectedLevel) + "血衣吗？\r\n\n";
        text += "需要材料：\r\n" + showRequirements(selectedLevel, selectedGender);
        cm.sendYesNo(text);
    } else if (status == 3) {
        // 再次检查条件（防止确认过程中条件发生变化）
        if (!checkRequirements(selectedLevel, selectedGender)) {
            cm.dispose();
            return;
        }

        // 制作装备
        var stats = {
            "hp": requirements[selectedLevel].hp,
            "str": requirements[selectedLevel].str,
            "dex": requirements[selectedLevel].dex,
            "int": requirements[selectedLevel].int_,
            "luk": requirements[selectedLevel].luk,
            "wdef": 50,
            "mdef": 50,
            "upgradeSlots": 7
        };

        // 扣除材料和金币
        deductRequirements(selectedLevel, selectedGender);

        // 给予新装备
        var itemId = selectedGender == 0 ? 1050018 : 1051017;
        cm.gainItemWithStats(itemId, stats);

        cm.sendOk("#e#r恭喜您！#n#k\r\n成功制作了#v" + itemId + "##b" + getLevelName(selectedLevel) + 
                  (selectedGender == 0 ? "男性" : "女性") + "血衣#k！\r\n" +
                  "属性：\r\n" +
                  "HP: +" + stats.hp + "\r\n" +
                  "力量: +" + stats.str + "\r\n" +
                  "敏捷: +" + stats.dex + "\r\n" +
                  "智力: +" + stats.int + "\r\n" +
                  "运气: +" + stats.luk);
        cm.dispose();
    }
}

function checkCurrentBloodyLevel(gender) {
    var itemId = gender == 0 ? 1050018 : 1051017;
    var level = -1;
    
    // 检查玩家身上的血衣
    for (var i = 2; i >= 0; i--) {
        if (hasBloodyClotheWithHP(itemId, requirements[i].hp)) {
            level = i;
            break;
        }
    }
    return level;
}

function hasBloodyClotheWithHP(itemId, hp) {
    var inv = cm.getInventory(1);
    for (var i = 0; i <= inv.getSlotLimit(); i++) {
        var item = inv.getItem(i);
        if (item != null && item.getItemId() == itemId && item.getHp() == hp) {
            return true;
        }
    }
    return false;
}

function showRequirements(level, gender) {
    var req = requirements[level];
    var text = "#e需求：#n\r\n";
    text += "等级要求：" + req.level + "\r\n";
    text += "金币要求：" + req.meso + "\r\n";
    text += "材料要求：\r\n";
    
    for (var i = 0; i < req.materials.length; i++) {
        if ((req.materials[i][0] == 1050018 || req.materials[i][0] == 1051017) && 
            req.materials[i][0] != (gender == 0 ? 1050018 : 1051017)) {
            continue;
        }
        text += "#v" + req.materials[i][0] + "# " + req.materials[i][2] + " x " + req.materials[i][1] + "\r\n";
    }
    
    text += "\n#e获得属性：#n\r\n";
    text += "HP: +" + req.hp + "\r\n";
    text += "力量: +" + req.str + "\r\n";
    text += "敏捷: +" + req.dex + "\r\n";
    text += "智力: +" + req.int_ + "\r\n";
    text += "运气: +" + req.luk + "\r\n";
    
    return text;
}

function checkRequirements(level, gender) {
    var req = requirements[level];
    
    // 检查等级
    if (cm.getPlayer().getLevel() < req.level) {
        cm.sendOk("等级不足，需要达到 " + req.level + " 级。");
        return false;
    }
    
    // 检查金币
    if (cm.getMeso() < req.meso) {
        cm.sendOk("金币不足，需要 " + req.meso + " 金币。");
        return false;
    }
    
    // 检查材料
    for (var i = 0; i < req.materials.length; i++) {
        if ((req.materials[i][0] == 1050018 || req.materials[i][0] == 1051017) && 
            req.materials[i][0] != (gender == 0 ? 1050018 : 1051017)) {
            continue;
        }
        if (!cm.haveItem(req.materials[i][0], req.materials[i][1])) {
            cm.sendOk("材料不足：需要 " + req.materials[i][2] + " x " + req.materials[i][1]);
            return false;
        }
    }
    
    // 检查背包空间
    if (cm.getInventory(1).getNextFreeSlot() <= -1) {
        cm.sendOk("装备栏空间不足，请清理背包。");
        return false;
    }
    
    return true;
}

function deductRequirements(level, gender) {
    var req = requirements[level];
    
    // 扣除金币
    cm.gainMeso(-req.meso);
    
    // 扣除材料
    for (var i = 0; i < req.materials.length; i++) {
        if ((req.materials[i][0] == 1050018 || req.materials[i][0] == 1051017) && 
            req.materials[i][0] != (gender == 0 ? 1050018 : 1051017)) {
            continue;
        }
        cm.gainItem(req.materials[i][0], -req.materials[i][1]);
    }
}

function getLevelName(level) {
    switch(level) {
        case 0: return "初级";
        case 1: return "中级";
        case 2: return "高级";
        default: return "";
    }
}
