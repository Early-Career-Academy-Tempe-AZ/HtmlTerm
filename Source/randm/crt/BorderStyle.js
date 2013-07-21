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
// TODO This is still ActionScript, not JavaScript
package randm.crt
{
	/// <summary>
	/// Different border styles used by the CrtPanel class
	/// </summary>
	public class BorderStyle
	{
		/// <summary>
		/// Single lines all around
		/// </summary>
		static public const Single: int = 0;
		
		/// <summary>
		/// Double lines all around
		/// </summary>
		static public const Double: int = 1;
		
		/// <summary>
		/// Single lines horizontally, double lines vertically
		/// </summary>
		/// <see>DoubleV</see>
		static public const SingleH: int = 2;
		
		/// <summary>
		/// Single lines vertically, double lines horizontally
		/// </summary>
		/// <see>DoubleH</see>
		static public const SingleV: int = 3;
		
		/// <summary>
		/// Double lines horizontally, single lines vertically
		/// </summary>
		/// <see>SingleV</see>
		static public const DoubleH: int = 4;
		
		/// <summary>
		/// Double lines vertically, single lines horizontally
		/// </summary>
		/// <see>SingleH</see>
		static public const DoubleV: int = 5;
	}
}
