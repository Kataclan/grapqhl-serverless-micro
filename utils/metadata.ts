import { IMAGES_BY_TRAIT, ZeniImageTraits } from '../constants/media';
import { CodeToClass, MetadataAttribute, ZeniClasses, ZeniDecrypted, ZeniImageInfo } from '../types';
import { getClassDisplayName } from './strings';

const findImageInfo = (
  trait: ZeniImageTraits,
  generation: string,
  traitName: string,
  id: string,
  zeniClass?: string,
) => {
  let generatedId: string;
  const _class = zeniClass ?? '';

  switch (traitName) {
    case 'body':
      generatedId = `${CodeToClass[parseInt(_class)]}_gen${generation}_body_${id[0] == '0' ? id[1] : id}`;
      break;
    default:
      generatedId =
        id[0] === '0'
          ? id[1] == '0'
            ? `${traitName}_none`
            : `${traitName}_gen${generation}_${id[1]}`
          : `${traitName}_gen${generation}_${id}`;
      break;
  }
  return IMAGES_BY_TRAIT[trait].find((imageInfo: ZeniImageInfo) => imageInfo.id === generatedId);
};

export const generateZeniMetadataAttributes = ({
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
      value: getClassDisplayName(ZeniClasses.Magi),
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
