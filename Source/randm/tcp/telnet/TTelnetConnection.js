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
var TTelnetConnection = function () {
    // TODO Event to let htmlterm to know to enable or disable echo
    //public static const ECHO_OFF: String = "EchoOff";
    //public static const ECHO_ON: String = "EchoOn";

    // Private variables
    var that = this;
    var FNegotiatedOptions;
    var FNegotiationState;

    // Private methods
    var HandleEcho = function (ACommand) { }; // Do nothing
    var HandleTerminalType = function () { }; // Do nothing
    var HandleWindowSize = function () { }; // Do nothing
    var SendCommand = function (ACommand) { }; // Do nothing
    var SendDo = function (AOption) { }; // Do nothing
    var SendDont = function (AOption) { }; // Do nothing
    var SendResponse = function (ACommand, AOption, ASetting) { }; // Do nothing
    var SendSubnegotiate = function (AOption) { }; // Do nothing
    var SendSubnegotiateEnd = function () { }; // Do nothing
    var SendWill = function (AOption) { }; // Do nothing
    var SendWont = function (AOption) { }; // Do nothing

    this.flushTelnetConnection = function () {
        var ToSendString = FOutputBuffer.toString();
        var ToSendBytes = [];

        // Read 1 byte at a time, doubling up IAC's as necessary
        for (i = 0; i < ToSendString.length; i++) {
            ToSendBytes.push(ToSendString.charCodeAt(i));
            if (ToSendString.charCodeAt(i) === TelnetCommand.IAC) {
                ToSendBytes.push(TelnetCommand.IAC);
            }
        }

        FWebSocket.send(new Uint8Array(ToSendBytes));
        FOutputBuffer.clear();
    };

    HandleEcho = function (ACommand) {
        switch (ACommand) {
            case TelnetCommand.Do:
                FLocalEcho = true;
                SendWill(TelnetOption.Echo);
                //TODO dispatchEvent(new Event(ECHO_ON));
                break;
            case TelnetCommand.Dont:
                FLocalEcho = false;
                SendWont(TelnetOption.Echo);
                //TODO dispatchEvent(new Event(ECHO_OFF));
                break;
            case TelnetCommand.Will:
                FLocalEcho = false;
                SendDo(TelnetOption.Echo);
                //TODO dispatchEvent(new Event(ECHO_OFF));
                break;
            case TelnetCommand.Wont:
                FLocalEcho = true;
                SendDont(TelnetOption.Echo);
                //TODO dispatchEvent(new Event(ECHO_ON));
                break;
        }
    };

    HandleTerminalType = function () {
        SendWill(TelnetOption.TerminalType);
        SendSubnegotiate(TelnetOption.TerminalType);

        var ToSendBytes = [];
        ToSendBytes.push(0); // IS

        var TerminalType = "DEC-VT100"; // TODO
        for (var i = 0; i < TerminalType.length; i++) {
            ToSendBytes.push(TerminalType.charCodeAt(i));
        }
        FWebSocket.send(new Uint8Array(ToSendBytes));

        SendSubnegotiateEnd();
    };

    HandleWindowSize = function () {
        SendWill(TelnetOption.WindowSize);
        SendSubnegotiate(TelnetOption.WindowSize);

        var Size = [];
        Size[0] = (FWindowSize.x >> 8) & 0xff;
        Size[1] = FWindowSize.x & 0xff;
        Size[2] = (FWindowSize.y >> 8) & 0xff;
        Size[3] = FWindowSize.y & 0xff;

        var ToSendBytes = [];
        for (var i = 0; i < Size.length; i++) {
            ToSendBytes.push(Size[i]);
            if (Size[i] == TelnetCommand.IAC) ToSendBytes.push(TelnetCommand.IAC); // Double up so it's not treated as an IAC
        }
        FWebSocket.send(new Uint8Array(ToSendBytes));

        SendSubnegotiateEnd();
    };

    this.__defineSetter__("LocalEcho", function (ALocalEcho) {
        FLocalEcho = ALocalEcho;
        if (that.connected) {
            if (FLocalEcho) {
                SendWill(TelnetOption.Echo);
            } else {
                SendWont(TelnetOption.Echo);
            }
        }
    });

    this.NegotiateInboundTelnetConnection = function (AData) {
        // Get any waiting data and handle negotiation
        while (AData.bytesAvailable) {
            var B = AData.readUnsignedByte();

            if (FNegotiationState == TelnetNegotiationState.Data) {
                if (B == TelnetCommand.IAC) {
                    FNegotiationState = TelnetNegotiationState.IAC;
                }
                else {
                    FInputBuffer.writeByte(B);
                }
            }
            else if (FNegotiationState == TelnetNegotiationState.IAC) {
                if (B == TelnetCommand.IAC) {
                    FNegotiationState = TelnetNegotiationState.Data;
                    FInputBuffer.writeByte(B);
                }
                else {
                    switch (B) {
                        case TelnetCommand.NoOperation:
                        case TelnetCommand.DataMark:
                        case TelnetCommand.Break:
                        case TelnetCommand.InterruptProcess:
                        case TelnetCommand.AbortOutput:
                        case TelnetCommand.AreYouThere:
                        case TelnetCommand.EraseCharacter:
                        case TelnetCommand.EraseLine:
                        case TelnetCommand.GoAhead:
                            // We recognize, but ignore these for now
                            FNegotiationState = TelnetNegotiationState.Data;
                            break;
                        case TelnetCommand.Do: FNegotiationState = TelnetNegotiationState.Do; break;
                        case TelnetCommand.Dont: FNegotiationState = TelnetNegotiationState.Dont; break;
                        case TelnetCommand.Will: FNegotiationState = TelnetNegotiationState.Will; break;
                        case TelnetCommand.Wont: FNegotiationState = TelnetNegotiationState.Wont; break;
                        default: FNegotiationState = TelnetNegotiationState.Data; break;
                    }
                }
            }
            else if (FNegotiationState == TelnetNegotiationState.Do) {
                switch (B) {
                    case TelnetOption.TransmitBinary: SendWill(B); break;
                    case TelnetOption.Echo: HandleEcho(TelnetCommand.Do); break;
                    case TelnetOption.SuppressGoAhead: SendWill(B); break;
                    case TelnetOption.TerminalType: HandleTerminalType(); break;
                    case TelnetOption.WindowSize: HandleWindowSize(); break;
                    case TelnetOption.LineMode: SendWont(B); break;
                    default: SendWont(B); break;
                }
                FNegotiationState = TelnetNegotiationState.Data;
            }
            else if (FNegotiationState == TelnetNegotiationState.Dont) {
                switch (B) {
                    case TelnetOption.TransmitBinary: SendWill(B); break;
                    case TelnetOption.Echo: HandleEcho(TelnetCommand.Dont); break;
                    case TelnetOption.SuppressGoAhead: SendWill(B); break;
                    case TelnetOption.WindowSize: SendWont(B); break;
                    case TelnetOption.LineMode: SendWont(B); break;
                    default: SendWont(B); break;
                }
                FNegotiationState = TelnetNegotiationState.Data;
            }
            else if (FNegotiationState == TelnetNegotiationState.Will) {
                switch (B) {
                    case TelnetOption.TransmitBinary: SendDo(B); break;
                    case TelnetOption.Echo: HandleEcho(TelnetCommand.Will); break;
                    case TelnetOption.SuppressGoAhead: SendDo(B); break;
                    case TelnetOption.WindowSize: SendDont(B); break;
                    case TelnetOption.LineMode: SendDont(B); break;
                    default: SendDont(B); break;
                }
                FNegotiationState = TelnetNegotiationState.Data;
            }
            else if (FNegotiationState == TelnetNegotiationState.Wont) {
                switch (B) {
                    case TelnetOption.TransmitBinary: SendDo(B); break;
                    case TelnetOption.Echo: HandleEcho(TelnetCommand.Wont); break;
                    case TelnetOption.SuppressGoAhead: SendDo(B); break;
                    case TelnetOption.WindowSize: SendDont(B); break;
                    case TelnetOption.LineMode: SendDont(B); break;
                    default: SendDont(B); break;
                }
                FNegotiationState = TelnetNegotiationState.Data;
            }
            else {
                FNegotiationState = TelnetNegotiationState.Data;
            }
        }
    };

    // TODO Need NegotiateOutbound

    SendCommand = function (ACommand) {
        var ToSendBytes = [];
        ToSendBytes.push(TelnetCommand.IAC);
        ToSendBytes.push(ACommand);
        FWebSocket.send(new Uint8Array(ToSendBytes));
    };

    SendDo = function (AOption) {
        if (FNegotiatedOptions[AOption] == TelnetCommand.Do) {
            // Already negotiated this option, don't go into a negotiation storm!
        } else {
            FNegotiatedOptions[AOption] = TelnetCommand.Do;

            var ToSendBytes = [];
            ToSendBytes.push(TelnetCommand.IAC);
            ToSendBytes.push(TelnetCommand.Do);
            ToSendBytes.push(AOption);
            FWebSocket.send(new Uint8Array(ToSendBytes));
        }
    };

    SendDont = function (AOption) {
        if (FNegotiatedOptions[AOption] == TelnetCommand.Dont) {
            // Already negotiated this option, don't go into a negotiation storm!
        } else {
            FNegotiatedOptions[AOption] = TelnetCommand.Dont;

            var ToSendBytes = [];
            ToSendBytes.push(TelnetCommand.IAC);
            ToSendBytes.push(TelnetCommand.Dont);
            ToSendBytes.push(AOption);
            FWebSocket.send(new Uint8Array(ToSendBytes));
        }
    };

    SendResponse = function (ACommand, AOption, ASetting) {
        if (ASetting) {
            // We want to do the option
            switch (ACommand) {
                case TelnetCommand.Do: SendWill(AOption); break;
                case TelnetCommand.Dont: SendWill(AOption); break;
                case TelnetCommand.Will: SendDont(AOption); break;
                case TelnetCommand.Wont: SendDont(AOption); break;
            }
        } else {
            // We don't want to do the option
            switch (ACommand) {
                case TelnetCommand.Do: SendWont(AOption); break;
                case TelnetCommand.Dont: SendWont(AOption); break;
                case TelnetCommand.Will: SendDo(AOption); break;
                case TelnetCommand.Wont: SendDo(AOption); break;
            }
        }
    };

    SendSubnegotiate = function (AOption) {
        var ToSendBytes = [];
        ToSendBytes.push(TelnetCommand.IAC);
        ToSendBytes.push(TelnetCommand.Subnegotiation);
        ToSendBytes.push(AOption);
        FWebSocket.send(new Uint8Array(ToSendBytes));
    };

    SendSubnegotiateEnd = function () {
        var ToSendBytes = [];
        ToSendBytes.push(TelnetCommand.IAC);
        ToSendBytes.push(TelnetCommand.EndSubnegotiation);
        FWebSocket.send(new Uint8Array(ToSendBytes));
    };

    SendWill = function (AOption) {
        if (FNegotiatedOptions[AOption] == TelnetCommand.Will) {
            // Already negotiated this option, don't go into a negotiation storm!
        } else {
            FNegotiatedOptions[AOption] = TelnetCommand.Will;

            var ToSendBytes = [];
            ToSendBytes.push(TelnetCommand.IAC);
            ToSendBytes.push(TelnetCommand.Will);
            ToSendBytes.push(AOption);
            FWebSocket.send(new Uint8Array(ToSendBytes));
        }
    };

    SendWont = function (AOption) {
        if (FNegotiatedOptions[AOption] == TelnetCommand.Wont) {
            // Already negotiated this option, don't go into a negotiation storm!
        } else {
            FNegotiatedOptions[AOption] = TelnetCommand.Wont;

            var ToSendBytes = [];
            ToSendBytes.push(TelnetCommand.IAC);
            ToSendBytes.push(TelnetCommand.Wont);
            ToSendBytes.push(AOption);
            FWebSocket.send(new Uint8Array(ToSendBytes));
        }
    };

    this.__defineSetter__("WindowSize", function (AWindowSize) {
        FWindowSize = AWindowSize;
        if (FNegotiatedOptions[TelnetOption.WindowSize] == TelnetCommand.Will) {
            HandleWindowSize();
        }
    });

    // Constructor
    TTcpConnection.call(this);

    FNegotiatedOptions = [];
    for (var i = 0; i < 256; i++) {
        FNegotiatedOptions[i] = 0;
    }
    FNegotiationState = TelnetNegotiationState.Data;
};

TTelnetConnection.prototype = new TTcpConnectionSurrogate();
TTelnetConnection.prototype.constructor = TTelnetConnection;

TTelnetConnection.prototype.flush = function () {
    this.flushTelnetConnection();
}

TTelnetConnection.prototype.NegotiateInbound = function (AData) {
    this.NegotiateInboundTelnetConnection(AData);
}