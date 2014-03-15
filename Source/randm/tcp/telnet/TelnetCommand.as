package randm.tcp.telnet
{
	/// <summary>
	/// Commands the telnet negotiator will handle
	/// </summary>
	public class TelnetCommand
	{
		/// <summary>
		/// SE: End of subnegotiation parameters.
		/// </summary>
		public static var EndSubnegotiation: int = 240;
		
		/// <summary>
		/// NOP: No operation.
		/// </summary>
		public static var NoOperation: int = 241;
		
		/// <summary>
		/// Data Mark: The data stream portion of a Synch. This should always be accompanied by a TCP Urgent notification.
		/// </summary>
		public static var DataMark: int = 242;
		
		/// <summary>
		/// Break: NVT character BRK.
		/// </summary>
		public static var Break: int = 243;
		
		/// <summary>
		/// Interrupt Process: The function IP.
		/// </summary>
		public static var InterruptProcess: int = 244;
		
		/// <summary>
		/// Abort output: The function AO.
		/// </summary>
		public static var AbortOutput: int = 245;
		
		/// <summary>
		/// Are You There: The function AYT.
		/// </summary>
		public static var AreYouThere: int = 246;
		
		/// <summary>
		/// Erase character: The function EC.
		/// </summary>
		public static var EraseCharacter: int = 247;
		
		/// <summary>
		/// Erase Line: The function EL.
		/// </summary>
		public static var EraseLine: int = 248;
		
		/// <summary>
		/// Go ahead: The GA signal
		/// </summary>
		public static var GoAhead: int = 249;
		
		/// <summary>
		/// SB: Indicates that what follows is subnegotiation of the indicated option.
		/// </summary>
		public static var Subnegotiation: int = 250;
		
		/// <summary>
		/// WILL: Indicates the desire to begin performing; or confirmation that you are now performing; the indicated option.
		/// </summary>
		public static var Will: int = 251;
		
		/// <summary>
		/// WON'T: Indicates the refusal to perform; or continue performing; the indicated option.
		/// </summary>
		public static var Wont: int = 252;
		
		/// <summary>
		/// DO: Indicates the request that the other party perform; or confirmation that you are expecting the other party to perform; the indicated option.
		/// </summary>
		public static var Do: int = 253;
		
		/// <summary>
		/// DON'T: Indicates the demand that the other party stop performing; or confirmation that you are no longer expecting the other party to perform; the indicated option.
		/// </summary>
		public static var Dont: int = 254;
		
		/// <summary>
		/// IAC: Data Byte 255
		/// </summary>
		public static var IAC: int = 255;
	}
}
