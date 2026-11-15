import React from 'react';
import NotebookCard from './NotebookCard';
import MathematicsPixelScene from './scenes/MathematicsPixelScene';

export default function MathematicsNotebook(props) {
  return (
    <NotebookCard
      {...props}
      subject="maths"
      pinColor={props.pinColor || 'purple'}
      SceneComponent={MathematicsPixelScene}
    />
  );
}
