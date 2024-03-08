import ParticipantsType from './types/participant';

export const getParticipants = {
  type: ParticipantsType,
  description: 'get participants',
  resolve: (): unknown => ({}),
};

export default getParticipants;
