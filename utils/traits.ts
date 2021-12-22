import * as Chance from "chance";
import { IMAGES_BY_TRAIT, ZeniImageTraits } from "../constants/media";
import { ZeniClasses, ZeniImageCombo } from "../types";
import * as fs from "fs";

const generateArn = (zeniCombo: ZeniImageCombo) => {
  const bodyId = zeniCombo.body.id.split("_")[2];
  const skinId = zeniCombo.skin.id.split("_")[2];
  const eyesId = zeniCombo.eyes.id.split("_")[2];
  const mouthId = zeniCombo.mouth.id.split("_")[2];
  const foreheadId =
    zeniCombo.forehead.id !== "forehead_none" ? zeniCombo.forehead.id.split("_")[2] : "0";
  const crownId = zeniCombo.crown.id !== "crown_none" ? zeniCombo.crown.id.split("_")[2] : "0";
  const necklaceId =
    zeniCombo.necklace.id !== "necklace_none" ? zeniCombo.necklace.id.split("_")[2] : "0";

  return `g0_${zeniCombo.class}_b${bodyId}_s${skinId}_e${eyesId}_m${mouthId}_f${foreheadId}_c${crownId}_n${necklaceId}_i${zeniCombo.classId}`;
};

function generateZeniCombo(
  zeniClass: ZeniClasses,
  tokenId: number,
  classId: number,
  items: {
    [arn: string]: ZeniImageCombo;
  }
): ZeniImageCombo {
  const chance = new Chance.Chance();
  const classBodies = IMAGES_BY_TRAIT[ZeniImageTraits.Body].filter(
    (imageInfo) => imageInfo.class === zeniClass
  );
  const body = chance.weighted(
    classBodies,
    classBodies.map((w) => w.weight)
  );
  const head = chance.weighted(
    IMAGES_BY_TRAIT[ZeniImageTraits.Skin],
    IMAGES_BY_TRAIT[ZeniImageTraits.Skin].map((w) => w.weight)
  );
  const eyes = chance.weighted(
    IMAGES_BY_TRAIT[ZeniImageTraits.Eyes],
    IMAGES_BY_TRAIT[ZeniImageTraits.Eyes].map((w) => w.weight)
  );
  const mouth = chance.weighted(
    IMAGES_BY_TRAIT[ZeniImageTraits.Mouth],
    IMAGES_BY_TRAIT[ZeniImageTraits.Mouth].map((w) => w.weight)
  );
  const forehead = chance.weighted(
    IMAGES_BY_TRAIT[ZeniImageTraits.Forehead],
    IMAGES_BY_TRAIT[ZeniImageTraits.Forehead].map((w) => w.weight)
  );
  const necklace = chance.weighted(
    IMAGES_BY_TRAIT[ZeniImageTraits.Necklace],
    IMAGES_BY_TRAIT[ZeniImageTraits.Necklace].map((w) => w.weight)
  );
  const crown = chance.weighted(
    IMAGES_BY_TRAIT[ZeniImageTraits.Crown],
    IMAGES_BY_TRAIT[ZeniImageTraits.Crown].map((w) => w.weight)
  );

  const combo: ZeniImageCombo = {
    tokenId,
    class: zeniClass,
    body,
    skin: head,
    eyes,
    mouth,
    forehead,
    necklace,
    crown,
    arn: "",
  };
  combo.arn = generateArn(combo);

  if (typeof items[combo.arn] === "undefined") {
    return combo;
  } else {
    return generateZeniCombo(zeniClass, tokenId, classId, items);
  }
}
const TOTAL_ZENIS = 5454;
const TOTAL_PER_CLASS = 1818;

const getPercentageAmongAllZenis = (count: number) => (count * 100) / TOTAL_ZENIS;

export const logResults = (traits: { [arn: string]: ZeniImageCombo }) => {
  const allArns = Object.keys(traits);
  const allImages = Object.values(traits);

  console.log("Total ARNS: ", allArns);
  console.log(
    "Unique ARNS: ",
    allArns.filter(function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }).length
  );

  const bodyCount: {
    [id: string]: number;
  } = {};
  IMAGES_BY_TRAIT[ZeniImageTraits.Body].forEach((img) => (bodyCount[img.displayName] = 0));
  allImages.forEach((img) => {
    bodyCount[img.body.displayName] += 1;
  });
  console.log("Bodies: ", bodyCount);

  const skinsCount: {
    [id: string]: { total: number; percent: string };
  } = {};
  IMAGES_BY_TRAIT[ZeniImageTraits.Skin].forEach(
    (img) => (skinsCount[img.displayName] = { total: 0, percent: "" })
  );
  allImages.forEach((img) => {
    skinsCount[img.skin.displayName].total += 1;
    skinsCount[img.skin.displayName].percent = `${getPercentageAmongAllZenis(
      skinsCount[img.skin.displayName].total
    )}%`;
  });
  console.log("Skins: ", skinsCount);

  const eyesCount: {
    [id: string]: { total: number; percent: string };
  } = {};
  IMAGES_BY_TRAIT[ZeniImageTraits.Eyes].forEach(
    (img) => (eyesCount[img.displayName] = { total: 0, percent: "" })
  );
  allImages.forEach((img) => {
    eyesCount[img.eyes.displayName] = {
      total: eyesCount[img.eyes.displayName].total + 1,
      percent: `${getPercentageAmongAllZenis(eyesCount[img.eyes.displayName].total)}%`,
    };
  });
  console.log("Eyes: ", eyesCount);

  const mouthCount: {
    [id: string]: { total: number; percent: string };
  } = {};
  IMAGES_BY_TRAIT[ZeniImageTraits.Mouth].forEach(
    (img) => (mouthCount[img.displayName] = { total: 0, percent: "" })
  );
  allImages.forEach((img) => {
    mouthCount[img.mouth.displayName] = {
      total: mouthCount[img.mouth.displayName].total + 1,
      percent: `${getPercentageAmongAllZenis(mouthCount[img.mouth.displayName].total)}%`,
    };
  });
  console.log("Mouths: ", mouthCount);

  const foreheadCount: {
    [id: string]: { total: number; percent: string };
  } = {};
  IMAGES_BY_TRAIT[ZeniImageTraits.Forehead].forEach(
    (img) => (foreheadCount[img.displayName] = { total: 0, percent: "" })
  );
  allImages.forEach((img) => {
    foreheadCount[img.forehead.displayName] = {
      total: foreheadCount[img.forehead.displayName].total + 1,
      percent: `${getPercentageAmongAllZenis(foreheadCount[img.forehead.displayName].total)}%`,
    };
  });
  console.log("Foreheads: ", foreheadCount);

  const necklaceCount: {
    [id: string]: { total: number; percent: string };
  } = {};
  IMAGES_BY_TRAIT[ZeniImageTraits.Necklace].forEach(
    (img) => (necklaceCount[img.displayName] = { total: 0, percent: "" })
  );
  allImages.forEach((img) => {
    necklaceCount[img.necklace.displayName] = {
      total: necklaceCount[img.necklace.displayName].total + 1,
      percent: `${getPercentageAmongAllZenis(necklaceCount[img.necklace.displayName].total)}%`,
    };
  });
  console.log("Necklaces: ", necklaceCount);

  const crownsCount: {
    [id: string]: { total: number; percent: string };
  } = {};
  IMAGES_BY_TRAIT[ZeniImageTraits.Crown].forEach(
    (img) => (crownsCount[img.displayName] = { total: 0, percent: "" })
  );
  allImages.forEach((img) => {
    crownsCount[img.crown.displayName] = {
      total: crownsCount[img.crown.displayName].total + 1,
      percent: `${getPercentageAmongAllZenis(crownsCount[img.crown.displayName].total)}%`,
    };
  });
  console.log("Crowns: ", crownsCount);

  return {
    bodyCount,
    skinsCount,
    eyesCount,
    mouthCount,
    foreheadCount,
    necklaceCount,
    crownsCount,
  };
};

export const generateTraits = (): {
  [arn: string]: ZeniImageCombo;
} => {
  const arns: string[] = [];
  const combosByArn: {
    [arn: string]: ZeniImageCombo;
  } = {};
  const arnByTokenId: {
    [tokenId: number]: string;
  } = {};

  let tokenId = 1;
  let magiId = 1;
  // GENERATE MAGI TRAITS
  for (let x = 0; x < 1735; ++x) {
    const newCombo = generateZeniCombo(ZeniClasses.Magi, tokenId, magiId, traits);
    combosByArn[newCombo.arn] = newCombo;

    arnByTokenId[tokenId] = newCombo.arn;
    arns.push(newCombo.arn);
    ++magiId;
    ++tokenId;
  }

  let rogueId = 1;
  // GENERATE ROGUE TRAITS
  for (let x = 0; x < 1735; ++x) {
    const newCombo = generateZeniCombo(ZeniClasses.Rogue, tokenId, rogueId, combosByArn);
    combosByArn[newCombo.arn] = newCombo;
    ++rogueId;
    ++tokenId;
  }

  let warriorId = 1;

  // GENERATE WARRIOR TRAITS
  for (let x = 0; x < 1735; ++x) {
    const newCombo = generateZeniCombo(ZeniClasses.Warrior, tokenId, warriorId, combosByArn);
    combosByArn[newCombo.arn] = newCombo;
    ++rogueId;
    ++warriorId;
  }

  const results = logResults(combosByArn);

  fs.writeFile("./metadata/token-to-arn.json", JSON.stringify(arnByTokenId), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });

  fs.writeFile("./metadata/arns.json", JSON.stringify(arns), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });

  fs.writeFile("./metadata/combos-by-arn.json", JSON.stringify(combosByArn), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
  fs.writeFile("./metadata/results.json", JSON.stringify(results), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });

  return combosByArn;
};
