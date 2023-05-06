pragma solidity ^0.5.11;

// Simple Solidity intro/demo contract
contract MyPrediction {

  address ContractAdmin;

  mapping ( bytes32 => NotarizedMessage) notarizedMessages; // this allows to look up notarizedMessages by their SHA256notaryHash
  bytes32[] messagesByNotaryHash; // this is like a whitepages of all messages, by SHA256notaryHash
  
  mapping ( address => bool ) authorizedUsers;

  struct NotarizedMessage {
    string message;
    uint timeStamp;
    string userEmail;
  }

  constructor() public {  // this is the CONSTRUCTOR (same name as contract) it gets called ONCE only when contract is first deployed
    ContractAdmin = msg.sender;  // just set the admin, so they can disable users if needed, but nobody else can
    authorizedUsers[ContractAdmin] = true;
  }

  modifier onlyAdmin() {
        require(
            msg.sender == ContractAdmin,
            "Not authorized"
        );
      // Do not forget the "_;"! It will be replaced by the actual function body when the modifier is used.
      _;
  }

    function addAuthorizedUser(address addressUser) public onlyAdmin returns (bool success) {
        authorizedUsers[addressUser] = true;
        return true;
    }

    function removeAuthorizedUser(address addressUser) public onlyAdmin returns (bool success) {
        authorizedUsers[addressUser] = false;
        return true;
    }

  function createMessage(string memory message, bytes32 SHA256notaryHash, string memory user) public returns (bool success) {
    address thisNewAddress = msg.sender;
    require(authorizedUsers[thisNewAddress], "User not authorized");
    if(bytes(message).length != 0) {   // ) {  // couldn't get bytes32 null check to work, oh well!
        // prevent users from fighting over sha listings in the whitepages
        if(bytes(notarizedMessages[SHA256notaryHash].message).length == 0) {
            messagesByNotaryHash.push(SHA256notaryHash); // adds entry for this image to our image whitepages
            notarizedMessages[SHA256notaryHash].message = message;
            notarizedMessages[SHA256notaryHash].timeStamp = block.timestamp;
            notarizedMessages[SHA256notaryHash].userEmail = user;
        }
        return true;
    }
    return false; // couldn't store message
  }

  function getAllMessages() public view returns (bytes32[] memory) { return messagesByNotaryHash; }

  function getMessage(bytes32 sha) public view returns (string memory,uint, string memory) {
    return (notarizedMessages[sha].message,notarizedMessages[sha].timeStamp,notarizedMessages[sha].userEmail);
  }

}
