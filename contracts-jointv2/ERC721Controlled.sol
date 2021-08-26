// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/presets/ERC721PresetMinterPauserAutoIdUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/// @title An ownable ERC721
/// @author Brendan Asselstine
/// @notice The owner may change the base URI AccessControlUpgradeable,
contract ERC721Controlled is ERC721PresetMinterPauserAutoIdUpgradeable {

  /// @notice Sets the new admin of the token.  Only callable by the admin
  /// @param newAdmin The new admin to use
  function setAdmin(address  newAdmin) external onlyAdmin {
    _setupRole(DEFAULT_ADMIN_ROLE, newAdmin); 
    _setupRole(MINTER_ROLE, newAdmin);
  }

  /// @notice Mints a new token.  Only callable by the admin.
  /// @param to The owner that the token should be minted to.
  function mintByTokenIds(address[] memory to,uint256 tokenIdLower) public  onlyAdmin {
    for( uint256 i = 0;i<to.length;i++)
    {
        _safeMint(to[i], tokenIdLower+i);
    }
  }

  /// @notice Mints a new token.  Only callable by the admin.
  /// @param to The owner that the token should be minted to.
  function mintByTokenId(address to,uint256 tokenId) public  onlyAdmin {
    _safeMint(to, tokenId);
  }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721PresetMinterPauserAutoIdUpgradeable) {
        require(totalSupply()<150000, "Max Total Supply is 150000 ");
        super._beforeTokenTransfer(from, to, tokenId);
    }

  /// @dev Requires the msg.sender to have the DEFAULT_ADMIN_ROLE
  modifier onlyAdmin() {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ERC721Controlled/only-admin");
    _;
  }
}
