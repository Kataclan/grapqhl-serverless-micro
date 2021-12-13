import { VercelRequest, VercelResponse } from "@vercel/node";
import { IMAGES_BY_TRAIT, ZeniImageTraits } from "../../../../constants/media";

const ZENIS_ARN_DATABASE: {
  [tokenId: string]: string;
} = {
  "244": "g0_warrior_b2_s6_e11_m2_f0_c2_n0",
};

type ZeniApi__Zeni = {
  tokenId: string;
  tokenIdByClass: string;
  arn: string;
  generation: string;
  zeniClass: string;
  bodyId: string;
  skinId: string;
  eyesId: string;
  mouthId: string;
  foreheadId: string;
  crownId: string;
  necklaceId: string;
};

interface ZeniApi_MetadataAttribute {
  trait_type: string | undefined;
  value: any;
  display_type?: string | undefined;
}

const findZeni = (tokenId: string) => {
  return ZENIS_ARN_DATABASE[tokenId];
};

const findImageInfo = (
  trait: ZeniImageTraits,
  generation: string,
  traitName: string,
  id: string,
  zeniClass?: string
) => {
  let generatedId: string;
  switch (traitName) {
    case "body":
      generatedId = `${zeniClass}_gen${generation}_body_${id}`;
      break;
    default:
      generatedId = id === "0" ? `${traitName}_none` : `${traitName}_gen${generation}_${id}`;
      break;
  }
  console.log(generatedId);
  return IMAGES_BY_TRAIT[trait].find((imageInfo) => imageInfo.id === generatedId);
};

const generazeZeniFromArn = (
  tokenId: string,
  tokenIdByClass: string,
  arn: string
): ZeniApi__Zeni => {
  const splittedArn = arn.split("_");
  return {
    tokenId,
    tokenIdByClass,
    arn,
    generation: splittedArn[0].substring(1),
    zeniClass: splittedArn[1], // first letter upper,
    bodyId: splittedArn[2].substring(1),
    skinId: splittedArn[3].substring(1),
    eyesId: splittedArn[4].substring(1),
    mouthId: splittedArn[5].substring(1),
    foreheadId: splittedArn[6].substring(1),
    crownId: splittedArn[7].substring(1),
    necklaceId: splittedArn[8].substring(1),
  };
};

const generateZeniMetadataAttributes = ({
  generation,
  zeniClass,
  bodyId,
  skinId,
  eyesId,
  foreheadId,
  mouthId,
  necklaceId,
  crownId,
}: ZeniApi__Zeni): ZeniApi_MetadataAttribute[] => {
  console.log(
    generation,
    zeniClass,
    bodyId,
    skinId,
    eyesId,
    foreheadId,
    mouthId,
    necklaceId,
    crownId
  );
  const bodyData = findImageInfo(ZeniImageTraits.Body, generation, "body", bodyId, zeniClass);
  const skinData = findImageInfo(ZeniImageTraits.Skin, generation, "skin", skinId);
  const eyesData = findImageInfo(ZeniImageTraits.Eyes, generation, "eyes", eyesId);
  const mouthData = findImageInfo(ZeniImageTraits.Mouth, generation, "mouth", mouthId);
  const foreheadData = findImageInfo(ZeniImageTraits.Forehead, generation, "forehead", foreheadId);
  const necklaceData = findImageInfo(ZeniImageTraits.Necklace, generation, "necklace", necklaceId);
  const crownData = findImageInfo(ZeniImageTraits.Crown, generation, "crown", crownId);

  const zeniAttributes = [
    {
      trait_type: "Generation",
      display_type: "number",
      value: parseInt(generation),
    },
    {
      trait_type: "Class",
      value: `${zeniClass.charAt(0).toUpperCase() + zeniClass.slice(1)}`, // first letter upper
    },
    {
      trait_type: "Body",
      value: bodyData?.displayName,
    },
    {
      trait_type: "Skin",
      value: skinData?.displayName,
    },
    {
      trait_type: "Eyes",
      value: eyesData?.displayName,
    },
    {
      trait_type: "Mouth",
      value: mouthData?.displayName,
    },
    {
      trait_type: "Forehead",
      value: foreheadData?.displayName,
    },
    {
      trait_type: "Crown",
      value: crownData?.displayName,
    },
    {
      trait_type: "Necklace",
      value: necklaceData?.displayName,
    },
    {
      trait_type: "Purification Points",
      display_type: "number",
      value: 100,
    },
  ];

  return zeniAttributes;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const tokenIdByClass = req.query.tokenIdByClass as string;
    const tokenId = "12"; // TODO: FIND TOKEN ID IN CONTRACT
    const zeniArn = findZeni(tokenIdByClass);
    const zeni = generazeZeniFromArn(tokenId, tokenIdByClass, zeniArn);
    const attributes = generateZeniMetadataAttributes(zeni);

    return res.json({
      name: `Generation ${zeni.generation} Zeni #${tokenId}`,
      image: `https://cms.zeniverse.com/${tokenIdByClass}`,
      description: `A ${zeni.zeniClass} Zeni of the Zeniverse's Generation ${zeni.generation}`,
      attributes,
    });
  } catch (error) {
    return res.status(400).json({ error: "There is no Magi Zeni with this id" });
  }
};
