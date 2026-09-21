// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedChain {
    address public owner;

    enum Role { None, Manufacturer }
    mapping(address => Role) public roles;

    struct MedicineBatch {
        string name;
        string batchId;
        string manufacturer;
        uint256 mfgDate;
        uint256 expDate;
        address registeredBy;
        bool exists;
    }

    mapping(string => MedicineBatch) private batches;

    event BatchRegistered(string batchId, string name, string manufacturer);

    modifier onlyManufacturer() {
        require(roles[msg.sender] == Role.Manufacturer || msg.sender == owner, "Access Denied: Manufacturer only");
        _;
    }

    constructor() {
        owner = msg.sender;
        roles[msg.sender] = Role.Manufacturer;
    }

    function registerBatch(
        string memory _name,
        string memory _batchId,
        string memory _manufacturer,
        uint256 _mfgDate,
        uint256 _expDate
    ) external onlyManufacturer {
        require(!batches[_batchId].exists, "Batch ID already exists!");

        batches[_batchId] = MedicineBatch({
            name: _name,
            batchId: _batchId,
            manufacturer: _manufacturer,
            mfgDate: _mfgDate,
            expDate: _expDate,
            registeredBy: msg.sender,
            exists: true
        });

        emit BatchRegistered(_batchId, _name, _manufacturer);
    }

    function verifyBatch(string memory _batchId) external view returns (
        string memory name,
        string memory batchId,
        string memory manufacturer,
        uint256 mfgDate,
        uint256 expDate,
        address registeredBy,
        bool exists
    ) {
        MedicineBatch memory b = batches[_batchId];
        require(b.exists, "Batch record not found");
        return (b.name, b.batchId, b.manufacturer, b.mfgDate, b.expDate, b.registeredBy, b.exists);
    }
}