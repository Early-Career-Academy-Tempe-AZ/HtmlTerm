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
var TTcpConnection = function () {
    // Public events
    this.onclose = function () { }; // Do nothing
    this.onconnect = function () { }; // Do nothing
    this.onioerror = function (ioee) { }; // Do nothing
    this.onsecurityerror = function () { }; // Do nothing

    // Private variables
    var that = this;
    var FWasConnected = false;

    // Protected variables
    this.FInputBuffer = null;
    this.FOutputBuffer;
    this.FWebSocket = null;

    // Private methods
    var OnSocketClose = function () { }; // Do nothing
    var OnSocketError = function (e) { }; // Do nothing
    var OnSocketOpen = function () { }; // Do nothing
    var OnSocketMessage = function (e) { }; // Do nothing

    this.__defineGetter__("bytesAvailable", function () {
        return FInputBuffer.bytesAvailable;
    });

    this.close = function () {
        if (FWebSocket) {
            FWebSocket.close();
        }
    };

    this.connect = function (AHost, APort) {
        FWasConnected = false;
        FWebSocket = new WebSocket("ws://" + AHost + ":" + APort);

        // Enable binary mode
        FWebSocket.binaryType = 'arraybuffer';

        // Set event handlers
        FWebSocket.onclose = OnSocketClose;
        FWebSocket.onerror = OnSocketError;
        FWebSocket.onmessage = OnSocketMessage;
        FWebSocket.onopen = OnSocketOpen;
    };

    this.__defineGetter__("connected", function () {
        if (FWebSocket) {
            return (FWebSocket.readyState === FWebSocket.OPEN);
        }

        return false;
    });

    this.flushTcpConnection = function () {
        var ToSendString = FOutputBuffer.toString();
        var ToSendBytes = [];

        for (i = 0; i < ToSendString.length; i++) {
            ToSendBytes.push(ToSendString.charCodeAt(i));
        }

        FWebSocket.send(new Uint8Array(ToSendBytes));
        FOutputBuffer.clear();
    };

    this.NegotiateInboundTcpConnection = function (AData) {
        // No negotiation for raw tcp connection
        while (AData.bytesAvailable) {
            var B = AData.readUnsignedByte();
            FInputBuffer.writeByte(B);
        }
    };

    OnSocketClose = function () {
        if (FWasConnected) {
            that.onclose();
        } else {
            that.onsecurityerror();
        }
        FWasConnected = false;
    };

    OnSocketError = function (e) {
        that.onioerror(e);
    };

    OnSocketOpen = function () {
        FWasConnected = true;
        that.onconnect();
    };

    OnSocketMessage = function (e) {
        // Free up some memory if we're at the end of the buffer
        if (FInputBuffer.bytesAvailable === 0) { FInputBuffer.clear(); }

        // Save the old position and set the new position to the end of the buffer
        var OldPosition = FInputBuffer.position;
        FInputBuffer.position = FInputBuffer.length;

        var Data = new ByteArray();

        // Write the incoming message to the input buffer
        if (e.data instanceof ArrayBuffer) {
            var u8 = new Uint8Array(e.data);
            for (var i = 0; i < u8.length; i++) {
                Data.writeByte(u8[i]);
            }
        } else {
            Data.writeString(e.data);
        }
        Data.position = 0;

        that.NegotiateInbound(Data);

        // Restore the old buffer position
        FInputBuffer.position = OldPosition;
    };

    // Remap all the read* functions to operate on our input buffer instead
    this.readBoolean = function () {
        return FInputBuffer.readBoolean();
    };

    this.readByte = function () {
        return FInputBuffer.readByte();
    };

    this.readBytes = function (ABytes, AOffset, ALength) {
        return FInputBuffer.readBytes(ABytes, AOffset, ALength);
    };

    this.readDouble = function () {
        return FInputBuffer.readDouble();
    };

    this.readFloat = function () {
        return FInputBuffer.readFloat();
    };

    this.readInt = function () {
        return FInputBuffer.readInt();
    };

    this.readMultiByte = function (ALength, ACharSet) {
        return FInputBuffer.readMultiByte(ALength, ACharSet);
    };

    this.readObject = function () {
        return FInputBuffer.readObject();
    };

    this.readShort = function () {
        return FInputBuffer.readShort();
    };

    this.readString = function (ALength) {
        return FInputBuffer.readString();
    };

    this.readUnsignedByte = function () {
        return FInputBuffer.readUnsignedByte();
    };

    this.readUnsignedInt = function () {
        return FInputBuffer.readUnsignedInt();
    };

    this.readUnsignedShort = function () {
        return FInputBuffer.readUnsignedShort();
    };

    this.readUTF = function () {
        return FInputBuffer.readUTF();
    };

    this.readUTFBytes = function (ALength) {
        return FInputBuffer.readUTFBytes(ALength);
    };

    this.test = function () {
        // This test comes from Websockify

        // Check for full typed array support
        if (('Uint8Array' in window) && ('set' in Uint8Array.prototype)) {
            // Check for full binary type support in WebSockets
            // TODO: this sucks, the property should exist on the prototype
            // but it does not.
            try {
                if ('binaryType' in (new WebSocket("ws://localhost:53211"))) {
                    return true;
                }
            } catch (exc) {
                // Just ignore failed test localhost connections
            }
        }

        return false;
    };

    // Remap all the write* functions to operate on our output buffer instead
    this.writeBoolean = function (AValue) {
        FOutputBuffer.writeBoolean(AValue);
    };

    this.writeByte = function (AValue) {
        FOutputBuffer.writeByte(AValue);
    };

    this.writeBytes = function (ABytes, AOffset, ALength) {
        FOutputBuffer.writeBytes(ABytes, AOffset, ALength);
    };

    this.writeDouble = function (AValue) {
        FOutputBuffer.writeDouble(AValue);
    };

    this.writeFloat = function (AValue) {
        FOutputBuffer.writeFloat(AValue);
    };

    this.writeInt = function (AValue) {
        FOutputBuffer.writeInt(AValue);
    };

    this.writeMultiByte = function (AValue, ACharSet) {
        FOutputBuffer.writeMultiByte(AValue, ACharSet);
    };

    this.writeObject = function (AObject) {
        FOutputBuffer.writeObject(AObject);
    };

    this.writeShort = function (AValue) {
        FOutputBuffer.writeShort(AValue);
    };

    this.writeString = function (AText) {
        FOutputBuffer.writeString(AText);
        that.flush();
    };

    this.writeUnsignedInt = function (AValue) {
        FOutputBuffer.writeUnsignedInt(AValue);
    };

    this.writeUTF = function (AValue) {
        FOutputBuffer.writeUTF(AValue);
    };

    this.writeUTFBytes = function (AValue) {
        FOutputBuffer.writeUTFBytes(AValue);
    };

    // Constructor
    FInputBuffer = new ByteArray();
    FOutputBuffer = new ByteArray();
};

var TTcpConnectionSurrogate = function () { };
TTcpConnectionSurrogate.prototype = TTcpConnection.prototype;

TTcpConnection.prototype.flush = function () {
    this.flushTcpConnection();
};

TTcpConnection.prototype.NegotiateInbound = function (AData) {
    this.NegotiateInboundTcpConnection(AData);
};