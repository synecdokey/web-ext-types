//    web-ext-types are TypeScript type definitions for WebExtensions
//    Copyright (C) 2017  Michael Zapata
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

interface EvListener<T extends Function> {
    addListener: (callback: T) => void;
    removeListener: (listener: T) => void;
    hasListener: (listener: T) => boolean;
}

type Listener<T> = EvListener<(arg: T) => void>;

declare namespace browser.alarms {
    type Alarm = {
        name: string,
        scheduledTime: number,
        periodInMinutes?: number,
    };

    type When = {
        when?: number,
        periodInMinutes?: number,
    };
    type DelayInMinutes = {
        delayInMinutes?: number,
        periodInMinutes?: number,
    };
    function create(name?: string, alarmInfo?: When | DelayInMinutes): void;
    function get(name?: string): Promise<Alarm|undefined>;
    function getAll(): Promise<Alarm[]>;
    function clear(name?: string): Promise<boolean>;
    function clearAll(): Promise<boolean>;

    const onAlarm: Listener<Alarm>;
}

declare namespace browser.browserAction {
    type ColorArray = [number, number, number, number];
    type ImageDataType = ImageData;

    function setTitle(details: { title: string, tabId?: number }): void;
    function getTitle(details: { tabId?: number }): Promise<string>;

    type IconViaPath = {
        path: string | object,
        tabId?: number,
    };

    type IconViaImageData = {
        imageData: ImageDataType,
        tabId?: number,
    };
    function setIcon(details: IconViaPath | IconViaImageData): Promise<void>;
    function setPopup(details: { popup: string, tabId?: number }): void;
    function getPopup(details: { tabId?: number }): Promise<string>;
    function setBadgeText(details: { text: string, tabId?: number }): void;
    function getBadgeText(details: { tabId?: number }): Promise<string>;
    function setBadgeBackgroundColor(details: { color: string|ColorArray, tabId?: number }): void;
    function getBadgeBackgroundColor(details: { tabId?: number }): Promise<ColorArray>;
    function enable(tabId?: number): void;
    function disable(tabId?: number): void;

    const onClicked: Listener<browser.tabs.Tab>;
}

declare namespace browser.commands {
    type Command = {
        name?: string,
        description?: string,
        shortcut?: string,
    };

    function getAll(): Promise<Command[]>;

    const onCommand: Listener<string>;
}

declare namespace browser.events {
    type UrlFilter = {
        hostContainsOptional?: string,
        hostEqualsOptional?: string,
        hostPrefixOptional?: string,
        hostSuffixOptional?: string,
        pathContainsOptional?: string,
        pathEqualsOptional?: string,
        pathPrefixOptional?: string,
        pathSuffixOptional?: string,
        queryContainsOptional?: string,
        queryEqualsOptional?: string,
        queryPrefixOptional?: string,
        querySuffixOptional?: string,
        urlContainsOptional?: string,
        urlEqualsOptional?: string,
        urlMatchesOptional?: string,
        originAndPathMatchesOptional?: string,
        urlPrefixOptional?: string,
        urlSuffixOptional?: string,
        schemesOptional?: string[],
        ports?: Array<number|number[]>,
    };
}

declare namespace browser.extensionTypes {
    type ImageFormat = "jpeg" | "png";
    type ImageDetails = {
        format: ImageFormat,
        quality: number,
    };
    type RunAt = "document_start" | "document_end" | "document_idle";
    type InjectDetails = {
        allFrames?: boolean,
        code?: string,
        file?: string,
        frameId: number,
        // unsupported: matchAboutBlank: boolean,
        runAt: RunAt,
    };
}

declare namespace browser.omnibox {
    type OnInputEnteredDisposition = "currentTab" | "newForegroundTab" | "newBackgroundTab";
    type SuggestResult = {
        content: string,
        description: string,
    };

    function setDefaultSuggestion(suggestion: { description: string }): void;

    const onInputStarted: Listener<void>;
    const onInputChanged:
        EvListener<(text: string, suggest: (arg: SuggestResult[]) => void) => void>;
    const onInputEntered:
        EvListener<(text: string, disposition: OnInputEnteredDisposition) => void>;
    const onInputCancelled: Listener<void>;
}

declare namespace browser.runtime {
    const lastError: string | null;
    const id: string;

    type Port = {
        name: string,
        disconnect(): void,
        error: object,
        onDisconnect: {
            addListener(cb: (port: Port) => void): void,
            removeListener(): void,
        },
        onMessage: {
            addListener(cb: (message: object) => void): void,
            removeListener(): void,
        },
        postMessage(message: object): void,
        sender?: runtime.MessageSender,
    };

    type MessageSender = {
        tab?: browser.tabs.Tab,
        frameId?: number,
        id?: string,
        url?: string,
        tlsChannelId?: string,
    };

    type PlatformOs =  "mac" | "win" | "android" | "cros" | "linux" | "openbsd";
    type PlatformArch =  "arm" | "x86-32" | "x86-64";
    type PlatformNaclArch = "arm" | "x86-32" | "x86-64";

    type PlatformInfo = {
        os: PlatformOs,
        arch: PlatformArch,
    };

    // type RequestUpdateCheckStatus = "throttled" | "no_update" | "update_available";
    type OnInstalledReason = "install" | "update" | "chrome_update" | "shared_module_update";
    type OnRestartRequiredReason = "app_update" | "os_update" | "periodic";

    function getBackgroundPage(): Promise<Window>;
    function openOptionsPage(): Promise<void>;

    // TODO: Explicitly expose every property of the manifest
    function getManifest(): object;
    function getURL(path: string): string;
    function setUninstallURL(url: string): Promise<void>;
    function reload(): void;
    // Will not exist: https://bugzilla.mozilla.org/show_bug.cgi?id=1314922
    // function RequestUpdateCheck(): Promise<RequestUpdateCheckStatus>;
    function connect(
        extensionId?: string,
        connectInfo?: { name?: string, includeTlsChannelId?: boolean }
    ): Port;
    function connectNative(application: string): Port;
    function sendMessage(
        extensionId: string|null,
        message: any,
        options?: { includeTlsChannelId?: boolean }
    ): Promise<any>;
    function sendNativeMessage(
        application: string,
        message: object
    ): Promise<object|void>;
    function getPlatformInfo(): Promise<PlatformInfo>;
    function getBrowserInfo(): Promise<{
        name: string,
        vendor: string,
        version: string,
        buildID: string,
    }>;
    // Unsupported: https://bugzilla.mozilla.org/show_bug.cgi?id=1339407
    // function getPackageDirectoryEntry(): Promise<any>;

    const onStartup: Listener<void>;
    const onInstalled: Listener<{
        reason: OnInstalledReason,
        previousVersion?: string,
        id?: string,
    }>;
    // Unsupported
    // const onSuspend: Listener<void>;
    // const onSuspendCanceled: Listener<void>;
    // const onBrowserUpdateAvailable: Listener<void>;
    // const onConnectExternal: Listener<Port>;
    // const onMessageExternal: Listener<any>;
    // const onRestartRequired: Listener<OnRestartRequiredReason>;
    const onUpdateAvailable: Listener<{ version: string }>;
    const onConnect: Listener<Port>;

    type onMessagePromise = (
        message: object,
        sender: MessageSender,
        sendResponse: (response: object) => boolean
    ) => Promise<void>;

    type onMessageBool = (
        message: object,
        sender: MessageSender,
        sendResponse: (response: object) => Promise<void>
    ) => boolean;

    type onMessageEvent = onMessagePromise | onMessageBool;
    const onMessage: EvListener<onMessageEvent>;
}

declare namespace browser.tabs {
    type Tab = {
        active: boolean,
        audible?: boolean,
    };
}
