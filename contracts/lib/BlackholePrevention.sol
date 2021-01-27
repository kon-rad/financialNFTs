// SPDX-License-Identifier: MIT

// BlackholePrevention.sol -- Part of the Charged Particles Protocol
// Copyright (c) 2021 Firma Lux, Inc. <https://charged.fi>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

pragma solidity >=0.6.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// interface IERC20 {
//   function transfer(address to, uint256 amount) external returns (bool);
// }

// interface IERC721 {
//   function transferFrom(address from, address to, uint256 tokenId) external;
// }

/**
 * @notice Prevents ETH or Tokens from getting stuck in a contract by allowing
 *  the Owner/DAO to pull them out on behalf of a user
 * This is only meant to contracts that are not expected to hold tokens, but do handle transferring them.
 */
contract BlackholePrevention {
  using Address for address payable;

  function _withdrawEther(address payable receiver, uint256 amount) internal virtual {
    require(receiver != address(0x0), "BHP: E-403");
    receiver.sendValue(amount);
  }

  function _withdrawERC20(address payable receiver, address tokenAddress, uint256 amount) internal virtual {
    require(receiver != address(0x0), "BHP: E-403");
    require(tokenAddress != address(0x0), "BHP: E-403");
    require(IERC20(tokenAddress).transfer(receiver, amount), "BHP: E-401");
  }

  function _withdrawERC721(address payable receiver, address tokenAddress, uint256 tokenId) internal virtual {
    require(receiver != address(0x0), "BHP: E-403");
    IERC721(tokenAddress).transferFrom(address(this), receiver, tokenId);
  }
}