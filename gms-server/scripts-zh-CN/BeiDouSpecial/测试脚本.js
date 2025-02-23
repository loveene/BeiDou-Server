function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
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
            var text = "";
            text += "  #v4021006#       #e#r欢迎来到吸怪特权    #v4021006#k#n\r\n";
            text += "#r#e----------------------------------------------#k#n\r\n";
            if (cm.getPlayer().get吸怪特权() == 0) {
                text += "\t\t\t\t目前状态：[关闭]\r\n";
                text += "\t\t\t\t人物坐标：[x：" + cm.getPlayer().getPosition().x + "  y：" + cm.getPlayer().getPosition().y + "]\r\n";
            } else {
                text += "\t\t\t\t目前状态：[开启]\r\n";
            }
            text += "        #L1##k#d< < <开启吸怪> > >#l\r\n";
            text += "        #L2##k#r< < <关闭吸怪> > >#l\r\n\r\n";
            cm.sendSimple(text); // 确保选项可点击
        } else if (status == 1) {
            if (selection == 1) {
                cm.sendOk("开启吸怪中！");
                cm.开启吸怪();
                cm.dispose();
            } else if (selection == 2) {
                cm.sendOk("关闭吸怪中！");
                cm.关闭吸怪();
                cm.dispose();
            } else {
                cm.sendOk("无效的选择，请重试！");
                cm.dispose();
            }
        }
    }
}