// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "../../../openzeppelin-contracts-upgradeable/contracts/token/ERC20/ERC20Upgradeable.sol";

contract ERC20Mintable is ERC20Upgradeable {

  constructor (
    string memory name,
    string memory symbol
  ) public {
    __ERC20_init(name, symbol);
  }

  function mint(address to, uint256 amount) external returns (address) {
    _mint(to, amount);
  }

}
