/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>

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
package org.gms.net.server.channel.handlers;

import org.gms.client.Character;
import org.gms.client.Client;
import org.gms.client.inventory.Inventory;
import org.gms.client.inventory.InventoryType;
import org.gms.client.inventory.Item;
import org.gms.client.inventory.manipulator.InventoryManipulator;
import org.gms.config.GameConfig;
import org.gms.net.AbstractPacketHandler;
import org.gms.net.packet.InPacket;
import org.gms.net.server.Server;
import org.gms.server.ItemInformationProvider;
import org.gms.util.PacketCreator;


public final class InventoryMergeHandler extends AbstractPacketHandler {
    @Override
    public final void handlePacket(InPacket p, Client c) {
        Character chr = c.getPlayer();
        p.readInt(); // 读取时间戳（未使用）
        chr.getAutoBanManager().setTimestamp(2, Server.getInstance().getCurrentTimestamp(), 4);

        // 检查服务器配置是否启用物品整理功能
        if (!GameConfig.getServerBoolean("use_item_sort")) {
            c.sendPacket(PacketCreator.enableActions());
            return;
        }

        byte invType = p.readByte(); // 背包类型
        if (invType < 1 || invType > 5) {
            c.disconnect(false, false); // 非法背包类型，断开连接
            return;
        }

        InventoryType inventoryType = InventoryType.getByType(invType);
        Inventory inventory = c.getPlayer().getInventory(inventoryType);
        inventory.lockInventory(); // 加锁以防止并发问题

        try {
            //------------------- RonanLana's SLOT MERGER -----------------
            ItemInformationProvider ii = ItemInformationProvider.getInstance();
            Item srcItem, dstItem;

            // 物品合并逻辑
            for (short dst = 1; dst <= inventory.getSlotLimit(); dst++) {
                dstItem = inventory.getItem(dst);
                if (dstItem == null) {
                    continue;
                }
                for (short src = (short) (dst + 1); src <= inventory.getSlotLimit(); src++) {
                    srcItem = inventory.getItem(src);
                    if (srcItem == null) {
                        continue;
                    }
                    if (dstItem.getItemId() != srcItem.getItemId()) {
                        continue;
                    }
                    if (dstItem.getQuantity() == ii.getSlotMax(c, inventory.getItem(dst).getItemId())) {
                        break;
                    }

                    // GM 调试信息
                    if (c.getPlayer().isGM()) {
                        c.getPlayer().dropMessage("合并物品: src : " + (int) src + " dst : " + (int) dst + " ID：" + srcItem.getItemId());
                    }

                    InventoryManipulator.move(c, inventoryType, src, dst); // 合并物品
                }
            }

            //------------------------------------------------------------
            // 背包整理逻辑
            inventory = c.getPlayer().getInventory(inventoryType);
            boolean sorted = false;
            while (!sorted) {
                short freeSlot = inventory.getNextFreeSlot();
                if (freeSlot != -1) {
                    short itemSlot = -1;
                    for (short i = (short) (freeSlot + 1); i <= inventory.getSlotLimit(); i = (short) (i + 1)) {
                        if (inventory.getItem(i) != null) {
                            itemSlot = i;
                            break;
                        }
                    }
                    if (itemSlot > 0) {
                        // GM 调试信息
                        if (c.getPlayer().isGM()) {
                            c.getPlayer().dropMessage("整理物品: src : " + (int) itemSlot + " dst : " + (int) freeSlot + " ID：" + inventory.getItem(itemSlot).getItemId());
                        }

                        InventoryManipulator.move(c, inventoryType, itemSlot, freeSlot); // 移动物品
                    } else {
                        sorted = true;
                    }
                } else {
                    sorted = true;
                }
            }
        } finally {
            inventory.unlockInventory(); // 解锁背包
        }

        // 发送完成整理的通知
        c.sendPacket(PacketCreator.finishedSort(inventoryType.getType()));
        c.sendPacket(PacketCreator.enableActions());
    }
}