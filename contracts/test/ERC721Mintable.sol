// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "../../openzeppelin-contracts-upgradeable/contracts/token/ERC721/ERC721Upgradeable.sol";

contract ERC721Mintable is ERC721Upgradeable {

  event ERC721Initialized(
    string name,
    string symbol,
    string baseURI
  );

  constructor (
    string memory name,
    string memory symbol,
    string memory baseURI_
  ) public {
    __ERC721_init(name, symbol);
    _setBaseURI(baseURI_);

    emit ERC721Initialized(name, symbol, baseURI_);
  }

  function mint(address user, uint256 id) external returns (address) {
    _mint(user, id);
  }

}
