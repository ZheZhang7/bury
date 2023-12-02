// 定义用户上传类型

/* 
    uuid：后续做uv 用户访问次数使用该值
    requestUrl: 接口地址
    historyTrack: history上报
    hashTrack: hash上报
    domTrack: 携带 track key 点击事件上报
    sdkVersion: 版本
    extra: 透传字段 用户自定义参数
    jsError: js 和 promise报错异常上报
*/


// 默认值都有什么
export interface DefaultOptions {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTrack: boolean,
    hashTrack: boolean,
    domTrack: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    jsError: boolean,
}
// 所有属性设置为可选，在这里继承 defaultoptions ,只将requesturl设置为必选
export interface Options extends Partial<DefaultOptions> {
    requestUrl: string
}

// 版本
export enum trackConfig {
    version = '1.0.0'
}

// 上报必传参数
export type reportBuryData = {
    [key: string]: any,
    event: string,
    targetKey: string
}