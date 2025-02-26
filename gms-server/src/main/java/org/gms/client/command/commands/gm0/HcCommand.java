/*
    This file is part of the HeavenMS MapleStory Server, commands OdinMS-based
    Copyleft (L) 2016 - 2019 RonanLana

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package org.gms.client.command.commands.gm0;

import org.gms.client.Client;
import org.gms.client.Character;
import org.gms.client.command.Command;
import org.gms.util.I18nUtil;

/**
 * @Author: Roo - 添加快速传送到自由命令
 */
public class HcCommand extends Command {
    {
        setDescription(I18nUtil.getMessage("HcCommand.message1", "快速传送到商城"));
    }

    @Override
    public void execute(Client client, String[] params) {
        Character player = client.getPlayer();
        
        // 传送玩家到商城地图（地图ID：910000000）
        player.changeMap(910000000);
        
        // 发送成功消息
        player.dropMessage(5, "已成功传送到商城！");
    }
}