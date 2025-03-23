
interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
}

const FilterActions = ({ onReset, onApply }: FilterActionsProps) => {
  return (
    <div className="flex justify-end mt-8 space-x-4">
      <button
        onClick={onReset}
        className="px-5 py-2.5 border border-gray-200 text-youth-charcoal/80 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
      >
        Clear All
      </button>
      
      <button
        onClick={onApply}
        className="px-5 py-2.5 bg-youth-blue text-white rounded-lg hover:bg-youth-blue/90 transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterActions;
