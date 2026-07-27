import manifestJson from './manifest.json';
import { BUSINESS_EIOS } from './eios';
import { BUSINESS_XIOS } from './xios';
import { BUSINESS_AIOS } from './aios';
import { BUSINESS_EDOS } from './edos';
import { IOsObject } from '../../../lib/blueprint-os/engine/types';

const objects: IOsObject[] = [
  ...BUSINESS_EIOS,
  ...BUSINESS_XIOS,
  ...BUSINESS_AIOS,
  ...BUSINESS_EDOS
];

export const BusinessPack = {
  manifest: manifestJson,
  objects
};
