import { FaDog } from 'react-icons/fa';
import { PiDogBold } from 'react-icons/pi';
import { GiSittingDog } from 'react-icons/gi';
import { CgProfile } from 'react-icons/cg';

export const links = [
  { text: 'add dog', path: '.', icon: <FaDog /> },
  { text: 'all dogs', path: 'all-dogs', icon: <PiDogBold /> },
  { text: 'all conditions', path: 'all-conditions', icon: <GiSittingDog /> },
  { text: 'profile', path: 'profile', icon: <CgProfile /> },
  
];
