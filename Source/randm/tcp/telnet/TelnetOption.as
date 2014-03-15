package randm.tcp.telnet
{
	/// <summary>
	/// Options that can be enabled/disabled in a telnet connection
	/// </summary>
	public class TelnetOption
	{
		/// <summary>
		/// When enabled; data is transmitted as 8-bit binary data.
		/// </summary>
		/// <remarks>
		/// Defined in RFC 856
		/// 
		/// Default is to not transmit in binary.
		/// </remarks>
		static public var TransmitBinary: int = 0;
		
		/// <summary>
		/// When enabled; the side performing the echoing transmits (echos) data characters it receives back to the sender of the data characters.
		/// </summary>
		/// <remarks>
		/// Defined in RFC 857
		/// 
		/// Default is to not echo over the telnet connection.
		/// </remarks>
		static public var Echo: int = 1;
		
		// TODO
		static public var Reconnection: int = 2;
		
		/// <summary>
		/// When enabled; the sender need not transmit GAs.
		/// </summary>
		/// <remarks>
		/// Defined in RFC 858
		/// 
		/// Default is to not suppress go aheads.
		/// </remarks>
		static public var SuppressGoAhead: int = 3;
		
		static public var ApproxMessageSizeNegotiation: int = 4;
		static public var Status: int = 5;
		static public var TimingMark: int = 6;
		static public var RemoteControlledTransAndEcho: int = 7;
		static public var OutputLineWidth: int = 8;
		static public var OutputPageSize: int = 9;
		static public var OutputCarriageReturnDisposition: int = 10;
		static public var OutputHorizontalTabStops: int = 11;
		static public var OutputHorizontalTabDisposition: int = 12;
		static public var OutputFormfeedDisposition: int = 13;
		static public var OutputVerticalTabstops: int = 14;
		static public var OutputVerticalTabDisposition: int = 15;
		static public var OutputLinefeedDisposition: int = 16;
		static public var ExtendedASCII: int = 17;
		static public var Logout: int = 18;
		static public var ByteMacro: int = 19;
		static public var DataEntryTerminal: int = 20;
		static public var SUPDUP: int = 21;
		static public var SUPDUPOutput: int = 22;
		static public var SendLocation: int = 23;
		static public var TerminalType: int = 24;
		static public var EndOfRecord: int = 25;
		static public var TACACSUserIdentification: int = 26;
		static public var OutputMarking: int = 27;
		static public var TerminalLocationNumber: int = 28;
		static public var Telnet3270Regime: int = 29;
		static public var Xdot3PAD: int = 30;

		/// <summary>
		/// Allows the NAWS (negotiate about window size) subnegotiation command to be used if both sides agree
		/// </summary>
		/// <remarks>
		/// Defined in RFC 1073
		/// 
		/// Default is to not allow the NAWS subnegotiation
		/// </remarks>
		static public var WindowSize: int = 31;
		
		static public var TerminalSpeed: int = 32;
		static public var RemoteFlowControl: int = 33;

		/// <summary>
		/// Linemode Telnet is a way of doing terminal character processing on the client side of a Telnet connection.
		/// </summary>
		/// <remarks>
		/// Defined in RFC 1184
		/// 
		/// Default is to not allow the LINEMODE subnegotiation
		/// </remarks>
		static public var LineMode: int = 34;
		
		static public var XDisplayLocation: int = 35;
		static public var EnvironmentOption: int = 36;
		static public var AuthenticationOption: int = 37;
		static public var EncryptionOption: int = 38;
		static public var NewEnvironmentOption: int = 39;
		static public var TN3270E: int = 40;
		static public var XAUTH: int = 41;
		static public var CHARSET: int = 42;
		static public var TelnetRemoteSerialPort: int = 43;
		static public var ComPortControlOption: int = 44;
		static public var TelnetSuppressLocalEcho: int = 45;
		static public var TelnetStartTLS: int = 46;
		static public var KERMIT: int = 47;
		static public var SENDURL: int = 48;
		static public var FORWARD_X: int = 49;
	}
}