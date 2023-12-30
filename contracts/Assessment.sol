// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event AmortizationPayment(uint256 principal, uint256 interest);
    event PalindromeCheck(string input, bool isPalindrome);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        require(msg.sender == owner, "You are not the owner of this account");

        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    // Function to simulate an amortization payment
    function makeAmortizationPayment(uint256 _principal, uint256 _interest) public {
        require(msg.sender == owner, "You are not the owner of this account");

        // Subtract the interest from the balance
        balance -= _interest;

        // Subtract the principal from the balance
        balance -= _principal;

        emit AmortizationPayment(_principal, _interest);
    }

    // Function to check if a string is a palindrome
    function isPalindrome(string memory _input) public pure returns (bool) {
        bytes memory forward = bytes(_input);
        bytes memory backward = new bytes(forward.length);

        for (uint256 i = 0; i < forward.length; i++) {
            backward[forward.length - 1 - i] = forward[i];
        }

        return keccak256(forward) == keccak256(backward);
    }

    // Function to test palindrome check
    function testPalindrome(string memory _input) public {
        bool result = isPalindrome(_input);
        emit PalindromeCheck(_input, result);
    }
}
