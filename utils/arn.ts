import { ClassCodes, GenerationCodes, ZeniDecrypted, ZeniImageCombo } from '../types';
import { ARN_INDEXES } from '../constants/arn';

const fourDigitStr = (str: string) => {
  switch (str.length) {
    case 1:
      return `000${str}`;
    case 2:
      return `00${str}`;
    case 3:
      return `0${str}`;
    default:
      return `${str}`;
  }
};

const twoDigitStr = (str: string) => (str.length === 1 ? `0${str}` : str);

export const decryptZeniARN = (arnEncrypted: string): ZeniDecrypted => {
  const decryptedArn = Buffer.from(arnEncrypted, 'hex').toString('utf-8');
  console.log('DECRYPTED ARN: ', decryptedArn);
  const zeniClass = decryptedArn.substring(ARN_INDEXES.class.start, ARN_INDEXES.class.end);
  const tokenIdByClass = decryptedArn.substring(ARN_INDEXES.tokenByClassId.start, ARN_INDEXES.tokenByClassId.end);
  const generation = decryptedArn[ARN_INDEXES.generation.index];
  const bodyId = decryptedArn.substring(ARN_INDEXES.bodyId.start, ARN_INDEXES.bodyId.end);
  const skinId = decryptedArn.substring(ARN_INDEXES.skinId.start, ARN_INDEXES.skinId.end);
  const eyesId = decryptedArn.substring(ARN_INDEXES.eyesId.start, ARN_INDEXES.eyesId.end);
  const mouthId = decryptedArn.substring(ARN_INDEXES.mouthId.start, ARN_INDEXES.mouthId.end);
  const foreheadId = decryptedArn.substring(ARN_INDEXES.foreheadId.start, ARN_INDEXES.foreheadId.end);
  const crownId = decryptedArn.substring(ARN_INDEXES.crownId.start, ARN_INDEXES.crownId.end);
  const necklaceId = decryptedArn.substring(ARN_INDEXES.necklaceId.start, ARN_INDEXES.necklaceId.end);
  console.log('Generation:', generation);
  console.log('Class:', zeniClass);
  console.log('Id:', tokenIdByClass);
  console.log('Body:', bodyId);
  console.log('Skin:', skinId);
  console.log('Eyes:', eyesId);
  console.log('Mouth:', mouthId);
  console.log('Forehead:', foreheadId);
  console.log('Crown:', crownId);
  console.log('Necklace:', necklaceId);
  return {
    generation,
    zeniClass,
    tokenIdByClass,
    bodyId,
    skinId,
    eyesId,
    mouthId,
    foreheadId,
    crownId,
    necklaceId,
  };
};

export const encryptZeniARN = (zeniCombo: ZeniImageCombo): string => {
  const bodyId = twoDigitStr(zeniCombo.body.id.split('_')[3]);
  const skinId = twoDigitStr(zeniCombo.skin.id.split('_')[2]);
  const eyesId = twoDigitStr(zeniCombo.eyes.id.split('_')[2]);
  const mouthId = twoDigitStr(zeniCombo.mouth.id.split('_')[2]);
  const foreheadId = twoDigitStr(zeniCombo.forehead.id !== 'forehead_none' ? zeniCombo.forehead.id.split('_')[2] : '0');
  const crownId = twoDigitStr(zeniCombo.crown.id !== 'crown_none' ? zeniCombo.crown.id.split('_')[2] : '0');
  const necklaceId = twoDigitStr(zeniCombo.necklace.id !== 'necklace_none' ? zeniCombo.necklace.id.split('_')[2] : '0');

  const generation = GenerationCodes[zeniCombo.generation].toString();
  const tokenByClassId = fourDigitStr(zeniCombo.classId.toString());
  const classId = twoDigitStr(ClassCodes[zeniCombo.class].toString());

  const arnInverted = `${necklaceId}${crownId}${foreheadId}${mouthId}${eyesId}${skinId}${bodyId}${tokenByClassId}${classId}${generation}`;
  const arnEncrypted = Buffer.from(arnInverted, 'utf-8').toString('hex');

  return arnEncrypted;
};
