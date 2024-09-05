import React, { useState } from 'react';

const conditions = [
  { label: 'ใหม่', description: 'ไม่เคยใช้งาน ปิดผนึก และอยู่ในบรรจุภัณฑ์เดิม' },
  { label: 'เหมือนใหม่', description: 'ใช้งานเล็กน้อยและใช้งานได้เต็มประสิทธิภาพ แต่ไม่รวมบรรจุภัณฑ์หรือแท็กเดิม' },
  { label: 'สภาพดี', description: 'ใช้มาบ้างเล็กน้อยและอาจมีตำหนิเล็กน้อย แต่ใช้งานได้อย่างเต็มประสิทธิภาพ' },
  { label: 'ปานกลาง', description: 'ใช้มาแล้วและมีตำหนิหลายจุด แต่โดยรวมยังใช้งานได้' },
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
