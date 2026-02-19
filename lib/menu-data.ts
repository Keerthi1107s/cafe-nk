export type MenuCategory = "starters" | "main" | "south-indian" | "beverages" | "desserts"
export type SpiceLevel = "mild" | "medium" | "hot" | "extra-hot"

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: MenuCategory
  image: string
  canCustomizeSpice?: boolean
  defaultSpice?: SpiceLevel
}

export interface OrderItem {
  id: string
  menuItemId: number
  quantity: number
  spiceLevel?: SpiceLevel
  specialInstructions?: string
  timestamp: Date
}

export const spiceLevels: { id: SpiceLevel; label: string; description: string }[] = [
  { id: "mild", label: "Mild", description: "Gentle and subtle" },
  { id: "medium", label: "Medium", description: "Balanced heat" },
  { id: "hot", label: "Hot", description: "Spicy kick" },
  { id: "extra-hot", label: "Extra Hot", description: "Intense heat" },
]

export const categories: { id: MenuCategory; label: string; emoji: string }[] = [
  { id: "starters", label: "Starters", emoji: "🥟" },
  { id: "main", label: "Main Course", emoji: "🍛" },
  { id: "south-indian", label: "South Indian Specials", emoji: "🥞" },
  { id: "beverages", label: "Beverages", emoji: "☕" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
]

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 1,
    name: "Gobi Manchurian",
    description: "Crispy cauliflower florets tossed in a spicy Indo-Chinese sauce with bell peppers and onions.",
    price: 180,
    category: "starters",
    image: "/gobi-manchurian-crispy-cauliflower-indo-chinese-di.jpg",
    canCustomizeSpice: true,
    defaultSpice: "medium",
  },
  {
    id: 2,
    name: "Paneer Tikka",
    description: "Marinated cottage cheese cubes grilled to perfection in a tandoor with mint chutney.",
    price: 220,
    category: "starters",
    image: "/paneer-tikka-grilled-indian-appetizer.jpg",
    canCustomizeSpice: true,
    defaultSpice: "mild",
  },
  {
    id: 3,
    name: "Baby Corn 65",
    description: "Tender baby corn coated in spiced batter and deep-fried until golden and crispy.",
    price: 160,
    category: "starters",
    image: "/baby-corn-65-crispy-fried-indian-starter.jpg",
    canCustomizeSpice: true,
    defaultSpice: "hot",
  },
  // Main Course
  {
    id: 4,
    name: "Veg Biryani",
    description: "Aromatic basmati rice layered with mixed vegetables, herbs, and traditional spices.",
    price: 250,
    category: "main",
    image: "/vegetable-biryani-indian-rice-dish.jpg",
    canCustomizeSpice: true,
    defaultSpice: "medium",
  },
  {
    id: 5,
    name: "Paneer Butter Masala",
    description: "Soft paneer cubes in a rich, creamy tomato-based gravy with aromatic spices.",
    price: 280,
    category: "main",
    image: "/paneer-butter-masala-creamy-indian-curry.jpg",
    canCustomizeSpice: true,
    defaultSpice: "mild",
  },
  {
    id: 6,
    name: "Dal Makhani",
    description: "Slow-cooked black lentils simmered in butter and cream with Indian spices.",
    price: 200,
    category: "main",
    image: "/dal-makhani-black-lentils-indian-dish.jpg",
    canCustomizeSpice: true,
    defaultSpice: "mild",
  },
  // South Indian Specials
  {
    id: 7,
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato masala, served with sambar and chutneys.",
    price: 120,
    category: "south-indian",
    image: "/masala-dosa-crispy-south-indian-crepe-with-potato-.jpg",
    canCustomizeSpice: true,
    defaultSpice: "medium",
  },
  {
    id: 8,
    name: "Idli Sambar",
    description: "Steamed rice cakes served with aromatic lentil soup and coconut chutney.",
    price: 80,
    category: "south-indian",
    image: "/idli-sambar-south-indian-breakfast.jpg",
    canCustomizeSpice: true,
    defaultSpice: "mild",
  },
  {
    id: 9,
    name: "Medu Vada",
    description: "Crispy fried lentil donuts served with sambar and fresh coconut chutney.",
    price: 70,
    category: "south-indian",
    image: "/medu-vada-crispy-south-indian-lentil-donut.jpg",
    canCustomizeSpice: true,
    defaultSpice: "medium",
  },
  {
    id: 10,
    name: "Uttapam",
    description: "Thick rice pancake topped with onions, tomatoes, and green chilies.",
    price: 100,
    category: "south-indian",
    image: "/uttapam-south-indian-pancake-with-vegetables.jpg",
    canCustomizeSpice: true,
    defaultSpice: "medium",
  },
  // Beverages
  {
    id: 11,
    name: "Filter Coffee",
    description: "Traditional South Indian coffee brewed fresh and served in a steel tumbler.",
    price: 40,
    category: "beverages",
    image: "/south-indian-filter-coffee-steel-tumbler.jpg",
  },
  {
    id: 12,
    name: "Masala Tea",
    description: "Aromatic tea infused with cardamom, ginger, and traditional spices.",
    price: 35,
    category: "beverages",
    image: "/masala-chai-indian-spiced-tea.jpg",
  },
  {
    id: 13,
    name: "Fresh Lime Soda",
    description: "Refreshing lime juice with soda water, available sweet or salted.",
    price: 50,
    category: "beverages",
    image: "/fresh-lime-soda-refreshing-drink.jpg",
  },
  {
    id: 14,
    name: "Mango Lassi",
    description: "Creamy yogurt drink blended with sweet Alphonso mangoes.",
    price: 80,
    category: "beverages",
    image: "/mango-lassi-indian-yogurt-drink.jpg",
  },
  // Desserts
  {
    id: 15,
    name: "Gulab Jamun",
    description: "Soft milk dumplings soaked in rose-flavored sugar syrup, served warm.",
    price: 80,
    category: "desserts",
    image: "/gulab-jamun-indian-sweet-dessert-in-syrup.jpg",
  },
  {
    id: 16,
    name: "Ice Cream",
    description: "Creamy homemade ice cream in flavors like mango, pistachio, and butterscotch.",
    price: 90,
    category: "desserts",
    image: "/indian-ice-cream-mango-pistachio-kulfi.jpg",
  },
  {
    id: 17,
    name: "Kesari Bath",
    description: "Traditional semolina pudding flavored with saffron, ghee, and cashews.",
    price: 70,
    category: "desserts",
    image: "/kesari-bath-saffron-semolina-halwa.jpg",
  },
  {
    id: 18,
    name: "Rasmalai",
    description: "Soft cottage cheese patties in sweetened, cardamom-infused milk.",
    price: 100,
    category: "desserts",
    image: "/rasmalai-indian-milk-dessert.jpg",
  },
]
