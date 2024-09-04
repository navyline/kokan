import React, { useState } from 'react';

const conditions = [
  { label: 'New', description: 'Unused, sealed, and in the original packaging or with the original tag.' },
  { label: 'Like new', description: 'Lightly used and fully functional, but does not include the original packaging or tags.' },
  { label: 'Good', description: 'Gently used and may have minor cosmetic flaws, but is fully functional.' },
  { label: 'Fair', description: 'Used and has multiple cosmetic flaws, but overall functional.' },
];

const ConditionSelector = ({ onSelectCondition }) => {
  const [selectedCondition, setSelectedCondition] = useState('');

  const handleConditionChange = (e) => {
    setSelectedCondition(e.target.value);
    onSelectCondition(e.target.value);
  };

  return (
    <div>
      <h3>Select Condition</h3>
      {conditions.map((condition, index) => (
        <div key={index} className="mb-4">
          <input
            type="radio"
            id={condition.label}
            name="condition"
            value={condition.label}
            onChange={handleConditionChange}
          />
          <label htmlFor={condition.label} className="ml-2">{condition.label}</label>
          <p className="text-gray-500 ml-6">{condition.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ConditionSelector;
