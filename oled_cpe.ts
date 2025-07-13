//% weight=20 color=#FFA500 icon="O" block="OLED_CPE" icon="\uf085"
namespace OLED_CPE {
    let buf: Buffer = pins.createBuffer(1024)
    const OLED_ADDR = 0x3C // I2C address

    // ฟอนต์ 5x8 (เฉพาะบางตัวอย่าง A–G)
    const font5x8: number[][] = [
        [0x00, 0x00, 0x00, 0x00, 0x00], // Space (ASCII 32)
        [0x7E, 0x11, 0x11, 0x11, 0x7E], // A
        [0x7F, 0x49, 0x49, 0x49, 0x36], // B
        [0x3E, 0x41, 0x41, 0x41, 0x22], // C
        [0x7F, 0x41, 0x41, 0x22, 0x1C], // D
        [0x7F, 0x49, 0x49, 0x49, 0x41], // E
        [0x7F, 0x09, 0x09, 0x09, 0x01], // F
        [0x3E, 0x41, 0x49, 0x49, 0x7A], // G
    ]

    function cmd(c: number) {
        pins.i2cWriteBuffer(OLED_ADDR, pins.createBufferFromArray([0x00, c]))
    }

    function sendData() {
        let sendBuf = pins.createBuffer(buf.length + 1)
        sendBuf[0] = 0x40
        for (let i = 0; i < buf.length; i++) {
            sendBuf[i + 1] = buf[i]
        }
        pins.i2cWriteBuffer(OLED_ADDR, sendBuf)
    }

    function pixelSet(x: number, y: number, color: number = 1) {
        if (x < 0 || x >= 128 || y < 0 || y >= 64) return
        const index = x + ((y >> 3) * 128)
        const bit = y % 8
        if (color)
            buf[index] |= (1 << bit)
        else
            buf[index] &= ~(1 << bit)
    }

    function drawChar(c: string, xpos: number, ypos: number = 0) {
        const ascii = c.charCodeAt(0)
        if (ascii < 32 || ascii > 127) return
        const glyph = font5x8[ascii - 32]
        for (let col = 0; col < 5; col++) {
            let line = glyph[col]
            for (let row = 0; row < 8; row++) {
                pixelSet(xpos + col, ypos + row, (line >> row) & 0x01)
            }
        }
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

    //% blockId="OLED_CPE_CLEAR" block="clear OLED screen"
    //% weight=60 blockGap=8
    //% parts=OLED_CPE
    export function clear() {
        for (let i = 0; i < 1024; i++) {
            buf[i] = 0
        }
        sendData()
    }

    //% blockId="OLED_CPE_PIXEL" block="set pixel at x %x|y %y|color %color"
    //% weight=70 blockGap=8
    //% parts=OLED_CPE
    export function pixel(x: number, y: number, color: number = 1) {
        pixelSet(x, y, color)
        sendData()
    }

    //% blockId="OLED_CPE_SHOWSTRING" block="OLED show string %s"
    //% weight=100 blockGap=8
    //% parts=OLED_CPE
    export function showString(s: string) {
        clear()
        for (let i = 0; i < s.length; i++) {
            drawChar(s.charAt(i), i * 6, 0)
        }
        sendData()
    }

    //% blockId="OLED_CPE_SHOWNUMBER" block="OLED show number %n"
    //% weight=90 blockGap=8
    //% parts=OLED_CPE
    export function showNumber(n: number) {
        showString(n.toString())
    }
}
