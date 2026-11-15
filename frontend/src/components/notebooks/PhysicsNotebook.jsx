import React from 'react';
import NotebookCard from './NotebookCard';
import PhysicsPixelScene from './scenes/PhysicsPixelScene';

export default function PhysicsNotebook(props) {
  return (
    <NotebookCard
      {...props}
      subject="physics"
      pinColor={props.pinColor || 'blue'}
      SceneComponent={PhysicsPixelScene}
    />
  );
}
