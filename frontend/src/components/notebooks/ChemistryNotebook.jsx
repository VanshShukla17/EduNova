import React from 'react';
import NotebookCard from './NotebookCard';
import ChemistryPixelScene from './scenes/ChemistryPixelScene';

export default function ChemistryNotebook(props) {
  return (
    <NotebookCard
      {...props}
      subject="chemistry"
      pinColor={props.pinColor || 'orange'}
      SceneComponent={ChemistryPixelScene}
    />
  );
}
