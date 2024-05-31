import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface AvatarProps {
  fullName: string;
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    color: 'white',
    fontSize: '3em',
    fontWeight: 'bold',
  },
}));

const Avatar: React.FC<AvatarProps> = ({ fullName }) => {
  const classes = useStyles();

  // Function to generate initials from the name
  const getInitials = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <div className={classes.avatar}>
      {getInitials(fullName)}
    </div>
  );
};

export default Avatar;
