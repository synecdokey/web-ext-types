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

declare namespace browser.identity {
    function getRedirectURL(): string;
    function launchWebAuthFlow(details: { url: string, interactive: boolean }): Promise<string>;
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
    type MutedInfoReason = "capture" | "extension" | "user";
    type MutedInfo = {
        muted: boolean,
        extensionId?: string,
        reason: MutedInfoReason,
    };
    type Tab = {
        active: boolean,
        highlighted: boolean,
        audible?: boolean,
        cookieStoreId?: string,
        favIconUrl?: string,
        height?: number,
        id?: number,
        incognito: boolean,
        index: number,
        mutedInfo?: MutedInfo,
        // not supported: openerTabId?: number,
        pinned: boolean,
        selected: boolean,
        sessionId?: string,
        status?: string,
        title?: string,
        url?: string,
        width?: number,
        windowId: number,
    };

    type TabStatus = "loading" | "complete";
    type WindowType = "normal" | "popup" | "panel" | "devtools";
    type ZoomSettingsMode = "automatic" | "disabled" | "manual";
    type ZoomSettingsScope = "per-origin" | "per-tab";
    type ZoomSettings = {
        defaultZoomFactor?: number,
        mode?: ZoomSettingsMode,
        scope?: ZoomSettingsScope,
    };

    const TAB_ID_NONE: number;

    function connect(tabId: number, connectInfo?: { name?: string, frameId?: number }): browser.runtime.Port;
    function create(createProperties: {
        active?: boolean,
        cookieStoreId?: string,
        index?: number,
        // unsupported: openerTabId: number,
        pinned?: boolean,
        // deprecated: selected: boolean,
        url?: string,
        windowId?: number,
    }): Promise<Tab>;
    function captureVisibleTab(
        windowId?: number,
        options?: browser.extensionTypes.ImageDetails
    ): Promise<string>;
    function detectLanguage(tabId?: number): Promise<string>;
    function duplicate(tabId: number): Promise<Tab>;
    function executeScript(
        tabId: number|undefined,
        details: browser.extensionTypes.InjectDetails
    ): Promise<object[]>;
    function get(tabId: number): Promise<Tab>;
    // deprecated: function getAllInWindow(): x;
    function getCurrent(): Promise<Tab>;
    // deprecated: function getSelected(windowId?: number): Promise<browser.tabs.Tab>;
    function getZoom(tabId?: number): Promise<number>;
    function getZoomSettings(tabId?: number): Promise<ZoomSettings>;
    // unsupported: function highlight(highlightInfo: {
    //     windowId?: number,
    //     tabs: number[]|number,
    // }): Promise<browser.windows.Window>;
    function insertCSS(tabId: number|undefined, details: browser.extensionTypes.InjectDetails): Promise<void>;
    function removeCSS(tabId: number|undefined, details: browser.extensionTypes.InjectDetails): Promise<void>;
    function move(tabIds: number|number[], moveProperties: {
        windowId?: number,
        index: number,
    }): Promise<Tab|Tab[]>;
    function query(queryInfo: {
        active?: boolean,
        audible?: boolean,
        cookieStoreId?: string,
        currentWindow?: boolean,
        highlighted?: boolean,
        index?: number,
        muted?: boolean,
        lastFocusedWindow?: boolean,
        pinned?: boolean,
        status?: TabStatus,
        title?: string,
        url?: string|string[],
        windowId?: number,
        windowType?: WindowType,
    }): Promise<Tab[]>;
    function reload(tabId: number, reloadProperties: { bypassCache: boolean }): Promise<void>;
    function remove(tabIds: Tab|Tab[]): Promise<void>;
    function sendMessage(tabId: number, message: any, options?: { frameId?: number }): Promise<object|void>;
    // deprecated: function sendRequest(): x;
    function setZoom(tabId: number|undefined, zoomFactor: number): Promise<void>;
    function setZoomSettings(tabId: number|undefined, zoomSettings: ZoomSettings): Promise<void>;
    function update(tabId: number|undefined, updateProperties: {
        active?: boolean,
        // unsupported: highlighted?: boolean,
        muted?: boolean,
        openerTabId?: number,
        pinned?: boolean,
        // deprecated: selected?: boolean,
        url?: string,
    }): Promise<Tab>;

    const onActivated: Listener<{ tabId: number, windowId: number }>;
    const onAttached: EvListener<(tabId: number, attachInfo: {
        newWindowId: number,
        newPosition: number,
    }) => void>;
    const onCreated: Listener<Tab>;
    const onDetached: EvListener<(tabId: number, detachInfo: {
        oldWindowId: number,
        oldPosition: number,
    }) => void>;
    const onHighlighted: Listener<{ windowId: number, tabIds: number[] }>;
    const onMoved: EvListener<(tabId: number, moveInfo: {
        windowId: number,
        fromIndex: number,
        toIndex: number,
    }) => void>;
    const onRemoved: EvListener<(tabId: number, removeInfo: {
        windowId: number,
        isWindowClosing: boolean,
    }) => void>;
    const onReplaced: EvListener<(addedTabId: number, removedTabId: number) => void>;
    const onUpdated: EvListener<(tabId: number, updateInfo: {
        status?: string,
        url?: string,
        pinned?: boolean,
        audible?: boolean,
        mutedInfo?: MutedInfo,
        favIconUrl?: string,
        title?: string,
    }, tab: Tab) => void>;
    const onZoomChanged: Listener<{
        tabId: number,
        oldZoomFactor: number,
        newZoomFactor: number,
        zoomSettings: ZoomSettings,
    }>;
}
