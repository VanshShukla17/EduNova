import React from 'react';
import NotebookCard from './NotebookCard';
import BiologyPixelScene from './scenes/BiologyPixelScene';

export default function BiologyNotebook(props) {
  return (
    <NotebookCard
      {...props}
      subject="biology"
      pinColor={props.pinColor || 'green'}
      SceneComponent={BiologyPixelScene}
    />
  );
}
