package randm.tcp.telnet
{
	public class TelnetNegotiationState
	{
		/// <summary>
		/// The default data state
		/// </summary>
		static public var Data: int = 0;
		
		/// <summary>
		/// The last received character was an IAC
		/// </summary>
		static public var IAC: int = 1;
		
		/// <summary>
		/// The last received character was a DO command
		/// </summary>
		static public var Do: int = 2;
		
		/// <summary>
		/// The last received character was a DONT command
		/// </summary>
		static public var Dont: int = 3;
		
		/// <summary>
		/// The last received character was a WILL command
		/// </summary>
		static public var Will: int = 4;
		
		/// <summary>
		/// The last received character was a WONT command
		/// </summary>
		static public var Wont: int = 5;
	}
}