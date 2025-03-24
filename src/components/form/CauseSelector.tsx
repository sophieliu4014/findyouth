
import React, { useEffect, useState } from 'react';

const causeOptions = [
  "",
  "Advocacy & Human Rights",
  "Education",
  "Sports",
  "Health",
  "Arts & Culture",
  "Environment",
  "Homeless",
  "Animals",
  "Youth",
  "Seniors",
  "Religion"
];

interface CauseSelectorProps {
  onSelect: (cause: string) => void;
  initialValue?: string;
}

const CauseSelector = ({ onSelect, initialValue = '' }: CauseSelectorProps) => {
  const [selectedCause, setSelectedCause] = useState(initialValue || '');

  useEffect(() => {
    if (initialValue && causeOptions.includes(initialValue)) {
      setSelectedCause(initialValue);
    }
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCause(value);
    onSelect(value);
  };

  return (
    <select
      className="w-full p-2 border rounded-md"
      value={selectedCause}
      onChange={handleChange}
    >
      <option value="">All Causes</option>
      {causeOptions.filter(cause => cause !== "").map((cause, index) => (
        <option key={index} value={cause}>{cause}</option>
      ))}
    </select>
  );
};

export default CauseSelector;
