// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

interface  newnft {
    function mintByTokenId(address to,uint256 tokenId) external;
    function mintByTokenIds(address[] calldata to,uint256 tokenIdLower) external;
}
interface   orignft {
    function ownerOf(uint256 tokenId) external view returns (address);
}

/// @title An ownable ERC721
/// @author Brendan Asselstine
/// @notice The owner may change the base URI AccessControlUpgradeable,
contract MigrateData {
   address newcontract;
   address origcontract;
   mapping (address => bool) private _admins;

   constructor (
  )  {
    _admins[msg.sender]=true;
  }

 function setContract(address  dest,address src) external onlyAdmin {
        newcontract =dest;
        origcontract =src;
  }

  function mintByTokenIds( uint256 tokenIdBegin,uint256 len) public onlyAdmin  {
        address[] memory addr = new address[](len);
        for(uint256 i=0;i<len;++i){
               addr[i] = orignft(origcontract).ownerOf(tokenIdBegin+i);
               require(addr[i]!=address(0), "owner is zero address");
        }
        newnft(newcontract).mintByTokenIds(addr,tokenIdBegin);
  }

  function mintByTokenId( uint256 tokenIdBegin,uint256 len) public onlyAdmin  {
        uint256 id =tokenIdBegin;
        for(uint256 i=0;i<len;++i){
               id = tokenIdBegin+i;
               address to= orignft(origcontract).ownerOf(id);
               require(to!=address(0), "owner is zero address");
               newnft(newcontract).mintByTokenId(to,id);
        }
  }
  function setAdmins(address[] memory newAdmins) external onlyAdmin {
    for(uint256 i =0;i<newAdmins.length;i++){
        _admins[newAdmins[i]]=true;
    }
  }
function revokeAdmins(address[] memory newAdmins) external onlyAdmin {
    for(uint256 i =0;i<newAdmins.length;i++){
        _admins[newAdmins[i]]=false;
    }
  }
    function adminOf(address owner) public view returns (bool) {
        require(owner != address(0), "admin query for the zero address");

        return _admins[owner];
    }
    
  /// @dev Requires the msg.sender to have the DEFAULT_ADMIN_ROLE
  modifier onlyAdmin() {
    require(_admins[msg.sender], "only-admin");
    _;
  }

}
