package randm.tcp.telnet
{
	import flash.events.Event;
	import flash.events.ProgressEvent;
	import flash.geom.Point;
	import flash.net.Socket;
	import flash.utils.ByteArray;
	import flash.utils.Endian;
	
	import randm.tcp.TTCPConnection;
	
	public class TTelnetConnection extends TTCPConnection
	{
		public static const ECHO_OFF: String = "EchoOff";
		public static const ECHO_ON: String = "EchoOn";

		private var FNegotiatedOptions: Vector.<int>;
		private var FNegotiationState: int;
		
		public function TTelnetConnection(AHost: String = null, APort: int = 0)
		{
			super(AHost, APort)
			
			FLocalEcho = true;
			FNegotiatedOptions = new Vector.<int>(255, true);
			FNegotiationState = TelnetNegotiationState.Data;
		}
		
		public override function flush(): void
		{
			// TODO
			var Text: String = "";
			var Bytes: String = "";

			FOutputBuffer.position = 0;
			while (FOutputBuffer.bytesAvailable > 0)
			{
				// Read 1 byte at a time, doubling up IAC's as necessary
				var B: int = FOutputBuffer.readUnsignedByte();
				if (B == TelnetCommand.IAC) superWriteByte(TelnetCommand.IAC);
				superWriteByte(B);
				
				// TODO
				Text += String.fromCharCode(B);
				Bytes += String.fromCharCode(B) + "=" + B.toString(10) + ", ";
				if (B == TelnetCommand.IAC) {
					Text += String.fromCharCode(B);
					Bytes += String.fromCharCode(B) + "=" + B.toString(10) + ", ";
				}
			}
			super.flush();
			
			// TODO
			trace(">> " + Text);
			trace(">> " + Bytes);
		}
		
		private function HandleEcho(ACommand: int): void
		{
			switch (ACommand) {
				case TelnetCommand.Do:
					FLocalEcho = true;
					SendWill(TelnetOption.Echo);
					dispatchEvent(new Event(ECHO_ON));
				case TelnetCommand.Dont:
					FLocalEcho = false;
					SendWont(TelnetOption.Echo);
					dispatchEvent(new Event(ECHO_OFF));
					break;
				case TelnetCommand.Will:
					FLocalEcho = false;
					SendDo(TelnetOption.Echo);
					dispatchEvent(new Event(ECHO_OFF));
					break;
				case TelnetCommand.Wont:
					FLocalEcho = true;
					SendDont(TelnetOption.Echo);
					dispatchEvent(new Event(ECHO_ON));
					break;
			}
		}
		
		private function HandleTerminalType(): void
		{
			SendWill(TelnetOption.TerminalType);
			SendSubnegotiate(TelnetOption.TerminalType);
			
			superWriteByte(0); // IS
			
			var TerminalType: String = "DEC-VT100"; // TODO
			for (var i: int = 0; i < TerminalType.length; i++) {
				superWriteByte(TerminalType.charCodeAt(i));
			}
			
			trace(">> sending terminal type"); // TODO
			
			SendSubnegotiateEnd();
		}
		
		private function HandleWindowSize(): void
		{
			SendWill(TelnetOption.WindowSize);
			SendSubnegotiate(TelnetOption.WindowSize);
			
			var Size: Array = [];
			Size[0] = (FWindowSize.x >> 8) & 0xff;
			Size[1] = FWindowSize.x & 0xff;
			Size[2] = (FWindowSize.y >> 8) & 0xff;
			Size[3] = FWindowSize.y & 0xff;
			
			for (var i: int = 0; i < Size.length; i++) {
				superWriteByte(Size[i]);
				if (Size[i] == 255) superWriteByte(255); // Double up so it's not treated as an IAC
			}
			
			trace(">> sending window size"); // TODO
			
			SendSubnegotiateEnd();
		}
		
		public override function set LocalEcho(ALocalEcho: Boolean): void
		{
			FLocalEcho = ALocalEcho;
			if (connected) {
				if (FLocalEcho) {
					SendWill(TelnetOption.Echo);
				} else {
					SendWont(TelnetOption.Echo);
				}
			}
		}
		
		public override function NegotiateInbound(Data: ByteArray): void
		{
			// Get any waiting data and handle negotiation
			while (Data.bytesAvailable)
			{
				var B: uint = Data.readUnsignedByte();
				
				if (FNegotiationState == TelnetNegotiationState.Data)
				{
					if (B == TelnetCommand.IAC)
					{
						FNegotiationState = TelnetNegotiationState.IAC;
					}
					else
					{
						FInputBuffer.writeByte(B);
					}
				}
				else if (FNegotiationState == TelnetNegotiationState.IAC)
				{
					if (B == TelnetCommand.IAC)
					{
						FNegotiationState = TelnetNegotiationState.Data;
						FInputBuffer.writeByte(B);
					}
					else
					{
						switch (B)
						{
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
				else if (FNegotiationState == TelnetNegotiationState.Do)
				{
					switch (B)
					{
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
				else if (FNegotiationState == TelnetNegotiationState.Dont)
				{
					switch (B)
					{
						case TelnetOption.TransmitBinary: SendWill(B); break;
						case TelnetOption.Echo: HandleEcho(TelnetCommand.Dont); break;
						case TelnetOption.SuppressGoAhead: SendWill(B); break;
						case TelnetOption.WindowSize: SendWont(B); break;
						case TelnetOption.LineMode: SendWont(B); break;
						default: SendWont(B); break;
					}
					FNegotiationState = TelnetNegotiationState.Data;
				}
				else if (FNegotiationState == TelnetNegotiationState.Will)
				{
					switch (B)
					{
						case TelnetOption.TransmitBinary: SendDo(B); break;
						case TelnetOption.Echo: HandleEcho(TelnetCommand.Will); break;
						case TelnetOption.SuppressGoAhead: SendDo(B); break;
						case TelnetOption.WindowSize: SendDont(B); break;
						case TelnetOption.LineMode: SendDont(B); break;
						default: SendDont(B); break;
					}
					FNegotiationState = TelnetNegotiationState.Data;
				}
				else if (FNegotiationState == TelnetNegotiationState.Wont)
				{
					switch (B)
					{
						case TelnetOption.TransmitBinary: SendDo(B); break;
						case TelnetOption.Echo: HandleEcho(TelnetCommand.Wont); break;
						case TelnetOption.SuppressGoAhead: SendDo(B); break;
						case TelnetOption.WindowSize: SendDont(B); break;
						case TelnetOption.LineMode: SendDont(B); break;
						default: SendDont(B); break;
					}
					FNegotiationState = TelnetNegotiationState.Data;
				}
				else
				{
					FNegotiationState = TelnetNegotiationState.Data;
				}
			}
		}
		
		// TODO Need NegotiateOutbound
		
		public function SendCommand(ACommand: int): void
		{
			superWriteByte(TelnetCommand.IAC);
			superWriteByte(ACommand);
			super.flush();
			
			trace(">> command " + ACommand.toString(10)); // TODO
		}
		
		public function SendDo(AOption: int): void
		{
			if (FNegotiatedOptions[AOption] == TelnetCommand.Do) {
				// Already negotiated this option, don't go into a negotiation storm!
				trace("|| already said DO " + AOption.toString(10)); // TODO
			} else {
				FNegotiatedOptions[AOption] = TelnetCommand.Do;

				superWriteByte(TelnetCommand.IAC);
				superWriteByte(TelnetCommand.Do);
				superWriteByte(AOption);
				super.flush();
				
				trace(">> DO " + AOption.toString(10)); // TODO
			}
		}
		
		public function SendDont(AOption: int): void
		{
			if (FNegotiatedOptions[AOption] == TelnetCommand.Dont) {
				// Already negotiated this option, don't go into a negotiation storm!
				trace("|| already said DONT " + AOption.toString(10)); // TODO
			} else {
				FNegotiatedOptions[AOption] = TelnetCommand.Dont;

				superWriteByte(TelnetCommand.IAC);
				superWriteByte(TelnetCommand.Dont);
				superWriteByte(AOption);
				super.flush();

				trace(">> DONT " + AOption.toString(10)); // TODO
			}
		}
		
		public function SendResponse(ACommand: int, AOption: int, ASetting: Boolean): void
		{
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
		}

		public function SendSubnegotiate(AOption: int): void
		{
			superWriteByte(TelnetCommand.IAC);
			superWriteByte(TelnetCommand.Subnegotiation);
			superWriteByte(AOption);
			
			trace(">> SUBNEGOTIATE START " + AOption.toString(10)); // TODO
		}
		
		public function SendSubnegotiateEnd(): void
		{
			superWriteByte(TelnetCommand.IAC);
			superWriteByte(TelnetCommand.EndSubnegotiation);
			super.flush();
			
			trace(">> SUBNEGOTIATE END"); // TODO
		}

		public function SendWill(AOption: int): void
		{
			if (FNegotiatedOptions[AOption] == TelnetCommand.Will) {
				// Already negotiated this option, don't go into a negotiation storm!
				trace("|| already said WILL " + AOption.toString(10)); // TODO
			} else {
				FNegotiatedOptions[AOption] = TelnetCommand.Will;

				superWriteByte(TelnetCommand.IAC);
				superWriteByte(TelnetCommand.Will);
				superWriteByte(AOption);
				super.flush();

				trace(">> WILL " + AOption.toString(10)); // TODO
			}
		}
		
		public function SendWont(AOption: int): void
		{
			if (FNegotiatedOptions[AOption] == TelnetCommand.Wont) {
				// Already negotiated this option, don't go into a negotiation storm!
				trace("|| already said WONT " + AOption.toString(10)); // TODO
			} else {
				FNegotiatedOptions[AOption] = TelnetCommand.Wont;

				superWriteByte(TelnetCommand.IAC);
				superWriteByte(TelnetCommand.Wont);
				superWriteByte(AOption);
				super.flush();

				trace(">> WONT " + AOption.toString(10)); // TODO
			}
		}
		
		public override function set WindowSize(AWindowSize: Point): void
		{
			FWindowSize = AWindowSize;
			if (FNegotiatedOptions[TelnetOption.WindowSize] == TelnetCommand.Will) {
				HandleWindowSize();
			}
		}
	}
}