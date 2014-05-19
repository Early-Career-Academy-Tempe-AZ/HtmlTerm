REM  HtmlTerm: An HTML5 WebSocket client
REM  Copyright (C) 2009-2013  Rick Parrish, R&M Software
REM
REM  This file is part of HtmlTerm.
REM
REM  HtmlTerm is free software: you can redistribute it and/or modify
REM  it under the terms of the GNU General Public License as published by
REM  the Free Software Foundation, either version 3 of the License, or
REM  any later version.
REM
REM  HtmlTerm is distributed in the hope that it will be useful,
REM  but WITHOUT ANY WARRANTY; without even the implied warranty of
REM  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
REM  GNU General Public License for more details.
REM
REM  You should have received a copy of the GNU General Public License
REM  along with HtmlTerm.  If not, see <http://www.gnu.org/licenses/>.

ECHO // HtmlTerm.js > Release\HtmlTerm.js

TYPE Source\ImpliedGlobals.js >> Release\HtmlTerm.js

TYPE Source\randm\actionscript\ByteArray.js >> Release\HtmlTerm.js
TYPE Source\randm\actionscript\FileReference.js >> Release\HtmlTerm.js
TYPE Source\randm\actionscript\Keyboard.js >> Release\HtmlTerm.js
TYPE Source\randm\actionscript\Point.js >> Release\HtmlTerm.js

TYPE Source\Helper.js >> Release\HtmlTerm.js
TYPE Source\StringUtils.js >> Release\HtmlTerm.js

TYPE Source\client\savefilesbutton\TSaveFilesButton.js >> Release\HtmlTerm.js

TYPE Source\randm\crt\cursor\BlinkState.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\cursor\TCursor.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\font\TFont.js >> Release\HtmlTerm.js
REM NO EXTRA FONTS IN THIS FILE TYPE Source\randm\crt\font\TFont437.js >> Release\HtmlTerm.js
REM NO EXTRA FONTS IN THIS FILE TYPE Source\randm\crt\font\TFontAmiga.js >> Release\HtmlTerm.js
REM NO EXTRA FONTS IN THIS FILE TYPE Source\randm\crt\font\TFontAtari.js >> Release\HtmlTerm.js
REM NO EXTRA FONTS IN THIS FILE TYPE Source\randm\crt\font\TFontC64.js >> Release\HtmlTerm.js
REM NO EXTRA FONTS IN THIS FILE TYPE Source\randm\crt\font\TFontIntl.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\BorderStyle.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\ContentAlignment.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\KeyPressEvent.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\ProgressBarStyle.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\TCharInfo.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\Crt.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\TCrtControl.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\TCrtLabel.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\TCrtPanel.js >> Release\HtmlTerm.js
TYPE Source\randm\crt\TCrtProgressBar.js >> Release\HtmlTerm.js

TYPE Source\randm\ansi\AnsiParserState.js >> Release\HtmlTerm.js
TYPE Source\randm\ansi\ESCQEvent.js >> Release\HtmlTerm.js
TYPE Source\randm\ansi\Ansi.js >> Release\HtmlTerm.js

TYPE Source\randm\tcp\TTcpConnection.js >> Release\HtmlTerm.js
TYPE Source\randm\tcp\telnet\TelnetCommand.js >> Release\HtmlTerm.js
TYPE Source\randm\tcp\telnet\TelnetNegotiationState.js >> Release\HtmlTerm.js
TYPE Source\randm\tcp\telnet\TelnetOption.js >> Release\HtmlTerm.js
TYPE Source\randm\tcp\telnet\TTelnetConnection.js >> Release\HtmlTerm.js

TYPE Source\randm\xfer\CRC.js >> Release\HtmlTerm.js
TYPE Source\randm\xfer\TFileRecord.js >> Release\HtmlTerm.js
TYPE Source\randm\xfer\TYModemReceive.js >> Release\HtmlTerm.js
TYPE Source\randm\xfer\TYModemSend.js >> Release\HtmlTerm.js        

TYPE Source\HtmlTerm.js >> Release\HtmlTerm.js

Z:\Programming\LintFreeClosureCompiler\bin\Release\LFCC.exe Release\HtmlTerm.js

COPY Source\randm\crt\font\TFont437.js Release\HtmlTerm.font-437.js
COPY Source\randm\crt\font\TFontAmiga.js Release\HtmlTerm.font-amiga.js
COPY Source\randm\crt\font\TFontAtari.js Release\HtmlTerm.font-atari.js
COPY Source\randm\crt\font\TFontC64.js Release\HtmlTerm.font-c64.js
COPY Source\randm\crt\font\TFontIntl.js Release\HtmlTerm.font-intl.js

COPY Release\HtmlTerm.js ..\ftelnet\flash\html-template\
COPY Release\HtmlTerm.js ..\ftelnet\flash\bin-debug\
COPY Release\HtmlTerm.js ..\ftelnet\flash\bin-release\
COPY Release\HtmlTerm.compiled.js ..\ftelnet\flash\html-template\
COPY Release\HtmlTerm.compiled.js ..\ftelnet\flash\bin-debug\
COPY Release\HtmlTerm.compiled.js ..\ftelnet\flash\bin-release\
COPY Release\HtmlTerm.font-437.js ..\ftelnet\flash\html-template\
COPY Release\HtmlTerm.font-437.js ..\ftelnet\flash\bin-debug\
COPY Release\HtmlTerm.font-437.js ..\ftelnet\flash\bin-release\
COPY Release\HtmlTerm.font-amiga.js ..\ftelnet\flash\html-template\
COPY Release\HtmlTerm.font-amiga.js ..\ftelnet\flash\bin-debug\
COPY Release\HtmlTerm.font-amiga.js ..\ftelnet\flash\bin-release\
COPY Release\HtmlTerm.font-atari.js ..\ftelnet\flash\html-template\
COPY Release\HtmlTerm.font-atari.js ..\ftelnet\flash\bin-debug\
COPY Release\HtmlTerm.font-atari.js ..\ftelnet\flash\bin-release\
COPY Release\HtmlTerm.font-c64.js ..\ftelnet\flash\html-template\
COPY Release\HtmlTerm.font-c64.js ..\ftelnet\flash\bin-debug\
COPY Release\HtmlTerm.font-c64.js ..\ftelnet\flash\bin-release\
COPY Release\HtmlTerm.font-intl.js ..\ftelnet\flash\html-template\
COPY Release\HtmlTerm.font-intl.js ..\ftelnet\flash\bin-debug\
COPY Release\HtmlTerm.font-intl.js ..\ftelnet\flash\bin-release\
COPY Release\Blob.js ..\ftelnet\flash\html-template\
COPY Release\Blob.js ..\ftelnet\flash\bin-debug\
COPY Release\Blob.js ..\ftelnet\flash\bin-release\
COPY Release\FileSaver.js ..\ftelnet\flash\html-template\
COPY Release\FileSaver.js ..\ftelnet\flash\bin-debug\
COPY Release\FileSaver.js ..\ftelnet\flash\bin-release\
COPY Release\* ..\my.fTelnet.ca\my.fTelnet.ca\HtmlTerm\
COPY Release\img\* ..\my.fTelnet.ca\my.fTelnet.ca\HtmlTerm\img\