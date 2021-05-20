// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "../../openzeppelin-contracts-upgradeable/contracts/token/ERC721/IERC721Upgradeable.sol";
import "../../openzeppelin-contracts-upgradeable/contracts/token/ERC20/IERC20Upgradeable.sol";
import "../../openzeppelin-contracts-upgradeable/contracts/token/ERC1155/IERC1155Upgradeable.sol";
import "./LootBox.sol";
import "./LootBoxController.sol";
import "./ERC721ControlledFactory.sol";

/// @title Allows anyone to "loot" an address
/// @author Brendan Asselstine
/// @notice A LootBox allows anyone to withdraw all tokens or execute calls on behalf of the contract.
/// @dev This contract is intended to be counterfactually instantiated via CREATE2.
contract NFTBox {

  address private _owner;
  LootBoxController public lootBoxControllerInstance;
  ERC721Controlled public erc721Controlled ;
  /// @notice Emitted when an ERC20 token is deposited
  event DepositERC20(address indexed token, uint256 amount);
  event ChoosedBox(address indexed user, address indexed lootboxAddress,uint256 indexed tokenId);

   constructor () public {
    // require(_owner == address(0), "LootBox/already-init");
    _owner = msg.sender;
     lootBoxControllerInstance = new LootBoxController();
    
     erc721Controlled = createERC721Controlled("hsc nft Box", "HOONFT", "https://nfts.hoosmartchain.com/box/");

  }

/// @notice Emitted when a ERC721Controlled is created
  event ERC721ControlledCreated(address indexed token);

  /// @notice Creates an ERC721Controlled contract
  /// @return The address of the newly created ERC721Controlled
  function createERC721Controlled(
    string memory name,
    string memory symbol,
    string memory baseURI
  ) public returns (ERC721Controlled) {
    ERC721Controlled result = new ERC721Controlled();
    result.initialize(name, symbol, baseURI, msg.sender);
    emit ERC721ControlledCreated(address(result));
    return result;
  }
  
function chooseBox(address user,IERC20Upgradeable[] calldata tokens,uint256[] calldata amounts
  ) external  onlyOwner returns (uint256){
    uint256 tokenId=erc721Controlled.mint(user);
    address lootboxAddress = lootBoxControllerInstance.computeAddress(address(erc721Controlled),tokenId);
    _depositERC20(tokens,amounts,lootboxAddress);
    emit ChoosedBox(user,lootboxAddress,tokenId);

    return tokenId;
  }

  /// @notice Transfers tokens to another account
  /// @param tokenId The address receiving all tokens
  /// @param erc20s Array of ERC20 token addresses whose entire balance should be transferred
  function openBox(
    uint256 tokenId,
    IERC20Upgradeable[] calldata erc20s
  ) external  {
      LootBox.WithdrawERC721[] memory erc721 = new  LootBox.WithdrawERC721[](0);
      LootBox.WithdrawERC1155[] memory erc1155= new  LootBox.WithdrawERC1155[](0);
   lootBoxControllerInstance.plunder(
     address(erc721Controlled),
     tokenId,
     erc20s,   
     erc721,
     erc1155
  );
  }

  /// @notice Transfers the entire balance of ERC20s to an account
  /// @param tokens An array of ERC20 tokens to transfer out.  The balance of each will be transferred.
  /// @param to The recipient of the transfers
  function _depositERC20(IERC20Upgradeable[] calldata tokens,uint256[] calldata amounts, address to) internal {
    for (uint256 i = 0; i < tokens.length; i++) {
      uint256 balance = amounts[i];
      tokens[i].transfer(to, amounts[i]);

      emit DepositERC20(address(tokens[i]), balance);
    }
  }

  modifier onlyOwner {
    require(msg.sender == _owner, "LootBox/only-owner");
    _;
  }
}
