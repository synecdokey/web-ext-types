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

interface Listener<T> {
    addListener: (callback: (arg: T) => void) => void;
    removeListener: (listener: Listener<T>) => void;
    hasListener: (listener: Listener<T>) => boolean;
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

    type onStartup = Listener<void>;
    type onInstalled = Listener<{
        reason: OnInstalledReason,
        previousVersion?: string,
        id?: string,
    }>;
    // Unsupported
    // type onSuspend = Listener<void>;
    // type onSuspendCanceled = Listener<void>;
    // type onBrowserUpdateAvailable = Listener<void>;
    // type onConnectExternal = Listener<Port>;
    // type onMessageExternal = Listener<any>;
    // type onRestartRequired = Listener<OnRestartRequiredReason>;
    type onUpdateAvailable = Listener<{ version: string }>;
    type onConnect = Listener<Port>;
    interface onMessage = {
        addListener: (
            callback: (
                message: object,
                sender: MessageSender,
                sendResponse: (response: object) => boolean | Promise<void>
            ) => boolean | Promise<void>
        ) => void;
        removeListener: (listener: onMessage) => void;
        hasListener: (listener: onMessage) => boolean;
    };
}

declare namespace browser.tabs {
    type Tab = {
        active: boolean,
        audible?: boolean,
    };
}
