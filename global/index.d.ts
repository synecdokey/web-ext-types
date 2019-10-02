// This Source Code Form is subject to the terms of the Mozilla Public
// license, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

interface EvListener<T extends Function> {
  addListener: (callback: T) => void;
  removeListener: (listener: T) => void;
  hasListener: (listener: T) => boolean;
}

type Listener<T> = EvListener<(arg: T) => void>;

type WinOrTab<T> = T & ({ windowId?: number} | { tabId?: number });


declare namespace browser.alarms {
  type Alarm = {
    name: string;
    scheduledTime: number;
    periodInMinutes?: number;
  };

  type When = {
    when?: number;
    periodInMinutes?: number;
  };
  type DelayInMinutes = {
    delayInMinutes?: number;
    periodInMinutes?: number;
  };
  function create(name?: string, alarmInfo?: When | DelayInMinutes): void;
  function get(name?: string): Promise<Alarm | undefined>;
  function getAll(): Promise<Alarm[]>;
  function clear(name?: string): Promise<boolean>;
  function clearAll(): Promise<boolean>;

  const onAlarm: Listener<Alarm>;
}

declare namespace browser.bookmarks {
  type BookmarkTreeNodeUnmodifiable = "managed";
  type BookmarkTreeNodeType = "bookmark" | "folder" | "separator";
  type BookmarkTreeNode = {
    id: string;
    parentId?: string;
    index?: number;
    url?: string;
    title: string;
    dateAdded?: number;
    dateGroupModified?: number;
    unmodifiable?: BookmarkTreeNodeUnmodifiable;
    children?: BookmarkTreeNode[];
    type?: BookmarkTreeNodeType;
  };

  type CreateDetails = {
    parentId?: string;
    index?: number;
    title?: string;
    type?: BookmarkTreeNodeType;
    url?: string;
  };

  function create(bookmark: CreateDetails): Promise<BookmarkTreeNode>;
  function get(idOrIdList: string | string[]): Promise<BookmarkTreeNode[]>;
  function getChildren(id: string): Promise<BookmarkTreeNode[]>;
  function getRecent(numberOfItems: number): Promise<BookmarkTreeNode[]>;
  function getSubTree(id: string): Promise<[BookmarkTreeNode]>;
  function getTree(): Promise<[BookmarkTreeNode]>;

  type Destination =
    | {
        parentId: string;
        index?: number;
      }
    | {
        index: number;
        parentId?: string;
      };
  function move(
    id: string,
    destination: Destination
  ): Promise<BookmarkTreeNode>;
  function remove(id: string): Promise<void>;
  function removeTree(id: string): Promise<void>;
  function search(
    query:
      | string
      | {
          query?: string;
          url?: string;
          title?: string;
        }
  ): Promise<BookmarkTreeNode[]>;
  function update(
    id: string,
    changes: { title: string; url: string }
  ): Promise<BookmarkTreeNode>;

  const onCreated: EvListener<(id: string, bookmark: BookmarkTreeNode) => void>;
  const onRemoved: EvListener<
    (
      id: string,
      removeInfo: {
        parentId: string;
        index: number;
        node: BookmarkTreeNode;
      }
    ) => void
  >;
  const onChanged: EvListener<
    (
      id: string,
      changeInfo: {
        title: string;
        url?: string;
      }
    ) => void
  >;
  const onMoved: EvListener<
    (
      id: string,
      moveInfo: {
        parentId: string;
        index: number;
        oldParentId: string;
        oldIndex: number;
      }
    ) => void
  >;
}

declare namespace browser.browserAction {
  type ColorArray = [number, number, number, number];
  type ImageDataType = ImageData;

  function setTitle(details: WinOrTab<{ title: string | null; }>): void;
  function getTitle(details: WinOrTab<{ tabId?: number }>): Promise<string>;

  type IconViaPath = WinOrTab<{
    path: string | { [size: number]: string };
  }>;

  type IconViaImageData = WinOrTab<{
    imageData: ImageDataType | { [size: number]: ImageDataType };
  }>;

  type IconReset = WinOrTab<{
    imageData?: {} | null;
    path?: {} | null;
  }>;

  function setIcon(
    details: IconViaPath | IconViaImageData | IconReset
  ): Promise<void>;
  function setPopup(details: WinOrTab<{ popup: string | null; }>): void;
  function getPopup(details: WinOrTab<{}>): Promise<string>;
  function openPopup(): Promise<void>;
  function setBadgeText(details: WinOrTab<{ text: string | null; }>): void;
  function getBadgeText(details: WinOrTab<{}>): Promise<string>;
  function setBadgeBackgroundColor(details: WinOrTab<{
    color: string | ColorArray | null;
  }>): void;
  function getBadgeBackgroundColor(details: WinOrTab<{}>): Promise<ColorArray>;
  function setBadgeTextColor(details: WinOrTab<{
    color: string | ColorArray | null;
  }>): void;
  function setBadgeTextColor(details: WinOrTab<{
    color: string | ColorArray | null;
  }>): void;
  function setBadgeTextColor(details: WinOrTab<{ color: null; }>): void;
  function getBadgeTextColor(details: WinOrTab<{}>): Promise<ColorArray>;
  function enable(tabId?: number): void;
  function disable(tabId?: number): void;
  function isEnabled(details: WinOrTab<{}>): Promise<boolean>;

  const onClicked: Listener<browser.tabs.Tab>;
}

declare namespace browser.browserSettings {
  const allowPopupsForUserEvents: browser.types.BrowserSetting<boolean>;
  const cacheEnabled: browser.types.BrowserSetting<boolean>;
  const closeTabsByDoubleClick: browser.types.BrowserSetting<boolean>;
  const contextMenuShowEvent: browser.types.BrowserSetting<"mouseup" | "mousedown">;
  const homepageOverride: browser.types.BrowserSetting<string>;
  const imageAnimationBehavior: browser.types.BrowserSetting<"normal" | "none" | "once">;
  const newTabPageOverride: browser.types.BrowserSetting<string>;
  const newTabPosition: browser.types.BrowserSetting<"afterCurrent" | "relatedAfterCurrent" | "atEnd">;
  const openBookmarksInNewTabs: browser.types.BrowserSetting<boolean>;
  const openSearchResultsInNewTabs: browser.types.BrowserSetting<boolean>;
  const openUrlbarResultsInNewTabs: browser.types.BrowserSetting<boolean>;
  const overrideDocumentColors: browser.types.BrowserSetting<"high-contrast-only" | "never" | "always">;
  const useDocumentFonts: browser.types.BrowserSetting<boolean>;
  const webNotificationsDisabled: browser.types.BrowserSetting<boolean>;
}

declare namespace browser.browsingData {
  type DataTypeSet = {
    cache?: boolean;
    cookies?: boolean;
    downloads?: boolean;
    fileSystems?: boolean;
    formData?: boolean;
    history?: boolean;
    indexedDB?: boolean;
    localStorage?: boolean;
    passwords?: boolean;
    pluginData?: boolean;
    serverBoundCertificates?: boolean;
    serviceWorkers?: boolean;
  };

  type DataRemovalOptions = {
    hostnames?: string[];
    originTypes?: {
      extension?: boolean;
      protectedWeb?: boolean;
      unprotectedWeb?: boolean;
    };
    since?: number;
  };

  type ExtraDataRemovalOptions = {
    hostnames?: string[]
  }

  function remove(
    removalOptions: DataRemovalOptions,
    dataTypes: DataTypeSet
  ): Promise<void>;
  function removeCache(removalOptions?: DataRemovalOptions): Promise<void>;
  function removeCookies(removalOptions: DataRemovalOptions & ExtraDataRemovalOptions): Promise<void>;
  function removeLocalStorage(removalOptions: DataRemovalOptions & ExtraDataRemovalOptions): Promise<void>;
  function removeDownloads(removalOptions: DataRemovalOptions): Promise<void>;
  function removeFormData(removalOptions: DataRemovalOptions): Promise<void>;
  function removeHistory(removalOptions: DataRemovalOptions): Promise<void>;
  function removePasswords(removalOptions: DataRemovalOptions): Promise<void>;
  function removePluginData(removalOptions: DataRemovalOptions): Promise<void>;
  function settings(): Promise<{
    options: DataRemovalOptions;
    dataToRemove: DataTypeSet;
    dataRemovalPermitted: DataTypeSet;
  }>;
}

declare namespace browser.clipboard {
  function setImageData(imageData: ArrayBuffer, imageType: "png" | "jpeg"): void;
}

declare namespace browser.commands {
  type Command = {
    name?: string;
    description?: string;
    shortcut?: string;
  };

  function getAll(): Promise<Command[]>;
  function reset(name: string): Promise<void>;
  function update(details: {
    name: string;
    description?: string;
    shortcut?: string;
  }): Promise<void>;

  const onCommand: Listener<string>;
}

declare namespace browser.menus {
  type ContextType =
    | "all"
    | "audio"
    | "bookmarks"
    | "browser_action"
    | "editable"
    | "frame"
    | "image"
    // | "launcher" unsupported
    | "link"
    | "page"
    | "page_action"
    | "password"
    | "selection"
    | "tab"
    | "tools_menu"
    | "video";

  type ItemType = "normal" | "checkbox" | "radio" | "separator";

  type OnClickData = {
    bookmarkId?: string;
    button?: number;
    checked?: boolean;
    editable: boolean;
    frameId?: number;
    frameUrl?: string;
    linkText?: string;
    linkUrl?: string;
    mediaType?: string;
    menuItemId: number | string;
    modifiers: string[];
    pageUrl?: string;
    parentMenuItemId?: number | string;
    selectionText?: string;
    srcUrl?: string;
    targetElementId?: number;
    viewType?: browser.extension.ViewType;
    wasChecked?: boolean;
  };

  const ACTION_MENU_TOP_LEVEL_LIMIT: number;

  function create(
    createProperties: {
      checked?: boolean;
      command?:
        | "_execute_browser_action"
        | "_execute_page_action"
        | "_execute_sidebar_action";
      contexts?: ContextType[];
      documentUrlPatterns?: string[];
      enabled?: boolean;
      icons?: object;
      id?: string;
      onclick?: (info: OnClickData, tab: browser.tabs.Tab) => void;
      parentId?: number | string;
      targetUrlPatterns?: string[];
      title?: string;
      type?: ItemType;
      visible?: boolean;
    },
    callback?: () => void
  ): number | string;

  function getTargetElement(targetElementId: number): object | null;

  function refresh(): Promise<void>;

  function remove(menuItemId: number | string): Promise<void>;

  function removeAll(): Promise<void>;

  function update(
    id: number | string,
    updateProperties: {
      checked?: boolean;
      command?:
        | "_execute_browser_action"
        | "_execute_page_action"
        | "_execute_sidebar_action";
      contexts?: ContextType[];
      documentUrlPatterns?: string[];
      enabled?: boolean;
      onclick?: (info: OnClickData, tab: browser.tabs.Tab) => void;
      parentId?: number | string;
      targetUrlPatterns?: string[];
      title?: string;
      type?: ItemType;
      visible?: boolean;
    }
  ): Promise<void>;

  const onClicked: EvListener<
    (info: OnClickData, tab: browser.tabs.Tab) => void
  >;

  const onHidden: EvListener<() => void>;

  const onShown: EvListener<(info: OnClickData, tab: browser.tabs.Tab) => void>;
}

declare namespace browser.contextualIdentities {
  type IdentityColor =
    | "blue"
    | "turquoise"
    | "green"
    | "yellow"
    | "orange"
    | "red"
    | "pink"
    | "purple";
  type IdentityIcon =
    | "fingerprint"
    | "briefcase"
    | "dollar"
    | "cart"
    | "circle"
    | "gift"
    | "vacation"
    | "food"
    | "fruit"
    | "pet"
    | "tree"
    | "chill";

  type ContextualIdentity = {
    cookieStoreId: string;
    color: IdentityColor;
    colorCode: string;
    icon: IdentityIcon;
    iconUrl: string;
    name: string;
  };

  function create(details: {
    name: string;
    color: IdentityColor;
    icon: IdentityIcon;
  }): Promise<ContextualIdentity>;
  function get(cookieStoreId: string): Promise<ContextualIdentity | null>;
  function query(details: { name?: string }): Promise<ContextualIdentity[]>;
  function update(
    cookieStoreId: string,
    details: {
      name: string;
      color: IdentityColor;
      icon: IdentityIcon;
    }
  ): Promise<ContextualIdentity>;
  function remove(cookieStoreId: string): Promise<ContextualIdentity | null>;
  
  const onCreated: Listener<{ changeInfo: { contextualIdentity: ContextualIdentity } }>;
  const onRemoved: Listener<{ changeInfo: { contextualIdentity: ContextualIdentity } }>;
  const onUpdated: Listener<{ changeInfo: { contextualIdentity: ContextualIdentity } }>;
}

declare namespace browser.cookies {
  type Cookie = {
    name: string;
    value: string;
    domain: string;
    hostOnly: boolean;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    session: boolean;
    firstPartyDomain?: string;
    sameSite: SameSiteStatus
    expirationDate?: number;
    storeId: string;
  };

  type CookieStore = {
    id: string;
    incognito: boolean;
    tabIds: number[];
  };

  type SameSiteStatus = 
    | 'no_restriction'
    | 'lax'
    | 'strict'

  type OnChangedCause =
    | "evicted"
    | "expired"
    | "explicit"
    | "expired_overwrite"
    | "overwrite";

  function get(details: {
    url: string;
    name: string;
    storeId?: string;
    firstPartyDomain?: string;
  }): Promise<Cookie | null>;
  function getAll(details: {
    url?: string;
    name?: string;
    domain?: string;
    path?: string;
    secure?: boolean;
    session?: boolean;
    storeId?: string;
    firstPartyDomain?: string;
  }): Promise<Cookie[]>;
  function set(details: {
    domain?: string;
    expirationDate?: number;
    firstPartyDomain?: string;
    httpOnly?: boolean;
    name?: string;
    path?: string;
    sameSite?: SameSiteStatus;
    secure?: boolean;
    storeId?: string;
    url: string;
    value?: string;
  }): Promise<Cookie>;
  function remove(details: {
    url: string;
    name: string;
    storeId?: string;
    firstPartyDomain?: string;
  }): Promise<Cookie | null>;
  function getAllCookieStores(): Promise<CookieStore[]>;

  const onChanged: Listener<{
    removed: boolean;
    cookie: Cookie;
    cause: OnChangedCause;
  }>;
}

declare namespace browser.contentScripts {
  type RegisteredContentScriptOptions = {
    allFrames?: boolean;
    css?: ({ file: string } | { code: string })[];
    excludeGlobs?: string[];
    excludeMatches?: string[];
    includeGlobs?: string[];
    js?: ({ file: string } | { code: string })[];
    matchAboutBlank?: boolean;
    matches: string[];
    runAt?: "document_start" | "document_end" | "document_idle";
  };

  type RegisteredContentScript = {
    unregister: () => void;
  };

  function register(
    contentScriptOptions: RegisteredContentScriptOptions
  ): Promise<RegisteredContentScript>;
}

declare namespace browser.devtools.inspectedWindow {
  const tabId: number;


  function eval(
    expression: string, options?: {
      frameURL?: string;
      useContentScriptContext?: boolean;
      contextSecurityOrigin?: string;
    }
  ): Promise<
    [
      any,
      undefined
        | { isException: boolean; value: string }
        | { isError: boolean; code: string }
    ]
  >;

  function reload(reloadOptions?: {
    ignoreCache?: boolean;
    userAgent?: string;
    injectedScript?: string;
  }): void;
}

declare namespace browser.devtools.network {
  /**
   * HAR JSON File Format
   *
   * As described in http://www.softwareishard.com/blog/har-12-spec/.
   */
  type HAR = {
    log: HARLog;
  };

  type HARLog = {
    version: string;
    creator: HARCreator;
    browser?: HARCreator;
    pages?: HARPage[];
    entries: HAREntry[];
    comment?: string;
  };

  type HARCreator = {
    name: "1.2";
    version: string;
    comment?: string;
  };

  type HARPage = {
    startedDateTime: string;
    id: string;
    title: string;
    pageTimings: HARPageTimings;
    comment?: string;
  };

  type HARPageTimings = {
    onContentLoad: number;
    onLoad: number;
    comment?: string;
  };

  type HAREntry = {
    pageref?: string;
    startedDateTime: string;
    time: number;
    request: HARRequest;
    response: HARResponse;
    cache?: HARCache;
    timings: HARTiming[];
    serverIPAddress?: string;
    connection?: string;
    comment?: string;
  };

  type HARRequest = {
    method: string;
    url: string;
    httpVersion: string;
    cookies: HARCookie[];
    headers: HARHeader[];
    queryString: HARQueryStringItem[];
    postData?: HARPostData;
    headersSize: number;
    bodySize: number;
    comment?: string;
  };

  type HARResponse = {
    status: number;
    statusText: string;
    httpVersion: string;
    cookies: HARCookie[];
    headers: HARHeader[];
    content: HARContent;
    redirectURL: string;
    headersSize: number;
    bodySize: number;
    comment?: string;
  };

  type HARCookie = {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    expires?: string;
    httpOnly?: boolean;
    secure?: boolean;
    comment?: string;
  };

  type HARHeader = {
    name: string;
    value: string;
    comment?: string;
  };

  type HARQueryStringItem = {
    name: string;
    value: string;
    comment?: string;
  };

  type HARPostData = {
    mimeType: string;
    params: HARParam[];
    text: string;
    comment?: string;
  };

  type HARParam = {
    name: string;
    value?: string;
    fileName?: string;
    contentType?: string;
    comment?: string;
  };

  type HARContent = {
    size: number;
    compression?: number;
    mimeType: string;
    text?: string;
    encoding?: string;
    comment?: string;
  };

  type HARCache = {
    beforeRequest?: HARCacheState | null;
    afterRequest?: HARCacheState | null;
    comment?: string;
  };

  type HARCacheState = {
    expires?: string;
    lastAccess: string;
    eTag: string;
    hitCount: number;
    comment?: string;
  };

  type HARTiming = {
    blocked?: number;
    dns?: number;
    connect?: number;
    send: number;
    wait: number;
    receive: number;
    ssl?: number;
    comment?: string;
  };


  function getHAR(): Promise<HAR>;

  const onNavigated: Listener<string>;
  const onRequestFinished: Listener<HAREntry & {
    getContent: () => Promise<{
      content: string;
      encoding: string;
    }>  // Check this!
  }>;
}

declare namespace browser.devtools.panels {
  type ElementsPanel = {
    createSidebarPane: (title: string) => Promise<ExtensionSidebarPane>;

    onSelectionChanged: Listener<void>;
  };

  type ExtensionPanel = {
    onShown: Listener<Window>;
    onHidden: Listener<void>;
  };
  
  type ExtensionSidebarPane = {
    setExpression: (expression: string, rootTitel?: string) => Promise<void>;
    setObject: (jsonObject: string|Array<object>|object, rootTitle?: string) => Promise<void>;
    setPage: (extensionPageURL: string) => Promise<void>;
    
    onShown: Listener<void>;
    onHidden: Listener<void>;
  };
  
  type ThemeName = "light" | "dark" | "firebug";

  function create(
    title: string,
    iconPath: string,
    pagePath: string
  ): Promise<ExtensionPanel>;


  const elements: ElementsPanel;
  const themeName: ThemeName;

  const onThemeChanged: Listener<ThemeName>;
}

declare namespace browser.dns {
  type Flag =
    | "allow_name_collisions"
    | "bypass_cache"
    | "canonical_name"
    | "disable_ipv4"
    | "disable_ipv6"
    | "disable_trr"
    | "offline"
    | "priority_low"
    | "priority_medium"
    | "speculate";


  function resolve(hostname: string, flags?: Flag[]): Promise<{
    addresses: string[];
    canonicalName?: string;
    isTRR: boolean;
  }>;
}

declare namespace browser.downloads {
  type FilenameConflictAction = "uniquify" | "overwrite" | "prompt";

  type InterruptReason =
    | "FILE_FAILED"
    | "FILE_ACCESS_DENIED"
    | "FILE_NO_SPACE"
    | "FILE_NAME_TOO_LONG"
    | "FILE_TOO_LARGE"
    | "FILE_VIRUS_INFECTED"
    | "FILE_TRANSIENT_ERROR"
    | "FILE_BLOCKED"
    | "FILE_SECURITY_CHECK_FAILED"
    | "FILE_TOO_SHORT"
    | "NETWORK_FAILED"
    | "NETWORK_TIMEOUT"
    | "NETWORK_DISCONNECTED"
    | "NETWORK_SERVER_DOWN"
    | "NETWORK_INVALID_REQUEST"
    | "SERVER_FAILED"
    | "SERVER_NO_RANGE"
    | "SERVER_BAD_CONTENT"
    | "SERVER_UNAUTHORIZED"
    | "SERVER_CERT_PROBLEM"
    | "SERVER_FORBIDDEN"
    | "USER_CANCELED"
    | "USER_SHUTDOWN"
    | "CRASH";

  type DangerType =
    | "file"
    | "url"
    | "content"
    | "uncommon"
    | "host"
    | "unwanted"
    | "safe"
    | "accepted";

  type State = "in_progress" | "interrupted" | "complete";

  type DownloadItem = {
    id: number;
    url: string;
    referrer: string;
    filename: string;
    incognito: boolean;
    danger: string;
    mime: string;
    startTime: string;
    endTime?: string;
    estimatedEndTime?: string;
    state: string;
    paused: boolean;
    canResume: boolean;
    error?: string;
    bytesReceived: number;
    totalBytes: number;
    fileSize: number;
    exists: boolean;
    byExtensionId?: string;
    byExtensionName?: string;
  };

  type Delta<T> = {
    current?: T;
    previous?: T;
  };

  type StringDelta = Delta<string>;
  type DoubleDelta = Delta<number>;
  type BooleanDelta = Delta<boolean>;
  type DownloadTime = Date | string | number;

  type DownloadQuery = {
    query?: string[];
    startedBefore?: DownloadTime;
    startedAfter?: DownloadTime;
    endedBefore?: DownloadTime;
    endedAfter?: DownloadTime;
    totalBytesGreater?: number;
    totalBytesLess?: number;
    filenameRegex?: string;
    urlRegex?: string;
    limit?: number;
    orderBy?: string;
    id?: number;
    url?: string;
    filename?: string;
    danger?: DangerType;
    mime?: string;
    startTime?: string;
    endTime?: string;
    state?: State;
    paused?: boolean;
    error?: InterruptReason;
    bytesReceived?: number;
    totalBytes?: number;
    fileSize?: number;
    exists?: boolean;
  };

  function download(options: {
    url: string;
    filename?: string;
    conflictAction?: string;
    saveAs?: boolean;
    method?: string;
    headers?: { [key: string]: string };
    body?: string;
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
    id: number;
    url?: StringDelta;
    filename?: StringDelta;
    danger?: StringDelta;
    mime?: StringDelta;
    startTime?: StringDelta;
    endTime?: StringDelta;
    state?: StringDelta;
    canResume?: BooleanDelta;
    paused?: BooleanDelta;
    error?: StringDelta;
    totalBytes?: DoubleDelta;
    fileSize?: DoubleDelta;
    exists?: BooleanDelta;
  }>;
}

declare namespace browser.events {
  type Rule = {
    id?: string;
    tags?: string[];
    conditions: any[];
    actions: any[];
    priority?: number;
  };

  type UrlFilter = {
    hostContains?: string;
    hostEquals?: string;
    hostPrefix?: string;
    hostSuffix?: string;
    pathContains?: string;
    pathEquals?: string;
    pathPrefix?: string;
    pathSuffix?: string;
    queryContains?: string;
    queryEquals?: string;
    queryPrefix?: string;
    querySuffix?: string;
    urlContains?: string;
    urlEquals?: string;
    urlMatches?: string;
    originAndPathMatches?: string;
    urlPrefix?: string;
    urlSuffix?: string;
    schemes?: string[];
    ports?: Array<number | number[]>;
  };
}

declare namespace browser.extension {
  type ViewType = "tab" | "notification" | "popup" | "sidebar";

  const lastError: string | null;
  const inIncognitoContext: boolean;

  function getURL(path: string): string;
  function getViews(fetchProperties?: {
    type?: ViewType;
    windowId?: number;
  }): Window[];
  function getBackgroundPage(): Window;
  function isAllowedIncognitoAccess(): Promise<boolean>;
  function isAllowedFileSchemeAccess(): Promise<boolean>;
  // unsupported: events as they are deprecated
}

declare namespace browser.extensionTypes {
  type ImageFormat = "jpeg" | "png";
  type ImageDetails = {
    format: ImageFormat;
    quality: number;
  };
  type RunAt = "document_start" | "document_end" | "document_idle";
  type InjectDetails = {
    allFrames?: boolean;
    code?: string;
    file?: string;
    frameId?: number;
    matchAboutBlank?: boolean;
    runAt?: RunAt;
  };
  type InjectDetailsCSS = InjectDetails & { cssOrigin?: "user" | "author" };
}

declare namespace browser.find {
    type FindOptions = {
        tabid: number;
        caseSensitive: boolean;
        entireWord: boolean;
        includeRangeData: boolean;
        includeRectData: boolean;
    };

    type FindResults = {
        count: number;
        rangeData?: RangeData[];
        rectData?: RectData[];
    };

    type RangeData = {
        framePos: number;
        startTextNodePos: number;
        endTextNodePos: number;
        startOffset: number;
        endOffset: number;
        text: string;
    };

    type RectData = {
        rectsAndTexts: RectsAndTexts;
        text: string;
    };

    type RectsAndTexts = {
        rectList: RectItem[];
        textList: string[];
    };

    type RectItem = {
        top: number;
        left: number;
        bottom: number;
        right: number;
    };

    function find(query: string, object?: FindOptions): Promise<FindResults>;
    function highlightResults(): void;
    function removeHighlighting(): void;
}

declare namespace browser.history {
  type TransitionType =
    | "link"
    | "typed"
    | "auto_bookmark"
    | "auto_subframe"
    | "manual_subframe"
    | "generated"
    | "auto_toplevel"
    | "form_submit"
    | "reload"
    | "keyword"
    | "keyword_generated";

  type HistoryItem = {
    id: string;
    url?: string;
    title?: string;
    lastVisitTime?: number;
    visitCount?: number;
    typedCount?: number;
  };

  type VisitItem = {
    id: string;
    visitId: string;
    visitTime?: number;
    refferingVisitId: string;
    transition: TransitionType;
  };

  function search(query: {
    text: string;
    startTime?: number | string | Date;
    endTime?: number | string | Date;
    maxResults?: number;
  }): Promise<HistoryItem[]>;

  function getVisits(details: { url: string }): Promise<VisitItem[]>;

  function addUrl(details: {
    url: string;
    title?: string;
    transition?: TransitionType;
    visitTime?: number | string | Date;
  }): Promise<void>;

  function deleteUrl(details: { url: string }): Promise<void>;

  function deleteRange(range: {
    startTime: number | string | Date;
    endTime: number | string | Date;
  }): Promise<void>;

  function deleteAll(): Promise<void>;

  const onVisited: Listener<HistoryItem>;
  const onTitleChanged: Listener<{
    url: string;
    title: string;
  }>;

  // TODO: Ensure that urls is not `urls: [string]` instead
  const onVisitRemoved: Listener<{ allHistory: boolean; urls: string[] }>;
}

declare namespace browser.i18n {
  type LanguageCode = string;

  function getAcceptLanguages(): Promise<LanguageCode[]>;

  function getMessage(
    messageName: string,
    substitutions?: string | string[]
  ): string;

  function getUILanguage(): LanguageCode;

  function detectLanguage(
    text: string
  ): Promise<{
    isReliable: boolean;
    languages: { language: LanguageCode; percentage: number }[];
  }>;
}

declare namespace browser.identity {
  function getRedirectURL(): string;
  function launchWebAuthFlow(details: {
    url: string;
    interactive: boolean;
  }): Promise<string>;
}

declare namespace browser.idle {
  type IdleState = "active" | "idle" /* unsupported: | "locked" */;

  function queryState(detectionIntervalInSeconds: number): Promise<IdleState>;
  function setDetectionInterval(intervalInSeconds: number): void;

  const onStateChanged: Listener<IdleState>;
}

declare namespace browser.management {
  type ExtensionInfo = {
    description: string;
    // unsupported: disabledReason: string,
    enabled: boolean;
    homepageUrl: string;
    hostPermissions: string[];
    icons: { size: number; url: string }[];
    id: string;
    installType: "admin" | "development" | "normal" | "sideload" | "other";
    mayDisable: boolean;
    name: string;
    // unsupported: offlineEnabled: boolean,
    optionsUrl: string;
    permissions: string[];
    shortName: string;
    type: string;
    updateUrl: string;
    version: string;
    // unsupported: versionName: string,
  };

  function get(id: string): Promise<ExtensionInfo>;
  function getAll(): Promise<ExtensionInfo[]>;
  function getSelf(): Promise<ExtensionInfo>;
  function install(options: {
    url: string;
  }): Promise<{
    id: string;
  }>;
  function setEnabled(id: string, enabled: boolean): Promise<void>;
  function uninstallSelf(options: {
    showConfirmDialog: boolean;
    dialogMessage: string;
  }): Promise<void>;
}

declare namespace browser.notifications {
  type TemplateType = "basic" /* | "image" | "list" | "progress" */;

  type NotificationOptions = {
    type: TemplateType;
    message: string;
    title: string;
    iconUrl?: string;
  };

  function create(
    id: string | null,
    options: NotificationOptions
  ): Promise<string>;
  function create(options: NotificationOptions): Promise<string>;

  function clear(id: string): Promise<boolean>;

  function getAll(): Promise<{ [key: string]: NotificationOptions }>;

  const onClosed: Listener<string>;

  const onClicked: Listener<string>;
}

declare namespace browser.omnibox {
  type OnInputEnteredDisposition =
    | "currentTab"
    | "newForegroundTab"
    | "newBackgroundTab";
  type SuggestResult = {
    content: string;
    description: string;
  };

  function setDefaultSuggestion(suggestion: { description: string }): void;

  const onInputStarted: Listener<void>;
  const onInputChanged: EvListener<
    (text: string, suggest: (arg: SuggestResult[]) => void) => void
  >;
  const onInputEntered: EvListener<
    (text: string, disposition: OnInputEnteredDisposition) => void
  >;
  const onInputCancelled: Listener<void>;
}

declare namespace browser.pageAction {
  type ImageDataType = ImageData;

  function show(tabId: number): void;

  function hide(tabId: number): void;

  function isShown(details: { tabId: number; }): Promise<boolean>;

  function setTitle(details: { tabId: number; title: string | null }): void;

  function getTitle(details: { tabId: number }): Promise<string>;

  function setIcon(details: {
    tabId: number;
    path?: string | { [size: number]: string } | null;
    imageData?: ImageDataType | { [size: number]: ImageDataType } | null;
  }): Promise<void>;

  function setPopup(details: { tabId: number; popup: string | null }): void;

  function getPopup(details: { tabId: number }): Promise<string>;

  function openPopup(): Promise<void>;

  const onClicked: Listener<browser.tabs.Tab>;
}

declare namespace browser.permissions {
  type Permission =
    | "activeTab"
    | "alarms"
    | "background"
    | "bookmarks"
    | "browsingData"
    | "browserSettings"
    | "clipboardRead"
    | "clipboardWrite"
    | "contextMenus"
    | "contextualIdentities"
    | "cookies"
    | "downloads"
    | "downloads.open"
    | "find"
    | "geolocation"
    | "history"
    | "identity"
    | "idle"
    | "management"
    | "menus"
    | "nativeMessaging"
    | "notifications"
    | "pkcs11"
    | "privacy"
    | "proxy"
    | "sessions"
    | "storage"
    | "tabs"
    | "theme"
    | "topSites"
    | "unlimitedStorage"
    | "webNavigation"
    | "webRequest"
    | "webRequestBlocking";

  type Permissions = {
    origins?: string[];
    permissions?: Permission[];
  };

  function contains(permissions: Permissions): Promise<boolean>;

  function getAll(): Promise<Permissions>;

  function remove(permissions: Permissions): Promise<boolean>;

  function request(permissions: Permissions): Promise<boolean>;

  // Not yet support in Edge and Firefox:
  // const onAdded: Listener<Permissions>;
  // const onRemoved: Listener<Permissions>;
}

declare namespace browser.pkcs11 {
  interface Token {
    name: string;
    manufacturer: string;
    HWVersion: string;
    SWVersion: string;
    serial: string;
    isLoggedIn: boolean;
  }

  function getModuleSlots(name: string): Promise<{
    name: string;
    token: Token | null;
  }[]>;
  function installModule(name: string, flags: number): Promise<void>;
  function isModuleInstalled(name: string): Promise<boolean>;
  function uninstallModule(name: string): Promise<void>;
}

declare namespace browser.privacy {
  namespace network {
    type WebRTCIPHandlingPolicy =
      | "default"
      | "default_public_and_private_interfaces"
      | "default_public_interface_only"
      | "disable_non_proxied_udp";

    const networkPredictionEnabled: browser.types.BrowserSetting<boolean>;
    const peerConnectionEnabled: browser.types.BrowserSetting<boolean>;
    const webRTCIPHandlingPolicy: browser.types.BrowserSetting<WebRTCIPHandlingPolicy>;
  }

  namespace services {
    const passwordSavingEnabled: browser.types.BrowserSetting<boolean>;
  }

  namespace websites {
    type CookieConfigBehaviour =
      | "allow_all"
      | "reject_all"
      | "reject_third_party"
      | "allow_visited"
      | "reject_trackers";

    type TrackingProtectionMode =
      | "always"
      | "never"
      | "private_browsing";

    const cookieConfig: browser.types.BrowserSetting<{
      behaviour: CookieConfigBehaviour;
      nonPersistentCookies: boolean;
    }>;
    const firstPartyIsolate: browser.types.BrowserSetting<boolean>;
    const hyperlinkAuditingEnabled: browser.types.BrowserSetting<boolean>;
    const protectedContentEnabled: browser.types.BrowserSetting<boolean>;
    const referrersEnabled: browser.types.BrowserSetting<boolean>;
    const resistFingerprinting: browser.types.BrowserSetting<boolean>;
    const thirdPartyCookiesAllowed: browser.types.BrowserSetting<boolean>;
    const trackingProtectionMode: browser.types.BrowserSetting<TrackingProtectionMode>;
  }
}

declare namespace browser.proxy {
  type ProxyInfoType =
    | "direct"
    | "http"
    | "https"
    | "socks"
    | "socks4";

  type SettingsProxyType =
    | "none"
    | "autoDetect"
    | "system"
    | "manual"
    | "autoConfig";

  type SettingsSocksVersion = 4 | 5;
  
  type ExtraInfoSpecItem = "requestHeaders";


  interface ProxyInfo {
    type: ProxyInfoType;
    host?: string;
    port?: string;
    username?: string;
    password?: string;
    proxyDNS?: boolean;
    failoverTimeout?: number;
  }

  interface RequestDetails {
    documentUrl: string;
    frameId: number;
    fromCache: boolean;
    ip: string;
    method: string;
    originUrl: string;
    parentFrameId: number;
    requestId: string;
    requestHeaders?: browser.webRequest.HttpHeaders;
    tabId: number;
    timeStamp: number;
    type: browser.webRequest.ResourceType;
    url: string;
  }

  const settings: browser.types.BrowserSetting<{
    autoConfigUrl?: string;
    autoLogin?: boolean;
    ftp?: string;
    http?: string;
    httpProxyAll?: boolean;
    passthrough?: string;
    proxyDNS?: boolean;
    proxyType?: SettingsProxyType;
    socks?: string;
    socksVersion?: SettingsSocksVersion;
    ssl?: string;
  }>;

  const onError: Listener<{ newState: Error; }>;
  const onRequest: EvListener<
    (details: RequestDetails) => ProxyInfo | ProxyInfo[] | Promise<ProxyInfo | ProxyInfo[]>
  >;
}

declare namespace browser.runtime {
  const lastError: string | null;
  const id: string;

  type Port = {
    name: string;
    disconnect(): void;
    error: object;
    onDisconnect: Listener<Port>;
    onMessage: Listener<object>;
    postMessage: <T = object>(message: T) => void;
    sender?: runtime.MessageSender;
  };

  type MessageSender = {
    tab?: browser.tabs.Tab;
    frameId?: number;
    id?: string;
    url?: string;
    tlsChannelId?: string;
  };

  type PlatformOs = "mac" | "win" | "android" | "cros" | "linux" | "openbsd";
  type PlatformArch = "arm" | "x86-32" | "x86-64";
  type PlatformNaclArch = "arm" | "x86-32" | "x86-64";

  type PlatformInfo = {
    os: PlatformOs;
    arch: PlatformArch;
  };

  // type RequestUpdateCheckStatus = "throttled" | "no_update" | "update_available";
  type OnInstalledReason =
    | "install"
    | "update"
    | "chrome_update"
    | "shared_module_update";
  type OnRestartRequiredReason = "app_update" | "os_update" | "periodic";

  type FirefoxSpecificProperties = {
    id?: string;
    strict_min_version?: string;
    strict_max_version?: string;
    update_url?: string;
  };

  type IconPath = { [urlName: string]: string } | string;

  type Manifest = {
    // Required
    manifest_version: 2;
    name: string;
    version: string;
    /** Required in Microsoft Edge */
    author?: string;

    // Optional

    // ManifestBase
    description?: string;
    homepage_url?: string;
    short_name?: string;

    // WebExtensionManifest
    background?: {
      page: string;
      scripts: string[];
      persistent?: boolean;
    };
    content_scripts?: {
      matches: string[];
      exclude_matches?: string[];
      include_globs?: string[];
      exclude_globs?: string[];
      css?: string[];
      js?: string[];
      all_frames?: boolean;
      match_about_blank?: boolean;
      run_at?: "document_start" | "document_end" | "document_idle";
    }[];
    content_security_policy?: string;
    developer?: {
      name?: string;
      url?: string;
    };
    theme?: browser.theme.Theme;
    icons?: {
      [imgSize: string]: string;
    };
    incognito?: "spanning" | "split" | "not_allowed";
    optional_permissions?: browser.permissions.Permission[];
    options_ui?: {
      page: string;
      browser_style?: boolean;
      chrome_style?: boolean;
      open_in_tab?: boolean;
    };
    permissions?: browser.permissions.Permission[];
    web_accessible_resources?: string[];

    // WebExtensionLangpackManifest
    languages: {
      [langCode: string]: {
        chrome_resources: {
          [resName: string]: string | { [urlName: string]: string };
        };
        version: string;
      };
    };
    langpack_id?: string;
    sources?: {
      [srcName: string]: {
        base_path: string;
        paths?: string[];
      };
    };

    // Extracted from components
    browser_action?: {
      default_title?: string;
      default_icon?: IconPath;
      theme_icons?: {
        light: string;
        dark: string;
        size: number;
      }[];
      default_popup?: string;
      browser_style?: boolean;
      default_area?: "navbar" | "menupanel" | "tabstrip" | "personaltoolbar";
    };
    commands?: {
      [keyName: string]: {
        suggested_key?: {
          default?: string;
          mac?: string;
          linux?: string;
          windows?: string;
          chromeos?: string;
          android?: string;
          ios?: string;
        };
        description?: string;
      };
    };
    default_locale?: browser.i18n.LanguageCode;
    devtools_page?: string;
    omnibox?: {
      keyword: string;
    };
    page_action?: {
      default_title?: string;
      default_icon?: IconPath;
      default_popup?: string;
      browser_style?: boolean;
      show_matches?: string[];
      hide_matches?: string[];
    };
    sidebar_action?: {
      default_panel: string;
      default_title?: string;
      default_icon?: IconPath;
      browser_style?: boolean;
    };

    // Firefox specific
    applications?: {
      gecko?: FirefoxSpecificProperties;
    };
    browser_specific_settings?: {
      gecko?: FirefoxSpecificProperties;
    };
    experiment_apis?: any;
    protocol_handlers?: {
      name: string;
      protocol: string;
      uriTemplate: string;
    };

    // Opera specific
    minimum_opera_version?: string;

    // Chrome specific
    action?: any;
    automation?: any;
    background_page?: any;
    chrome_settings_overrides?: {
      homepage?: string;
      search_provider?: {
        name: string;
        search_url: string;
        keyword?: string;
        favicon_url?: string;
        suggest_url?: string;
        instant_url?: string;
        is_default?: string;
        image_url?: string;
        search_url_post_params?: string;
        instant_url_post_params?: string;
        image_url_post_params?: string;
        alternate_urls?: string[];
        prepopulated_id?: number;
      };
    };
    chrome_ui_overrides?: {
      bookmarks_ui?: {
        remove_bookmark_shortcut?: true;
        remove_button?: true;
      };
    };
    chrome_url_overrides?: {
      newtab?: string;
      bookmarks?: string;
      history?: string;
    };
    content_capabilities?: any;
    converted_from_user_script?: any;
    current_locale?: any;
    declarative_net_request?: any;
    event_rules?: any[];
    export?: {
      whitelist?: string[];
    };
    externally_connectable?: {
      ids?: string[];
      matches?: string[];
      accepts_tls_channel_id?: boolean;
    };
    file_browser_handlers?: {
      id: string;
      default_title: string;
      file_filters: string[];
    }[];
    file_system_provider_capabilities?: {
      source: "file" | "device" | "network";
      configurable?: boolean;
      multiple_mounts?: boolean;
      watchable?: boolean;
    };
    import?: {
      id: string;
      minimum_version?: string;
    }[];
    input_components?: any;
    key?: string;
    minimum_chrome_version?: string;
    nacl_modules?: {
      path: string;
      mime_type: string;
    }[];
    oauth2?: any;
    offline_enabled?: boolean;
    options_page?: string;
    platforms?: any;
    requirements?: any;
    sandbox?: {
      pages: string[];
      content_security_policy?: string;
    }[];
    signature?: any;
    spellcheck?: any;
    storage?: {
      managed_schema: string;
    };
    system_indicator?: any;
    tts_engine?: {
      voice: {
        voice_name: string;
        lang?: string;
        gender?: "male" | "female";
        event_types: (
          | "start"
          | "word"
          | "sentence"
          | "marker"
          | "end"
          | "error")[];
      }[];
    };
    update_url?: string;
    version_name?: string;
  };

  function getBackgroundPage(): Promise<Window>;
  function openOptionsPage(): Promise<void>;
  function getManifest(): Manifest;

  function getURL(path: string): string;
  function setUninstallURL(url: string): Promise<void>;
  function reload(): void;
  // Will not exist: https://bugzilla.mozilla.org/show_bug.cgi?id=1314922
  // function RequestUpdateCheck(): Promise<RequestUpdateCheckStatus>;
  function connect(
    connectInfo?: { name?: string; includeTlsChannelId?: boolean }
  ): Port;
  function connect(
    extensionId?: string,
    connectInfo?: { name?: string; includeTlsChannelId?: boolean }
  ): Port;
  function connectNative(application: string): Port;

  function sendMessage<T = any, U = any>(message: T): Promise<U>;
  function sendMessage<T = any, U = any>(
    message: T,
    options: { includeTlsChannelId?: boolean; toProxyScript?: boolean }
  ): Promise<U>;
  function sendMessage<T = any, U = any>(
    extensionId: string,
    message: T
  ): Promise<U>;
  function sendMessage<T = any, U = any>(
    extensionId: string,
    message: T,
    options?: { includeTlsChannelId?: boolean; toProxyScript?: boolean }
  ): Promise<U>;

  function sendNativeMessage(
    application: string,
    message: object
  ): Promise<object | void>;
  function getPlatformInfo(): Promise<PlatformInfo>;
  function getBrowserInfo(): Promise<{
    name: string;
    vendor: string;
    version: string;
    buildID: string;
  }>;
  // Unsupported: https://bugzilla.mozilla.org/show_bug.cgi?id=1339407
  // function getPackageDirectoryEntry(): Promise<any>;

  const onStartup: Listener<void>;
  const onInstalled: Listener<{
    reason: OnInstalledReason;
    previousVersion?: string;
    id?: string;
  }>;
  // Unsupported
  // const onSuspend: Listener<void>;
  // const onSuspendCanceled: Listener<void>;
  // const onBrowserUpdateAvailable: Listener<void>;
  // const onRestartRequired: Listener<OnRestartRequiredReason>;
  const onUpdateAvailable: Listener<{ version: string }>;
  const onConnect: Listener<Port>;

  const onConnectExternal: Listener<Port>;

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

  type onMessageVoid = (
    message: object,
    sender: MessageSender,
    sendResponse: (response: object) => Promise<void>
  ) => void;

  type onMessageEvent = onMessagePromise | onMessageBool | onMessageVoid;
  const onMessage: EvListener<onMessageEvent>;

  const onMessageExternal: EvListener<onMessageEvent>;
}

declare namespace browser.search {
  function get(): Promise<{
    name: string;
    isDefault: boolean;
    alias?: string;
    favIconUrl?: string;
  }[]>;
  function search(searchProperties: {
    query: string;
    engine?: string;
    tabId?: number;
  }): void;
}

declare namespace browser.sessions {
  type Filter = { maxResults?: number };

  type Session = {
    lastModified: number;
    tab: browser.tabs.Tab;
    window: browser.windows.Window;
  };

  const MAX_SESSION_RESULTS: number;

  function getRecentlyClosed(filter?: Filter): Promise<Session[]>;

  function restore(sessionId: string): Promise<Session>;

  function setTabValue(
    tabId: number,
    key: string,
    value: string | object
  ): Promise<void>;

  function getTabValue(
    tabId: number,
    key: string
  ): Promise<void | string | object>;

  function removeTabValue(tabId: number, key: string): Promise<void>;

  function setWindowValue(
    windowId: number,
    key: string,
    value: string | object
  ): Promise<void>;

  function getWindowValue(
    windowId: number,
    key: string
  ): Promise<void | string | object>;

  function removeWindowValue(windowId: number, key: string): Promise<void>;

  const onChanged: EvListener<() => void>;
}

declare namespace browser.sidebarAction {
  type ImageDataType = ImageData;

  function setPanel(details: WinOrTab<{ panel: string | null; }>): void;

  function getPanel(details: WinOrTab<{}>): Promise<string>;

  function setTitle(details: WinOrTab<{ title: string | null; }>): void;

  function getTitle(details: WinOrTab<{}>): Promise<string>;

  type IconViaPath = {
    path: string | { [index: number]: string } | null;
  };

  type IconViaImageData = {
    imageData: ImageDataType | { [index: number]: ImageDataType } | null;
  };

  function setIcon(details: WinOrTab<IconViaPath | IconViaImageData>): Promise<void>;

  function isOpen(details: {
    windowId?: number
  }): Promise<boolean>;

  function open(): Promise<void>;

  function close(): Promise<void>;
}

declare namespace browser.storage {
  // Non-firefox implementations don't accept all these types
  type StorageValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | RegExp
    | ArrayBuffer
    | Uint8ClampedArray
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Float32Array
    | Float64Array
    | DataView
    | StorageArray
    | StorageMap
    | StorageSet
    | StorageObject;

  // The Index signature makes casting to/from classes or interfaces a pain.
  // Custom types are OK.
  interface StorageObject {
    [key: string]: StorageValue;
  }
  // These have to be interfaces rather than types to avoid a circular
  // definition of StorageValue
  interface StorageArray extends Array<StorageValue> {}
  interface StorageMap extends Map<StorageValue, StorageValue> {}
  interface StorageSet extends Set<StorageValue> {}

  interface Get {
    <T extends StorageObject>(keys?: string | string[] | null): Promise<T>;
    /* <T extends StorageObject>(keys: T): Promise<{[K in keyof T]: T[K]}>; */
    <T extends StorageObject>(keys: T): Promise<T>;
  }

  type StorageArea = {
    get: Get;
    // unsupported: getBytesInUse: (keys: string|string[]|null) => Promise<number>,
    set: (keys: StorageObject) => Promise<void>;
    remove: (keys: string | string[]) => Promise<void>;
    clear: () => Promise<void>;
  };

  type StorageChange = {
    oldValue?: any;
    newValue?: any;
  };

  const sync: StorageArea;
  const local: StorageArea;
  const managed: StorageArea;

  type ChangeDict = { [field: string]: StorageChange };
  type StorageName = "sync" | "local" /* |"managed" */;

  const onChanged: EvListener<
    (changes: ChangeDict, areaName: StorageName) => void
  >;
}

declare namespace browser.tabs {
  type MutedInfoReason = "capture" | "extension" | "user";
  type MutedInfo = {
    muted: boolean;
    extensionId?: string;
    reason: MutedInfoReason;
  };
  // TODO: Specify PageSettings properly.
  type PageSettings = object;
  type Tab = {
    active: boolean;
    audible?: boolean;
    autoDiscardable?: boolean;
    cookieStoreId?: string;
    discarded?: boolean;
    favIconUrl?: string;
    height?: number;
    hidden: boolean;
    highlighted: boolean;
    id?: number;
    incognito: boolean;
    index: number;
    isArticle: boolean;
    isInReaderMode: boolean;
    lastAccessed: number;
    mutedInfo?: MutedInfo;
    openerTabId?: number;
    pinned: boolean;
    selected: boolean;
    sessionId?: string;
    status?: string;
    title?: string;
    url?: string;
    width?: number;
    windowId: number;
  };

  type TabStatus = "loading" | "complete";
  type WindowType = "normal" | "popup" | "panel" | "devtools";
  type ZoomSettingsMode = "automatic" | "disabled" | "manual";
  type ZoomSettingsScope = "per-origin" | "per-tab";
  type ZoomSettings = {
    defaultZoomFactor?: number;
    mode?: ZoomSettingsMode;
    scope?: ZoomSettingsScope;
  };

  const TAB_ID_NONE: number;

  function connect(
    tabId: number,
    connectInfo?: { name?: string; frameId?: number }
  ): browser.runtime.Port;
  function create(createProperties: {
    active?: boolean;
    cookieStoreId?: string;
    index?: number;
    openerTabId?: number;
    pinned?: boolean;
    // deprecated: selected: boolean,
    url?: string;
    windowId?: number;
  }): Promise<Tab>;
  function captureTab(
    tabId?: number,
    options?: browser.extensionTypes.ImageDetails
  ): Promise<string>;
  function captureVisibleTab(
    windowId?: number,
    options?: browser.extensionTypes.ImageDetails
  ): Promise<string>;
  function detectLanguage(tabId?: number): Promise<string>;
  function discard(tabIds: number | number[]): Promise<void>;
  function duplicate(tabId: number): Promise<Tab>;
  function executeScript(
    tabId: number | undefined,
    details: browser.extensionTypes.InjectDetails
  ): Promise<object[]>;
  function get(tabId: number): Promise<Tab>;
  // deprecated: function getAllInWindow(): x;
  function getCurrent(): Promise<Tab>;
  // deprecated: function getSelected(windowId?: number): Promise<browser.tabs.Tab>;
  function getZoom(tabId?: number): Promise<number>;
  function getZoomSettings(tabId?: number): Promise<ZoomSettings>;
  function hide(tabIds: number | number[]): Promise<number[]>;
  function highlight(highlightInfo: {
    windowId?: number;
    populate?: boolean;
    tabs: number[]|number;
  }): Promise<browser.windows.Window>;
  function insertCSS(
    tabId: number | undefined,
    details: browser.extensionTypes.InjectDetailsCSS
  ): Promise<void>;
  function removeCSS(
    tabId: number | undefined,
    details: browser.extensionTypes.InjectDetails
  ): Promise<void>;
  function move(
    tabIds: number | number[],
    moveProperties: {
      windowId?: number;
      index: number;
    }
  ): Promise<Tab | Tab[]>;
  function moveInSuccession(tabIds: number[], tabId?: number, options?: {
    append?: boolean;
    insert?: boolean;
  }): void;
  function print(): Promise<void>;
  function printPreview(): Promise<void>;
  function query(queryInfo: {
    active?: boolean;
    audible?: boolean;
    // unsupported: autoDiscardable?: boolean,
    cookieStoreId?: string;
    currentWindow?: boolean;
    discarded?: boolean;
    hidden?: boolean;
    highlighted?: boolean;
    index?: number;
    muted?: boolean;
    lastFocusedWindow?: boolean;
    pinned?: boolean;
    status?: TabStatus;
    title?: string;
    url?: string | string[];
    windowId?: number;
    windowType?: WindowType;
  }): Promise<Tab[]>;
  function reload(
    tabId?: number,
    reloadProperties?: { bypassCache?: boolean }
  ): Promise<void>;
  function remove(tabIds: number | number[]): Promise<void>;
  function saveAsPDF(
    pageSettings: PageSettings
  ): Promise<"saved" | "replaced" | "canceled" | "not_saved" | "not_replaced">;
  function sendMessage<T = any, U = object>(
    tabId: number,
    message: T,
    options?: { frameId?: number }
  ): Promise<U | void>;
  // deprecated: function sendRequest(): x;
  function setZoom(
    tabId: number | undefined,
    zoomFactor: number
  ): Promise<void>;
  function setZoomSettings(
    tabId: number | undefined,
    zoomSettings: ZoomSettings
  ): Promise<void>;
  function show(tabIds: number | number[]): Promise<void>;
  function toggleReaderMode(tabId?: number): Promise<void>;
  function update(
    tabId: number | undefined,
    updateProperties: {
      active?: boolean;
      // unsupported: autoDiscardable?: boolean,
      // unsupported: highlighted?: boolean,
      // unsupported: hidden?: boolean;
      loadReplace?: boolean;
      muted?: boolean;
      openerTabId?: number;
      pinned?: boolean;
      // deprecated: selected?: boolean,
      url?: string;
    }
  ): Promise<Tab>;

  const onActivated: Listener<{ tabId: number; windowId: number }>;
  const onAttached: EvListener<
    (
      tabId: number,
      attachInfo: {
        newWindowId: number;
        newPosition: number;
      }
    ) => void
  >;
  const onCreated: Listener<Tab>;
  const onDetached: EvListener<
    (
      tabId: number,
      detachInfo: {
        oldWindowId: number;
        oldPosition: number;
      }
    ) => void
  >;
  const onHighlighted: Listener<{ windowId: number; tabIds: number[] }>;
  const onMoved: EvListener<
    (
      tabId: number,
      moveInfo: {
        windowId: number;
        fromIndex: number;
        toIndex: number;
      }
    ) => void
  >;
  const onRemoved: EvListener<
    (
      tabId: number,
      removeInfo: {
        windowId: number;
        isWindowClosing: boolean;
      }
    ) => void
  >;
  const onReplaced: EvListener<
    (addedTabId: number, removedTabId: number) => void
  >;
  const onUpdated: EvListener<
    (
      tabId: number,
      changeInfo: {
        audible?: boolean;
        discarded?: boolean;
        favIconUrl?: string;
        mutedInfo?: MutedInfo;
        pinned?: boolean;
        status?: string;
        title?: string;
        url?: string;
      },
      tab: Tab
    ) => void
  >;
  const onZoomChanged: Listener<{
    tabId: number;
    oldZoomFactor: number;
    newZoomFactor: number;
    zoomSettings: ZoomSettings;
  }>;
}

declare namespace browser.theme {
  type ThemeAlignment =
    | "bottom"
    | "center"
    | "left"
    | "right"
    | "top"
    | "center bottom"
    | "center center"
    | "center top"
    | "left bottom"
    | "left center"
    | "left top"
    | "right bottom"
    | "right center"
    | "right top";
  type ThemeColor = string | [number, number, number];
  type ThemeTiling =
    | "no-repeat"
    | "repeat"
    | "repeat-x"
    | "repeat-y";

  type Theme = {
    images?: {
      theme_frame: string;
      additional_backgrounds: string[];
    };

    colors: {
      /**
       * Alias for `toolbar_text`
       */
      bookmark_text?: ThemeColor;
      button_background_active?: ThemeColor;
      button_background_hover?: ThemeColor;
      icons?: ThemeColor;
      icons_attention?: ThemeColor;
      frame?: ThemeColor;
      frame_inactive?: ThemeColor;
      ntp_background?: ThemeColor;
      ntp_text?: ThemeColor;
      popup?: ThemeColor;
      popup_border?: ThemeColor;
      popup_highlight?: ThemeColor;
      popup_highlight_text?: ThemeColor;
      popup_text?: ThemeColor;
      sidebar?: ThemeColor;
      sidebar_border?: ThemeColor;
      sidebar_highlight?: ThemeColor;
      sidebar_highlight_text?: ThemeColor;
      sidebar_text?: ThemeColor;
      tab_background_separator?: ThemeColor;
      tab_background_text?: ThemeColor;
      tab_line?: ThemeColor;
      tab_loading?: ThemeColor;
      tab_selected?: ThemeColor;
      tab_text?: ThemeColor;
      toolbar?: ThemeColor;
      toolbar_bottom_separator?: ThemeColor;
      toolbar_field?: ThemeColor;
      toolbar_field_border?: ThemeColor;
      toolbar_field_border_focus?: ThemeColor;
      toolbar_field_focus?: ThemeColor;
      toolbar_field_highlight?: ThemeColor;
      toolbar_field_highlight_text?: ThemeColor;
      toolbar_field_separator?: ThemeColor;
      toolbar_field_text?: ThemeColor;
      toolbar_field_text_focus?: ThemeColor;
      toolbar_text?: ThemeColor;
      toolbar_top_separator?: ThemeColor;
      toolbar_vertical_separator?: ThemeColor;
    };

    properties?: {
      additional_backgrounds_alignment?: ThemeAlignment[];
      additional_backgrounds_tiling?: ThemeTiling[];
    };
  };

  function getCurrent(windowId?: number): Promise<Theme>;
  function update(theme: Theme): void;
  function update(windowId: number, theme: Theme): void;
  function reset(windowId?: number): void;

  const onUpdated: Listener<{ theme: Theme, windowId?: number }>;
}

declare namespace browser.topSites {
  type MostVisitedURL = {
    favicon?: string;
    title: string;
    url: string;
  };
  function get(options?: {
    includeBlocked?: boolean;
    includeFavicon?: boolean;
    limit?: number;
    onePerDomain?: boolean;
  }): Promise<MostVisitedURL[]>;
}

declare namespace browser.types {
  type BrowserSettingDetails<T> = {
    value: T;
    levelOfControl:
      | "not_controllable"
      | "controlled_by_other_extensions"
      | "controllable_by_this_extension"
      | "controlled_by_this_extension";
  }

  interface BrowserSetting<T> {
    get(details: {}): Promise<BrowserSettingDetails<T>>;
    set(details: { value: T }): Promise<boolean>;
    clear(details: {}): Promise<boolean>;
    
    onChange: Listener<BrowserSettingDetails<T>>;
  }
}

declare namespace browser.webNavigation {
  type TransitionType = "link" | "auto_subframe" | "form_submit" | "reload";
  // unsupported: | "typed" | "auto_bookmark" | "manual_subframe"
  //              | "generated" | "start_page" | "keyword"
  //              | "keyword_generated";

  type TransitionQualifier =
    | "client_redirect"
    | "server_redirect"
    | "forward_back";
  // unsupported: "from_address_bar";

  function getFrame(details: {
    tabId: number;
    processId: number;
    frameId: number;
  }): Promise<{ errorOccured: boolean; url: string; parentFrameId: number }>;

  function getAllFrames(details: {
    tabId: number;
  }): Promise<
    {
      errorOccured: boolean;
      processId: number;
      frameId: number;
      parentFrameId: number;
      url: string;
    }[]
  >;

  interface NavListener<T> {
    addListener: (
      callback: (arg: T) => void,
      filter?: {
        url: browser.events.UrlFilter[];
      }
    ) => void;
    removeListener: (callback: (arg: T) => void) => void;
    hasListener: (callback: (arg: T) => void) => boolean;
  }

  type DefaultNavListener = NavListener<{
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    timeStamp: number;
  }>;

  type TransitionNavListener = NavListener<{
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    timeStamp: number;
    transitionType: TransitionType;
    transitionQualifiers: TransitionQualifier[];
  }>;

  const onBeforeNavigate: NavListener<{
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    parentFrameId: number;
    timeStamp: number;
  }>;

  const onCommitted: TransitionNavListener;

  const onCreatedNavigationTarget: NavListener<{
    sourceFrameId: number;
    // Unsupported: sourceProcessId: number,
    sourceTabId: number;
    tabId: number;
    timeStamp: number;
    url: string;
    windowId: number;
  }>;

  const onDOMContentLoaded: DefaultNavListener;

  const onCompleted: DefaultNavListener;

  const onErrorOccurred: DefaultNavListener; // error field unsupported

  const onReferenceFragmentUpdated: TransitionNavListener;

  const onHistoryStateUpdated: TransitionNavListener;
}

declare namespace browser.webRequest {
  type ResourceType =
    | "main_frame"
    | "sub_frame"
    | "stylesheet"
    | "script"
    | "image"
    | "object"
    | "xmlhttprequest"
    | "xbl"
    | "xslt"
    | "ping"
    | "beacon"
    | "xml_dtd"
    | "font"
    | "media"
    | "object_subrequest"
    | "websocket"
    | "csp_report"
    | "imageset"
    | "web_manifest"
    | "other";

  type RequestFilter = {
    urls: string[];
    types?: ResourceType[];
    tabId?: number;
    windowId?: number;
  };

  type StreamFilter = {
    onstart: (event: any) => void;
    ondata: (event: { data: ArrayBuffer }) => void;
    onstop: (event: any) => void;
    onerror: (event: any) => void;

    close(): void;
    disconnect(): void;
    resume(): void;
    suspend(): void;
    write(data: Uint8Array | ArrayBuffer): void;

    error: string;
    status:
      | "uninitialized"
      | "transferringdata"
      | "finishedtransferringdata"
      | "suspended"
      | "closed"
      | "disconnected"
      | "failed";
  };

  type HttpHeaders = (
    | { name: string; binaryValue: number[]; value?: string }
    | { name: string; value: string; binaryValue?: number[] })[];

  type BlockingResponse = {
    cancel?: boolean;
    redirectUrl?: string;
    requestHeaders?: HttpHeaders;
    responseHeaders?: HttpHeaders;
    authCredentials?: { username: string; password: string };
    upgradeToSecure?: boolean;
  };

  interface CertificateInfo {
    fingerprint: {
      sha1?: string;
      sha256: string;
    };
    isBuiltInRoot: boolean;
    issuer: string;
    rawDER?: number[];
    serialNumber: string;
    subject: string;
    subjectPublicKeyInfoDigest: {
      sha256: string;
    };
    validity: {
      start: number;
      end: number;
    }
  }

  type SecurityInfoTransparencyStatus =
    | "not_applicable"
    | "policy_compliant"
    | "policy_not_enough_scts"
    | "policy_not_diverse_scts";

  type SecurityInfoProtocolVersion =
    | "TLSv1"
    | "TLSv1.1"
    | "TLSv1.2"
    | "TLSv1.3"
    | "unknown";

  type SecurityInfoState =
    | "broken"
    | "insecure"
    | "secure"
    | "weak";

  interface SecurityInfo {
    certificates: CertificateInfo[];
    certificateTransparencyStatus?: SecurityInfoTransparencyStatus;
    cipherSuite?: string;
    errorMessage?: string;
    hpkp?: boolean;
    hsts?: boolean;
    isDomainMismatch?: boolean;
    isExtendedValidation?: boolean;
    isNotValidAtThisTime?: boolean;
    isUntrusted?: boolean;
    keaGroupName?: string;
    protocolVersion?: SecurityInfoProtocolVersion;
    signatureSchemeName?: string;
    state: SecurityInfoState;
    weaknessReasons?: string;
  }

  type UploadData = {
    bytes?: ArrayBuffer;
    file?: string;
  };

  const MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES: number;

  function handlerBehaviorChanged(): Promise<void>;

  // TODO: Enforce the return result of the addListener call in the contract
  //       Use an intersection type for all the default properties
  interface ReqListener<T, U> {
    addListener: (
      callback: (arg: T) => void,
      filter: RequestFilter,
      extraInfoSpec?: Array<U>
    ) => BlockingResponse | Promise<BlockingResponse>;
    removeListener: (callback: (arg: T) => void) => void;
    hasListener: (callback: (arg: T) => void) => boolean;
  }

  const onBeforeRequest: ReqListener<
    {
      requestId: string;
      url: string;
      method: string;
      frameId: number;
      parentFrameId: number;
      requestBody?: {
        error?: string;
        formData?: { [key: string]: string[] };
        raw?: UploadData[];
      };
      tabId: number;
      type: ResourceType;
      timeStamp: number;
      originUrl: string;
    },
    "blocking" | "requestBody"
  >;

  const onBeforeSendHeaders: ReqListener<
    {
      documentUrl?: string;
      requestId: string;
      url: string;
      method: string;
      frameId: number;
      parentFrameId: number;
      proxyInfo?: {
        host?: string;
        port?: number;
        type: "http" | "https" | "socks" | "socks5" | "direct" | "unknown";
        username?: string;
        password?: string;
        proxyDNS?: boolean;
        failoverTimeout?: number;
      };
      tabId: number;
      type: ResourceType;
      timeStamp: number;
      originUrl: string;
      requestHeaders?: HttpHeaders;
    },
    "blocking" | "requestHeaders"
  >;

  const onSendHeaders: ReqListener<
    {
      requestId: string;
      url: string;
      method: string;
      frameId: number;
      parentFrameId: number;
      tabId: number;
      type: ResourceType;
      timeStamp: number;
      originUrl: string;
      requestHeaders?: HttpHeaders;
    },
    "requestHeaders"
  >;

  const onHeadersReceived: ReqListener<
    {
      requestId: string;
      url: string;
      method: string;
      frameId: number;
      parentFrameId: number;
      tabId: number;
      type: ResourceType;
      timeStamp: number;
      originUrl: string;
      statusLine: string;
      responseHeaders?: HttpHeaders;
      statusCode: number;
    },
    "blocking" | "responseHeaders"
  >;

  const onAuthRequired: ReqListener<
    {
      requestId: string;
      url: string;
      method: string;
      frameId: number;
      parentFrameId: number;
      tabId: number;
      type: ResourceType;
      timeStamp: number;
      scheme: string;
      realm?: string;
      challenger: { host: string; port: number };
      isProxy: boolean;
      responseHeaders?: HttpHeaders;
      statusLine: string;
      statusCode: number;
    },
    "blocking" | "responseHeaders"
  >;

  const onResponseStarted: ReqListener<
    {
      requestId: string;
      url: string;
      method: string;
      frameId: number;
      parentFrameId: number;
      tabId: number;
      type: ResourceType;
      timeStamp: number;
      originUrl: string;
      ip?: string;
      fromCache: boolean;
      statusLine: string;
      responseHeaders?: HttpHeaders;
      statusCode: number;
    },
    "responseHeaders"
  >;

  const onBeforeRedirect: ReqListener<
    {
      requestId: string;
      url: string;
      method: string;
      frameId: number;
      parentFrameId: number;
      tabId: number;
      type: ResourceType;
      timeStamp: number;
      originUrl: string;
      ip?: string;
      fromCache: boolean;
      statusCode: number;
      redirectUrl: string;
      statusLine: string;
      responseHeaders?: HttpHeaders;
    },
    "responseHeaders"
  >;

  const onCompleted: ReqListener<
    {
      requestId: string;
      url: string;
      method: string;
      frameId: number;
      parentFrameId: number;
      tabId: number;
      type: ResourceType;
      timeStamp: number;
      originUrl: string;
      ip?: string;
      fromCache: boolean;
      statusCode: number;
      statusLine: string;
      responseHeaders?: HttpHeaders;
    },
    "responseHeaders"
  >;

  const onErrorOccurred: ReqListener<
    {
      requestId: string;
      url: string;
      method: string;
      frameId: number;
      parentFrameId: number;
      tabId: number;
      type: ResourceType;
      timeStamp: number;
      originUrl: string;
      ip?: string;
      fromCache: boolean;
      error: string;
    },
    void
  >;

  function filterResponseData(requestId: string): StreamFilter;
  function getSecurityInfo(requestId: string, options?: {
    certificateChain?: boolean;
    rawDER?: boolean;
  }): Promise<SecurityInfo>;
}

declare namespace browser.windows {
  type WindowType = "normal" | "popup" | "panel" | "devtools";

  type WindowState =
    | "normal"
    | "minimized"
    | "maximized"
    | "fullscreen"
    | "docked";

  type Window = {
    id?: number;
    focused: boolean;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    tabs?: browser.tabs.Tab[];
    title?: string;
    incognito: boolean;
    type?: WindowType;
    state?: WindowState;
    alwaysOnTop: boolean;
    sessionId?: string;
  };

  type CreateType = "normal" | "popup" | "panel" | "detached_panel";

  const WINDOW_ID_NONE: number;

  const WINDOW_ID_CURRENT: number;

  function get(
    windowId: number,
    getInfo?: {
      populate?: boolean;
      windowTypes?: WindowType[];
    }
  ): Promise<browser.windows.Window>;

  function getCurrent(getInfo?: {
    populate?: boolean;
    windowTypes?: WindowType[];
  }): Promise<browser.windows.Window>;

  function getLastFocused(getInfo?: {
    populate?: boolean;
    windowTypes?: WindowType[];
  }): Promise<browser.windows.Window>;

  function getAll(getInfo?: {
    populate?: boolean;
    windowTypes?: WindowType[];
  }): Promise<browser.windows.Window[]>;

  // TODO: url and tabId should be exclusive
  function create(createData?: {
    allowScriptsToClose?: boolean;
    url?: string | string[];
    tabId?: number;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    // unsupported: focused?: boolean,
    incognito?: boolean;
    titlePreface?: string;
    type?: CreateType;
    state?: WindowState;
  }): Promise<browser.windows.Window>;

  function update(
    windowId: number,
    updateInfo: {
      left?: number;
      top?: number;
      width?: number;
      height?: number;
      focused?: boolean;
      drawAttention?: boolean;
      state?: WindowState;
      titlePreface?: string;
    }
  ): Promise<browser.windows.Window>;

  function remove(windowId: number): Promise<void>;

  const onCreated: Listener<browser.windows.Window>;

  const onRemoved: Listener<number>;

  const onFocusChanged: Listener<number>;
}
