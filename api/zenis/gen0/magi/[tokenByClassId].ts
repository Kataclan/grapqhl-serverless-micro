import { VercelRequest, VercelResponse } from '@vercel/node';
import { ZeniClasses } from '../../../../types';
import MAGI_ARNs from '../../../../metadata/magi-ids-to-arn.json';
import { decryptZeniARN } from '../../../../utils/arn';
import { generateZeniMetadataAttributes } from '../../../../utils/metadata';
import { getClassDisplayName } from '../../../../utils/strings';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const tokenByClassId = req.query.tokenByClassId as string;
    const zeniArn = MAGI_ARNs[tokenByClassId];
    const decryptedARN = decryptZeniARN(zeniArn);
    const attributes = generateZeniMetadataAttributes(decryptedARN);
    const classDisplayName = getClassDisplayName(ZeniClasses.Magi);

    return res.json({
      name: `Generation ${decryptedARN.generation} Zeni #${req.query.tokenId}`,
      image: `https://cms.zeniverse.com/static/${zeniArn}.jpg`,
      description: `A ${classDisplayName} Zeni of the Zeniverse's Generation ${decryptedARN.generation}`,
      attributes,
    });
  } catch (error) {
    return res.status(400).json({ error: 'There is no Magi Zeni with this id' });
  }
};
