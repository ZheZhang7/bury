import { DefaultOptions, trackConfig, Options, reportBuryData } from "../types/index";
import {createHistoryEvent} from "../utils/pv";

const eventList:string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];
export default class bury {
    // options 用户传过来的参数
    public data:Options;
    constructor(options:Options) {
        this.data = Object.assign(this.initDef(), options);
        this.initBury();
    }

    // 合并js和promise报错
    private jsError () {
        this.errorEvent(); 
        this.promiseReject();
    }

    // 监听js报错
    private errorEvent () {
        window.addEventListener('error', (error) => {
            this.reportBury({
                event: 'jsError',
                targetKey: 'message',
                message: error
            })
        })
    }

    // 监听promise报错
    private promiseReject () {
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(error => {
                this.reportBury({
                    event: 'promiseError',
                    targetKey: 'message',
                    message: error
                })
            })
        })
    }

    // 监听dom
    private targetKeyReport () {
        eventList.forEach(ev => {
            window.addEventListener(ev, e => {
                const target = e.target as HTMLElement;
                const targetKey = target.getAttribute('target-key');
                if (targetKey) {
                    this.reportBury({
                        event: ev,
                        targetKey,
                    })
                }
            })
        })
    }

    // 兜底逻辑 用户未传递相关参数
    private initDef ():DefaultOptions {
        // 修改history路由
        window.history['pushState'] = createHistoryEvent('pushState');
        window.history['replaceState'] = createHistoryEvent('replaceState');
        return <DefaultOptions> {
            // 默认参数
            sdkVersion: trackConfig.version,
            historyTrack: false,
            hashTrack: false,
            domTrack: false,
            jsError: false
        }
    }

    // uv 独立访问，用户的唯一表示
    // 可以再登录之后通过接口返回的id进行设置
    // 另一种可以采用canvas进行指纹追踪（设备，操作系统，浏览器三合一形成唯一的uuid）
    public setUserId <T extends DefaultOptions['uuid']>(uuid: T) {
        this.data.uuid = uuid;
    }
    
    public setExtra <T extends DefaultOptions['extra']>(extra: T) {
        this.data.extra = extra;
    }


    // 在这里uuid采用sendBeacon上报
    // 上报
    // sendbeacon与xhr对比，navigator.sendBeacon即使是页面关闭了也会完成请求，而xhr不一定
    private reportBury <T>(data: T) {
        const params = Object.assign(this.data, data, {time: new Date().getTime()});
        let headers = {
            type: 'application/x-www-form-urlencoded'
        }
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(this.data.requestUrl, blob);
    }

    // 手动上报
    public sendBury <T extends reportBuryData>(data: T) {
        this.reportBury(data);
    }

    // 自动上报
    private captureEvents <T>(mouseEventList:string[], targetKey:string, data?:T) {
        let count = 0;
        mouseEventList.forEach(event => {
            window.addEventListener(event, () => {
                count++;
                console.log('监听success')
                console.log('跳转次数：', count);
                this.reportBury({
                    event,
                    targetKey,
                    data
                })
            })
        })
    }

    // 初始化上报
    private initBury() {
        if (this.data.historyTrack) {
            this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv')
        }
        if (this.data.hashTrack) {
            this.captureEvents(['hashchange'], 'hash-pv');
        }
        if (this.data.domTrack) {
            this.targetKeyReport();
        }
        if (this.data.jsError) {
            this.jsError();
        }
    }
}