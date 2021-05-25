// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "../../openzeppelin-contracts-upgradeable/contracts/token/ERC20/IERC20Upgradeable.sol";

/// @title Allows anyone to "loot" an address
/// @author Brendan Asselstine
/// @notice A LootBox allows anyone to withdraw all tokens or execute calls on behalf of the contract.
/// @dev This contract is intended to be counterfactually instantiated via CREATE2.
contract NFTBox {

  address private _owner;

  /// @notice Emitted when an ERC20 token is deposited
  event DepositERC20(address indexed token, uint256 amount);

  /// @notice Emitted when an ERC20 token is withdrawn
  event WithdrewERC20(address indexed token, uint256 amount);

   constructor () public {
    _owner = msg.sender;
  }

  /// @notice Transfers the entire balance of ERC20s to an account
  /// @param tokens An array of ERC20 tokens to transfer out.  The balance of each will be transferred.
  /// @param to The recipient of the transfers
  function depositERC20(IERC20Upgradeable[] calldata tokens,uint256[] calldata amounts, address to) external onlyOwner{
    for (uint256 i = 0; i < tokens.length; i++) {
      uint256 balance = amounts[i];
      tokens[i].transfer(to, amounts[i]);

      emit DepositERC20(address(tokens[i]), balance);
    }
  }

  /// @notice Transfers the entire balance of ERC20s to an account
  /// @param tokens An array of ERC20 tokens to transfer out.  The balance of each will be transferred.
  /// @param to The recipient of the transfers
  function withdrawERC20(IERC20Upgradeable[] memory tokens, address to) external onlyOwner {
    for (uint256 i = 0; i < tokens.length; i++) {
      uint256 balance = tokens[i].balanceOf(address(this));
      tokens[i].transfer(to, balance);

      emit WithdrewERC20(address(tokens[i]), balance);
    }
  }

  modifier onlyOwner {
    require(msg.sender == _owner, "NFTBox/only-owner");
    _;
  }
}
