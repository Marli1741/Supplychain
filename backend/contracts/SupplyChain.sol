// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SupplyChain {
    address public Owner;

    constructor() {
        Owner = msg.sender;
    }

    // --- 1. ROLE-BASED ACCESS CONTROL (RBAC) ---
    modifier onlyByOwner() {
        require(msg.sender == Owner, "Only owner allowed");
        _;
    }

    // --- 2. EVENT LOGGING ---
    event MedicineAdded(uint256 id, string name);
    event StageUpdated(uint256 id, STAGE stage, uint256 timestamp);

    // --- 3. STATE MACHINE ---
    enum STAGE { Init, RawMaterialSupply, Manufacture, Distribution, Retail, sold }

    uint256 public medicineCtr = 0;
    uint256 public rmsCtr = 0;
    uint256 public manCtr = 0;
    uint256 public disCtr = 0;
    uint256 public retCtr = 0;

    struct medicine {
        uint256 id;
        string name;
        string description;
        uint256 RMSid;
        uint256 MANid;
        uint256 DISid;
        uint256 RETid;
        STAGE stage;
        uint256 timestamp;
        string gpsCoordinates; // HYBRID FEATURE: GPS Data
    }

    mapping(uint256 => medicine) public MedicineStock;

    // --- ROLE DATA STRUCTURES ---
    struct rawMaterialSupplier { address addr; uint256 id; string name; string place; }
    mapping(uint256 => rawMaterialSupplier) public RMS;
    
    struct manufacturer { address addr; uint256 id; string name; string place; }
    mapping(uint256 => manufacturer) public MAN;
    
    struct distributor { address addr; uint256 id; string name; string place; }
    mapping(uint256 => distributor) public DIS;
    
    struct retailer { address addr; uint256 id; string name; string place; }
    mapping(uint256 => retailer) public RET;

    // --- ADDING ROLES ---
    function addRMS(address _address, string memory _name, string memory _place) public onlyByOwner {
        rmsCtr++; RMS[rmsCtr] = rawMaterialSupplier(_address, rmsCtr, _name, _place);
    }
    function addManufacturer(address _address, string memory _name, string memory _place) public onlyByOwner {
        manCtr++; MAN[manCtr] = manufacturer(_address, manCtr, _name, _place);
    }
    function addDistributor(address _address, string memory _name, string memory _place) public onlyByOwner {
        disCtr++; DIS[disCtr] = distributor(_address, disCtr, _name, _place);
    }
    function addRetailer(address _address, string memory _name, string memory _place) public onlyByOwner {
        retCtr++; RET[retCtr] = retailer(_address, retCtr, _name, _place);
    }

    // --- CORE LOGIC (With Hybrid GPS Inputs) ---

    function addMedicine(string memory _name, string memory _description) public onlyByOwner {
        require(rmsCtr > 0 && manCtr > 0 && disCtr > 0 && retCtr > 0, "All roles must exist");
        medicineCtr++;
        MedicineStock[medicineCtr] = medicine(
            medicineCtr, _name, _description, 0, 0, 0, 0, STAGE.Init, block.timestamp, 
            "Origin: Factory HQ" // Default starting location
        );
        emit MedicineAdded(medicineCtr, _name);
    }

    function RMSsupply(uint256 _medicineID, string memory _gps) public {
        require(validMedicine(_medicineID));
        uint256 _id = findRMS(msg.sender);
        require(_id > 0, "Not RMS");
        require(MedicineStock[_medicineID].stage == STAGE.Init);

        MedicineStock[_medicineID].RMSid = _id;
        MedicineStock[_medicineID].gpsCoordinates = _gps;
        updateStage(_medicineID, STAGE.RawMaterialSupply);
    }

    function Manufacturing(uint256 _medicineID, string memory _gps) public {
        require(validMedicine(_medicineID));
        uint256 _id = findMAN(msg.sender);
        require(_id > 0, "Not Manufacturer");
        require(MedicineStock[_medicineID].stage == STAGE.RawMaterialSupply);

        MedicineStock[_medicineID].MANid = _id;
        MedicineStock[_medicineID].gpsCoordinates = _gps;
        updateStage(_medicineID, STAGE.Manufacture);
    }

    function Distribute(uint256 _medicineID, string memory _gps) public {
        require(validMedicine(_medicineID));
        uint256 _id = findDIS(msg.sender);
        require(_id > 0, "Not Distributor");
        require(MedicineStock[_medicineID].stage == STAGE.Manufacture);

        MedicineStock[_medicineID].DISid = _id;
        MedicineStock[_medicineID].gpsCoordinates = _gps;
        updateStage(_medicineID, STAGE.Distribution);
    }

    function Retail(uint256 _medicineID, string memory _gps) public {
        require(validMedicine(_medicineID));
        uint256 _id = findRET(msg.sender);
        require(_id > 0, "Not Retailer");
        require(MedicineStock[_medicineID].stage == STAGE.Distribution);

        MedicineStock[_medicineID].RETid = _id;
        MedicineStock[_medicineID].gpsCoordinates = _gps;
        updateStage(_medicineID, STAGE.Retail);
    }

    function sold(uint256 _medicineID, string memory _gps) public {
        require(validMedicine(_medicineID));
        uint256 _id = findRET(msg.sender);
        require(_id == MedicineStock[_medicineID].RETid, "Only assigned retailer can sell");
        require(MedicineStock[_medicineID].stage == STAGE.Retail);

        MedicineStock[_medicineID].gpsCoordinates = _gps;
        updateStage(_medicineID, STAGE.sold);
    }

    // --- HELPERS ---
    function updateStage(uint256 _medicineID, STAGE _stage) internal {
        MedicineStock[_medicineID].stage = _stage;
        MedicineStock[_medicineID].timestamp = block.timestamp;
        emit StageUpdated(_medicineID, _stage, block.timestamp);
    }

    function validMedicine(uint256 _medicineID) internal view returns (bool) {
        require(_medicineID > 0 && _medicineID <= medicineCtr, "Invalid ID");
        return true;
    }

    function findRMS(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= rmsCtr; i++) if (RMS[i].addr == _address) return RMS[i].id; return 0;
    }
    function findMAN(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= manCtr; i++) if (MAN[i].addr == _address) return MAN[i].id; return 0;
    }
    function findDIS(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= disCtr; i++) if (DIS[i].addr == _address) return DIS[i].id; return 0;
    }
    function findRET(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= retCtr; i++) if (RET[i].addr == _address) return RET[i].id; return 0;
    }
}