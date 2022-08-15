import type { Response } from '~/types/request';

import request from '~/utils/request';

import { apiEmojis } from './api';

type GetEmojisResponse = Record<'Activities'
| 'Animals & Nature'
| 'Component'
| 'Flags'
| 'Food & Drink'
| 'Objects'
| 'People & Body'
| 'Smileys & Emotion'
| 'Symbols'
| 'Travel & Places', string[][]>

export const getEmojis = () => request.get<GetEmojisResponse, Response<GetEmojisResponse>>(apiEmojis);
