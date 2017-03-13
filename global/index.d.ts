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

declare namespace browser.bookmarks {
    type BookmarkTreeNodeUnmodifiable = "managed";
    type BookmarkTreeNode = {
        id: string,
        parentId?: string,
        index?: number,
        url?: string,
        title: string,
        dateAdded?: number,
        dateGroupModified?: number,
        unmodifiable?: BookmarkTreeNodeUnmodifiable,
        children?: BookmarkTreeNode[],
    };

    type CreateDetails = {
        parentId?: string,
        index?: number,
        title?: string,
        url?: string,
    };

    function create(bookmark: CreateDetails): Promise<BookmarkTreeNode>;
    function get(idOrIdList: string|string[]): Promise<BookmarkTreeNode[]>;
    function getChildren(id: string): Promise<BookmarkTreeNode[]>;
    function getRecent(numberOfItems: number): Promise<BookmarkTreeNode[]>;
    function getSubTree(id: string): Promise<[BookmarkTreeNode]>;
    function getTree(id: string): Promise<[BookmarkTreeNode]>;

    type Destination = {
        parentId: string,
        index?: number,
    } | {
        index: number,
        parentId?: string,
    };
    function move(id: string, destination: Destination): Promise<BookmarkTreeNode>;
    function remove(id: string): Promise<void>;
    function removeTree(id: string): Promise<void>;
    function search(query: string|{
        query?: string,
        url?: string,
        title?: string,
    }): Promise<BookmarkTreeNode[]>;
    function update(id: string, changes: { title: string, url: string }): Promise<BookmarkTreeNode>;

    const onCreated: EvListener<(id: string, bookmark: BookmarkTreeNode) => void>;
    const onRemoved: EvListener<(id: string, removeInfo: {
        parentId: string,
        index: number,
        node: BookmarkTreeNode,
    }) => void>;
    const onChanged: EvListener<(id: string, changeInfo: {
        title: string,
        url?: string,
    }) => void>;
    const onMoved: EvListener<(id: string, moveInfo: {
        parentId: string,
        index: number,
        oldParentId: string,
        oldIndex: number,
    }) => void>;
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

declare namespace browser.browsingData {
    type DataTypeSet = {
        cache?: boolean,
        cookies?: boolean,
        downloads?: boolean,
        fileSystems?: boolean,
        formData?: boolean,
        history?: boolean,
        indexedDB?: boolean,
        localStorage?: boolean,
        passwords?: boolean,
        pluginData?: boolean,
        serverBoundCertificates?: boolean,
        serviceWorkers?: boolean,
    };

    type DataRemovalOptions = {
        since?: number,
        originTypes?: { unprotectedWeb: boolean },
    };

    function remove(removalOptions: DataRemovalOptions, dataTypes: DataTypeSet): Promise<void>;
    function removeCache(removalOptions?: DataRemovalOptions): Promise<void>;
    function removeCookies(removalOptions: DataRemovalOptions): Promise<void>;
    function removeDownloads(removalOptions: DataRemovalOptions): Promise<void>;
    function removeFormData(removalOptions: DataRemovalOptions): Promise<void>;
    function removeHistory(removalOptions: DataRemovalOptions): Promise<void>;
    function removePasswords(removalOptions: DataRemovalOptions): Promise<void>;
    function removePluginData(removalOptions: DataRemovalOptions): Promise<void>;
    function settings(): Promise<{
        options: DataRemovalOptions,
        dataToRemove: DataTypeSet,
        dataRemovalPermitted: DataTypeSet,
    }>;
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

declare namespace browser.contextMenus {
    type ContextType = "all" | "page" | "frame" | "page" | "link" | "editable" | "image"
        | "video" | "audio" | "launcher" | "browser_action" | "page_action" | "password" | "tab";

    type ItemType = "normal" | "checkbox" | "radio" | "separator";

    type OnClickData = {
        menuItemId: number|string,
        editable: boolean,
        parentMenuItemId?: number|string,
        mediaType?: string,
        linkUrl?: string,
        srcUrl?: string,
        pageUrl?: string,
        frameUrl?: string,
        selectionText?: string,
        wasChecked?: boolean,
        checked?: boolean,
    };

    const ACTION_MENU_TOP_LEVEL_LIMIT: number;

    function create(createProperties: {
        type?: ItemType,
        title?: string,
        checked?: boolean,
        contexts?: ContextType[],
        onclick?: (info: OnClickData, tab: browser.tabs.Tab) => void,
        parentId?: number|string,
        documentUrlPatterns?: string[],
        targetUrlPatterns?: string[],
        enabled?: boolean,
    }, callback: () => void): number|string;
    function update(id: number|string, updateProperties: {
        type?: ItemType,
        title?: string,
        checked?: boolean,
        contexts?: ContextType[],
        onclick?: (info: OnClickData, tab: browser.tabs.Tab) => void,
        parentId?: number|string,
        documentUrlPatterns?: string[],
        targetUrlPatterns?: string[],
        enabled?: boolean,
    }): Promise<void>;
    function remove(menuItemId: number|string): Promise<void>;
    function removeAll(): Promise<void>;

    const onClicked: EvListener<(info: OnClickData, tab: browser.tabs.Tab) => void>;
}

declare namespace browser.contextualIdentities {
    type IdentityColor = "blue" | "turquoise" | "green" | "yellow" | "orange" | "red" | "pink" | "purple";
    type IdentityIcon = "fingerprint" | "briefcase" | "dollar" | "cart" | "circle";

    type ContextualIdentity = {
        cookieStoreId: string,
        color: IdentityColor,
        icon: IdentityIcon,
        name: string,
    };

    function create(details: {
        name: string,
        color: IdentityColor,
        icon: IdentityIcon,
    }): Promise<ContextualIdentity>;
    function get(cookieStoreId: string): Promise<ContextualIdentity|null>;
    function query(details: { name?: string }): Promise<ContextualIdentity[]>;
    function update(cookieStoreId: string, details: {
        name: string,
        color: IdentityColor,
        icon: IdentityIcon,
    }): Promise<ContextualIdentity>;
    function remove(cookieStoreId: string): Promise<ContextualIdentity|null>;
}

declare namespace browser.cookies {
    type Cookie = {
        name: string,
        value: string,
        domain: string,
        hostOnly: boolean,
        path: string,
        secure: boolean,
        httpOnly: boolean,
        session: boolean,
        expirationDate?: number,
        storeId: string,
    };

    type CookieStore = {
        id: string,
        tabIds: number[],
    };

    type OnChangedCause = "evicted" | "expired" | "explicit" | "expired_overwrite"| "overwrite";

    function get(details: { url: string, name: string, storeId?: string }): Promise<Cookie|null>;
    function getAll(details: {
        url?: string,
        name?: string,
        domain?: string,
        path?: string,
        secure?: boolean,
        session?: boolean,
        storeId?: string,
    }): Promise<Cookie[]>;
    function set(details: {
        url: string,
        name?: string,
        domain?: string,
        path?: string,
        secure?: boolean,
        httpOnly?: boolean,
        expirationDate?: number,
        storeId?: string,
    }): Promise<Cookie>;
    function remove(details: { url: string, name: string, storeId?: string }): Promise<Cookie|null>;
    function getAllCookieStores(): Promise<CookieStore[]>;

    const onChanged: Listener<{ removed: boolean, cookie: Cookie, cause: OnChangedCause }>;
}

declare namespace browser.downloads {
    type FilenameConflictAction = "uniquify" | "overwrite" | "prompt";

    type InterruptReason = "FILE_FAILED" | "FILE_ACCESS_DENIED" | "FILE_NO_SPACE"
                         | "FILE_NAME_TOO_LONG" | "FILE_TOO_LARGE" | "FILE_VIRUS_INFECTED"
                         | "FILE_TRANSIENT_ERROR" | "FILE_BLOCKED" | "FILE_SECURITY_CHECK_FAILED"
                         | "FILE_TOO_SHORT"
                         | "NETWORK_FAILED" | "NETWORK_TIMEOUT" | "NETWORK_DISCONNECTED"
                         | "NETWORK_SERVER_DOWN" | "NETWORK_INVALID_REQUEST"
                         | "SERVER_FAILED" | "SERVER_NO_RANGE" | "SERVER_BAD_CONTENT"
                         | "SERVER_UNAUTHORIZED" | "SERVER_CERT_PROBLEM" | "SERVER_FORBIDDEN"
                         | "USER_CANCELED" | "USER_SHUTDOWN" | "CRASH";

    type DangerType = "file" | "url" | "content" | "uncommon" | "host" | "unwanted" | "safe"
                    | "accepted";

    type State = "in_progress" | "interrupted" | "complete";

    type DownloadItem = {
        id: number,
        url: string,
        referrer: string,
        filename: string,
        incognito: boolean,
        danger: string,
        mime: string,
        startTime: string,
        endTime?: string,
        estimatedEndTime?: string,
        state: string,
        paused: boolean,
        canResume: boolean,
        error?: string,
        bytesReceived: number,
        totalBytes: number,
        fileSize: number,
        exists: boolean,
        byExtensionId?: string,
        byExtensionName?: string,
    };

    type Delta<T> = {
        current?: T,
        previous?: T,
    };

    type StringDelta = Delta<string>;
    type DoubleDelta = Delta<number>;
    type BooleanDelta = Delta<boolean>;
    type DownloadTime = Date|string|number;

    type DownloadQuery = {
        query?: string[],
        startedBefore?: DownloadTime,
        startedAfter?: DownloadTime,
        endedBefore?: DownloadTime,
        endedAfter?: DownloadTime,
        totalBytesGreater?: number,
        totalBytesLess?: number,
        filenameRegex?: string,
        urlRegex?: string,
        limit?: number,
        orderBy?: string,
        id?: number,
        url?: string,
        filename?: string,
        danger?: DangerType,
        mime?: string,
        startTime?: string,
        endTime?: string,
        state?: State,
        paused?: boolean,
        error?: InterruptReason,
        bytesReceived?: number,
        totalBytes?: number,
        fileSize?: number,
        exists?: boolean,
    };

    function download(options: {
        url: string,
        filename?: string,
        conflictAction?: string,
        saveAs?: boolean,
        method?: string,
        headers?: { [key: string]: string },
        body?: string,
    }): Promise<number>;
    function search(query: DownloadQuery): Promise<DownloadItem[]>;
    function pause(downloadId: number): Promise<void>;
    function resume(downloadId: number): Promise<void>;
    function cancel(downloadId: number): Promise<void>;
    // unsupported: function getFileIcon(downloadId: number, options?: { size?: number }):
    //              Promise<string>;
    function open(downloadId: number): Promise<void>;
    function show(downloadId: number): Promise<void>;
    function showDefaultFolder(): void;
    function erase(query: DownloadQuery): Promise<number[]>;
    function removeFile(downloadId: number): Promise<void>;
    // unsupported: function acceptDanger(downloadId: number): Promise<void>;
    // unsupported: function drag(downloadId: number): Promise<void>;
    // unsupported: function setShelfEnabled(enabled: boolean): void;

    const onCreated: Listener<DownloadItem>;
    const onErased: Listener<number>;
    const onChanged: Listener<{
        id: number,
        url?: StringDelta,
        filename?: StringDelta,
        danger?: StringDelta,
        mime?: StringDelta,
        startTime?: StringDelta,
        endTime?: StringDelta,
        state?: StringDelta,
        canResume?: BooleanDelta,
        paused?: BooleanDelta,
        error?: StringDelta,
        totalBytes?: DoubleDelta,
        fileSize?: DoubleDelta,
        exists?: BooleanDelta,
    }>;
}

declare namespace browser.events {
    type UrlFilter = {
        hostContains?: string,
        hostEquals?: string,
        hostPrefix?: string,
        hostSuffix?: string,
        pathContains?: string,
        pathEquals?: string,
        pathPrefix?: string,
        pathSuffix?: string,
        queryContains?: string,
        queryEquals?: string,
        queryPrefix?: string,
        querySuffix?: string,
        urlContains?: string,
        urlEquals?: string,
        urlMatches?: string,
        originAndPathMatches?: string,
        urlPrefix?: string,
        urlSuffix?: string,
        schemes?: string[],
        ports?: Array<number|number[]>,
    };
}

declare namespace browser.extension {
    type ViewType = "tab" | "notification" | "popup";

    const lastError: string|null;
    const inIncognitoContext: boolean;

    function getURL(path: string): string;
    function getViews(fetchProperties?: { type: ViewType, windowId: number }): Window[];
    function getBackgroundPage(): Window;
    function isAllowedIncognitoAccess(): Promise<boolean>;
    function isAllowedFileSchemeAccess(): Promise<boolean>;
    // unsupported: events as they are deprecated
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

declare namespace browser.history {
    type TransitionType = "link" | "typed" | "auto_bookmark" | "auto_subframe" | "manual_subframe"
                        | "generated" | "auto_toplevel" | "form_submit" | "reload" | "keyword"
                        | "keyword_generated";

    type HistoryItem = {
        id: string,
        url?: string,
        title?: string,
        lastVisitTime?: number,
        visitCount?: number,
        typedCount?: number,
    };

    type VisitItem = {
        id: string,
        visitId: string,
        VisitTime?: number,
        refferingVisitId: string,
        transition: TransitionType,
    };

    function search(query: {
        text: string,
        startTime?: number|string|Date,
        endTime?: number|string|Date,
        maxResults?: number,
    }): Promise<HistoryItem[]>;

    function getVisits(details: { url: string }): Promise<VisitItem[]>;

    function addUrl(details: {
        url: string,
        title?: string,
        transition?: TransitionType,
        visitTime?: number|string|Date,
    }): Promise<void>;

    function deleteUrl(details: { url: string }): Promise<void>;

    function deleteRange(range: {
        startTime: number|string|Date,
        endTime: number|string|Date,
    }): Promise<void>;

    function deleteAll(): Promise<void>;

    const onVisited: Listener<HistoryItem>;

    // TODO: Ensure that urls is not `urls: [string]` instead
    const onVisitRemoved: Listener<{ allHistory: boolean, urls: string[] }>;
}

declare namespace browser.identity {
    function getRedirectURL(): string;
    function launchWebAuthFlow(details: { url: string, interactive: boolean }): Promise<string>;
}

declare namespace browser.idle {
    type IdleState = "active" | "idle" /* unsupported: | "locked" */;

    function queryState(detectionIntervalInSeconds: number): Promise<IdleState>;
    function setDetectionInterval(intervalInSeconds: number): void;

    const onStateChanged: Listener<IdleState>;
}

declare namespace browser.management {
    type ExtensionInfo = {
        description: string,
        // unsupported: disabledReason: string,
        enabled: boolean,
        homepageUrl: string,
        hostPermissions: string[],
        icons: { size: number, url: string }[],
        id: string,
        installType: "admin" | "development" | "normal" | "sideload" | "other";
        mayDisable: boolean,
        name: string,
        // unsupported: offlineEnabled: boolean,
        optionsUrl: string,
        permissions: string[],
        shortName: string,
        // unsupported: type: string,
        updateUrl: string,
        version: string,
        // unsupported: versionName: string,
    };

    function getSelf(): Promise<ExtensionInfo>;
    function uninstallSelf(options: { showConfirmDialog: boolean, dialogMessage: string }): Promise<void>;
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

declare namespace browser.storage {
    type StorageArea = {
        get: (keys: string|string[]|object|null) => Promise<object>,
        getBytesInUse: (keys: string|string[]|null) => Promise<number>,
        set: (keys: object) => Promise<void>,
        remove: (keys: string|string[]) => Promise<void>,
        clear: () => Promise<void>,
    };

    type StorageChange = {
        oldValue?: any,
        newValue?: any,
    };

    const sync: StorageArea;
    const local: StorageArea;
    const managed: StorageArea;

    type ChangeDict = { [field: string]: StorageChange };
    type StorageName = "sync"|"local"|"managed";

    const onChanged: EvListener<(changes: ChangeDict, areaName: StorageName) => void>;
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

declare namespace browser.topSites {
    type MostVisitedURL = {
        title: string,
        url: string,
    };
    function get(): Promise<MostVisitedURL[]>;
}
