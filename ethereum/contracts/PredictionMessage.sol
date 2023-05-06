pragma solidity ^0.5.11;

// Simple Solidity intro/demo contract
contract PredictionMessage {

  address ContractAdmin;

  mapping ( bytes32 => NotarizedMessage) notarizedMessages; // this allows to look up notarizedMessages by their SHA256notaryHash
  bytes32[] messagesByNotaryHash; // this is like a whitepages of all images, by SHA256notaryHash

  mapping ( address => User ) Users;   // this allows to look up Users by their ethereum address
  address[] usersByAddress;  // this is like a whitepages of all users, by ethereum address

  struct NotarizedMessage {
    string message;
    uint timeStamp;
  }

  struct User {
    string email;
    string tokenValidation;
    uint validatedAt;
    uint createdAt;
    bytes32[] myMessages;
    bool enabled;
  }

  constructor() public {  // this is the CONSTRUCTOR (same name as contract) it gets called ONCE only when contract is first deployed
    ContractAdmin = msg.sender;  // just set the admin, so they can disable users if needed, but nobody else can
  }

  modifier onlyAdmin() {
        require(
            msg.sender == ContractAdmin,
            "Not authorized"
        );
      // Do not forget the "_;"! It will be replaced by the actual function body when the modifier is used.
      _;
  }

    function enableUser(address addressUser) public onlyAdmin returns (bool success) {
        require(Users[addressUser].enabled == false, "User already enabled");
        Users[addressUser].enabled = true;
        return true;
    }

    function disableUser(address addressUser) public onlyAdmin returns (bool success) {
        require(Users[addressUser].enabled == true, "User already disabled");
        Users[addressUser].enabled = false;
        return true;
    }

  function registerNewUser(string memory email, string memory tokenValidation) public returns (bool success) {
    address thisNewAddress = msg.sender;
    // don't overwrite existing entries, and make sure handle isn't null
    if(bytes(Users[msg.sender].email).length == 0 && bytes(email).length != 0){
      Users[thisNewAddress].email = email;
      Users[thisNewAddress].tokenValidation = tokenValidation;
      Users[thisNewAddress].validatedAt = 0;
      Users[thisNewAddress].createdAt = block.timestamp;
      Users[thisNewAddress].enabled = true;
      usersByAddress.push(thisNewAddress);  // adds an entry for this user to the user 'whitepages'
      return true;
    } else {
      return false; // either handle was null, or a user with this handle already existed
    }
  }

  function strEquals(string memory a, string memory b) private pure returns (bool) {
      return (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
  }

    function validateUser(string memory token) public returns (bool success) {
        address thisNewAddress = msg.sender;
        require(bytes(Users[thisNewAddress].email).length != 0, "User doesn't exists");
        require(strEquals(Users[thisNewAddress].tokenValidation, token), "Not valid token");
        //after validations, update User
        Users[thisNewAddress].validatedAt = block.timestamp;
        return true;
    }

  function createMessage(string memory message) public returns (bool success) {
    address thisNewAddress = msg.sender;
    bytes32 SHA256notaryHash = bytes32(block.number);
    if(bytes(Users[thisNewAddress].email).length != 0){ // make sure this user has created an account first
        require(Users[thisNewAddress].enabled, "User disabled");
      if(bytes(message).length != 0){   // ) {  // couldn't get bytes32 null check to work, oh well!
        // prevent users from fighting over sha listings in the whitepages
        if(bytes(notarizedMessages[SHA256notaryHash].message).length == 0) {
            messagesByNotaryHash.push(SHA256notaryHash); // adds entry for this image to our image whitepages
            notarizedMessages[SHA256notaryHash].message = message;
            notarizedMessages[SHA256notaryHash].timeStamp = block.timestamp;
            Users[thisNewAddress].myMessages.push(SHA256notaryHash); // add the message hash to this users .myMessages array
        }
        return true;
      } else {
        return false; // either message or SHA256notaryHash was null, couldn't store message
      }
    }
    return false; // user didn't have an account yet, couldn't store image
  }

  function getUsers() public view returns (address[] memory) { return usersByAddress; }

  function getUser(address userAddress) public view returns (string memory,uint,uint,bytes32[] memory, bool) {
    return (
        Users[userAddress].email,
        Users[userAddress].validatedAt,
        Users[userAddress].createdAt,
        Users[userAddress].myMessages,
        Users[userAddress].enabled
    );
  }

  function getAllMessages() public view returns (bytes32[] memory) { return messagesByNotaryHash; }

  function getUserMessages(address userAddress) public view returns (bytes32[] memory) { return Users[userAddress].myMessages; }

  function getMessage(bytes32 SHA256notaryHash) public view returns (string memory,uint) {
    return (notarizedMessages[SHA256notaryHash].message,notarizedMessages[SHA256notaryHash].timeStamp);
  }

}
