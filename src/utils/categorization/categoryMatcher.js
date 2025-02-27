// A simple category matcher based on keywords

export const suggestCategories = (description, categories) => {
    // Convert description to lowercase for case-insensitive matching
    const lowerDesc = description.toLowerCase();
    
    // Define common keywords for each category
    const categoryKeywords = {
      'Food': ['restaurant', 'café', 'cafe', 'diner', 'food', 'swiggy', 'zomato', 'uber eats'],
      'Grocery': ['grocery', 'supermarket', 'market', 'store', 'kirana', 'blinkit', 'bigbasket', 'grofers'],
      'Laundry': ['laundry', 'dry clean', 'wash', 'iron'],
      'Shopping': ['mall', 'retail', 'shop', 'myntra', 'flipkart', 'amazon', 'ajio'],
      'Maids': ['maid', 'cleaning', 'housekeep', 'domestic', 'servant'],
      'Medical': ['medical', 'hospital', 'doctor', 'clinic', 'pharmacy', 'medicine', 'pharma', 'apollo', 'medplus'],
      'Entertainment': ['movie', 'theatre', 'netflix', 'prime', 'hotstar', 'disney', 'game', 'entertainment'],
      'Transportation': ['uber', 'ola', 'taxi', 'auto', 'rickshaw', 'cab', 'metro', 'transport', 'train', 'bus', 'petrol', 'fuel'],
      'Utilities': ['electricity', 'water', 'gas', 'internet', 'phone', 'mobile', 'bill', 'recharge', 'broadband', 'wifi'],
      'Rent': ['rent', 'lease', 'housing', 'accommodation'],
      'Education': ['school', 'college', 'tuition', 'course', 'class', 'learning', 'education', 'coaching', 'fees']
    };
    
    // Add more mappings for custom categories
    categories.forEach(category => {
      if (!categoryKeywords[category]) {
        categoryKeywords[category] = [category.toLowerCase()];
      }
    });
    
    // Check for keyword matches
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (lowerDesc.includes(keyword)) {
          return category;
        }
      }
    }
    
    // No match found
    return null;
  };