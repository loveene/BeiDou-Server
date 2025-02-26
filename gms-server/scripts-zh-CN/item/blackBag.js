function start() {
    // 获取当前吸怪特权状态
    var is吸怪开启 = im.getPlayer().get吸怪特权() == 1;

    if (is吸怪开启) {
        // 如果当前是开启状态，则关闭吸怪特权
        im.关闭吸怪();
    } else {
        // 如果当前是关闭状态，则开启吸怪特权
        im.开启吸怪();
    }

    // 结束交互
    im.dispose();
}