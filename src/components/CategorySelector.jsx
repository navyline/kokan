import { useState } from 'react';
import { FaTags } from 'react-icons/fa';

const CategorySelector = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { label: 'Art & Handmade', subcategories: [] },
    {
      label: 'Baby', subcategories: [
        'Baby Toys', 'Car Seats', 'Clothing', 'Cribs', 'Strollers', 'Carriers'
      ]
    },
    { label: 'Beauty', subcategories: [] },
    {
      label: 'Bikes', subcategories: [
        'Commuter', 'Cruiser', 'e-Bike', 'Helmet', 'Kid’s', 'Mountain', 'Road', 'Accessories'
      ]
    },
    {
      label: 'Books', subcategories: [
        'Children', 'Fiction', 'Non-fiction', 'Textbooks'
      ]
    },
    {
      label: 'Clothing & Accessories', subcategories: []
    },
    {
      label: 'Consumables', subcategories: [
        'Alcohol', 'Detergent', 'Food', 'Paper Towel', 'Soap', 'Toilet Paper'
      ]
    },
    {
      label: 'Electronics', subcategories: [
        'Audio', 'Batteries', 'Cables', 'Cameras', 'Computers', 'Phones', 'Printers', 'Speakers', 'Televisions / TV’s'
      ]
    },
    {
      label: 'Free Items', subcategories: []
    },
    {
      label: 'Furniture', subcategories: [
        'Beds', 'Chairs', 'Desk', 'Entertainment Unit', 'Hutch', 'Mattress', 'Table'
      ]
    },
    { label: 'Gift Cards', subcategories: [] },
    { label: 'Grocery', subcategories: [] },
    {
      label: 'Health', subcategories: [
        'Bath & Body', 'Hair Care', 'Oral Care', 'Skin Care'
      ]
    },
    {
      label: 'Hobbies & Crafts', subcategories: []
    },
    {
      label: 'Home', subcategories: [
        'Appliances', 'Bath', 'Bedroom', 'Cleaning Supplies', 'Decor', 'Fans', 'Home Textiles', 'Kitchen', 'Lighting', 'Storage', 'Vacuum'
      ]
    },
    { label: 'Jobs', subcategories: [] },
    { label: 'Movies', subcategories: [] },
    { label: 'Music', subcategories: [] },
    {
      label: 'Office', subcategories: [
        'Notebooks', 'Office Supplies', 'Paper', 'Pens'
      ]
    },
    { label: 'Other', subcategories: [] },
    { label: 'Pets', subcategories: [] },
    { label: 'Plants', subcategories: [] },
    {
      label: 'Services', subcategories: [
        'Barbering', 'Childcare', 'Fitness', 'Hairstyling', 'Housing', 'Lessons', 'Nanny', 'Photography', 'Plumbing', 'Rentals', 'Resume', 'Trades', 'Travel', 'Tutors'
      ]
    },
    {
      label: 'Sports & Outdoors', subcategories: [
        'Baseball', 'Basketball', 'Camping', 'Fishing', 'Hockey', 'Soccer'
      ]
    },
    { label: 'Tools', subcategories: [] },
    {
      label: 'Toys', subcategories: []
    },
    {
      label: 'Video Games', subcategories: [
        'Nintendo', 'Playstation', 'Xbox', 'PC'
      ]
    },
  ];

  const handleSelectCategory = () => {
    if (selectedCategory) {
      onSelectCategory(selectedCategory);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="text-purple-600"
      >
        <FaTags className="inline mr-2" /> {selectedCategory || "Select Category"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Select Category</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categories.map((category, idx) => (
                <div key={idx}>
                  <label className="font-bold">
                    <input
                      type="radio"
                      name="category"
                      value={category.label}
                      checked={selectedCategory === category.label}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    {category.label}
                  </label>
                  {category.subcategories.length > 0 && (
                    <div className="ml-6 space-y-1">
                      {category.subcategories.map((subcategory, subIdx) => (
                        <label key={subIdx} className="block">
                          <input
                            type="radio"
                            name="category"
                            value={`${category.label} > ${subcategory}`}
                            checked={selectedCategory === `${category.label} > ${subcategory}`}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mr-2"
                          />
                          {subcategory}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-4 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSelectCategory}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategorySelector;
