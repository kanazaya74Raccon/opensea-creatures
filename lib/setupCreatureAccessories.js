const values = require('./valuesCommon.js');

// Configure the nfts

const setupAccessory = async (
  accessories,
  owner
) => {
  for (let i = 0; i < values.NUM_ACCESSORIES; i++) {
    const id = i + 1;
    // We can't mint to factory as it isn't an ERC1155 receiver
    //await accessories.create(owner, id, values.INITIAL_SUPPLY, "", "0x0");
  }
};

// Configure the lootbox

const setupAccessoryLootBox = async (lootBox, factory) => {
  await lootBox.setState(
    factory.address,
    values.NUM_LOOTBOX_OPTIONS,
    values.NUM_CLASSES,
    1337
  );
  // We have one token id per rarity class.
  for (let i = 0; i < values.NUM_CLASSES; i++) {
    const id = i + 1;
    await lootBox.setTokenIdsForClass(i, [id]);
  }
  await lootBox.setOptionSettings(
    values.LOOTBOX_OPTION_BASIC,
    3,
    [7300, 2100, 400, 100, 50, 50],
    [0, 0, 0, 0, 0, 0]
  );
  await lootBox.setOptionSettings(
    values.LOOTBOX_OPTION_PREMIUM,
    5,
    [7300, 2100, 400, 100, 50, 50],
    [3, 0, 0, 0, 0, 0]
  );
  await lootBox.setOptionSettings(
    values.LOOTBOX_OPTION_GOLD,
    7,
    [7300, 2100, 400, 100, 50, 50],
    [3, 0, 2, 0, 1, 0]
  );
};

// Deploy and configure everything

const setupCreatureAccessories = async(accessories, factory, lootBox, owner) => {
  await setupAccessory(accessories, owner);
  await accessories.setApprovalForAll(owner, factory.address);
  await accessories.transferOwnership(factory.address);
  await setupAccessoryLootBox(lootBox, factory);
  await lootBox.transferOwnership(factory.address);
};


module.exports = {
  setupAccessory,
  setupAccessoryLootBox,
  setupCreatureAccessories
};
