interface DefaultOptions {
    uuid: string | undefined;
    requestUrl: string | undefined;
    historyTrack: boolean;
    hashTrack: boolean;
    domTrack: boolean;
    sdkVersion: string | number;
    extra: Record<string, any> | undefined;
    jsError: boolean;
}
interface Options extends Partial<DefaultOptions> {
    requestUrl: string;
}
type reportBuryData = {
    [key: string]: any;
    event: string;
    targetKey: string;
};

declare class bury {
    data: Options;
    constructor(options: Options);
    private jsError;
    private errorEvent;
    private promiseReject;
    private targetKeyReport;
    private initDef;
    setUserId<T extends DefaultOptions['uuid']>(uuid: T): void;
    setExtra<T extends DefaultOptions['extra']>(extra: T): void;
    private reportBury;
    sendBury<T extends reportBuryData>(data: T): void;
    private captureEvents;
    private initBury;
}

export { bury as default };
