//% weight=20 color=#FFA500 icon="O" block="OLED_CPE" icon="\uf085"
namespace OLED_CPE {
    let x = 0
    let y = 0
    let buf: Buffer = pins.createBuffer(1024)

    function cmd(c: number) {
        pins.i2cWriteNumber(60, 0, NumberFormat.UInt8BE)
        pins.i2cWriteNumber(60, c, NumberFormat.UInt8BE)
    }

    function sendData() {
        pins.i2cWriteNumber(60, 0x40, NumberFormat.UInt8BE)
        OLED_CPE.init();
        OLED_CPE.showString("Hello!");

    }

    //% blockId="OLED_CPE_SHOWSTRING" block="OLED show string %s"
    //% weight=100 blockGap=8
    //% parts=OLED_CPE trackArgs=0
    export function showString(s: string) {
        let i = 0
        while (i < s.length) {
            buf[i] = s.charCodeAt(i)
            i++
        }
        sendData()
    }

    //% blockId="OLED_CPE_SHOWNUMBER" block="OLED show number %n"
    //% weight=90 blockGap=8
    //% parts=OLED_CPE
    export function showNumber(n: number) {
        showString(n.toString())
    }

    //% blockId="OLED_CPE_PIXEL" block="set pixel at x %x|y %y|color %color"
    //% weight=70 blockGap=8
    //% parts=OLED_CPE trackArgs=0
    export function pixel(x: number, y: number, color: number = 1) {
        let index = (x + y * 128) >> 3
        let bit = y % 8
        if (color)
            buf[index] |= (1 << bit)
        else
            buf[index] &= ~(1 << bit)
        sendData()
    }

    //% blockId="OLED_CPE_CLEAR" block="clear OLED screen"
    //% weight=60 blockGap=8
    //% parts=OLED_CPE
    export function clear() {
        for (let i = 0; i < 1024; i++) {
            buf[i] = 0
        }
        sendData()
    }

    //% blockId="OLED_CPE_INIT" block="initialize OLED"
    //% weight=110 blockGap=8
    //% parts=OLED_CPE
    export function init() {
        cmd(0xAE)
        cmd(0xD5)
        cmd(0x80)
        cmd(0xA8)
        cmd(0x3F)
        cmd(0xD3)
        cmd(0x00)
        cmd(0x40)
        cmd(0x8D)
        cmd(0x14)
        cmd(0x20)
        cmd(0x00)
        cmd(0xA1)
        cmd(0xC8)
        cmd(0xDA)
        cmd(0x12)
        cmd(0x81)
        cmd(0xCF)
        cmd(0xD9)
        cmd(0xF1)
        cmd(0xDB)
        cmd(0x40)
        cmd(0xA4)
        cmd(0xA6)
        cmd(0xAF)
        clear()
    }
}
