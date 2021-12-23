import { VercelRequest, VercelResponse } from '@vercel/node';
import { IMAGES_BY_TRAIT, ZeniImageTraits } from '../../constants/media';
import { MetadataAttribute, ZeniDecrypted, ZeniImageInfo } from '../../types';
import { decryptZeniARN } from '../../utils/arn';

const ZENIS_ARN_DATABASE: {
  [tokenId: string]: string;
} = {
  '244': '303030303330303035303230373132313030323030',
};

const findZeniARN = (tokenId: string) => {
  return ZENIS_ARN_DATABASE[tokenId];
};

const findImageInfo = (
  trait: ZeniImageTraits,
  generation: string,
  traitName: string,
  id: string,
  zeniClass?: string,
) => {
  let generatedId: string;
  switch (traitName) {
    case 'body':
      generatedId = `${zeniClass}_gen${generation}_body_${id}`;
      break;
    default:
      generatedId = id === '0' ? `${traitName}_none` : `${traitName}_gen${generation}_${id}`;
      break;
  }
  return IMAGES_BY_TRAIT[trait].find((imageInfo: ZeniImageInfo) => imageInfo.id === generatedId);
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
}: ZeniDecrypted): MetadataAttribute[] => {
  console.log(generation, zeniClass, bodyId, skinId, eyesId, foreheadId, mouthId, necklaceId, crownId);
  const bodyData = findImageInfo(ZeniImageTraits.Body, generation, 'body', bodyId, zeniClass);
  const skinData = findImageInfo(ZeniImageTraits.Skin, generation, 'skin', skinId);
  const eyesData = findImageInfo(ZeniImageTraits.Eyes, generation, 'eyes', eyesId);
  const mouthData = findImageInfo(ZeniImageTraits.Mouth, generation, 'mouth', mouthId);
  const foreheadData = findImageInfo(ZeniImageTraits.Forehead, generation, 'forehead', foreheadId);
  const necklaceData = findImageInfo(ZeniImageTraits.Necklace, generation, 'necklace', necklaceId);
  const crownData = findImageInfo(ZeniImageTraits.Crown, generation, 'crown', crownId);

  const zeniAttributes = [
    {
      trait_type: 'Generation',
      display_type: 'number',
      value: parseInt(generation),
    },
    {
      trait_type: 'Class',
      value: `${zeniClass.charAt(0).toUpperCase() + zeniClass.slice(1)}`, // first letter upper
    },
    {
      trait_type: 'Body',
      value: bodyData?.displayName,
    },
    {
      trait_type: 'Skin',
      value: skinData?.displayName,
    },
    {
      trait_type: 'Eyes',
      value: eyesData?.displayName,
    },
    {
      trait_type: 'Mouth',
      value: mouthData?.displayName,
    },
    {
      trait_type: 'Forehead',
      value: foreheadData?.displayName,
    },
    {
      trait_type: 'Crown',
      value: crownData?.displayName,
    },
    {
      trait_type: 'Necklace',
      value: necklaceData?.displayName,
    },
    {
      trait_type: 'Purification Points',
      display_type: 'number',
      value: 100,
    },
  ];

  return zeniAttributes;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const tokenId = req.query.tokenId as string;
    const tokenIdByClass = '12'; // TODO: FIND TOKEN ID BY CLASS IN CONTRACT
    const zeniArn = findZeniARN(tokenIdByClass);
    const decryptedARN: ZeniDecrypted = decryptZeniARN(zeniArn);
    const attributes = generateZeniMetadataAttributes(decryptedARN);
    console.log(zeniArn);

    return res.json({
      name: `Generation ${decryptedARN.generation} Zeni #${tokenId}`,
      image: `https://cms.zeniverse.com/static/${zeniArn}.jpg`,
      description: `A ${decryptedARN.zeniClass} Zeni of the Zeniverse's Generation ${decryptedARN.generation}`,
      attributes,
    });
  } catch (error) {
    return res.status(400).json({ error: 'There is no Magi Zeni with this id' });
  }
};
