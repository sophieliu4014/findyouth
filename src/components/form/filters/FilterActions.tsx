
interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
}

const FilterActions = ({ onReset, onApply }: FilterActionsProps) => {
  return (
    <div className="flex justify-end mt-6 space-x-3">
      <button
        onClick={onReset}
        className="px-4 py-2 border border-gray-200 text-youth-charcoal/80 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Clear All
      </button>
      
      <button
        onClick={onApply}
        className="px-4 py-2 bg-youth-blue text-white rounded-lg hover:bg-youth-blue/90 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterActions;
