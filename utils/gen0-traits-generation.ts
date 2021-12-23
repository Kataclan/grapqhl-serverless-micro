import * as Chance from "chance";
import { IMAGES_BY_TRAIT, ZeniImageTraits } from "../constants/media";
import { ZeniClasses, ZeniImageCombo } from "../types";
import * as fs from "fs";

const TOTAL_ZENIS = 5454;
const TOTAL_PER_CLASS = 1818;
const TOTAL_PER_TEAM_PER_CLASS = 83;
const TOTAL_PER_CLASS_PUBLIC = TOTAL_PER_CLASS - TOTAL_PER_TEAM_PER_CLASS;

const generateGen0Arn = (zeniCombo: ZeniImageCombo) => {
  const bodyId = zeniCombo.body.id.split("_")[3];
  const skinId = zeniCombo.skin.id.split("_")[2];
  const eyesId = zeniCombo.eyes.id.split("_")[2];
  const mouthId = zeniCombo.mouth.id.split("_")[2];
  const foreheadId =
    zeniCombo.forehead.id !== "forehead_none" ? zeniCombo.forehead.id.split("_")[2] : "0";
  const crownId = zeniCombo.crown.id !== "crown_none" ? zeniCombo.crown.id.split("_")[2] : "0";
  const necklaceId =
    zeniCombo.necklace.id !== "necklace_none" ? zeniCombo.necklace.id.split("_")[2] : "0";

  return `${zeniCombo.class}_${zeniCombo.classId}_g0_b${bodyId}_s${skinId}_e${eyesId}_m${mouthId}_f${foreheadId}_c${crownId}_n${necklaceId}`;
};

function generateZeniCombo(
  zeniClass: ZeniClasses,
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
    classId,
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
  combo.arn = generateGen0Arn(combo);

  if (typeof items[combo.arn] === "undefined") {
    return combo;
  } else {
    return generateZeniCombo(zeniClass, classId, items);
  }
}

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
    [id: string]: { total: number; percent: string };
  } = {};
  IMAGES_BY_TRAIT[ZeniImageTraits.Body].forEach(
    (img) => (bodyCount[img.displayName] = { total: 0, percent: "" })
  );
  allImages.forEach((img) => {
    bodyCount[img.body.displayName].total += 1;
    bodyCount[img.body.displayName].percent = `${getPercentageAmongAllZenis(
      bodyCount[img.body.displayName].total
    )}%`;
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

  const magiArnByClassId: {
    [tokenId: number]: string;
  } = {};
  const rogueArnByClassId: {
    [tokenId: number]: string;
  } = {};
  const warriorArnByClassId: {
    [tokenId: number]: string;
  } = {};

  // GENERATE MAGI TRAITS
  let magiId = 1;
  for (let x = 0; x < TOTAL_PER_CLASS_PUBLIC; ++x) {
    const newCombo = generateZeniCombo(ZeniClasses.Magi, magiId, combosByArn);
    combosByArn[newCombo.arn] = newCombo;
    magiArnByClassId[magiId] = newCombo.arn;
    arns.push(newCombo.arn);
    ++magiId;
  }

  // GENERATE ROGUE TRAITS
  let rogueId = 1;
  for (let x = 0; x < TOTAL_PER_CLASS_PUBLIC; ++x) {
    const newCombo = generateZeniCombo(ZeniClasses.Rogue, rogueId, combosByArn);
    combosByArn[newCombo.arn] = newCombo;
    rogueArnByClassId[rogueId] = newCombo.arn;
    arns.push(newCombo.arn);
    ++rogueId;
  }

  // GENERATE WARRIOR TRAITS
  let warriorId = 1;
  for (let x = 0; x < TOTAL_PER_CLASS_PUBLIC; ++x) {
    const newCombo = generateZeniCombo(ZeniClasses.Warrior, warriorId, combosByArn);
    combosByArn[newCombo.arn] = newCombo;
    warriorArnByClassId[warriorId] = newCombo.arn;
    arns.push(newCombo.arn);
    ++warriorId;
  }

  const results = logResults(combosByArn);

  fs.writeFile("./metadata/magi-ids-to-arn.json", JSON.stringify(magiArnByClassId), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
  fs.writeFile("./metadata/rogue-ids-to-arn.json", JSON.stringify(rogueArnByClassId), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
  fs.writeFile("./metadata/warrior-ids-to-arn.json", JSON.stringify(warriorArnByClassId), (err) => {
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
