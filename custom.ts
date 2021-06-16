
/**
 * 使用此文件来定义自定义函数和图形块。
 * 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
 */

enum MyEnumColor {
    //% block="red"
    Red,
    //% block="yellow"
    Yellow,
    //% block="greeen"
    Greeen
}
enum MyEnumTime {
    //% block="hour"
    Hour,
    //% block="minute"
    Minute,
    //% block="second"
    Second
}

/**
 * 自定义图形块
 */
//% weight=100 color=#0fbc11 icon="" block="Traffic Light"
namespace custom {
    let addrI2C=0;
    
    let _beginHour:number=0;
    let _beginMinute:number=0;
    let _beginSecond:number=0;
    let _RTime:number=0;
    let _YTime:number=0;
    let _GTime:number=0;
    const LIGHT_INFINITY_TIME = 0xff;

    /**
     * TODO: 获取当前MCU时间
     * @param e 获取的数据
     * @param  NULL
     * @return 无返回
     */
    //% block="get now time %e"
    //% weight=99
    export function getNowTime(e:MyEnumTime): number {
        let buffer = readReg(0x0E,3);
        basic.pause(300)
        let data;
        switch(e){
            case MyEnumTime.Hour:
                data = buffer[0];
            break;
            case MyEnumTime.Minute:
                data = buffer[1];
            break;
            default:
                data = buffer[2];
        }

       return data
    }

    /**
     * TODO: 清除MCU时刻表，时刻表用来记录红绿灯在不同时段红黄绿三个持续时间
     * @param  NULL 
     * @return 无返回
     */
    //% block="clear schedule"
    //% weight=98
    export function clearSchedule(): void {
        let buffer = pins.createBuffer(2);
        buffer[0]=0x11;
        buffer[1]=1;
        writeReg(buffer);
        basic.pause(300)
    }

    /** 
     * TODO:设置交通灯状态改变的起始时间
     * @param beginHour   设置起始小时 eg:0
     * @param beginMintue 设置起始分钟 eg:0
     * @param beginSecon  设置起始秒钟 eg:20
     */
    //% block="set begin time hour %beginHour mintue %beginMintue secon %beginSecon"
    //% weight=97
    export function setBeginTime(beginHour:number, beginMintue:number, beginSecon:number):void{
        _beginHour=beginHour;
        _beginMinute=beginMintue;
        _beginSecond=beginSecon;
    }

    /**
     * TODO:设置三种灯持续亮时间
     * @param RTime 红灯持续时间
     * @param YTime 黄灯持续时间
     * @param GTime 绿灯持续时间
     * @return 没有返回
     */
    //% block="set light time red %rtime yellow %ytime green %gtime"
    //% weight=96
    export function setRYGLightTime(rtime:number, ytime:number, gtime:number):void{
        if(rtime == LIGHT_INFINITY_TIME){
            _RTime  = 1;
            _YTime  = 0;
            _GTime  = 0;
        }else if(ytime == LIGHT_INFINITY_TIME){
            _RTime  = 0;
            _YTime  = 1;
            _GTime  = 0;
        }else if(gtime == LIGHT_INFINITY_TIME){
            _RTime  = 0;
            _YTime  = 0;
            _GTime  = 1;
        }else{
            _RTime  = rtime;
            _YTime  = ytime;
            _GTime  = gtime;
        }
    }
    /**
     * TODE:发送设置MCU
     * @param NULL
     * @retuen 没有返回
     */
    //% block="send message to MCU"
    //% weight=95
    export function sendMessageToMCU():void{
        let buffer = pins.createBuffer(2);
        buffer[0] = 0X0A;
        buffer[1] = 1;
        writeReg(buffer);
        basic.pause(300)
        let buffer1 = pins.createBuffer(4);
        buffer1[0] = 0X17;
        buffer1[1] = _beginHour;
        buffer1[2] = _beginMinute;
        buffer1[3] = _beginSecond;
        writeReg(buffer1);
        basic.pause(300)
      
        let buffer2 = pins.createBuffer(4);
        buffer2[0] = 0X0B;
        buffer2[1] = _RTime;
        buffer2[2] = _YTime;
        buffer2[3] = _GTime;
        writeReg(buffer2); 
        basic.pause(300)
        // let a=readReg(0X17,3);
        // for(let i =0;i<3;i++){
        //     serial.writeValue("x", a[i])   
        // }
        //  let b=readReg(0X0B,3);
        // for(let i =0;i<3;i++){
        //     serial.writeValue("x", b[i])   
        // }
    } 
    /**
     * TODO: 跟新MCU时间
     * @param hour,minute,second
     * @return 没有返回
     */
    //% block="update module time hour %hour minute %minute second %second"
    //% weight=94
    export function updateModuleTime(hour:number, minute:number, second:number):void{
        let buffer = pins.createBuffer(2);
        buffer[0] = 0X09;
        buffer[1] = 1;
        writeReg(buffer);
        basic.pause(300)
        let buffer1 = pins.createBuffer(4);
        buffer1[0] = 0X06;
        buffer1[1] = hour;
        buffer1[2] = minute;
        buffer1[3] = second;
        writeReg(buffer1);
        basic.pause(300)
    }
    /**
     * TODO: 跟新默认红黄绿三色灯的持续时间
     * @param RTiem,YTime,GTime
     * @return 没有返回
     */
    //% block="change default traffic light time red %rtime yellow %ytime green %gtime"
    //% weight=93
    export function changeDefaultRYGTime(rtime:number, ytime:number, gtime:number):void{
        let buffer = pins.createBuffer(2);
        buffer[0]=0X13;
        buffer[1]=1;
        writeReg(buffer);
        basic.pause(300)
        let buffer1 = pins.createBuffer(4);
        buffer1[0] = 0X14;
        buffer1[1] = rtime;
        buffer1[2] = ytime;
        buffer1[3] = gtime;
        writeReg(buffer1);
        basic.pause(300)
    }
    /**
     * TODO: 获取交通灯此时的状态
     * @param light 设置要检测的灯
     * @return 返回灯状态
     */
    //% block="get linght  %light state"
    //% weight=92
    export function ifLightIsOn(light:MyEnumColor):number{
        let buffer = readReg(0X12,1);
        let data;
        if(buffer[0] == light){
            data = 1;
        }else{
            data = 0;
        }
        return data;
    }
    /**
     * TODO: 设置I2C地址
     * @param addr I2C地址 eg:0x54
     * @return 返回灯状态
     */
    //% block="set i2c addr %addr"
    //% weight=92
    export function seti2cAddr(addr:number):void{
        addrI2C = addr;
    }

    /**
     * TODO: 从指定传感器中获取指定长度数据
     * @param  reg 寄存器值
     * @param  len 获取数据长度
     * @return 返回获取数据的buffer
     */
    function readReg(reg:number, len:number):Buffer{
        pins.i2cWriteNumber(addrI2C, reg, NumberFormat.Int8LE);
        return pins.i2cReadBuffer(addrI2C, len);
    }

    /**
     * TODO:向指定传感器寄存器中写入数据
     * @param reg 寄存器值
     * @param buf 写入数据
     * @return 无返回
     */
    function writeReg(buf:Buffer):void{
        pins.i2cWriteBuffer(addrI2C, buf);
    }


}
