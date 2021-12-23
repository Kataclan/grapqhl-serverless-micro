import { VercelRequest, VercelResponse } from '@vercel/node';
import * as fs from 'fs';
import * as Canvas from 'canvas';
import { IMAGE_HEIGHT, IMAGE_WIDTH, __generatedImagesDir } from '../../../constants/media';
import { ZeniImageCombo } from '../../../types';
import { generateTraits } from '../../../utils/gen0-traits-generation';

export const generateImageFromZeniTrait = async (trait: ZeniImageCombo) => {
  const canvas = Canvas.createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext('2d');

  if (trait.crown.displayName !== 'None') {
    const crownImage = await Canvas.loadImage(trait.crown.filePath + '/crown_back.png');
    ctx.drawImage(crownImage, 0, 0);
  }

  const bodyImage = await Canvas.loadImage(trait.body.filePath + '/' + trait.body.fileName);
  const headImg = await Canvas.loadImage(trait.skin.filePath + '/' + trait.skin.fileName);
  const eyesImg = await Canvas.loadImage(trait.eyes.filePath + '/' + trait.eyes.fileName);
  const mouthImg = await Canvas.loadImage(trait.mouth.filePath + '/' + trait.mouth.fileName);

  ctx.drawImage(bodyImage, 0, 0);
  ctx.drawImage(headImg, 0, 0);
  ctx.drawImage(eyesImg, 0, 0);

  if (trait.forehead.displayName !== 'None') {
    const furnitureImg = await Canvas.loadImage(trait.forehead.filePath + '/' + trait.forehead.fileName);
    ctx.drawImage(furnitureImg, 0, 0);
  }

  if (trait.necklace.displayName !== 'None') {
    const necklaceImg = await Canvas.loadImage(trait.necklace.filePath + '/' + trait.necklace.fileName);
    ctx.drawImage(necklaceImg, 0, 0);
  }
  if (trait.crown.displayName !== 'None') {
    const crownImage = await Canvas.loadImage(trait.crown.filePath + '/' + trait.crown.fileName);
    ctx.drawImage(crownImage, 0, 0);
  }

  ctx.drawImage(mouthImg, 0, 0);

  const buffer = await canvas.toBuffer('image/png');
  await fs.writeFile(__generatedImagesDir + `/${trait.class}/${trait.arn}.png`, buffer, function () {
    return;
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: VercelRequest, res: VercelResponse) => {
  const traits = generateTraits();

  const arns = Object.keys(traits);
  const values = Object.values(traits);
  for (let i = 0; i < arns.length; ++i) {
    generateImageFromZeniTrait(values[i]);
  }

  return res.send({
    data: 'OK',
  });
};
