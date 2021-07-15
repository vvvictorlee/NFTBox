// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "../../openzeppelin-contracts-upgradeable/contracts/token/ERC1155/ERC1155Upgradeable.sol";

contract ERC1155Mintable is ERC1155Upgradeable {

  constructor (
    string memory uri
  ) public {
    __ERC1155_init(uri);
  }

  function mint(address to, uint256 id, uint256 amount, bytes calldata data) external returns (address) {
    _mint(to, id, amount, data);
  }

}
