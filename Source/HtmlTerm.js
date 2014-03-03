/*
  HtmlTerm: An HTML5 WebSocket client
  Copyright (C) 2009-2013  Rick Parrish, R&M Software

  This file is part of HtmlTerm.

  HtmlTerm is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  any later version.

  HtmlTerm is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with HtmlTerm.  If not, see <http://www.gnu.org/licenses/>.
*/
var HtmlTerm = function () { }; // Do nothing
var THtmlTerm = function () {
    // Private variables
    var that = this;
    var FConnection = 0;
    var FContainer = 0;
    var FLastTimer = 0;
    var FSaveFilesButton = 0;
    var FTimer = 0;
    var FUploadList = 0;
    var FYModemReceive = 0;
    var FYModemSend = 0;

    // Settings to be loaded from HTML
    var FBitsPerSecond = 115200;
    var FBlink = true;
    var FCodePage = "437";
    var FEnter = "\r";
    var FFontHeight = 16;
    var FFontWidth = 9;
    var FHostname = "bbs.ftelnet.ca";
    var FPort = 1123;
    var FProxyHostname = "";
    var FProxyPort = 11235;
    var FScreenColumns = 80;
    var FScreenRows = 25;
    var FServerName = "fTelnet / HtmlTerm / GameSrv Support Server";
    var FSplashScreen = "G1swbRtbMkobWzA7MEgbWzE7NDQ7MzRt2sTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEG1swOzQ0OzMwbb8bWzBtDQobWzE7NDQ7MzRtsyAgG1szN21XZWxjb21lISAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAbWzA7NDQ7MzBtsxtbMG0NChtbMTs0NDszNG3AG1swOzQ0OzMwbcTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTE2RtbMG0NCg0KG1sxbSAbWzBtIBtbMTs0NDszNG3axMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMQbWzA7NDQ7MzBtvxtbMG0NCiAgG1sxOzQ0OzM0bbMbWzA7MzRt29vb2xtbMzBt29vb29vb29vb29vb29vb29vb29vb2xtbMzRt29vb29vbG1s0NDszMG2zG1swbQ0KICAbWzE7NDQ7MzRtsxtbMDszNG3b29vbG1sxOzMwbdvb29vb29vb29vb29vb29vb29vb29sbWzA7MzBt29sbWzM0bdvb29sbWzQ0OzMwbbMbWzBtDQogIBtbMTs0NDszNG2zG1swOzM0bdvb29sbWzE7MzBt29vb2xtbMG3b29vb29vb29vb29sbWzFt29vb2xtbMzBt29sbWzA7MzBt29sbWzM0bdvb29sbWzQ0OzMwbbMbWzBtDQogIBtbMTs0NDszNG2zG1swOzM0bdvb29sbWzE7MzBt29vb2xtbMG3b29vb29vb29vbG1sxbdvb29sbWzBt29sbWzE7MzBt29sbWzA7MzBt29sbWzM0bdvb29sbWzQ0OzMwbbMbWzBtDQogIBtbMTs0NDszNG2zG1swOzM0bdvb29sbWzE7MzBt29vb2xtbMG3b29vb29vb2xtbMW3b29vbG1swbdvbG1sxbdvbG1szMG3b2xtbMDszMG3b2xtbMzRt29vb2xtbNDQ7MzBtsxtbMG0NCiAgG1sxOzQ0OzM0bbMbWzA7MzRt29vb2xtbMTszMG3b29vbG1swbdvb29vb2xtbMW3b29vbG1swbdvbG1sxbdvb29sbWzMwbdvbG1swOzMwbdvbG1szNG3b29vbG1s0NDszMG2zG1swbQ0KICAbWzE7NDQ7MzRtsxtbMDszNG3b29vbG1sxOzMwbdvb29sbWzBt29vb2xtbMW3b29vbG1swbdvbG1sxbdvb29vb2xtbMzBt29sbWzA7MzBt29sbWzM0bdvb29sbWzQ0OzMwbbMbWzQwOzM3bQ0KICAbWzE7NDQ7MzRtsxtbMDszNG3b29vbG1sxOzMwbdvbG1swOzMwbdvbG1sxbdvb29vb29vb29vb29vb29vb2xtbMDszMG3b2xtbMzRt29vb2xtbNDQ7MzBtsxtbNDA7MzdtDQogIBtbMTs0NDszNG2zG1swOzM0bdvb29sbWzE7MzBt29sbWzBt29vb29vb29vb29vb29vb29vb29sbWzMwbdvbG1szNG3b29vbG1s0NDszMG2zG1s0MDszN20NCiAgG1sxOzQ0OzM0bbMbWzA7MzBt29vb29vb29vb29vb29vb29vb29vb29vb29vb29vbG1szNG3b2xtbNDQ7MzBtsxtbNDA7MzdtDQogIBtbMTs0NDszNG2zG1s0MDszMG3b2xtbMG3b29vb29vb29vb29vb29vb29vb29vb29vb29vbG1szMG3b2xtbNDRtsxtbNDA7MzdtIBtbMzRtIBtbMTs0NzszN23axMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMQbWzMwbb8bWzBtDQogIBtbMTs0NDszNG2zG1swOzMwbdvbG1sxbdvb29vb29vb29vb29vb29sbWzA7MzBt29vb29vb29vb2xtbMW3b2xtbMDszMG3b2xtbNDRtsxtbNDA7MzdtIBtbMzRtIBtbMTs0NzszN22zICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAbWzMwbbMbWzBtDQogIBtbMTs0NDszNG2zG1s0MDszMG3b2xtbMG3b29vb29vb29vb29vb29vb29vb29vb29vb29vbG1szMG3b2xtbNDRtsxtbMG0gG1szNG0gG1sxOzQ3OzM3bbMgICAbWzM0bUh0bWxUZXJtIC0tIFRlbG5ldCBmb3IgdGhlIFdlYiAgICAgG1szMG2zG1swbQ0KG1sxbSAbWzBtIBtbMTs0NDszNG2zG1swOzMwbdvbG1sxbdvb29vb29vb29vb29vb29vb29vb29vb2xtbMDszMG3b29vb29sbWzQ0bbMbWzBtIBtbMzRtIBtbMTs0NzszN22zICAgICAbWzA7NDc7MzRtV2ViIGJhc2VkIEJCUyB0ZXJtaW5hbCBjbGllbnQgICAgG1sxOzMwbbMbWzBtDQogIBtbMTs0NDszNG2zG1swOzM0bdvbG1szMG3b29vb29vb29vb29vb29vb29vb29vb29vb29vbG1szNG3b2xtbNDQ7MzBtsxtbMG0gG1szNG0gG1sxOzQ3OzM3bbMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIBtbMzBtsxtbMG0NCiAgG1sxOzQ0OzM0bcAbWzA7NDQ7MzBtxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTZG1swbSAbWzM0bSAbWzE7NDc7MzdtwBtbMzBtxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTZG1swbQ0KDQobWzExQxtbMTszMm1Db3B5cmlnaHQgKEMpIDIwMDAtMjAxNCBSJk0gU29mdHdhcmUuICBBbGwgUmlnaHRzIFJlc2VydmVkDQobWzA7MzRtxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExA==";

    // Private methods
    var CenterSaveFilesButton = function () { }; // Do nothing
    var LoadFile = function (f, len) { }; // Do nothing
    var OnAnsiESC5n = function (AEvent) { }; // Do nothing
    var OnAnsiESC6n = function (AEvent) { }; // Do nothing
    var OnAnsiESC255n = function (AEvent) { }; // Do nothing
    var OnAnsiESCQ = function (AEvent) { }; // Do nothing
    var OnCloseButtonClick = function (me) { }; // Do nothing
    var OnConnectionClose = function (e) { }; // Do nothing
    var OnConnectionConnect = function (e) { }; // Do nothing
    var OnConnectionIOError = function (e) { }; // Do nothing
    var OnConnectionSecurityError = function (see) { }; // Do nothing
    var OnCrtFontChanged = function (e) { }; // Do nothing    
    var OnCrtScreenSizeChanged = function (e) { }; // Do nothing
    var OnDonateMenuClick = function (cme) { }; // Do nothing
    var OnDownloadComplete = function () { }; // Do nothing
    var OnHelpMenuClick = function (cme) { }; // Do nothing
    var OnMaximizeButtonClick = function (me) { }; // Do nothing
    var OnMinimizeButtonClick = function (me) { }; // Do nothing
    var OnSaveFilesButtonClick = function (me) { }; // Do nothing
    var OnSaveFilesButtonGraphicChanged = function (e) { }; // Do nothing
    var OnTimer = function (e) { }; // Do nothing
    var OnUploadComplete = function (e) { }; // Do nothing
    var OnUploadListFileLoad = function (e) { }; // Do nothing
    var OnUploadListFileSelect = function (e) { }; // Do nothing
    var OnUploadMenuClick = function (cme) { }; // Do nothing
    var OnWebPageMenuClick = function (cme) { }; // Do nothing
    var ShowSaveFilesButton = function () { }; // Do nothing

    this.Init = function (AContainerID) {
        // Ensure we have our container
        if (document.getElementById(AContainerID) === null) {
            trace('HtmlTerm Error: Your document is missing the required element with id="' + AContainerID + '"');
            return false;
        }
        FContainer = document.getElementById(AContainerID);

        // IE less than 9.0 will throw script errors and not even load
        if (navigator.appName === 'Microsoft Internet Explorer') {
            var Version = -1;
            var RE = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
            if (RE.exec(navigator.userAgent) !== null) { Version = parseFloat(RegExp.$1); }
            if (Version < 9.0) {
                trace("HtmlTerm Error: IE less than 9.0 found (and is not supported)");
                return false;
            }
        }

        // Seup the crt window
        if (Crt.Init(FContainer)) {
            Crt.Blink = FBlink;
            Crt.SetFont(FCodePage, FFontWidth, FFontHeight);
            Crt.SetScreenSize(FScreenColumns, FScreenRows);
            Crt.Window(1, 1, 80, FScreenRows - 1);
            Crt.FastWrite(" Not connected                                                                  ", 1, FScreenRows, new TCharInfo(' ', 31, false, false), true);
            Crt.Canvas.addEventListener(Crt.FONT_CHANGED, OnCrtFontChanged, false);
            Crt.Canvas.addEventListener(Crt.SCREEN_SIZE_CHANGED, OnCrtScreenSizeChanged, false);

            // Check for websocket support
            if ((typeof (WebSocket) === "undefined") && (typeof (MozWebSocket) === "undefined")) {
                Crt.WriteLn("Sorry, your browser doesn't support the WebSocket API");
                Crt.WriteLn();
                Crt.WriteLn("When this version of HtmlTerm was released, WebSocket was implemented in:");
                Crt.WriteLn("    Chrome 4");
                Crt.WriteLn("    Firefox 4 *");
                Crt.WriteLn("    Internet Explorer 10 Developer Preview");
                Crt.WriteLn("    Opera 10.70 **");
                Crt.WriteLn("    Safari 5");
                Crt.WriteLn();
                Crt.WriteLn("* WebSockets are disabled by default in FireFox 4 and 5.");
                Crt.WriteLn("  Enable them by changing this setting in \"about:config\":");
                Crt.WriteLn("    network.websocket.enabled = true");
                Crt.WriteLn("    network.websocket.override-security-block = true");
                Crt.WriteLn("  As of Firefox 6 this change is no longer required");
                Crt.WriteLn();
                Crt.WriteLn("** WebSockets are disabled by default in Opera.");
                Crt.WriteLn("   Enable them by changing this setting in \"opera:config\":");
                Crt.WriteLn("     User Prefs -> Enable WebSockets = checked");
                trace("HtmlTerm Error: WebSocket not supported");
                return false;
            }

            // Create the Save Files button
            FSaveFilesButton = new TSaveFilesButton();
            FContainer.appendChild(FSaveFilesButton.Image);
            FSaveFilesButton.ongraphicchanged = OnSaveFilesButtonGraphicChanged;
            CenterSaveFilesButton();

            // Create the ansi cursor position handler
            Ansi.onesc5n = OnAnsiESC5n;
            Ansi.onesc6n = OnAnsiESC6n;
            Ansi.onesc255n = OnAnsiESC255n;
            Ansi.onescQ = OnAnsiESCQ;

            Ansi.Write(atob(FSplashScreen));
        } else {
            trace("HtmlTerm Error: Unable to init Crt");
        }

        // Create our main timer
        FTimer = setInterval(OnTimer, 50);

        return true;
    };

    this.__defineGetter__("BitsPerSecond", function () {
        return FBitsPerSecond;
    });

    this.__defineSetter__("BitsPerSecond", function (ABitsPerSecond) {
        FBitsPerSecond = ABitsPerSecond;
    });

    this.__defineGetter__("Blink", function () {
        return FBlink;
    });

    this.__defineSetter__("Blink", function (ABlink) {
        FBlink = ABlink;
    });

    CenterSaveFilesButton = function () {
        FSaveFilesButton.Center(Crt.Canvas);
    };

    this.__defineGetter__("CodePage", function () {
        return FCodePage;
    });

    this.__defineSetter__("CodePage", function (ACodePage) {
        FCodePage = ACodePage;
    });

    this.Connect = function () {
        if ((FConnection !== null) && (FConnection.connected)) { return; }

        // Create new connection
        FConnection = new TTelnet();
        FConnection.onclose = OnConnectionClose;
        FConnection.onconnect = OnConnectionConnect;
        FConnection.onioerror = OnConnectionIOError;
        FConnection.onsecurityerror = OnConnectionSecurityError;

        // Reset display
        Crt.NormVideo();
        Crt.ClrScr();

        // Make connection
        if (FProxyHostname === "") {
            Crt.FastWrite(" Connecting to                                                                  ", 1, FScreenRows, new TCharInfo(' ', 31, false, false), true);
            Crt.FastWrite(FHostname + ":" + FPort, 16, FScreenRows, new TCharInfo(' ', 31, false, false), true);
            FConnection.connect(FHostname, FPort);
        } else {
            Crt.FastWrite(" Connecting to                                                                  ", 1, FScreenRows, new TCharInfo(' ', 31, false, false), true);
            Crt.FastWrite(FHostname + ":" + FPort + " via proxy", 16, FScreenRows, new TCharInfo(' ', 31, false, false), true);
            FConnection.connect(FProxyHostname, FProxyPort);
        }
    };

    this.Connected = function () {
        if (FConnection === null) { return false; }
        return FConnection.connected;
    };

    this.Disconnect = function () {
        if (FConnection === null) { return; }
        if (!FConnection.connected) { return; }

        FConnection.close();
        FConnection.onclose = null;
        FConnection.onconnect = null;
        FConnection.onioerror = null;
        FConnection.onsecurityerror = null;
        FConnection = null;

        OnConnectionClose("Disconnect");
    };

    this.Download = function (cme) {
        if (FConnection === null) { return; }
        if (!FConnection.connected) { return; }

        // Transfer the file
        FYModemReceive = new TYModemReceive(FConnection);

        // Setup listeners for during transfer
        clearInterval(FTimer);
        FYModemReceive.ontransfercomplete = OnDownloadComplete;

        // Download the file
        FYModemReceive.Download();
    };

    this.__defineGetter__("Enter", function () {
        return FEnter;
    });

    this.__defineSetter__("Enter", function (AEnter) {
        FEnter = AEnter;
    });

    this.__defineGetter__("FontHeight", function () {
        return FFontHeight;
    });

    this.__defineSetter__("FontHeight", function (AFontHeight) {
        FFontHeight = AFontHeight;
    });

    this.__defineGetter__("FontWidth", function () {
        return FFontWidth;
    });

    this.__defineSetter__("FontWidth", function (AFontWidth) {
        FFontWidth = AFontWidth;
    });

    this.__defineGetter__("Hostname", function () {
        return FHostname;
    });

    this.__defineSetter__("Hostname", function (AHostname) {
        FHostname = AHostname;
    });

    OnAnsiESC5n = function (AEvent) {
        FConnection.writeString("\x1B[0n");
    };

    OnAnsiESC6n = function (AEvent) {
        FConnection.writeString(Ansi.CursorPosition());
    };

    OnAnsiESC255n = function (AEvent) {
        FConnection.writeString(Ansi.CursorPosition(Crt.WindRows, Crt.WindCols));
    };

    OnAnsiESCQ = function (AEvent) {
        Crt.SetFont(AEvent.CodePage, AEvent.Width, AEvent.Height);
    };

    OnCloseButtonClick = function (me) {
        if (FConnection === null) { return; }
        if (!FConnection.connected) { return; }

        if (confirm("Are you sure you'd like to disconnect from " + FServerName + "?")) { that.Disconnect(); }
    };

    OnConnectionClose = function (e) {
        // Remove save button (if visible)
        FSaveFilesButton.Image.removeEventListener("click", OnSaveFilesButtonClick, false);
        FSaveFilesButton.Hide();

        Crt.FastWrite(" Disconnected from                                                              ", 1, FScreenRows, new TCharInfo(' ', 31, false, false), true);
        Crt.FastWrite(FHostname + ":" + FPort, 20, FScreenRows, new TCharInfo(' ', 31, false, false), true);
    };

    OnConnectionConnect = function (e) {
        Crt.ClrScr();
        if (FProxyHostname !== "") { FConnection.writeString(FHostname + ":" + FPort + "\r\n"); }

        if (FProxyHostname === "") {
            Crt.FastWrite(" Connected to                                                                   ", 1, FScreenRows, new TCharInfo(' ', 31, false, false), true);
            Crt.FastWrite(FHostname + ":" + FPort, 15, FScreenRows, new TCharInfo(' ', 31, false, false), true);
        } else {
            Crt.FastWrite(" Connected to                                                                   ", 1, FScreenRows, new TCharInfo(' ', 31, false, false), true);
            Crt.FastWrite(FHostname + ":" + FPort + " via proxy", 15, FScreenRows, new TCharInfo(' ', 31, false, false), true);
        }
    };

    OnConnectionIOError = function (e) {
        trace("HtmlTerm.OnConnectionIOError");
    };

    OnConnectionSecurityError = function (see) {
        if (FProxyHostname === "") {
            Crt.FastWrite(" Unable to connect to                                                           ", 1, FScreenRows, new TCharInfo(' ', 31, false, false), true);
            Crt.FastWrite(FHostname + ":" + FPort, 23, FScreenRows, new TCharInfo(' ', 31, false, false), true);
        } else {
            Crt.FastWrite(" Unable to connect to                                                           ", 1, FScreenRows, new TCharInfo(' ', 31, false, false), true);
            Crt.FastWrite(FHostname + ":" + FPort + " via proxy", 23, FScreenRows, new TCharInfo(' ', 31, false, false), true);
        }
    };

    OnCrtFontChanged = function (e) {
        // Center the buttons
        CenterSaveFilesButton();
    };

    OnCrtScreenSizeChanged = function (e) {
        // Center the buttons
        CenterSaveFilesButton();
    };

    OnDonateMenuClick = function (cme) {
        //TODO
    };

    OnDownloadComplete = function () {
        // Restart listeners for keyboard and connection data
        FTimer = setInterval(OnTimer, 50);

        // Display the save button (if files were completed)
        if (FYModemReceive.FileCount > 0) { ShowSaveFilesButton(); }
    };

    OnHelpMenuClick = function (cme) {
        //TODO navigateToURL(new URLRequest("http://www.ftelnet.ca/help.php"));
    };

    OnSaveFilesButtonClick = function (me) {
        if (FYModemReceive === null) { return; }
        if (FYModemReceive.FileCount === 0) { return; }

        var i;
        var j;
        var ByteString;
        var buffer;
        var dataView;
        var myBlob;
        var fileSaver;

        if (FYModemReceive.FileCount === 1) {
            // If we have just one file, save it
            ByteString = FYModemReceive.FileAt(0).data.toString();

            buffer = new ArrayBuffer(ByteString.length);
            dataView = new DataView(buffer);
            for (i = 0; i < ByteString.length; i++) {
                dataView.setUint8(i, ByteString.charCodeAt(i));
            }

            myBlob = new Blob([buffer], { type: 'application/octet-binary' });
            fileSaver = window.saveAs(myBlob, FYModemReceive.FileAt(0).name);
        } else if (FYModemReceive.FileCount > 1) {
            // More than one requires bundling in a TAR archive
            var TAR = new ByteArray();
            for (i = 0; i < FYModemReceive.FileCount; i++) {
                // Create header
                var Header = new ByteArray();
                // File Name 100 bytes
                var FileName = FYModemReceive.FileAt(i).name;
                for (j = 0; j < 100; j++) {
                    if (j < FileName.length) {
                        Header.writeByte(FileName.charCodeAt(j));
                    } else {
                        Header.writeByte(0);
                    }
                }
                // File Mode 8 bytes
                for (j = 0; j < 8; j++) { Header.writeByte(0); }
                // Owner's UserID 8 bytes
                for (j = 0; j < 8; j++) { Header.writeByte(0); }
                // Owner's GroupID 8 bytes
                for (j = 0; j < 8; j++) { Header.writeByte(0); }
                // File size in bytes with leading 0s 11 bytes plus 1 null
                var FileSize = FYModemReceive.FileAt(i).data.length.toString(8);
                for (j = 0; j < 11 - FileSize.length; j++) { Header.writeByte("0".charCodeAt(0)); }
                for (j = 0; j < FileSize.length; j++) { Header.writeByte(FileSize.charCodeAt(j)); }
                Header.writeByte(0);
                // Last modification time in numeric Unix time format 11 bytes plus 1 null (ASCII representation of the octal number of seconds since January 1, 1970, 00:00 UTC)
                for (j = 0; j < 11; j++) { Header.writeByte(0); }
                Header.writeByte(0);
                // Checksum for header block 8 bytes (spaces initially)
                for (j = 0; j < 8; j++) { Header.writeByte(32); }
                // Link indicator 1 byte
                Header.writeByte("0".charCodeAt(0));
                // Name of linked file 100 bytes
                for (j = 0; j < 100; j++) { Header.writeByte(0); }
                // Reset of 512 byte header
                for (j = 0; j < 255; j++) { Header.writeByte(0); }

                // Calculate checksum (sum of unsigned bytes)
                Header.position = 0;
                var CheckSum = 0;
                for (j = 0; j < 512; j++) {
                    CheckSum += Header.readUnsignedByte();
                }

                // Write header up to checksum
                TAR.writeBytes(Header, 0, 148);

                // Write checksum (zero prefixed 6 digit octal number followed by NULL SPACE)
                var CheckSumStr = CheckSum.toString(8);
                for (j = 0; j < 6 - CheckSumStr.length; j++) { TAR.writeByte("0".charCodeAt(0)); }
                for (j = 0; j < CheckSumStr.length; j++) { TAR.writeByte(CheckSumStr.charCodeAt(j)); }
                TAR.writeByte(0);
                TAR.writeByte(32);

                // Write header after hash
                TAR.writeBytes(Header, 156, 356);

                // Add file data
                TAR.writeBytes(FYModemReceive.FileAt(i).data);

                // Add the padding if the file isn't a multiple of 512 bytes
                if (FYModemReceive.FileAt(i).data.length % 512 !== 0) {
                    for (j = 0; j < 512 - (FYModemReceive.FileAt(i).data.length % 512); j++) {
                        TAR.writeByte(0);
                    }
                }
            }

            // Add 2 zero filled blocks for end of archive
            for (i = 0; i < 1024; i++) {
                TAR.writeByte(0);
            }

            // Save the tar
            ByteString = TAR.toString();

            buffer = new ArrayBuffer(ByteString.length);
            dataView = new DataView(buffer);
            for (i = 0; i < ByteString.length; i++) {
                dataView.setUint8(i, ByteString.charCodeAt(i));
            }

            myBlob = new Blob([buffer], { type: 'application/octet-binary' });
            fileSaver = window.saveAs(myBlob, "HtmlTerm-BatchDownload.tar");
        }

        // Remove button
        FSaveFilesButton.Image.removeEventListener('click', OnSaveFilesButtonClick, false);
        FSaveFilesButton.Hide();

        // Reset display
        Crt.Canvas.style.opacity = 1;
    };

    OnSaveFilesButtonGraphicChanged = function (e) {
        CenterSaveFilesButton();
    };

    OnTimer = function (e) {
        if (FConnection.connected) {
            // Determine how long it took between frames
            var MSecElapsed = new Date().getTime() - FLastTimer;
            if (MSecElapsed < 1) { MSecElapsed = 1; }

            // Determine how many bytes we need to read to achieve the requested BitsPerSecond rate
            var BytesToRead = Math.floor(FBitsPerSecond / 8 / (1000 / MSecElapsed));
            if (BytesToRead < 1) { BytesToRead = 1; }

            // Read the number of bytes we want
            var Data = FConnection.readString(BytesToRead);
            if (Data.length > 0) {
                // if (DEBUG) trace("HtmlTerm.OnTimer Data = " + Data);
                Ansi.Write(Data);
            }

            while (Crt.KeyPressed()) {
                var KPE = Crt.ReadKey();

                // Check for upload/download
                if (KPE !== null) {
                    if (KPE.keyString.length > 0) {
                        // Handle translating Enter key
                        if (KPE.keyString === "\r\n") {
                            FConnection.writeString(FEnter);
                        } else {
                            FConnection.writeString(KPE.keyString);
                        }
                    }
                }
            }
        }
        FLastTimer = new Date().getTime();
    };

    OnUploadComplete = function (e) {
        // Restart listeners for keyboard and connection data
        FTimer = setInterval(OnTimer, 50);
    };

    LoadFile = function (AFile, AFileCount) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = function (e) {
            var FR = new TFileRecord(AFile.name, AFile.size);
            FR.data.writeString(e.target.result);
            FR.data.position = 0;
            FYModemSend.Upload(FR, AFileCount);
        };

        // Read in the image file as a data URL.
        reader.readAsBinaryString(AFile);
    };

    this.Upload = function (AFiles) {
        if (FConnection === null) { return; }
        if (!FConnection.connected) { return; }

        // Get the YModemSend class ready to go
        FYModemSend = new TYModemSend(FConnection);

        // Setup the listeners
        clearInterval(FTimer);
        FYModemSend.ontransfercomplete = OnUploadComplete;

        // Loop through the FileList and prep them for upload
        var i;
        for (i = 0; i < AFiles.length; i++) {
            LoadFile(AFiles[i], AFiles.length);
        }
    };

    OnWebPageMenuClick = function (cme) {
        //TODO navigateToURL(new URLRequest("http://www.ftelnet.ca/"));
    };

    this.__defineGetter__("Port", function () {
        return FPort;
    });

    this.__defineSetter__("Port", function (APort) {
        FPort = APort;
    });

    this.__defineGetter__("ProxyHostname", function () {
        return FProxyHostname;
    });

    this.__defineSetter__("ProxyHostname", function (AProxyHostname) {
        FProxyHostname = AProxyHostname;
    });

    this.__defineGetter__("ProxyPort", function () {
        return FProxyPort;
    });

    this.__defineSetter__("ProxyPort", function (AProxyPort) {
        FProxyPort = AProxyPort;
    });

    this.__defineGetter__("ScreenColumns", function () {
        return FScreenColumns;
    });

    this.__defineSetter__("ScreenColumns", function (AScreenColumns) {
        FScreenColumns = AScreenColumns;
    });

    this.__defineGetter__("ScreenRows", function () {
        return FScreenRows;
    });

    this.__defineSetter__("ScreenRows", function (AScreenRows) {
        FScreenRows = AScreenRows;
    });

    this.__defineGetter__("ServerName", function () {
        return FServerName;
    });

    this.__defineSetter__("ServerName", function (AServerName) {
        FServerName = AServerName;
    });

    ShowSaveFilesButton = function () {
        Crt.Canvas.style.opacity = 0.4;

        FSaveFilesButton.Image.addEventListener('click', OnSaveFilesButtonClick, false);
        FSaveFilesButton.Show();
    };

    this.__defineGetter__("SplashScreen", function () {
        return FSplashScreen;
    });

    this.__defineSetter__("SplashScreen", function (ASplashScreen) {
        FSplashScreen = ASplashScreen;
    });
};
HtmlTerm = new THtmlTerm();
